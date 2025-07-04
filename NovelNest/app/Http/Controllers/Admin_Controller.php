<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Exception;
use App\Services\JwtService;
use App\Models\NguoiDung;
use Illuminate\Support\Facades\Crypt;
use App\Models\TheLoai;
use App\Models\Truyen;
use App\Models\Chuong;
use App\Models\LichSuMua;
use App\Models\DaMua;
use App\Models\LichSuNap;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class Admin_Controller extends Controller
{
    public function login(Request $request){
        $user = $request->attributes->get('user');
        if($user && $user->vaiTro < 3){
            return Inertia::location('/admin');
        }
        return Inertia::render('Admin/Login');
    }

    public function authLogin(Request $request, JwtService $jwtService){
        $tenDangNhap = $request->input('tenDangNhap');
        $matKhau = $request->input('matKhau');
        $user = NguoiDung::where('tenDangNhap',NguoiDung::maHoa($tenDangNhap))
            ->where('matKhau',NguoiDung::maHoa($matKhau))
            ->whereIn('vaiTro',[1,2])
            ->first();
        if(!$user){
            return response()->json(['message'=>"Tên đăng nhập hoặc mật khẩu không chính xác"],401);
        }
        $id = NguoiDung::giaiMa($user->id);
        $token = $jwtService->generateToken($id);
        return response()->json(["message"=> "Đăng nhập thành công"],200)
        ->withCookie(
            cookie(
                'auth_token',
                $token,
                60 * 24 * 7, // 7 ngày
                '/',
                null,
                true,
                true,
                false,
                'strict'
            )
        );
        // $token = $request->cookie('auth_token');
        // $parsed = $jwtService->parseToken($token);
        // return response()->json(['message'=> NguoiDung::find(NguoiDung::maHoa($parsed->claims()->get('uid')))],401);

    }

    public function dashboard(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }

        $top3Truyen = Truyen::join('chuong', 'truyen.id', '=', 'chuong.id_Truyen')
            ->join('damua', 'chuong.id', '=', 'damua.id_Chuong')
            ->join('lichsumua', 'damua.id_LichSuMua', '=', 'lichsumua.id')
            ->select('truyen.id', 'truyen.ten', DB::raw('SUM(DISTINCT lichsumua.gia) as doanhThu'))
            ->groupBy('truyen.id', 'truyen.ten')
            ->orderByDesc('doanhThu')
            ->limit(3)
            ->get();

        $top3TacGia = NguoiDung::join('truyen', 'nguoidung.id', '=', 'truyen.id_NguoiDung')
            ->join('chuong', 'truyen.id', '=', 'chuong.id_Truyen')
            ->join('damua', 'chuong.id', '=', 'damua.id_Chuong')
            ->select(
                'nguoidung.id',
                'nguoidung.ten',
                DB::raw('FLOOR(SUM(damua.gia) * 0.7) as doanhThu')
            )
            ->groupBy('nguoidung.id', 'nguoidung.ten')
            ->orderByDesc('doanhThu')
            ->limit(3)
            ->get();
        $soLuongTacGia = Truyen::distinct('id_NguoiDung')
            ->count('id_NguoiDung');
        $doanhThuHeThong = lichSuMua::sum('gia');
        $doanhThuTacGia = floor(DaMua::SUM('gia')*0.7);
        $loiNhuanHeThong = $doanhThuHeThong - $doanhThuTacGia;

        // $napTheoNgay = LichSuNap::selectRaw('DATE(thoiGian) as thoiGian, SUM(menhGia) as tongNap')
        //     ->whereMonth('thoiGian', now()->month)
        //     ->whereYear('thoiGian', now()->year)
        //     ->groupByRaw('DATE(thoiGian)')
        //     ->orderBy('thoiGian')
        //     ->get();
        // $napTheoThang = LichSuNap::selectRaw('MONTH(thoiGian) as thoiGian, SUM(menhGia) as tongNap')
        //     ->whereYear('thoiGian', now()->year)
        //     ->groupByRaw('MONTH(thoiGian)')
        //     ->orderBy('thoiGian')
        //     ->get();
        // $napTheoNam = LichSuNap::selectRaw('YEAR(thoiGian) as thoiGian, SUM(menhGia) as tongNap')
        //     ->groupByRaw('YEAR(thoiGian)')
        //     ->orderBy('thoiGian')
        //     ->get();
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $dates = collect();
        $current = $startOfMonth->copy();
        while ($current <= $endOfMonth) {
            $dates->push($current->format('d/m/Y'));
            $current->addDay();
        }

        $rawData = LichSuNap::selectRaw('DATE(thoiGian) as date, SUM(menhGia) as tongNap')
            ->whereMonth('thoiGian', now()->month)
            ->whereYear('thoiGian', now()->year)
            ->groupByRaw('DATE(thoiGian)')
            ->pluck('tongNap', 'date');

        $napTheoNgay = $dates->map(function($date) use ($rawData) {
            $key = Carbon::createFromFormat('d/m/Y', $date)->toDateString();
            return [
                'thoiGian' => $date,
                'tongNap' => $rawData[$key] ?? 0
            ];
        });

        $months = collect(range(1, 12));
        $year = now()->year;

        $rawData = LichSuNap::selectRaw('MONTH(thoiGian) as thang, SUM(menhGia) as tongNap')
            ->whereYear('thoiGian', $year)
            ->groupByRaw('MONTH(thoiGian)')
            ->pluck('tongNap', 'thang');

        $napTheoThang = $months->map(function($month) use ($rawData, $year) {
            return [
                'thoiGian' => str_pad($month, 2, '0', STR_PAD_LEFT) . '/' . $year,
                'tongNap' => $rawData[$month] ?? 0
            ];
        });

        $minYear = LichSuNap::min(DB::raw('YEAR(thoiGian)')) ?? now()->year;
        $maxYear = LichSuNap::max(DB::raw('YEAR(thoiGian)')) ?? now()->year;

        $years = collect(range($minYear, $maxYear));
        $rawData = LichSuNap::selectRaw('YEAR(thoiGian) as nam, SUM(menhGia) as tongNap')
            ->groupByRaw('YEAR(thoiGian)')
            ->pluck('tongNap', 'nam');

        $napTheoNam = $years->map(function($year) use ($rawData) {
            return [
                'thoiGian' => (string)$year,
                'tongNap' => $rawData[$year] ?? 0
            ];
        });
        return Inertia::render('Admin/DashBoard',[
            'user'=> $user,
            'top3Truyen'=>$top3Truyen,
            'top3TacGia'=>$top3TacGia,
            'soLuongTacGia'=>$soLuongTacGia,
            'doanhThuHeThong'=>$doanhThuHeThong,
            'doanhThuTacGia'=>$doanhThuTacGia,
            'loiNhuanHeThong'=>$loiNhuanHeThong,
            'napTheoNgay' => $napTheoNgay,
            'napTheoThang'=>$napTheoThang,
            'napTheoNam'=>$napTheoNam
        ]);
    }

    public function quanLyTruyen(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        $theLoai = $request->query('theLoai','all');
        $searchText = $request->query('searchText','');
        $tenTheLoai = "Tất cả thể loại";
        if($theLoai!='all')
            $tenTheLoai = TheLoai::find($theLoai)->ten;
        $theLoais = TheLoai::where('trangThai','1')->get();
        $truyens = Truyen::where(DB::raw('LOWER(ten)'), 'LIKE', '%' . strtolower($searchText) . '%')
                    ->when($theLoai!='all', fn($q)=>$q->where('id_TheLoai',$theLoai))
                    ->orderByDesc('ngayBatDau')
                    ->with('nguoidung:id,ten')
                    ->with('theloai:id,ten')
                    ->get();
        return Inertia::render('Admin/QuanLyTruyen', [
            'user'=> [
                'ten'=> $user->ten, 
                'vaiTro'=>$user->vaiTro,
                'anhDaiDien' => $user->anhDaiDien,
            ],
            'theLoais' => $theLoais,
            'tenTheLoai' => $tenTheLoai,
            'truyens'=>$truyens
        ]);
    }

    public function themtheloai(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        $theLoais = TheLoai::all();

        return Inertia::render('Admin/ThemTheLoai', [
            'user'=> [
                'ten'=> $user->ten, 
                'vaiTro'=>$user->vaiTro,
                'anhDaiDien' => $user->anhDaiDien,
            ],
            'theLoais' => $theLoais,
        ]);
    }
    public function apiThemTheLoai(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        $ten = $request->input('ten');
        $theLoai = TheLoai::where('ten',$ten )->first();
        if($theLoai){
            return response()->json([
                'message' => 'Tên thể loại đã tồn tại!'
            ],409);
        }
        if($request->hasFile('hinhAnh')){
            $file = $request->file('hinhAnh');
            $fileName = uniqid() .'.'. $file->getClientOriginalExtension(); 
            $file->move(public_path('img/theLoai/'), $fileName);
        }
        try {
            $theloai = new TheLoai();
            $theloai->ten = $ten;
            $theloai->hinhAnh = $fileName;
            $theloai->trangThai = 1;
            $theloai->save();
        }catch(Exception $e){
            return response()->json(['message' => $e->getMessage()],404);
        }
        return response()->json([
            'message'=> 'Tạo thể loại mới thành công!'
        ],201);
    }

    public function apiSuaTheLoai(Request $request,$id){
        $user = $request->attributes->get('user');
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        $ten = $request->input('ten');
        
        try {
            $theloai = TheLoai::find($id);
            if($ten != $theloai->ten){
                $theLoai2 = TheLoai::where('ten',$ten )->first();
                if($theLoai2){
                    return response()->json([
                        'message' => 'Tên thể loại đã tồn tại!'
                    ],409);
                }
                $theloai->ten = $ten;
            }
            if($request->hasFile('hinhAnh')){
                $file = $request->file('hinhAnh');
                $fileName = uniqid() .'.'. $file->getClientOriginalExtension(); 
                $file->move(public_path('img/theLoai/'), $fileName);
                $oldImagePath = public_path('img/theLoai/' . $theloai->hinhAnh);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
                $theloai->hinhAnh = $fileName;
            }
            $theloai->save();
        }catch(Exception $e){
            return response()->json(['message' => $e->getMessage()],404);
        }
        return response()->json([
            'message'=> 'Cập nhật thể loại thành công!'
        ],201);
    }

    public function apiChangeTruyen(Request $request, $id){
        $user = $request->attributes->get('user');
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        $truyen = Truyen::find($id);
        if(!$truyen){
            return response()->json([
                'message'=> 'Không tìm thấy truyện!'
            ],401);
        }
        if($truyen->trangThai != 0)
            $truyen->trangThai = 0;
        else
            $truyen->trangThai = 1;
        $truyen->save();
        return response()->json([
            'message'=> 'Cập nhật truyện thành công!'
        ],201);
    }
    public function quanLyChuong(Request $request, $id){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        $truyen = Truyen::find($id);
        if(!$truyen){
            return redirect('/admin/quanlytruyen');
        }
        $searchText = $request->query('searchText','');
        $chuongs = $truyen->Chuongs()
            ->where(function ($query) use ($searchText) {
                $query->where(DB::raw('LOWER(ten)'), 'LIKE', '%' . strtolower($searchText) . '%')
                    ->orWhere('soChuong', 'LIKE', '%' . strtolower($searchText) . '%');
            })
            ->orderByDesc('soChuong')
            ->get();
        return Inertia::render('Admin/QuanLyChuong',[
            'user'=>$user,
            'chuongs'=>$chuongs,
            'truyen'=>$truyen
        ]);
    }
    public function apiChangeChuong(Request $request, $id){
        $user = $request->attributes->get('user');
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        $chuong = Chuong::find($id);
        if(!$chuong){
            return response()->json([
                'message'=> 'Không tìm thấy chương!'
            ],401);
        }
        if($chuong->trangThai != 0)
            $chuong->trangThai = 0;
        else
            $chuong->trangThai = 1;
        $chuong->save();
        return response()->json([
            'message'=> 'Cập nhật chương thành công!'
        ],201);
    }
    public function quanLyNguoiDung(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        $searchText = $request->query('searchText','');
        $sort = $request->query('sort','macdinh');
        $nguoiDungs = NguoiDung::where(DB::raw('LOWER(ten)'), 'LIKE', '%' . strtolower($searchText) . '%')
            ->where('vaiTro', '>', 2)
            ->when($sort == 'dutang', function ($q) {
                $q->orderBy('soDu');
            })
            ->when($sort == 'dugiam', function ($q) {
                $q->orderByDesc('soDu');
            })
            ->get();
        foreach ($nguoiDungs as $nguoiDung) {
            $nguoiDung->email = $nguoiDung->giaiMa($nguoiDung->email);
        }
        return Inertia::render('Admin/QuanLyNguoiDung',[
            'user'=>$user,
            'nguoiDungs'=>$nguoiDungs
        ]);
    }
    public function apiChangeNguoiDung(Request $request, $id){
        $user = $request->attributes->get('user');
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        $nguoiDung = NguoiDung::find($id);
        if(!$nguoiDung){
            return response()->json([
                'message'=> 'Không tìm thấy chương!'
            ],401);
        }
        if($nguoiDung->trangThai != 0)
            $nguoiDung->trangThai = 0;
        else
            $nguoiDung->trangThai = 1;
        $nguoiDung->save();
        return response()->json([
            'message'=> 'Cập nhật người dùng thành công!'
        ],201);
    }
    public function quanLyLichSu(Request $request, $id){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        $sort = $request->query('sort','new');
        $nguoiDung = NguoiDung::find($id);
        $lichSuNap = DB::table('lichsunap')
            ->where('id_NguoiDung', $nguoiDung->id)
            ->select([
                DB::raw("'Nạp' as loai"),
                DB::raw('soLuongXu as soLuong'),
                'thoiGian'
            ]);
        $lichSuMua = DB::table('lichsumua')
            ->where('id_NguoiDung', $nguoiDung->id)
            ->select([
                DB::raw("'Mua' as loai"),
                DB::raw('gia as soLuong'),
                'thoiGian'
            ]);
        $lichSuNhan = DB::table('damua')
            ->join('chuong', 'damua.id_Chuong', '=', 'chuong.id')
            ->join('truyen', 'chuong.id_Truyen', '=', 'truyen.id')
            ->join('lichsumua', 'damua.id_LichSuMua', '=', 'lichsumua.id') // ✅ join thêm để lấy thời gian
            ->where('truyen.id_NguoiDung', $nguoiDung->id)
            ->select([
                DB::raw("'Nhận' as loai"),
                DB::raw('FLOOR(SUM(damua.gia) * 0.7) as soLuong'),
                DB::raw('lichsumua.thoiGian as thoiGian')
            ])
            ->groupBy('damua.id_LichSuMua', 'lichsumua.thoiGian');
        $lichSuTongHop = DB::table(DB::raw("(
                            {$lichSuNap->toSql()}
                            UNION ALL
                            {$lichSuMua->toSql()}
                            UNION ALL
                            {$lichSuNhan->toSql()}
                        ) as lichsu"))
                        ->mergeBindings($lichSuNap)
                        ->mergeBindings($lichSuMua)
                        ->mergeBindings($lichSuNhan)
                        ->when($sort=='new',function($q){
                            $q->orderByDesc('thoiGian');
                        })
                        ->when($sort=='old',function($q){
                            $q->orderBy('thoiGian');
                        })
                        ->get();
        return Inertia::render('Admin/LichSuGiaoDich',[
            'user'=>$user,
            'nguoiDung'=>$nguoiDung,
            'lichSus'=>$lichSuTongHop
        ]);
    }
}
