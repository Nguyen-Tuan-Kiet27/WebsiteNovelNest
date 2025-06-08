<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LichSuDoc extends Model
{
    protected $table = "lichsudoc";
    protected $primaryKey = "id";
    protected $fillable = ["thoiGian","id_Chuong","id_NguoiDung"] ;
    public $timestamps = false;
    public function Chuong(){
        return $this->belongsTo(Chuong::class,"id_Chuong");
    }
    public function NguoiDung(){
        return $this->belongsTo(NguoiDung::class,"id_NguoiDung");
    }
}
