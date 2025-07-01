<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LichSuMua extends Model
{
    protected $table = "lichsumua";
    protected $primaryKey = "id";
    protected $fillable = ["thoiGian","id_NguoiDung","gia"];
    public $timestamps = false;
    public function NguoiDung(){
        return $this->belongsTo(NguoiDung::class,"id_NguoiDung");
    }
    public function DaMuas(){
        return $this->hasMany(Damua::class,"id_LichSuMua");
    }
}
