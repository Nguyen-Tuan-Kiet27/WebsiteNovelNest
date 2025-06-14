import Userlayout from '@/Layouts/UserLayout';
import { Inertia } from '@inertiajs/inertia';
import { useState, useEffect } from 'react';

export default function TaiKhoan(){
    return(
        <div className='TaiKhoan'>
            <button
                onClick={()=>Inertia.post('/api/logout')}
            >Đăng xuất</button>
        </div>
    )
}