<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DaMua extends Model
{
    protected $table = "damua";
    protected $primaryKey = ["id_LichSuMua","id_Chuong"];
    public $incrementing = false;
    protected $fillable = ["id_LichSuMua","id_Chuong","id_NguoiDung","gia"];
    public $timestamps = false;
    public function LichSuMua(){
        return $this->belongsTo(LichSuMua::class,"id_LichSuMua");
    }
    public function Chuong(){
        return $this->belongsTo(Chuong::class,"id_Chuong");
    }
    public function NguoiDung(){
        return $this->belongsTo(NguoiDung::class,"id_NguoiDung");
    }
}
