<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User_Controller;
use App\Http\Controllers\Author_Controller;
use App\Http\Controllers\Admin_Controller;
use Inertia\Inertia;
use Illuminate\Cookie\Middleware\EncryptCookies;

//user
Route::get('/', [User_Controller::class, 'index'])->middleware('CheckLogin');
Route::get('/theloai', [User_Controller::class,'category']);
Route::get('/theloai/{id}', [User_Controller::class,'danhSachTruyenTheLoai']);
Route::get('/truyen/{id}', [User_Controller::class,'stories']);
Route::get('/chuong/{id}', [User_Controller::class,'detailStory']);


Route::get('/auth/facebook', [User_Controller::class,'LoginFB']);
Route::get('/auth/facebook/callback', [User_Controller::class,'LoginFBCallback']);
Route::get('/auth/google', [User_Controller::class, 'loginGG']);
Route::get('/auth/google/callback', [User_Controller::class, 'LoginGGCallback']);

Route::get('/taikhoan', [User_Controller::class,'taiKhoan'])->middleware('CheckLogin');
//author
Route::get('/author', [Author_Controller::class,'DoanhThu'])->middleware('CheckLogin:1,2,3');
Route::get('/author/truyen', [Author_Controller::class,'Truyen'])->middleware('CheckLogin:1,2,3');
Route::get('/author/themtruyen', [Author_Controller::class,'ThemTruyen'])->middleware('CheckLogin:1,2,3');
Route::get('/author/truyen/{id}', [Author_Controller::class,'TruyenChuong'])->middleware('CheckLogin:1,2,3');
Route::get('/author/themchuong/{id}', [Author_Controller::class,'ThemChuong'])->middleware('CheckLogin:1,2,3');



//Admin
Route::get('/admin/dangnhap', [Admin_Controller::class,"login"])->middleware('CheckLogin');
Route::get('/admin', [Admin_Controller::class,'dashboard'])->middleware('CheckLogin:1,2');
Route::get('/admin/quanlytruyen', [Admin_Controller::class,'quanlytruyen'])->middleware('CheckLogin:1,2');
Route::get('/admin/themtheloai', [Admin_Controller::class,'themTheLoai'])->middleware('CheckLogin:1,2');
//////////////Chuyển token từ ngrok về localhost
Route::get('/auth/callback', [User_Controller::class,'authCallback']);

