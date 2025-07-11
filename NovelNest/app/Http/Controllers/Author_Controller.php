<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Exception;
use App\Services\JwtService;
use App\Models\NguoiDung;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use App\Models\TheLoai;
use App\Models\Truyen;
use App\Models\Chuong;
use App\Models\LichSuMua;
use App\Models\BaiViet;
use App\Models\DaMua;
use App\Models\LichSuRut;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Events\LichSuRutMoi;



class Author_Controller extends Controller
{
    public function doanhThu(Request $request){
        $user = $request->attributes->get("user");
        if(!$user){
            return redirect("/");
        }
        //Top 3 doanh thu cao nhất
        $top3Truyens = Truyen::join('chuong', 'truyen.id', '=', 'chuong.id_Truyen')
            ->join('damua', 'chuong.id', '=', 'damua.id_Chuong')
            ->where('truyen.id_NguoiDung', $user->id)
            ->select('truyen.id', 'truyen.ten', DB::raw('FLOOR(SUM(damua.gia) * 0.7) as doanhThu'))
            ->groupBy('truyen.id', 'truyen.ten')
            ->orderByDesc('doanhThu')
            ->limit(3)
            ->get();
        $top3Truyens = $top3Truyens->isEmpty() ? collect([]) : $top3Truyens;
        //Tuyện đang hoạt động
        $truyenDangHoatDong = Truyen::where('id_NguoiDung',$user->id)->where('trangThai',1)->count();
        //Doanh thu tuần này
        $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $endOfWeek = Carbon::now();
        $doanhThuTuan = Damua::join('chuong', 'damua.id_Chuong', '=', 'chuong.id')
            ->join('truyen', 'chuong.id_Truyen', '=', 'truyen.id')
            ->join('lichsumua','damua.id_LichSuMua','=','lichsumua.id')
            ->where('truyen.id_NguoiDung', $user->id)
            ->whereBetween('lichsumua.thoiGian', [$startOfWeek, $endOfWeek])
            ->selectRaw('FLOOR(SUM(damua.gia * 0.7)) as tongDoanhThu')
            ->value('tongDoanhThu');
        $doanhThuTuan = $doanhThuTuan ?? 0;
        //Chart doanh tháng này
        $startOfMonth = Carbon::now()->startOfMonth(); 
        $endOfMonth = Carbon::now()->endOfMonth();     

        $doanhThuTrongThang = Damua::join('chuong', 'damua.id_Chuong', '=', 'chuong.id')
            ->join('truyen', 'chuong.id_Truyen', '=', 'truyen.id')
            ->join('lichsumua', 'damua.id_LichSuMua', '=', 'lichsumua.id')
            ->where('truyen.id_NguoiDung', $user->id)
            ->whereBetween('lichsumua.thoiGian', [$startOfMonth, $endOfMonth])
            ->select(
                DB::raw("DATE(lichsumua.thoiGian) as ngay"),
                DB::raw("FLOOR(SUM(damua.gia) * 0.7) as tongDoanhThu")
            )
            ->groupBy(DB::raw("DATE(lichsumua.thoiGian)"))
            ->get();
        $ngayTrongThang = collect(range(1, $startOfMonth->daysInMonth))
            ->map(function ($day) use ($startOfMonth) {
                return $startOfMonth->copy()->day($day)->toDateString();
            });
        $doanhThuMap = $doanhThuTrongThang->isEmpty()
                        ? collect()
                        : $doanhThuTrongThang->pluck('tongDoanhThu', 'ngay');
        $finalDataThang = $ngayTrongThang->map(function ($ngay) use ($doanhThuMap) {
            return [
                'mocThoiGian' => $ngay,
                'tongDoanhThu' => $doanhThuMap->get($ngay, 0)
            ];
        });

        $top10Thang = Truyen::join('chuong', 'truyen.id', '=', 'chuong.id_Truyen')
            ->join('damua', 'chuong.id', '=', 'damua.id_Chuong')
            ->where('truyen.id_NguoiDung', $user->id)
            ->join('lichsumua', 'damua.id_LichSuMua', '=', 'lichsumua.id')
            ->whereBetween('lichsumua.thoiGian', [$startOfMonth, $endOfMonth])
            ->select('truyen.id', 'truyen.ten', DB::raw('FLOOR(SUM(damua.gia) * 0.7) as doanhThu'),DB::raw('COUNT(damua.gia) as luotBan'))
            ->groupBy('truyen.id', 'truyen.ten')
            ->orderByDesc('doanhThu')
            ->limit(10)
            ->get();

        //Doanh thu năm nay
        $startOfYear = Carbon::now()->startOfYear();
        $endOfYear = Carbon::now()->endOfYear();
        $year =  $startOfYear->year;

        $doanhThuTrongNam = Damua::join('chuong', 'damua.id_Chuong', '=', 'chuong.id')
            ->join('truyen', 'chuong.id_Truyen', '=', 'truyen.id')
            ->join('lichsumua', 'damua.id_LichSuMua', '=', 'lichsumua.id')
            ->where('truyen.id_NguoiDung', $user->id)
            ->whereBetween('lichsumua.thoiGian', [$startOfYear, $endOfYear])
            ->select(
                DB::raw("MONTH(lichsumua.thoiGian) as thang"),
                DB::raw("FLOOR(SUM(damua.gia) * 0.7) as tongDoanhThu")
            )
            ->groupBy(DB::raw("MONTH(lichsumua.thoiGian)"))
            ->get();
        
        $thangTrongNam = collect(range(1, 12));
        $doanhThuMap = $doanhThuTrongNam->pluck('tongDoanhThu', 'thang');
        $finalDataNam = $thangTrongNam->map(function ($thang) use ($doanhThuMap,$year) {
            return [
                'mocThoiGian' => "$year-$thang",
                'tongDoanhThu' => $doanhThuMap->get($thang, 0)
            ];
        });

        $top10Nam = Truyen::join('chuong', 'truyen.id', '=', 'chuong.id_Truyen')
            ->join('damua', 'chuong.id', '=', 'damua.id_Chuong')
            ->where('truyen.id_NguoiDung', $user->id)
            ->join('lichsumua', 'damua.id_LichSuMua', '=', 'lichsumua.id')
            ->whereBetween('lichsumua.thoiGian', [$startOfYear, $endOfYear])
            ->select('truyen.id', 'truyen.ten', DB::raw('FLOOR(SUM(damua.gia) * 0.7) as doanhThu'),DB::raw('COUNT(damua.gia) as luotBan'))
            ->groupBy('truyen.id', 'truyen.ten')
            ->orderByDesc('doanhThu')
            ->limit(10)
            ->get();
        //Chart doanh thu all
        $doanhThuAll = DaMua::join('chuong','damua.id_Chuong','=','chuong.id')
            ->join('truyen','chuong.id_Truyen','=','truyen.id')
            ->join('lichsumua','damua.id_LichSuMua','=','lichsumua.id')
            ->where('truyen.id_NguoiDung',$user->id)
            ->select(
                DB::raw("YEAR(lichsumua.thoiGian) as nam"),
                DB::raw("FLOOR(SUM(damua.gia) * 0.7) as tongDoanhThu")
            )
            ->groupBy(DB::raw("YEAR(lichsumua.thoiGian)"))
            ->get();
        // $cacNam = collect(range($namBatDau = $doanhThuAll->first()->nam, $doanhThuAll->last()->nam));
        if ($doanhThuAll->isNotEmpty()) {
            $namBatDau = $doanhThuAll->first()->nam;
            $namKetThuc = $doanhThuAll->last()->nam;
            $cacNam = collect(range($namBatDau, $namKetThuc));
        } else {
            $cacNam = collect(range($year,$year)); // Trống, không có năm nào
        }
        $doanhThuMap = $doanhThuAll->pluck('tongDoanhThu','nam');
        $finalDataAll = $cacNam->map(function ($nam) use ($doanhThuMap){
            return[
                'mocThoiGian'=>$nam,
                'tongDoanhThu'=>$doanhThuMap->get($nam,0)
            ];
        });

        $top10All = Truyen::join('chuong', 'truyen.id', '=', 'chuong.id_Truyen')
            ->join('damua', 'chuong.id', '=', 'damua.id_Chuong')
            ->where('truyen.id_NguoiDung', $user->id)
            ->join('lichsumua', 'damua.id_LichSuMua', '=', 'lichsumua.id')
            ->select('truyen.id', 'truyen.ten', DB::raw('FLOOR(SUM(damua.gia) * 0.7) as doanhThu'),DB::raw('COUNT(damua.gia) as luotBan'))
            ->groupBy('truyen.id', 'truyen.ten')
            ->orderByDesc('doanhThu')
            ->limit(10)
            ->get();
        /////////////////////////
        

        /////////////////////////
        return Inertia::render("Author/DoanhThu", [
            "user"=> $user,
            "top3Truyens"=>$top3Truyens,
            "truyenDangHoatDong"=>$truyenDangHoatDong,
            "doanhThuTuan"=>$doanhThuTuan,
            "chartThang"=>$finalDataThang,
            "chartNam"=>$finalDataNam,
            "chartAll"=>$finalDataAll,
            "top10Thang"=>$top10Thang,
            "top10Nam"=>$top10Nam,
            "top10All"=>$top10All,

        ]);


    }

