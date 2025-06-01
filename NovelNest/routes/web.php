<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User_Controller;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/index', [User_Controller::class, 'index']);
