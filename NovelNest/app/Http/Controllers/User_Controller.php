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
    public function category(){
        return Inertia::render('User/TheLoai');
    }


    public function danhSachTruyenTheLoai(Request $request, $id){
          $category = [
        'id' => $id,
        'title' => 'Hành động', // Giả lập, sau này bạn có thể dùng model thực tế
    ];

    // Giả lập danh sách truyện thuộc thể loại đó
    $truyens = [
        ['id' => 1, 'title' => 'Truyện A', 'img' => 'a.jpg', 'views' => 1200],
        ['id' => 2, 'title' => 'Truyện B', 'img' => 'b.jpg', 'views' => 950],
        ['id' => 3, 'title' => 'Truyện C', 'img' => 'c.jpg', 'views' => 430],
    ];

    return Inertia::render('User/DetailCategory', [
        'category' => $category,
        'truyens' => $truyens
    ]);
    }

}
