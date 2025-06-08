import { Head, usePage, router} from '@inertiajs/react';
import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
export default function Login(){
    const handleSubmit = (e)=>{
        e.preventDefault();
        const formData = new FormData(e.target)
        axios.post('/api/admin/login', formData)
        .then(res => {
            router.visit('/admin');
        })
        .catch(error => {
            console.log(error.response?.data);
        });
    }
    
    return(
        <div className='admin_Login'>
            <div>
                <h4>TRANG QUẢN TRỊ NOVELNEST</h4>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Tên đăng nhập:</label>
                        <input
                            type="text"
                            name='tenDangNhap'
                        />
                    </div>
                    <div>
                        <label>Mật khẩu:</label>
                        <input 
                            type="password"
                            name='matKhau'
                        />
                    </div>
                    <p style={{color:"blue"}}>Nếu bạn quyên mật khẩu, cần liên hệ với Super Admin hoặc kỹ thuật viên!</p>
                    <button type='submit'>Đăng nhập</button>
                </form>
            </div>
        </div>
    );
}