    public function truyen(Request $request){
        $user = $request->attributes->get("user");
        if(!$user){ 
            return redirect("/");
        }
        $truyens = $user->Truyens()->orderBy('ngayBatDau', 'desc')->with('TheLoai:id,ten')->withSum('Chuongs as luotXem', 'luotXem')->get();
        return Inertia::render("Author/Truyen", [
            "user"=> [
                'ten'=>$user->ten,
                'anhDaiDien' =>$user->anhDaiDien,
            ],
            "truyens"=>$truyens,
        ]);
    }

    public function themTruyen(Request $request){
        $user = $request->attributes->get("user");
        if(!$user){ 
            return redirect("/");
        }
        $theLoais = TheLoai::where("trangThai", 1)->get();
        return Inertia::render("Author/ThemTruyen", [
            "user"=> [
                'ten'=>$user->ten,
                'anhDaiDien' =>$user->anhDaiDien,
            ],
            "theLoais"=>$theLoais
        ]);
    }

    public function suaTruyen(Request $request,$id){
        $user = $request->attributes->get("user");
        if(!$user){ 
            return redirect("/");
        }
        $theLoais = TheLoai::where("trangThai", 1)->get();
        $truyen = Truyen::find($id);
        if(!$truyen || $truyen->id_NguoiDung != $user->id || $truyen->trangThai == 0){
            return redirect('/author/truyen');
        }
        return Inertia::render("Author/SuaTruyen", [
            "user"=> [
                'ten'=>$user->ten,
                'anhDaiDien' =>$user->anhDaiDien,
            ],
            "theLoais"=>$theLoais,
            'truyen' => $truyen
        ]);
    }

