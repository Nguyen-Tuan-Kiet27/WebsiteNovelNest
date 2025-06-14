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

class Author_Controller extends Controller
{
    public function DoanhThu(Request $request){
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

    public function Truyen(Request $request){
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

    public function ThemTruyen(Request $request){
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
}
