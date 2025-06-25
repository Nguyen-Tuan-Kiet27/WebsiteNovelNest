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
}