    public function apiThemTruyen(Request $request){
        $user = $request->attributes->get("user");
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        if($request->hasFile('hinhAnh')){
            $hinhAnh = $request->file('hinhAnh');
            $nameHinhAnh = uniqid().'.'.$hinhAnh->getClientOriginalExtension();
        }
        if($request->hasFile('hinhNen')){
            $hinhNen = $request->file('hinhNen');
            $nameHinhNen = uniqid().'.'.$hinhNen->getClientOriginalExtension();
        }
        try{
            $truyen = new Truyen();
            $truyen->ten = $request->input('ten');
            $truyen->id_TheLoai = $request->input('id_TheLoai');
            $truyen->gioiThieu = $request->input('gioiThieu');
            $truyen->id_NguoiDung = $user->id;
            $truyen->hinhAnh = $nameHinhAnh;
            $truyen->hinhNen = $nameHinhNen;
            $truyen->phanLoai = 1;
            $truyen->trangThai = 1;
            $truyen->ngayBatDau = now();
            $truyen->save();
            $hinhAnh->move(public_path('img/truyen/hinhAnh/'), $nameHinhAnh);
            $hinhNen->move(public_path('img/truyen/hinhNen/'), $nameHinhNen);
        }catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()],404);
        }
        return response()->json([
            'message'=> 'Tạo truyện mới thành công!'
        ],201);
    }

    public function apiSuaTruyen(Request $request,$id){
        try {
            $user = $request->attributes->get("user");
            $truyen = Truyen::find( $id );
            if(!$user || !$truyen || $truyen->id_NguoiDung != $user->id){
                return response()->json([
                    'message'=> 'Không có quyền truy cập!'
                ],401);
            }
            try{
                $truyen->ten = $request->input('ten');
                $truyen->id_TheLoai = $request->input('id_TheLoai') ?? $truyen->id_TheLoai;
                $truyen->gioiThieu = $request->input('gioiThieu');
                if ($request->hasFile('hinhAnh')) {
                    if ($truyen->hinhAnh && file_exists(public_path('img/truyen/hinhAnh/' . $truyen->hinhAnh))) {
                        unlink(public_path('img/truyen/hinhAnh/' . $truyen->hinhAnh));
                    }
                    $hinhAnh = $request->file('hinhAnh');
                    $nameHinhAnh = uniqid() . '.' . $hinhAnh->getClientOriginalExtension();
                    $hinhAnh->move(public_path('img/truyen/hinhAnh/'), $nameHinhAnh);
                    $truyen->hinhAnh = $nameHinhAnh;
                }
                if($request->hasFile('hinhNen')){
                    if ($truyen->hinhNen && file_exists(public_path('img/truyen/hinhNen/' . $truyen->hinhNen))) {
                        unlink(public_path('img/truyen/hinhNen/' . $truyen->hinhNen));
                    }
                    $hinhNen = $request->file('hinhNen');
                    $nameHinhNen = uniqid().'.'.$hinhNen->getClientOriginalExtension();
                    $hinhNen->move(public_path('img/truyen/hinhNen/'), $nameHinhNen);
                    $truyen->hinhNen = $nameHinhNen;
                }
                $truyen->phanLoai = 1;
                $truyen->trangThai = $request->trangThai;
                $truyen->save();
            }catch(\Exception $e){
                return response()->json(['message' => $e->getMessage()],404);
            }
            return response()->json([
                'message'=> 'Sửa truyện thành công!'
            ],201);
        }catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()],404);
        }
    }

    public function truyenChuong(Request $request, $id){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect("/");
        }
        $truyen = Truyen::find($id);
        if(!$truyen || $truyen->id_NguoiDung != $user->id){
            return redirect('/author/truyen');
        }
        return Inertia::render('Author/TruyenChuong',[
            "user"=> [
                'ten'=>$user->ten,
                'anhDaiDien' =>$user->anhDaiDien,
            ],
            'truyen'=> $truyen,
            'chuongs'=>$truyen->Chuongs()->get(),
        ]);
    }
    public function themChuong(Request $request, $id){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect("/");
        }
        $truyen = Truyen::withCount('chuongs as soLuongChuong')->find($id);
        if(!$truyen || $truyen->id_NguoiDung != $user->id){
            return redirect('/author/truyen');
        }
        return Inertia::render('Author/ThemChuong',[
            "user"=> [
                'ten'=>$user->ten,
                'anhDaiDien' =>$user->anhDaiDien,
                'premium' => $user->premium > now() 
                    ? true 
                    : ($user->vaiTro == 3 ? false : true),
            ],
            'truyen'=> $truyen,
        ]);
    }

    public function apiThemChuong(Request $request, $id){
        $user = $request->attributes->get("user");
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        $ten = $request->input('ten');
        $gia = $request->input('gia');
        $noiDung = $request->input('noiDung');
        $soChuong = $request->input('soChuong');
        $tomTat = $request->input('tomTat');
        $end = $request->input('end');
        $end = filter_var($end, FILTER_VALIDATE_BOOLEAN);
        $truyen = Truyen::find($id);
        if (!$truyen) {
            return response()->json(['errorTruyen' => 'Truyện không tồn tại!'], 404);
        }
        $response = [];
        $errorR = false;
        if($truyen->chuongs()->where('ten', $ten)->exists()){
            $response['errorTen'] = 'Tên chương đã tồn tại!';
            $errorR = true;
        }
        if($truyen->chuongs()->where('soChuong',$soChuong)->first()){
            $response['errorSoChuong'] = 'Đã có người thêm chuong '.$soChuong.', hãy kiểm tra lại!';
            $errorR = true;
        }
        if($errorR){
            return response()->json($response,409);
        }
        
        try{
            $chuong = new Chuong();
            $chuong->id_Truyen = $id;
            $chuong->ten = $ten;
            $chuong->gia = $gia;
            $chuong->noiDung = $noiDung;
            $chuong->soChuong = $soChuong;
            $chuong->tomTat = $tomTat;
            $chuong->ngayTao = now();
            $chuong->save();
            $truyen->updatePhanLoai();

            if($end){
                $truyen->ngayKetThuc = $end?now():null;
                $truyen->save();
            }
            return response()->json(['message' => 'Thêm chương thành công!'], 200);
        }catch(Exception $e){
            return response()->json([
                'message' => 'Đã có lỗi không mong muốn xảy ra khi thêm chương.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function SuaChuong(Request $request, $id){
        $user = $request->attributes->get('user');
        if(!$user){
            return redirect("/");
        }
        $chuong = Chuong::find($id);
        if(!$chuong || $chuong->truyen->id_NguoiDung != $user->id){
            return redirect("/author/truyen");
        }
        $truyen = $chuong->truyen;
        $user->premium =  $user->premium > now() 
                            ? true 
                            : ($user->vaiTro == 3 ? false : true);
        return Inertia::render("Author/SuaChuong", [
            "chuong"=>$chuong,
            "truyen"=>$truyen,
            "user"=>$user,
        ]);
    }
    public function apiSuaChuong(Request $request, $id){
        $user = $request->attributes->get("user");
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        $ten = $request->input('ten');
        $gia = $request->input('gia');
        $noiDung = $request->input('noiDung');
        $tomTat = $request->input('tomTat');
        $chuong = Chuong::find($id);
        if (!$chuong) {
            return response()->json(['errorTruyen' => 'Chương không tồn tại!'], 404);
        }
        if($chuong->truyen->id_NguoiDung != $user->id){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        if($ten != $chuong->ten){
            if($chuong->truyen->chuongs()->where('ten', $ten)->exists()){
                $response['errorTen'] = 'Tên chương đã tồn tại!';
                return response()->json($response,409);
            }
        }
        try{
            $chuong->ten = $ten;
            $chuong->gia = $gia;
            if ($noiDung != $chuong->noiDung) {
                $chuong->noiDung = $noiDung;
                $prefix = 't' . $chuong->id . '_';
                $folder = storage_path('app/private/tts');

                collect(scandir($folder))
                    ->filter(fn($file) => str_ends_with($file, '.mp3') && str_starts_with($file, $prefix))
                    ->each(function ($file) use ($folder) {
                        $fullPath = $folder . DIRECTORY_SEPARATOR . $file;
                        if (file_exists($fullPath)) {
                            unlink($fullPath);
                        }
                    });
            }
            $chuong->tomTat = $tomTat;
            $chuong->save();
            $truyen = $chuong->truyen;
            $truyen->updatePhanLoai();
            return response()->json(['message' => 'Sửa chương thành công!'], 200);
        }catch(Exception $e){
            return response()->json([
                'message' => 'Đã có lỗi không mong muốn xảy ra khi thêm chương.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function blog(Request $request){
        $user = $request->attributes->get("user");
        if(!$user){ 
            return redirect("/");
        }
        $baiVies = $user->baiViets()->orderByDesc('ngayTao')->get();
        return Inertia::render("Author/Blog", [
            "user"=> [
                'ten'=>$user->ten,
                'anhDaiDien' =>$user->anhDaiDien,
            ],
            "baiViets"=>$baiVies,
        ]);
    }

    public function themBlog(Request $request){
        $user = $request->attributes->get("user");
        if(!$user){ 
            return redirect("/");
        }
        return Inertia::render("Author/ThemBlog", [
            "user"=> [
                'ten'=>$user->ten,
                'anhDaiDien' =>$user->anhDaiDien,
            ],
        ]);
    }
    public function apiThemBlog(Request $request){
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
            $blog = new BaiViet();
            $blog->tieuDe = $request->tieuDe;
            $blog->hinhAnh = $nameHinhAnh;
            $blog->noiDung = $request->noiDung;
            $blog->ngayTao = now();
            $blog->id_NguoiDung = $user->id;
            $blog->save();
            $hinhAnh->move(public_path('img/blog/'), $nameHinhAnh);
        }catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()],404);
        }
        return response()->json([
            'message'=> 'Tạo blog mới thành công!'
        ],201);
    }
    public function suaBlog(Request $request,$id){
        $user = $request->attributes->get("user");
        if(!$user){ 
            return redirect("/");
        }
        $blog = BaiViet::find($id);
        if(!$blog){
            return redirect('/author/blog');
        }
        return Inertia::render("Author/SuaBlog", [
            "user"=> [
                'ten'=>$user->ten,
                'anhDaiDien' =>$user->anhDaiDien,
            ],
            'blog'=>$blog
        ]);
    }
    public function apiSuaBlog(Request $request,$id){
        $user = $request->attributes->get("user");
        if(!$user){
            return response()->json([
                'message'=> 'Không có quyền truy cập!'
            ],401);
        }
        $blog = BaiViet::find($id);
        if(!$blog){
            return response()->json([
                'message'=> 'Không tìm thấy blog này!'
            ],401);
        }
        try{
            $blog->tieuDe = $request->tieuDe;
            if($request->hasFile('hinhAnh')){
                if ($blog->hinhAnh && file_exists(public_path('img/blog/' . $blog->hinhAnh))) {
                    unlink(public_path('img/blog/' . $blog->hinhAnh));
                }
                $hinhAnh = $request->file('hinhAnh');
                $nameHinhAnh = uniqid().'.'.$hinhAnh->getClientOriginalExtension();
                $hinhAnh->move(public_path('img/blog/'), $nameHinhAnh);
                $blog->hinhAnh = $nameHinhAnh;
            }
            $blog->noiDung = $request->noiDung;
            $blog->save();
        }catch(\Exception $e){
            return response()->json(['message' => $e->getMessage()],404);
        }
        return response()->json([
            'message'=> 'Sửa blog thành công!'
        ],201);
    }
    public function rutXu(Request $request){
        $user = $request->attributes->get("user");
        if(!$user){ 
            return redirect("/");
        }
        return Inertia::render('Author/RutXu',[
            'user'=>$user,
        ]);
    }
    public function apiRutXu(Request $request){
        try{
            $user = $request->attributes->get('user');
            if(!$user){
                return response()->json([
                    'message'=> 'Không có quyền truy cập!'
                ],401);
            }
            if($request->soLuongXu > $user->soDu){
                return response()->json([
                    'message'=> 'Không đủ số dư trong tài khoản!'
                ],401);
            }
            $lichSuRut = new LichSuRut();
            $lichSuRut->id_NguoiDung = $user->id;
            $lichSuRut->soLuongXu = $request->soLuongXu;
            $lichSuRut->giaTri = floor((int)($request->soLuongXu)*0.95);
            $lichSuRut->thoiGian = now();
            $lichSuRut->tenNganHang = $request->tenNganHang;
            $lichSuRut->soTaiKhoan = $request->soTaiKhoan;
            $lichSuRut->tenNguoiNhan = $request->tenNguoiNhan;
            $user->soDu = $user->soDu - (int)$request->soLuongXu;
            DB::transaction(function () use ($user, $lichSuRut) {
                $user->save();
                $lichSuRut->save();
            });
            broadcast(new LichSuRutMoi($lichSuRut));
            return response()->json([
                'message' => 'Yêu cầu rút tiền đã được gửi thành công.',
            ], 200);
        }catch(Exception $e){
            return response()->json([
                'message' => 'Đã xảy ra lỗi hệ thống!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
