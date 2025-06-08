<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BaiViet extends Model
{
    protected $table = "baiviet";
    protected $primaryKey = "id";
    protected $fillable = ["tieuDe","noiDung","hinhAnh","ngayTao","id_NguoiDung"];
    public $timestamps = false;
    public function NguoiDung(){
        return $this->belongsTo(NguoiDung::class,"id_NguoiDung");
    }
}
