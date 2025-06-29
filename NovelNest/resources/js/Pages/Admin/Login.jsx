import { Head, usePage, router} from '@inertiajs/react';
import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import './Login.scss';
export default function Login(){
    const [error, setError] = useState('');
    const handleSubmit = (e)=>{
        e.preventDefault();
        const formData = new FormData(e.target)
        if(!formData.get('tenDangNhap') || !formData.get('matKhau')){
            setError('Không được để trống tài khoản hoặc mật khẩu!')
            return;
        }
        axios.post('/api/admin/login', formData)
        .then(res => {
            router.visit('/admin');
        })
        .catch(error => {
            setError('Tài khoản hoặc mật khẩu không chính xác!')
        });
    }

    return(
        <div className='adminLogin'>
            <div>
                <h1>TRANG QUẢN TRỊ NOVELNEST</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Tên đăng nhập:</label>
                        <input
                            type="text"
                            name='tenDangNhap'
                            onChange={()=>setError('')}
                        />
                    </div>
                    <div>
                        <label>Mật khẩu:</label>
                        <input 
                            type="password"
                            name='matKhau'
                            onChange={()=>setError('')}
                        />
                    </div>
                    <div>
                        <lable style={{width:'80%', color:'red'}}>{error}</lable>
                    </div>
                    <div>
                        <p style={{color:"blue"}}>Nếu bạn quyên mật khẩu, cần liên hệ với Super Admin hoặc kỹ thuật viên!</p>
                    </div>
                    <button type='submit'>Đăng nhập</button>
                </form>
            </div>
        </div>
    );
}