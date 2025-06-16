import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import './AdminLayout.scss'
export default function AdminLayout({children,page,user}){
    return(
        <div className='AdminLayout'>
            <header>
                <div>
                    <img 
                        src={user.anhDaiDien.startsWith('http')?user.anhDaiDien:`/img/nguoiDung/${user.anhDaiDien}`} 
                        alt="" 
                    />
                    <p>{user?.ten || 'Admin'}</p>
                </div>
                <button
                    style={page == 1 ? { color: '#378C0C', fontWeight: '700' } : {}}
                >
                    Dash Board
                </button>
                <button
                    style={page == 2 ? { color: '#378C0C', fontWeight: '700' } : {}}
                >
                    Người dùng
                </button>
                <button
                    style={page == 3 ? { color: '#378C0C', fontWeight: '700' } : {}}
                >
                    Tác giả
                </button>
                <button
                    style={page == 4 ? { color: '#378C0C', fontWeight: '700' } : {}}
                >
                    Truyện/ Chương
                </button>
                <button
                    style={page == 5 ? { color: '#378C0C', fontWeight: '700' } : {}}
                >
                    Yêu cầu rút tiền
                </button>
                <button
                    style={page == 6 ? { color: '#378C0C', fontWeight: '700' } : {}}
                >
                    Báo cáo vi phạm
                </button>
                <button
                    style={page == 7 ? { color: '#378C0C', fontWeight: '700'} : {display: user.vaiTro==1 ? 'block':'none'}}
                >
                    Đội ngũ admin
                </button>
            </header>
            <main>
                {children}
            </main>
        </div>
    )
}