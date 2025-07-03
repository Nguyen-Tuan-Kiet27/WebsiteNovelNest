<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chuong extends Model
{
    protected $table = "chuong";
    protected $primaryKey = "id";
    protected $fillable = ["ten","soChuong","tomTat","noiDung","gia","ngayTao","luotXem","amThanh","id_Truyen","trangThai"];
    public $timestamps = false;
    public function LichSuDocs(){
        return $this->hasMany(LichSuDoc::class,"id_Chuong");
    }
    public function DaMuas(){
        return $this->hasMany(DaMua::class,"id_Chuong");
    }
    public function BaoCaos(){
        return $this->hasMany(BaoCao::class,"id_Chuong");
    }
    public function Truyen(){
        return $this->belongsTo(Truyen::class,"id_Truyen");
    }
}
