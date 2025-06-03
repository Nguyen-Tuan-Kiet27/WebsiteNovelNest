<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User_Controller;


Route::get('/', [User_Controller::class, 'index']);
