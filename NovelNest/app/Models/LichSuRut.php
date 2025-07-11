<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LichSuRut extends Model
{
    protected $table = "lichsurut";
    protected $primaryKey = "id";
    protected $fillable = ["id_NguoiDung",'trangThai','xuLy','ketQua','lyDo','id_Admin','soLuongXu','giaTri','thoiGian','tenNganHang','soTaiKhoan','tenNguoiNhan'];
    // trangThai 0 chưa xử lý 1 dã xử lý
    // xuLy 0 chưa có admin nhận 1 là đã có người nhận
    // ketQua 0 bị từ chối 1 đã chuyển khoản

    public $timestamps = false;
    public function NguoiDung(){
        return $this->belongsTo(NguoiDung::class,"id_NguoiDung");
    }
    public function Admin(){
        return $this->belongsTo(NguoiDung::class,"id_Admin");
    }
}
