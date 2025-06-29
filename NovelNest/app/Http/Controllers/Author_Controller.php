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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class Author_Controller extends Controller
{
    public function doanhThu(Request $request){
        $user = $request->attributes->get("user");
        if(!$user){
            return redirect("/");
        }
        return Inertia::render("Author/DoanhThu", [
            "user"=> [
                'ten'=>$user->ten,
                'anhDaiDien' =>$user->anhDaiDien,
            ]
        ]);
    }

    public function truyen(Request $request){
        $user = $request->attributes->get("user");
        $truyens = $user->Truyens()->orderBy('ngayBatDau', 'desc')->with('TheLoai:id,ten')->withSum('Chuongs as luotXem', 'luotXem')->get();
        if(!$user){ 
            return redirect("/");
        }
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
        $theLoais = TheLoai::where("trangThai", 1)->get();
        if(!$user){ 
            return redirect("/");
        }
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
        $theLoais = TheLoai::where("trangThai", 1)->get();
        if(!$user){ 
            return redirect("/");
        }
        $truyen = Truyen::find($id);
        if(!$truyen || $truyen->id_NguoiDung != $user->id){
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
                Log::info($request->input('ten'));
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
            if($chuong->truyen()->chuongs()->where('ten', $ten)->exists()){
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
                            Log::info("Đã xóa file: " . $file);
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
}
