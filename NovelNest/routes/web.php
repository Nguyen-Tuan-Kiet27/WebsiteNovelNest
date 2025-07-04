<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User_Controller;
use App\Http\Controllers\Author_Controller;
use App\Http\Controllers\Admin_Controller;
use App\Http\Controllers\Payment_Controller;
use Inertia\Inertia;
use Illuminate\Cookie\Middleware\EncryptCookies;

//user
Route::get('/', [User_Controller::class, 'index'])->middleware('CheckLogin');
Route::get('/theloai', [User_Controller::class,'category'])->middleware('CheckLogin');
Route::get('/theloai/{id}', [User_Controller::class,'danhSachTruyenTheLoai'])->middleware('CheckLogin');
Route::get('/truyen/{id}', [User_Controller::class,'stories'])->middleware('CheckLogin');
Route::get('/chuong/{id}', [User_Controller::class,'detailStory'])->middleware(['CheckLogin','CheckChuong']);
Route::get('/blogtruyen', [User_Controller::class,'blogTruyen'])->middleware('CheckLogin');
Route::get('/blogtruyen/{id}', [User_Controller::class,'detailBlogTruyen'])->middleware('CheckLogin');
Route::get('/muaxu', [User_Controller::class,'muaXu'])->middleware('CheckLogin:3,4');
Route::get('/vnpay_return', [Payment_Controller::class, 'vnpayReturn'])->middleware('CheckLogin');
Route::get('/momo_return', [Payment_Controller::class, 'momoReturn'])->middleware('CheckLogin');
Route::get('/signupauthor', [User_Controller::class,'signupAuthor'])->middleware('CheckLogin');
Route::get('/dieukhoandichvu',[User_Controller::class,'dieuKhoanDichVu'])->middleware('CheckLogin');
Route::get('/datlaimatkhau', [User_Controller::class,'datLaiMatKhau'])->middleware('CheckLogin:3,4');
Route::get('/search', [User_Controller::class,'timKiem'])->middleware('CheckLogin');




Route::get('/auth/facebook', [User_Controller::class,'LoginFB']);
Route::get('/auth/facebook/callback', [User_Controller::class,'LoginFBCallback']);
Route::get('/auth/google', [User_Controller::class, 'loginGG']);
Route::get('/auth/google/callback', [User_Controller::class, 'LoginGGCallback']);

Route::get('/taikhoan', [User_Controller::class,'taiKhoan'])->middleware('CheckLogin');
//author
Route::get('/author', [Author_Controller::class,'doanhThu'])->middleware('CheckLogin:1,2,3');
Route::get('/author/truyen', [Author_Controller::class,'truyen'])->middleware('CheckLogin:1,2,3');
Route::get('/author/themtruyen', [Author_Controller::class,'themTruyen'])->middleware('CheckLogin:1,2,3');
Route::get('/author/truyen/{id}', [Author_Controller::class,'truyenChuong'])->middleware('CheckLogin:1,2,3');
Route::get('/author/themchuong/{id}', [Author_Controller::class,'themChuong'])->middleware('CheckLogin:1,2,3');
Route::get('/author/suatruyen/{id}', [Author_Controller::class,'suaTruyen'])->middleware('CheckLogin:1,2,3');
Route::get('/author/suachuong/{id}', [Author_Controller::class,'suaChuong'])->middleware('CheckLogin:1,2,3');


//Admin
Route::get('/admin/dangnhap', [Admin_Controller::class,"login"])->middleware('CheckLogin');
Route::get('/admin', [Admin_Controller::class,'dashboard'])->middleware('CheckLogin:1,2');
Route::get('/admin/quanlytruyen', [Admin_Controller::class,'quanLyTruyen'])->middleware('CheckLogin:1,2');
Route::get('/admin/quanlychuong/{id}', [Admin_Controller::class,'quanLyChuong'])->middleware('CheckLogin:1,2');
Route::get('/admin/themtheloai', [Admin_Controller::class,'themTheLoai'])->middleware('CheckLogin:1,2');
Route::get('/admin/quanlynguoidung', [Admin_Controller::class,'quanLyNguoiDung'])->middleware('CheckLogin:1,2');
Route::get('/admin/quanlylichsu/{id}', [Admin_Controller::class,'quanLyLichSu'])->middleware('CheckLogin:1,2');
//////////////Chuyển token từ ngrok về localhost
Route::get('/auth/callback', [User_Controller::class,'authCallback']);

