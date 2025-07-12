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
use App\Models\QuangCao;
use App\Models\LichSuRut;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Events\LichSuRutMoi;
use App\Events\AnLichSuRut;


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
        //Người dùng mới:
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();
        $dates = collect();
        $current = $startOfMonth->copy();
        while ($current <= $endOfMonth) {
            $dates->push($current->format('d/m/Y'));
            $current->addDay();
        }
        $rawData = NguoiDung::selectRaw('DATE(ngayTao) as date, COUNT(id) as soLuong')
            ->whereIn('vaiTro',['3','4'])
            ->whereMonth('ngayTao', now()->month)
            ->whereYear('ngayTao', now()->year)
            ->groupByRaw('DATE(ngayTao)')
            ->pluck('soLuong', 'date');
        $nguoiDungTheoNgay = $dates->map(function($date) use ($rawData) {
            $key = Carbon::createFromFormat('d/m/Y', $date)->toDateString();
            return [
                'thoiGian' => $date,
                'soLuong' => $rawData[$key] ?? 0
            ];
        });

        $months = collect(range(1, 12));
        $year = now()->year;
        $rawData = NguoiDung::selectRaw('MONTH(ngayTao) as thang, COUNT(id) as soLuong')
            ->whereIn('vaiTro',['3','4'])
            ->whereYear('ngayTao', $year)
            ->groupByRaw('MONTH(ngayTao)')
            ->pluck('soLuong', 'thang');
        $nguoiDungTheoThang = $months->map(function($month) use ($rawData, $year) {
            return [
                'thoiGian' => str_pad($month, 2, '0', STR_PAD_LEFT) . '/' . $year,
                'soLuong' => $rawData[$month] ?? 0
            ];
        });

        $minYear = NguoiDung::min(DB::raw('YEAR(ngayTao)')) ?? now()->year;
        $maxYear = NguoiDung::max(DB::raw('YEAR(ngayTao)')) ?? now()->year;

        $years = collect(range($minYear, $maxYear));
        $rawData = NguoiDung::selectRaw('YEAR(ngayTao) as nam, COUNT(id) as soLuong')
            ->whereIn('vaiTro',['3','4'])
            ->groupByRaw('YEAR(ngayTao)')
            ->pluck('soLuong', 'nam');

        $nguoiDungTheoNam = $years->map(function($year) use ($rawData) {
            return [
                'thoiGian' => (string)$year,
                'soLuong' => $rawData[$year] ?? 0
            ];
        });

        //%tacgia/nguoidung
        $soLuongTacGia = Truyen::distinct('id_NguoiDung')
            ->count('id_NguoiDung');
        $soLuongNguoiDung = NguoiDung::where('vaiTro',4)->where('trangThai',1)->count();
        //DoanhThu
        // $doanhThuHeThong = lichSuMua::sum('gia');
        // $doanhThuTacGia = floor(DaMua::SUM('gia')*0.7);
        // $loiNhuanHeThong = $doanhThuHeThong - $doanhThuTacGia;
        $start = now()->startOfMonth();
        $end = now()->endOfMonth();
        $dates = collect();
        $curr = $start->copy();
        while ($curr <= $end) {
            $dates->push($curr->format('d/m/Y'));
            $curr->addDay();
        }
        $heThongRaw = LichSuMua::selectRaw('DATE(thoiGian) as ngay, SUM(gia) as tong')
            ->whereBetween('thoiGian', [$start, $end])
            ->groupByRaw('DATE(thoiGian)')
            ->pluck('tong', 'ngay');
        $tacGiaRaw = DB::table('daMua')
            ->join('lichSuMua', 'daMua.id_LichSuMua', '=', 'lichSuMua.id')
            ->selectRaw('DATE(lichSuMua.thoiGian) as ngay, FLOOR(SUM(daMua.gia) * 0.7) as tong')
            ->whereBetween('lichSuMua.thoiGian', [$start, $end])
            ->groupByRaw('DATE(lichSuMua.thoiGian)')
            ->pluck('tong', 'ngay');
        $doanhThuTheoNgay = $dates->map(function ($date) use ($heThongRaw, $tacGiaRaw) {
            $key = Carbon::createFromFormat('d/m/Y', $date)->toDateString();
            $heThong = $heThongRaw[$key] ?? 0;
            $tacGia = $tacGiaRaw[$key] ?? 0;
            return [
                'thoiGian' => $date,
                'heThong' => $heThong,
                'tacGia' => $tacGia,
                'loiNhuan' => $heThong - $tacGia,
            ];
        });

        $year = now()->year;
        $months = collect(range(1, 12));

        $heThongRaw = LichSuMua::selectRaw('MONTH(thoiGian) as thang, SUM(gia) as tong')
            ->whereYear('thoiGian', $year)
            ->groupByRaw('MONTH(thoiGian)')
            ->pluck('tong', 'thang');

        $tacGiaRaw = DB::table('daMua')
            ->join('lichSuMua', 'daMua.id_LichSuMua', '=', 'lichSuMua.id')
            ->selectRaw('MONTH(lichSuMua.thoiGian) as thang, FLOOR(SUM(daMua.gia) * 0.7) as tong')
            ->whereYear('lichSuMua.thoiGian', $year)
            ->groupByRaw('MONTH(lichSuMua.thoiGian)')
            ->pluck('tong', 'thang');

        $doanhThuTheoThang = $months->map(function ($month) use ($year, $heThongRaw, $tacGiaRaw) {
            $heThong = $heThongRaw[$month] ?? 0;
            $tacGia = $tacGiaRaw[$month] ?? 0;
            return [
                'thoiGian' => str_pad($month, 2, '0', STR_PAD_LEFT) . '/' . $year,
                'heThong' => $heThong,
                'tacGia' => $tacGia,
                'loiNhuan' => $heThong - $tacGia,
            ];
        });
        $minYear = LichSuMua::min(DB::raw('YEAR(thoiGian)')) ?? now()->year;
        $maxYear = LichSuMua::max(DB::raw('YEAR(thoiGian)')) ?? now()->year;

        $years = collect(range($minYear, $maxYear));

        $heThongRaw = LichSuMua::selectRaw('YEAR(thoiGian) as nam, SUM(gia) as tong')
            ->groupByRaw('YEAR(thoiGian)')
            ->pluck('tong', 'nam');

        $tacGiaRaw = DB::table('daMua')
            ->join('lichSuMua', 'daMua.id_LichSuMua', '=', 'lichSuMua.id')
            ->selectRaw('YEAR(lichSuMua.thoiGian) as nam, FLOOR(SUM(daMua.gia) * 0.7) as tong')
            ->groupByRaw('YEAR(lichSuMua.thoiGian)')
            ->pluck('tong', 'nam');

        $doanhThuTheoNam = $years->map(function ($year) use ($heThongRaw, $tacGiaRaw) {
            $heThong = $heThongRaw[$year] ?? 0;
            $tacGia = $tacGiaRaw[$year] ?? 0;
            return [
                'thoiGian' => (string) $year,
                'heThong' => $heThong,
                'tacGia' => $tacGia,
                'loiNhuan' => $heThong - $tacGia,
            ];
        });
        

        //Nạp
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
        //Rút
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $dates = collect();
        $current = $startOfMonth->copy();
        while ($current <= $endOfMonth) {
            $dates->push($current->format('d/m/Y'));
            $current->addDay();
        }
        $rawData = LichSuRut::selectRaw('DATE(thoiGian) as date, SUM(giaTri) as tongRut')
            ->where('trangThai', 1)
            ->where('ketQua', 1)
            ->whereMonth('thoiGian', now()->month)
            ->whereYear('thoiGian', now()->year)
            ->groupByRaw('DATE(thoiGian)')
            ->pluck('tongRut', 'date');

        $rutTheoNgay = $dates->map(function ($date) use ($rawData) {
            $key = Carbon::createFromFormat('d/m/Y', $date)->toDateString();
            return [
                'thoiGian' => $date,
                'tongRut' => $rawData[$key] ?? 0
            ];
        });
        $months = collect(range(1, 12));
        $year = now()->year;

        $rawData = LichSuRut::selectRaw('MONTH(thoiGian) as thang, SUM(giaTri) as tongRut')
            ->where('trangThai', 1)
            ->where('ketQua', 1)
            ->whereYear('thoiGian', $year)
            ->groupByRaw('MONTH(thoiGian)')
            ->pluck('tongRut', 'thang');

        $rutTheoThang = $months->map(function ($month) use ($rawData, $year) {
            return [
                'thoiGian' => str_pad($month, 2, '0', STR_PAD_LEFT) . '/' . $year,
                'tongRut' => $rawData[$month] ?? 0
            ];
        });
        $minYear = LichSuRut::where('trangThai', 1)->where('ketQua', 1)->min(DB::raw('YEAR(thoiGian)')) ?? now()->year;
        $maxYear = LichSuRut::where('trangThai', 1)->where('ketQua', 1)->max(DB::raw('YEAR(thoiGian)')) ?? now()->year;

        $years = collect(range($minYear, $maxYear));

        $rawData = LichSuRut::selectRaw('YEAR(thoiGian) as nam, SUM(giaTri) as tongRut')
            ->where('trangThai', 1)
            ->where('ketQua', 1)
            ->groupByRaw('YEAR(thoiGian)')
            ->pluck('tongRut', 'nam');

        $rutTheoNam = $years->map(function ($year) use ($rawData) {
            return [
                'thoiGian' => (string)$year,
                'tongRut' => $rawData[$year] ?? 0
            ];
        });

        //Tổng hợp nạp rút
        $napRutTheoNgay = $dates->map(function ($date) use ($napTheoNgay, $rutTheoNgay) {
            $key = $date;
            $nap = $napTheoNgay->firstWhere('thoiGian', $key)['tongNap'] ?? 0;
            $rut = $rutTheoNgay->firstWhere('thoiGian', $key)['tongRut'] ?? 0;

            return [
                'thoiGian' => $key,
                'tongNap' => $nap,
                'tongRut' => $rut
            ];
        });
        $napRutTheoThang = $months->map(function ($month) use ($napTheoThang, $rutTheoThang, $year) {
            $key = str_pad($month, 2, '0', STR_PAD_LEFT) . '/' . $year;
            $nap = $napTheoThang->firstWhere('thoiGian', $key)['tongNap'] ?? 0;
            $rut = $rutTheoThang->firstWhere('thoiGian', $key)['tongRut'] ?? 0;

            return [
                'thoiGian' => $key,
                'tongNap' => $nap,
                'tongRut' => $rut
            ];
        });
        $mergedYears = $years->unique();

        $napRutTheoNam = $mergedYears->map(function ($year) use ($napTheoNam, $rutTheoNam) {
            $key = (string)$year;
            $nap = $napTheoNam->firstWhere('thoiGian', $key)['tongNap'] ?? 0;
            $rut = $rutTheoNam->firstWhere('thoiGian', $key)['tongRut'] ?? 0;

            return [
                'thoiGian' => $key,
                'tongNap' => $nap,
                'tongRut' => $rut
            ];
        });

        return Inertia::render('Admin/DashBoard',[
            'user'=> $user,
            'nguoiDungTheoNgay'=>$nguoiDungTheoNgay,
            'nguoiDungTheoThang'=>$nguoiDungTheoThang,
            'nguoiDungTheoNam'=>$nguoiDungTheoNam,
            'tacGiaPNguoiDung'=>[
                ['name' => 'Tác giả', 'soLuong' => $soLuongTacGia],
                ['name' => 'Độc giả', 'soLuong' => $soLuongNguoiDung],
            ],
            'doanhThuTheoNgay'=>$doanhThuTheoNgay, 
            'doanhThuTheoThang'=>$doanhThuTheoThang,
            'doanhThuTheoNam'=>$doanhThuTheoNam,
            'napRutTheoNgay' => $napRutTheoNgay,
            'napRutTheoThang'=>$napRutTheoThang,
            'napRutTheoNam'=>$napRutTheoNam
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
        $nguoiDung->trangThai = $request->input('trangThai');
        $nguoiDung->lyDo = $request->input('lyDo','');
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
        $lichSuRut = DB::table('lichsurut')
            ->where('id_NguoiDung', $nguoiDung->id)
            ->where('ketQua',1)
            ->select([
                DB::raw("'Rút' as loai"),
                DB::raw('soLuongXu as soLuong'),
                'thoiGian'
            ]);
        $lichSuTongHop = DB::table(DB::raw("(
                            {$lichSuNap->toSql()}
                            UNION ALL
                            {$lichSuMua->toSql()}
                            UNION ALL
                            {$lichSuNhan->toSql()}
                            UNION ALL
                            {$lichSuRut->toSql()}
                        ) as lichsu"))
                        ->mergeBindings($lichSuNap)
                        ->mergeBindings($lichSuMua)
                        ->mergeBindings($lichSuNhan)
                        ->mergeBindings($lichSuRut)
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
            ->where('nguoidung.vaiTro','<','4')
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
            $admin->anhDaiDien = 'admin.png';
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
    public function quanLyThongTinWeb(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        $dktg = ThongTin::where('khoa','DKTG')->first();
        $dknd = ThongTin::where('khoa','dieuKhoanDichVu')->first();
        $email = ThongTin::where('khoa','email')->first();
        $fb = ThongTin::where('khoa','facebook')->first();
        $yt = ThongTin::where('khoa','youtube')->first();

        $slides = QuangCao::orderByDesc('trangThai')
                  ->orderByDesc('ngayTao')
                  ->get();

        return Inertia::render('Admin/QuanLyThongTinWeb',[
            'user'=>$user,
            'dktg'=>$dktg,
            'dknd'=>$dknd,
            'eml'=>$email,
            'fb'=>$fb,
            'yt'=>$yt,
            'slides'=>$slides,
        ]);
    }
    public function apiSuaThongTin(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        try{
            $newThongTin = $request->input('thongTin');
            $thongTin = ThongTin::where('khoa',$newThongTin['khoa'])->first();
            $thongTin->giaTri = $newThongTin['giaTri'];
            $thongTin->ngayTao = now();
            $thongTin->save();
            Log::channel('customlog')->info('Thêm sửa thông tin: ', [
                'user' => $user->toArray(),
                'theloai' => $thongTin->toArray(),
            ]);
            return response()->json(['message'=>'Thay đổi thông tin thành công!'],200);
        }catch(Exception $e){
            return response()->json(['message'=>'Có lỗi hệ thống sảy ra!','error'=>$e->getMessage()],500);
        }
    }
    public function themSlide(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        return Inertia::render('Admin/ThemSlide',[
            'user'=>$user,
        ]);
    }
    public function apiThemSlide(Request $request){
        $user = $request->attributes->get("user");
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        if($request->hasFile('hinhAnh')){
            $hinhAnh = $request->file('hinhAnh');
            $nameHinhAnh = uniqid().'.'.$hinhAnh->getClientOriginalExtension();
        }else{
            return response()->json([
                'message'=> 'Chưa chọn hình ảnh!'
            ],401);
        }
        try{
            $slide = new QuangCao();
            $slide->hinhAnh = $nameHinhAnh;
            $slide->lienKet = $request->lienKet;
            $slide->ngayTao = now();
            $slide->trangThai = 1;
            $slide->id_NguoiDung = $user->id;
            $slide->save();
            Log::channel('customlog')->info('Thêm slide: ', [
                'user' => $user->toArray(),
                'theloai' => $slide->toArray()
            ]);
            $hinhAnh->move(public_path('img/quangCao/'), $nameHinhAnh);
        }catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()],404);
        }
        return response()->json([
            'message'=> 'Tạo slide mới thành công!'
        ],201);
    }
    public function suaSlide(Request $request,$id){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        $slide = QuangCao::find($id);
        if(!$slide){
            return redirect('/admin/quanlythongtinweb');
        }
        return Inertia::render('Admin/SuaSlide',[
            'user'=>$user,
            'slide'=>$slide,
        ]);
    }
    public function apiSuaSlide(Request $request,$id){
        $user = $request->attributes->get("user");
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        try{
            $slide = QuangCao::find($id);
            if(!$slide){
                return response()->json([
                    'message'=> 'Không tìm thấy slide!'
                ],401);
            }
            if($request->hasFile('hinhAnh')){
                if ($slide->hinhAnh && file_exists(public_path('img/quangCao/' . $slide->hinhAnh))) {
                    unlink(public_path('img/quangCao/' . $slide->hinhAnh));
                }
                $hinhAnh = $request->file('hinhAnh');
                $nameHinhAnh = uniqid().'.'.$hinhAnh->getClientOriginalExtension();
                $hinhAnh->move(public_path('img/quangCao/'), $nameHinhAnh);
                $slide->hinhAnh = $nameHinhAnh;
            }
            $slide->lienKet = $request->lienKet;
            $slide->ngayTao = now();
            $slide->id_NguoiDung = $user->id;
            $slide->save();
            Log::channel('customlog')->info('Sửa slide: ', [
                'user' => $user->toArray(),
                'slide' => $slide->toArray()
            ]);
        }catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()],404);
        }
        return response()->json([
            'message'=> 'Sửa slide thành công!'
        ],201);
    }

    public function apiSuaTrangThaiSlide(Request $request,$id){
        $user = $request->attributes->get("user");
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        try{
            $slide = QuangCao::find($id);
            if(!$slide){
                return response()->json([
                    'message'=> 'Không tìm thấy slide!'
                ],401);
            }
            $slide->trangThai = $request->trangThai;
            $slide->ngayTao = now();
            $slide->id_NguoiDung = $user->id;
            $slide->save();
            Log::channel('customlog')->info('Sửa slide: ', [
                'user' => $user->toArray(),
                'slide' => $slide->toArray()
            ]);
        }catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()],404);
        }
        return response()->json([
            'message'=> 'Cập nhật trạng thái slide thành công!'
        ],201);
    }

    public function apiXoaSlide(Request $request,$id){
        $user = $request->attributes->get("user");
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        try{
            $slide = QuangCao::find($id);
            if(!$slide){
                return response()->json([
                    'message'=> 'Không tìm thấy slide!'
                ],401);
            }
            if ($slide->hinhAnh && file_exists(public_path('img/quangCao/' . $slide->hinhAnh))) {
                unlink(public_path('img/quangCao/' . $slide->hinhAnh));
            }
            Log::channel('customlog')->info('Xóa slide: ', [
                'user' => $user->toArray(),
                'slide' => $slide->toArray()
            ]);
            $slide->delete(); 
        }catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()],404);
        }
        return response()->json([
            'message'=> 'Xóa slide thành công!'
        ],201);
    }
    public function yeuCauRutXu(Request $request){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect('admin/dangnhap');
        }
        $lichSuRuts = LichSuRut::where('trangThai',0)->where('xuLy',0)->orderBy('thoiGian')->get();
        return Inertia::render('Admin/YeuCauRutXu',[
            'user'=>$user,
            'LSRs'=>$lichSuRuts,
        ]);

    }
    public function apiNhanYeuCau(Request $request){
        try{
            $user = $request->attributes->get("user");
            if(!$user){
                return response()->json([
                    'message'=> 'Không có quyền truy cập!'
                ],401);
            }
            $yeuCau = LichSuRut::find($request->input('id'));
            if(!$yeuCau){
                return response()->json([
                    'message'=> 'Không tìm thấy yêu cầu!'
                ],401);
            }
            if($yeuCau->trangThai == 1 || $yeuCau->xuLy==1){
                return response()->json([
                    'message'=> 'Đã có người nhận yêu cầu này!'
                ],401);
            }
            $yeuCau->xuLy = 1;
            $yeuCau->id_Admin = $user->id;
            $yeuCau->save();
            broadcast(new AnLichSuRut($yeuCau));
            return response()->json([
                'message'=> 'Nhận yêu cầu rút tiền thành công!'
            ],200);
        }catch(Exception $e){
            return response()->json([
                'message'=> 'Đã có lỗi hệ thống xảy ra!',
                'error'=>$e->getMessage(),
            ],500);
        }
    }

    public function apiHuyNhanYeuCau(Request $request){
        try{
            $user = $request->attributes->get("user");
            if(!$user){
                return response()->json([
                    'message'=> 'Không có quyền truy cập!'
                ],401);
            }
            $yeuCau = LichSuRut::find($request->input('id'));
            if(!$yeuCau){
                return response()->json([
                    'message'=> 'Không tìm thấy yêu cầu!'
                ],401);
            }
            $yeuCau->xuLy = 0;
            $yeuCau->id_Admin = null;
            $yeuCau->save();
            broadcast(new LichSuRutMoi($yeuCau));
            return response()->json([
                'message'=> 'Hủy nhận yêu cầu rút tiền thành công!'
            ],200);
        }catch(Exception $e){
            return response()->json([
                'message'=> 'Đã có lỗi hệ thống xảy ra!',
                'error'=>$e->getMessage(),
            ],500);
        }
    }

    public function apiTuChoiYeuCau(Request $request){
        try{
            $user = $request->attributes->get("user");
            if(!$user){
                return response()->json([
                    'message'=> 'Không có quyền truy cập!'
                ],401);
            }
            $yeuCau = LichSuRut::find($request->input('id'));
            if(!$yeuCau){
                return response()->json([
                    'message'=> 'Không tìm thấy yêu cầu!'
                ],401);
            }
            $yeuCau->trangThai = 1;
            $yeuCau->ketQua = 0;
            $yeuCau->lyDo = $request->input('lyDo');
            $yeuCau->thoiGian = now();
            $nguoiDung = NguoiDung::find($yeuCau->id_NguoiDung);
            $nguoiDung->soDu+=$yeuCau->soLuongXu;
            DB::transaction(function () use ($yeuCau, $nguoiDung) {
                $yeuCau->save();
                $nguoiDung->save();
            });
            $yeuCau->save();
            Log::channel('customlog')->info('Từ chôi yêu cầu rút tiền: ', [
                'user' => $user->toArray(),
                'theloai' => $yeuCau->toArray()
            ]);
            return response()->json([
                'message'=> 'Từ chối yêu cầu rút tiền thành công!'
            ],200);
        }catch(Exception $e){
            return response()->json([
                'message'=> 'Đã có lỗi hệ thống xảy ra!',
                'error'=>$e->getMessage(),
            ],500);
        }
    }

    public function apiHoanThanhYeuCau(Request $request){
        try{
            $user = $request->attributes->get("user");
            if(!$user){
                return response()->json([
                    'message'=> 'Không có quyền truy cập!'
                ],401);
            }
            $yeuCau = LichSuRut::find($request->input('id'));
            if(!$yeuCau){
                return response()->json([
                    'message'=> 'Không tìm thấy yêu cầu!'
                ],401);
            }
            $yeuCau->trangThai = 1;
            $yeuCau->ketQua = 1;
            $yeuCau->thoiGian = now();
            $yeuCau->save();
            Log::channel('customlog')->info('Hoàn thành yêu cầu rút tiền: ', [
                'user' => $user->toArray(),
                'theloai' => $yeuCau->toArray()
            ]);
            return response()->json([
                'message'=> 'Hoàn thành yêu cầu rút tiền thành công!'
            ],200);
        }catch(Exception $e){
            return response()->json([
                'message'=> 'Đã có lỗi hệ thống xảy ra!',
                'error'=>$e->getMessage(),
            ],500);
        }
    }
}
