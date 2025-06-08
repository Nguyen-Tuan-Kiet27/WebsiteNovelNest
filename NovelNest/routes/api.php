<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User_Controller;
use App\Http\Controllers\Admin_Controller;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/logout',[User_Controller::class,'logout']);

Route::post('/admin/login', [Admin_Controller::class,'authLogin'])->middleware(['web']);
