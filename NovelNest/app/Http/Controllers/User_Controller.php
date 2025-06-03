<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;

class User_Controller extends Controller
{
    public function index()
    {
        return Inertia::render('User/Home');
    }
}
