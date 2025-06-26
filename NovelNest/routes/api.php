<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User_Controller;
use App\Http\Controllers\Admin_Controller;
use App\Http\Controllers\Author_Controller;
use App\Http\Controllers\Summary_Controller;
use App\Http\Controllers\TextToSpeech_Controller;
use App\Http\Controllers\Payment_Controller;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//User
Route::post('/logout',[User_Controller::class,'logout']);
Route::post('/favorite/{id}',[User_Controller::class,'changeYeuThich'])->middleware(['web','CheckLogin']);
Route::get('/audio/{id}/{speakerId}',[TextToSpeech_Controller::class,'get']);
Route::get('/damua/{id}',[User_Controller::class,'checkDaMua'])->middleware(['web','CheckChuong'] );
Route::get('/checkrole',[User_Controller::class,'apiCheckRole'])->middleware(['web','CheckLogin'] );
Route::post('/send-otp', [User_Controller::class, 'sendOtpEmail'])->middleware(['web','CheckLogin']);
Route::post('/verify-otp', [User_Controller::class, 'verifyOtp'])->middleware(['web','CheckLogin']);
Route::post('/vnpay/create-payment', [Payment_Controller::class, 'vnpayPayment'])->middleware(['web','CheckLogin']);
Route::post('/momo/create-payment', [Payment_Controller::class, 'momoPayment'])->middleware(['web','CheckLogin']);



//Author
Route::post('/author/themtruyen', [Author_Controller::class,'apiThemTruyen'])->middleware(['web','CheckLogin:1,2,3']);
Route::post('/author/themchuong/{id}', [Author_Controller::class,'apiThemChuong'])->middleware(['web','CheckLogin:1,2,3']);
Route::post('/tomtat', [Summary_Controller::class,'summarize'])->middleware(['web','CheckLogin:1,2,3']);

//Admin
Route::post('/admin/login', [Admin_Controller::class,'authLogin'])->middleware(['web']);

Route::post('/admin/themtheloai', [Admin_Controller::class,'apiThemTheLoai'])->middleware(['web','CheckLogin:1,2']);

