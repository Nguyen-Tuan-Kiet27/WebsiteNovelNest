<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThongTin extends Model
{
    protected $table = "thongtin";
    protected $primaryKey = "id";
    protected $fillable = ["khoa","giaTri","loai"];
    public $timestamps = false;
}
