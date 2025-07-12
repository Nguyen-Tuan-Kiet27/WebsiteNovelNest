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
use App\Models\BaoCao;
use App\Models\ThongTin;
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
        $token = $jwtService->generateToken($id,['matKhau'=>$user->matKhau]);
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
                    ->select(
                        'truyen.id',
                        'truyen.ten',
                        DB::raw('FLOOR(SUM(damua.gia) * 0.7) as doanhThu')
                    )
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
        $sort = $request->query('sort','macdinh');
        $tenTheLoai = "Tất cả thể loại";
        if($theLoai!='all')
            $tenTheLoai = TheLoai::find($theLoai)->ten;
        $theLoais = TheLoai::where('trangThai','1')->get();
        $truyens = Truyen::leftJoin('chuong', 'truyen.id', '=', 'chuong.id_Truyen')
            ->leftJoin('damua', 'chuong.id', '=', 'damua.id_Chuong')
            ->with(['nguoidung:id,ten', 'theloai:id,ten'])
            ->where(DB::raw('LOWER(truyen.ten)'), 'LIKE', '%' . strtolower($searchText) . '%')
            ->when($theLoai !== 'all', fn($q) => $q->where('truyen.id_TheLoai', $theLoai))
            ->select('truyen.id', 'truyen.ten', 'truyen.ngayBatDau', 'truyen.hinhAnh','truyen.trangThai','truyen.id_NguoiDung','truyen.id_TheLoai', DB::raw('FLOOR(SUM(damua.gia) * 0.7) as doanhThu'))
            ->groupBy('truyen.id', 'truyen.ten', 'truyen.ngayBatDau', 'truyen.hinhAnh','truyen.trangThai','truyen.id_NguoiDung','truyen.id_TheLoai')
            ->when($sort === 'macdinh', fn($q) => $q->orderByDesc('truyen.ngayBatDau'))
            ->when($sort === 'thugiam', fn($q) => $q->orderByDesc('doanhThu'))
            ->when($sort === 'thutang', fn($q) => $q->orderBy('doanhThu'))
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
            Log::channel('customlog')->info('Thêm thể loại: ', [
                'user' => $user->toArray(),
                'theloai' => $theloai->toArray()
            ]);
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
            Log::channel('customlog')->info('Cập nhật thể loại: ', [
                'user' => $user->toArray(),
                'theloai' => $theloai->toArray()
            ]);
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
        if($request->query('check','')=='bc'){
            if($truyen->trangThai == 0){
                return response()->json([
                    'message'=> 'Truyện đã bị người khác khóa!'
                ],401);
            }
        }
        if($truyen->trangThai != 0)
            $truyen->trangThai = 0;
        else
            $truyen->trangThai = 1;
        $truyen->save();
        Log::channel('customlog')->info('Cập nhật truyện: ', [
            'user' => $user->toArray(),
            'truyen' => $truyen->toArray()
        ]);
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
        if($request->query('check','')=='bc'){
            if($chuong->trangThai == 0){
                return response()->json([
                    'message'=> 'Chương đã bị người khác khóa!'
                ],401);
            }
        }
        if($chuong->trangThai != 0)
            $chuong->trangThai = 0;
        else
            $chuong->trangThai = 1;
        $chuong->save();
        $chuong->noiDung = 'Nội dung chương';
        Log::channel('customlog')->info('Cập nhật chương: ', [
            'user' => $user->toArray(),
            'chuong' => $chuong->toArray()
        ]);
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
        $nguoiDungs = NguoiDung::where(function ($query) use ($searchText) {
                $query->where(DB::raw('LOWER(ten)'), 'LIKE', '%' . strtolower($searchText) . '%')
                      ->orWhere('id', 'LIKE', '%' . $searchText . '%');
            })
            // ->where('vaiTro', '>', 2)
            ->when($sort == 'dutang', fn ($q) => $q->orderBy('soDu'))
            ->when($sort == 'dugiam', fn ($q) => $q->orderByDesc('soDu'))
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
                'message'=> 'Không tìm thấy tài khoản!'
            ],401);
        }
        if(!$user->vaiTro > $nguoiDung->vaiTro){
            return response()->json([
                'message'=> 'Không có quyền cập nhật tài khoản này!'
            ],401);
        }
        if($nguoiDung->trangThai != 0)
            $nguoiDung->trangThai = 0;
        else
            $nguoiDung->trangThai = 1;
        $nguoiDung->save();
        Log::channel('customlog')->info('Cập nhật người dùng: ', [
            'user' => $user->toArray(),
            'nguoiDung' => $nguoiDung->toArray()
        ]);
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
                DB::raw("'Mua truyện' as loai"),
                DB::raw('gia as soLuong'),
                'thoiGian'
            ]);
        $lichSuNhan = DB::table('damua')
            ->join('chuong', 'damua.id_Chuong', '=', 'chuong.id')
            ->join('truyen', 'chuong.id_Truyen', '=', 'truyen.id')
            ->join('lichsumua', 'damua.id_LichSuMua', '=', 'lichsumua.id')
            ->where('truyen.id_NguoiDung', $nguoiDung->id)
            ->select([
                DB::raw("'Thu nhập' as loai"),
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
    public function quanLyTacGia(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }

        $searchText = $request->query('searchText','');

        $sort = $request->query('sort','macdinh');

       $tacGias = NguoiDung::leftjoin('truyen', 'nguoidung.id', '=', 'truyen.id_NguoiDung')
            ->leftjoin('chuong', 'truyen.id', '=', 'chuong.id_Truyen')
            ->leftjoin('damua', 'chuong.id', '=', 'damua.id_Chuong')
            ->select(
                'nguoidung.id',
                'nguoidung.ten',
                'nguoidung.email',
                'nguoidung.trangThai',
                'nguoidung.vaiTro',
                DB::raw('FLOOR(SUM(damua.gia) * 0.7) as doanhThu')
            )
            ->where('nguoidung.vaiTro','<',4)
            // ->where(DB::raw('LOWER(nguoidung.ten)'), 'LIKE', '%' . strtolower($searchText) . '%')
            ->where(function ($query) use ($searchText) {
                $query->where(DB::raw('LOWER(nguoidung.ten)'), 'LIKE', '%' . strtolower($searchText) . '%')
                      ->orWhere('nguoidung.id', 'LIKE', '%' . $searchText . '%');
            })
            // ->where('nguoidung.vaiTro', '>', 2)
            ->groupBy('nguoidung.id', 'nguoidung.ten', 'nguoidung.email','nguoidung.trangThai','nguoidung.vaiTro')
            ->when($sort == 'thutang', function ($q) {
                $q->orderBy('doanhThu');
            })
            ->when($sort == 'thugiam', function ($q) {
                $q->orderByDesc('doanhThu');
            })
            ->get();

        foreach ($tacGias as $tacGia) {
            $tacGia->email = NguoiDung::giaiMa($tacGia->email);
        }
        return Inertia::render('Admin/QuanLyTacGia',[
            'user'=>$user,
            'tacGias'=>$tacGias
        ]);
    }
    public function quanLyTruyenTacGia(Request $request,$id){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        $nguoiDung=NguoiDung::find($id);
        if(!$nguoiDung) return redirect('/admin/quanlytruyen');
        $theLoai = $request->query('theLoai','all');
        $searchText = $request->query('searchText','');
        $sort = $request->query('sort','macdinh');
        $tenTheLoai = "Tất cả thể loại";
        if($theLoai!='all')
            $tenTheLoai = TheLoai::find($theLoai)->ten;
        $theLoais = TheLoai::where('trangThai','1')->get();
        $truyens = Truyen::leftJoin('chuong', 'truyen.id', '=', 'chuong.id_Truyen')
            ->where('truyen.id_NguoiDung',$nguoiDung->id)
            ->leftJoin('damua', 'chuong.id', '=', 'damua.id_Chuong')
            ->with(['theloai:id,ten'])
            ->where(DB::raw('LOWER(truyen.ten)'), 'LIKE', '%' . strtolower($searchText) . '%')
            ->when($theLoai !== 'all', fn($q) => $q->where('truyen.id_TheLoai', $theLoai))
            ->select('truyen.id', 'truyen.ten', 'truyen.ngayBatDau', 'truyen.hinhAnh','truyen.trangThai','truyen.id_NguoiDung','truyen.id_TheLoai', DB::raw('FLOOR(SUM(damua.gia) * 0.7) as doanhThu'))
            ->groupBy('truyen.id', 'truyen.ten', 'truyen.ngayBatDau', 'truyen.hinhAnh','truyen.trangThai','truyen.id_NguoiDung','truyen.id_TheLoai')
            ->when($sort === 'macdinh', fn($q) => $q->orderByDesc('truyen.ngayBatDau'))
            ->when($sort === 'thugiam', fn($q) => $q->orderByDesc('doanhThu'))
            ->when($sort === 'thutang', fn($q) => $q->orderBy('doanhThu'))
            ->get();
        return Inertia::render('Admin/QuanLyTruyenTacGia', [
            'user'=> [
                'ten'=> $user->ten, 
                'vaiTro'=>$user->vaiTro,
                'anhDaiDien' => $user->anhDaiDien,
            ],
            'nguoiDung'=>$nguoiDung,
            'theLoais' => $theLoais,
            'tenTheLoai' => $tenTheLoai,
            'truyens'=>$truyens
        ]);
    }
    public function quanLyTruyenBaoCao(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }

        $truyens = Truyen::join('chuong', 'chuong.id_Truyen', '=', 'truyen.id')
                        ->join('baocao', 'baocao.id_Chuong', '=', 'chuong.id')
                        ->leftJoin('damua', 'chuong.id', '=', 'damua.id_Chuong')
                        ->where('baocao.trangThai', 1)
                        ->where('truyen.trangThai',1)
                        ->where('chuong.trangThai',1)
                        ->select(
                            'truyen.id',
                            'truyen.ten',
                            'truyen.id_TheLoai',
                            'truyen.id_NguoiDung',
                            'truyen.trangThai',
                            DB::raw('COUNT(baocao.id) as soLuong'),
                            DB::raw('FLOOR(SUM(damua.gia) * 0.7) as doanhThu')
                        )
                        ->with(['nguoidung:id,ten', 'theloai:id,ten'])
                        ->groupBy('truyen.id', 'truyen.ten', 'truyen.id_TheLoai', 'truyen.id_NguoiDung','truyen.trangThai')
                        ->orderByDesc('soLuong')
                        ->get();
        return Inertia::render('Admin/QuanLyTruyenBaoCao', [
            'user'=> [
                'ten'=> $user->ten, 
                'vaiTro'=>$user->vaiTro,
                'anhDaiDien' => $user->anhDaiDien,
            ],
            'truyens'=>$truyens
        ]);
    }

    public function quanLyChuongBaoCao(Request $request, $id){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        $truyen = Truyen::find($id);
        if(!$truyen || $truyen->trangThai==0){
            return redirect('/admin/quanlytruyenbaocao');
        }
        $chuongs = Chuong::join('baocao', 'baocao.id_Chuong', '=', 'chuong.id')
                        ->leftJoin('damua', 'chuong.id', '=', 'damua.id_Chuong')
                        ->where('baocao.trangThai', 1)
                        ->where('chuong.trangThai',1)
                        ->where('chuong.id_Truyen',$id)
                        ->select(
                            'chuong.id',
                            'chuong.ten',
                            'chuong.trangThai',
                            DB::raw('COUNT(baocao.id) as soLuong'),
                            DB::raw('FLOOR(SUM(damua.gia) * 0.7) as doanhThu')
                        )
                        ->groupBy('chuong.id', 'chuong.ten','chuong.trangThai')
                        ->orderByDesc('soLuong')
                        ->get();
        if($chuongs->isEmpty())
            return redirect('/admin/quanlytruyenbaocao');
        return Inertia::render('Admin/QuanLyChuongBaoCao', [
            'user'=> [
                'ten'=> $user->ten, 
                'vaiTro'=>$user->vaiTro,
                'anhDaiDien' => $user->anhDaiDien,
            ],
            'chuongs'=>$chuongs,
            'truyen' => $truyen
        ]);
    }

    public function chiTietBaoCao(Request $request, $id){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        $chuong = Chuong::find($id);
        if(!$chuong || $chuong->trangThai == 0)
            return redirect('/admin/quanlytruyenbaocao');
        $baoCaos = BaoCao::where('id_Chuong',$id)
                        ->where('trangThai',1)
                        ->with('nguoiDung:id,ten')
                        ->get();
        if($baoCaos->isEmpty()){
            return redirect('/admin/quanlychuongbaocao/'.$chuong->truyen->id);
        }
        return Inertia::render('Admin/ChiTietBaoCao', [
            'user'=> [
                'ten'=> $user->ten, 
                'vaiTro'=>$user->vaiTro,
                'anhDaiDien' => $user->anhDaiDien,
            ],
            'chuong'=>$chuong,
            'truyen'=>$chuong->truyen,
            'baoCaos' => $baoCaos
        ]);
    }
    public function boQuaBaoCao(Request $request, $id){
        $user = $request->attributes->get('user');
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        $baoCaos = BaoCao::where('id_Chuong', $id)
                        ->where('trangThai',1)
                    ->get();
        if($baoCaos->isEmpty()){
            return response()->json([
                'message'=> 'Đã có người duyệt chương này!'
            ],401);
        }
        Log::channel('customlog')->info('Bỏ qua báo cáo: ', [
            'user'=>$user->toArray(),
            'baoCaos' => $baoCaos->toArray(),
        ]);
        BaoCao::where('id_Chuong', $id)->update(['trangThai' => 0]);
        return response()->json([
                'message'=> 'Bỏ qua báo cáo thành công!'
            ],200);
    }
     public function doiNguAdmin(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        $admins = NguoiDung::where('vaiTro',2)->get();
        foreach($admins as $admin){
            $admin->tenDangNhap = NguoiDung::giaiMa($admin->tenDangNhap);
            $admin->matKhau = NguoiDung::giaiMa($admin->matKhau);
            $admin->id = NguoiDung::giaiMa($admin->id);
        }

        return Inertia::render('Admin/DoiNguAdmin',[
            'user'=>$user,
            'admins'=>$admins
        ]);
    }

    public function apiThemAdmin(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        try{
            $tenDangNhap = $request->tenDangNhap;
            $tenHienThi = $request->tenHienThi;
            $matKhau = $request->matKhau;
            if(!NguoiDung::where('tenDangNhap',NguoiDung::maHoa($tenDangNhap))->exists()){
                return response()->json([
                    'eTDN'=> 'Tên đăng nhập đã tồn tại!'
                ],409);
            }
            $soLuongAdmin = ThongTin::where('khoa','soLuongAdmin')->first();
            $idAdmin = 'A' . str_pad((int)$soLuongAdmin->giaTri+1, 4, '0', STR_PAD_LEFT);
            $admin = new NguoiDung();
            $admin->id = NguoiDung::maHoa($idAdmin);
            $admin->tenDangNhap = NguoiDung::maHoa($tenDangNhap);
            $admin->matKhau = NguoiDung::maHoa($matKhau);
            $admin->ten = $tenHienThi;
            $admin->vaiTro = 2;
            $admin->anhDaiDien = 'macDinh.png';
            $admin->ngayTao = now();
            $admin->save();
            Log::channel('customlog')->info('Tạo admin: ', [
                'user'=>$user->toArray(),
                'admin' => $admin->toArray(),
            ]);
            $soLuongAdmin->giaTri = (int)$soLuongAdmin->giaTri+1;
            $soLuongAdmin->save();
            return response()->json([
                'message'=>'Tạo admin mới thành công!'
            ],200);
        }catch(Exception $e){
            return response()->json([
                'message'=> 'Có lỗi hệ thống sảy ra!',
                'error'=>$e->getMessage(),
            ],500);
        }
    }

    public function apiSuaAdmin(Request $request,$id){
        $user = $request->attributes->get('user');
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        try{
            $admin = NguoiDung::find(NguoiDung::maHoa($id));
            $tenDangNhap = $request->tenDangNhap;
            $tenHienThi = $request->tenHienThi;
            $matKhau = $request->matKhau;
            if(!$admin){
                return response()->json([
                    'eID'=> 'Không tìm thấy admin!'
                ],401);
            }
            if($admin->tenDangNhap != NguoiDung::maHoa($tenDangNhap)){
                if(NguoiDung::where('tenDangNhap',NguoiDung::maHoa($tenDangNhap))->exists()){
                    return response()->json([
                        'eTDN'=> 'Tên đăng nhập đã tồn tại!'
                    ],401);
                }
            }
            $admin->tenDangNhap = NguoiDung::maHoa($tenDangNhap);
            $admin->matKhau = NguoiDung::maHoa($matKhau);
            $admin->ten = $tenHienThi;
            $admin->save();
            Log::channel('customlog')->info('Sửa admin: ', [
                'user'=>$user->toArray(),
                'admin' => $admin->toArray(),
            ]);
            return response()->json([
                'message'=>'Sửa admin thành công!'
            ],200);
        }catch(Exception $e){
            return response()->json([
                'message'=> 'Có lỗi hệ thống sảy ra!',
                'error'=>$e->getMessage(),
            ],500);
        }
    }
}
