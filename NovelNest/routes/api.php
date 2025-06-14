<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User_Controller;
use App\Http\Controllers\Admin_Controller;
use App\Http\Controllers\Author_Controller;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/logout',[User_Controller::class,'logout']);

Route::post('/admin/login', [Admin_Controller::class,'authLogin'])->middleware(['web']);

Route::post('/admin/themtheloai', [Admin_Controller::class,'apiThemTheLoai'])->middleware(['web','CheckLogin:1,2']);

Route::post('/author/themtruyen', [Author_Controller::class,'apiThemTruyen'])->middleware(['web','CheckLogin:1,2,3']);