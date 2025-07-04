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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        return Inertia::render('Admin/DashBoard',['user'=> $user]);
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
}
