<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuangCao extends Model
{
    protected $table = "quangcao";
    protected $primaryKey = "id";
    protected $fillable = ["hinhAnh","lienKet","ngayTao","trangThai","id_NguoiDung"];
    public $timestamps = false;
    public function NguoiDung(){
        return $this->belongsTo(NguoiDung::class,"id_NguoiDung");
    }
}
