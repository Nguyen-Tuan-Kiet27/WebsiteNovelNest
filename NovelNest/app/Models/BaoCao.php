<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BaoCao extends Model
{
    protected $table = "baocao";
    protected $primaryKey = ['id'];
    public $incrementing = false;
    protected $fillable = ["id_Chuong","id_NguoiDung","noiDung","trangThai"];
    public $timestamps = false;
    public function Chuong(){
        return $this->belongsTo(Chuong::class,"id_Chuong");
    }
    public function NguoiDung(){
        return $this->belongsTo(NguoiDung::class,"id_NguoiDung");
    }
}
