<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BinhLuan extends Model
{
    protected $table = "binhluan";
    protected $primaryKey = "id";
    protected $fillable = ["noiDung","id_BinhLuan","id_NguoiDung","id_Truyen","ngayTao"];
    public $timestamps = false;
    public function BinhLuan(){
        return $this->belongsTo(BinhLuan::class,"id_BinhLuan");
    }
    public function NguoiDung(){
        return $this->belongsTo(NguoiDung::class,"id_NguoiDung");
    }
    public function Truyen(){
        return $this->belongsTo(Truyen::class,"id_Truyen");

    }
    public function BinhLuans(){
        return $this->hasMany(BinhLuan::class,"id_BinhLuan");
    }
}
