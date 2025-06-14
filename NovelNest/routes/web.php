<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User_Controller;
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

//Admin
Route::get('/admin/login', [Admin_Controller::class,"login"])->middleware('CheckLogin');

//////////////Chuyển token từ ngrok về localhost
Route::get('/auth/callback', [User_Controller::class,'authCallback']);

