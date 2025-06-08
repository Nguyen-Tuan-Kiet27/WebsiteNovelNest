<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Truyen extends Model
{
    protected $table = "truyen";
    protected $primaryKey = "id";
    protected $fillable = ["ten","gioiThieu","hinhAnh","hinhNen","phanLoai","trangThai","ngayBatDau","ngayKetThuc","id_NguoiDung","id_TheLoai"];
    public $timestamps = false;
    public function NguoiDung(){
        return $this->belongsTo(NguoiDung::class,"id_NguoiDung");
    }
    public function TheLoai(){
        return $this->belongsTo(TheLoai::class,"id_TheLoai");
    }
    public function BinhLuans(){
        return $this->hasMany(BinhLuan::class,"id_Truyen");
    }
    public function YeuThichs(){
        return $this->hasMany(YeuThich::class,"id_Truyen");
    }
    public function DaMuas(){
        return $this->hasMany(Damua::class,"id_Truyen");
    }
}
