<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User_Controller;


Route::get('/', [User_Controller::class, 'index']);
Route::get('/theloai', [User_Controller::class,'category']);
Route::get('/theloai/{id}', [User_Controller::class,'danhSachTruyenTheLoai']);
