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
Route::get('/logout',[User_Controller::class,'logout']);
Route::post('/favorite/{id}',[User_Controller::class,'changeYeuThich'])->middleware(['web','CheckLogin']);
Route::get('/audio/{id}/{speakerId}',[TextToSpeech_Controller::class,'get']);
Route::get('/damua/{id}',[User_Controller::class,'checkDaMua'])->middleware(['web','CheckLogin','CheckChuong'] );
Route::get('/checkrole',[User_Controller::class,'apiCheckRole'])->middleware(['web','CheckLogin'] );
Route::post('/send-otp', [User_Controller::class, 'sendOtpEmail'])->middleware(['web','CheckLogin']);
Route::post('/verify-otp', [User_Controller::class, 'verifyOtp'])->middleware(['web','CheckLogin']);
Route::post('/vnpay/create-payment', [Payment_Controller::class, 'vnpayPayment'])->middleware(['web','CheckLogin']);
Route::post('/momo/create-payment', [Payment_Controller::class, 'momoPayment'])->middleware(['web','CheckLogin']);
Route::get('/checkep',[User_Controller::class,'apiCheckEP'])->middleware(['web','CheckLogin']);
Route::put('/signupauthor',[User_Controller::class,'apiSignupAuthor'])->middleware(['web','CheckLogin:4']);
Route::post('/muachuong',[User_Controller::class,'apiMuaChuong'])->middleware(['web','CheckLogin']);
Route::post('/checkpass',[User_Controller::class,'apiCheckPass'])->middleware(['web','CheckLogin']);
Route::get('/tomtat/{id}',[User_Controller::class,'apiGetTomTat'])->middleware(['web','CheckLogin','CheckChuong'] );
Route::post('/lichsudoc/{id}',[User_Controller::class,'apiLichSuDoc'])->middleware(['web','CheckLogin']) ;
Route::get('/getdamua/{page}',[User_Controller::class,'apiGetDaMuas'])->middleware(['web','CheckLogin']);
Route::get('/getyeuthich/{page}',[User_Controller::class,'apiGetYeuThichs'])->middleware(['web','CheckLogin']);
Route::get('/getlichsu',[User_Controller::class,'apiGetLichSus'])->middleware(['web','CheckLogin']);
Route::put('/user/doiten',[User_Controller::class,'apiDoiTen'])->middleware(['web','CheckLogin']);
Route::post('/user/baocaochuong/{id}',[User_Controller::class,'apiBaoCaoChuong'])->middleware(['web','CheckLogin']);
Route::post('/binhluan/{id}',[User_Controller::class,'apiBinhLuan'])->middleware(['web','CheckLogin','CheckContent']);
Route::put('/muapremium',[User_Controller::class,'apiMuaPremium'])->middleware(['web','CheckLogin:3,4']);

//Author
Route::post('/author/themtruyen', [Author_Controller::class,'apiThemTruyen'])->middleware(['web','CheckLogin:1,2,3','CheckContent']);
Route::post('/author/themchuong/{id}', [Author_Controller::class,'apiThemChuong'])->middleware(['web','CheckLogin:1,2,3','CheckContent']);
Route::post('/tomtat', [Summary_Controller::class,'summarize'])->middleware(['web','CheckLogin:1,2,3']);
Route::put('/author/suatruyen/{id}', [Author_Controller::class,'apiSuaTruyen'])->middleware(['web','CheckLogin:1,2,3','CheckContent']);
Route::put('/author/suachuong/{id}', [Author_Controller::class,'apiSuaChuong'])->middleware(['web','CheckLogin:1,2,3','CheckContent']);
Route::post('/author/themblog', [Author_Controller::class,'apiThemBlog'])->middleware(['web','CheckLogin:1,2,3','CheckContent']);
Route::post('/author/suablog/{id}', [Author_Controller::class,'apiSuaBlog'])->middleware(['web','CheckLogin:1,2,3','CheckContent']);


//Admin
Route::post('/admin/login', [Admin_Controller::class,'authLogin'])->middleware(['web']);

Route::post('/admin/themtheloai', [Admin_Controller::class,'apiThemTheLoai'])->middleware(['web','CheckLogin:1,2']);
Route::put('/admin/suatheloai/{id}', [Admin_Controller::class,'apiSuaTheLoai'])->middleware(['web','CheckLogin:1,2']);
Route::put('/admin/changetruyen/{id}',[Admin_Controller::class,'apiChangeTruyen'])->middleware(['web','CheckLogin:1,2']);
Route::put('/admin/changechuong/{id}',[Admin_Controller::class,'apiChangeChuong'])->middleware(['web','CheckLogin:1,2']);
Route::put('/admin/changenguoidung/{id}',[Admin_Controller::class,'apiChangeNguoiDung'])->middleware(['web','CheckLogin:1,2']);
Route::put('/admin/boquabaocao/{id}',[Admin_Controller::class,'boQuaBaoCao'])->middleware(['web','CheckLogin:1,2']);
Route::post('/superadmin/themadmin',[Admin_Controller::class,'apiThemAdmin'])->middleware(['web','CheckLogin:1']);
Route::put('/superadmin/suaadmin/{id}',[Admin_Controller::class,'apiSuaAdmin'])->middleware(['web','CheckLogin:1']);





