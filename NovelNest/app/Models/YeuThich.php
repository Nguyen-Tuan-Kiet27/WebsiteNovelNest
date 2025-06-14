<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class YeuThich extends Model
{
    protected $table = "yeuthich";
    protected $primaryKey = ["id_Truyen","id_NguoiDung"];
    public $incrementing = false;
    protected $fillable = ["id_Truyen","id_NguoiDung"];
    public $timestamps = false;
    public function Truyen(){
        return $this->belongsTo(Truyen::class,"id_Truyen");
    }
    public function NguoiDung(){
        return $this->belongsTo(NguoiDung::class,"id_NguoiDung");
    }
}
