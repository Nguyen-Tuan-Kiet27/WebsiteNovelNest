<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TheLoai extends Model
{
    protected $table = "theloai";
    protected $primaryKey = "id";
    protected $fillable = ["ten","hinhAnh","trangThai"];
    public $timestamps = false;
    public function Truyens(){
        return $this->hasMany(Truyen::class,"id_TheLoai");
    }
}
