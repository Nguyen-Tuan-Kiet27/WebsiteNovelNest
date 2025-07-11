<?php

namespace App\Models;

use Carbon\Traits\Timestamp;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class NguoiDung extends Model
{
    protected $table = "nguoidung";
    protected $primaryKey = "id";
    public $incrementing = false;
    public $keyType = "string";
    protected $fillable = ["id","ten","tenDangNhap","email","matKhau","vaiTro","soDu","premium","anhDaiDien","ngayTao","trangThai","lyDo"] ;
    public $timestamps = false;
    public function BaiViets(){
        return $this->hasMany(BaiViet::class, "id_NguoiDung");
    }
    public function QuanCaos(){
        return $this->hasMany(BaiViet::class,"id_NguoiDung");
    }
    public function BinhLuans(){
        return $this->hasMany(BinhLuan::class,"id_NguoiDung");
    }
    public function YeuThichs(){
        return $this->hasMany(YeuThich::class,"id_NguoiDung");
    }
    public function BaoCaos(){
        return $this->hasMany(BaoCao::class,"id_NguoiDung");
    }
    public function Truyens(){
        return $this->hasMany(Truyen::class,"id_NguoiDung");
    } 
    public function LichSuDocs(){
        return $this->hasMany(LichSuDoc::class,"id_NguoiDung");
    }
    public function DaMuas(){
        return $this->hasMany(DaMua::class,"id_NguoiDung");
    }
    public function LichSuMuas(){
        return $this->hasMany(LichSuMua::class,"id_NguoiDung");
    }
    public function LichSuNaps(){
        return $this->hasMany(LichSuNap::class,"id_NguoiDung");
    }
    public function yeuThichTruyens() {
        return $this->belongsToMany(Truyen::class, 'yeuthich', 'id_NguoiDung', 'id_Truyen')->with('theLoai');
    }
    static function maHoa($plaintext) {
        $key = env('CUSTOM_ENCRYPT_KEY');
        $iv = env('CUSTOM_ENCRYPT_IV'); // 16 bytes

        return base64_encode(openssl_encrypt($plaintext, 'AES-256-CBC', $key, 0, $iv));
    }

    static function giaiMa($ciphertext) {
        $key = env('CUSTOM_ENCRYPT_KEY');
        $iv = env('CUSTOM_ENCRYPT_IV');

        return openssl_decrypt(base64_decode($ciphertext), 'AES-256-CBC', $key, 0, $iv);
    }



}
