<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LichSuNap extends Model
{
    protected $table = "lichsunap";
    protected $primaryKey = "id";
    protected $fillable = ["soLuongXu","menhGia","thoiGian","id_NguoiDung"];
    public $timestamps = false;
    public function NguoiDung(){
        return $this->belongsTo(NguoiDung::class,"id_NguoiDung");
    }
}
