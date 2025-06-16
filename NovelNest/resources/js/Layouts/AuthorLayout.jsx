import { router, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import './AuthorLayout.scss'
export default function AuthorLayout({children,page,user,title}){
    return(
        <div className='AuthorLayout'>
            <Head title={`NovelNest - Author_${title}`} />
            <header>
                <div>
                    <img 
                        src={user.anhDaiDien.startsWith('http')?user.anhDaiDien:`/img/nguoiDung/${user.anhDaiDien}`} 
                        alt="" 
                    />
                    <p>{user?.ten || 'Author'}</p>
                </div>
                <button
                    style={page == 1 ? { color: '#378C0C', fontWeight: '700' } : {}}
                    onClick={()=>router.visit('/author')}
                >
                    Doanh thu
                </button>
                <button
                    style={page == 2 ? { color: '#378C0C', fontWeight: '700' } : {}}
                    onClick={()=>router.visit('/author/truyen')}
                >
                    Truyện
                </button>
                <button
                    style={page == 3 ? { color: '#378C0C', fontWeight: '700' } : {}}
                    onClick={()=>router.visit('/author/blog')}
                >
                    Blog truyện
                </button>
            </header>
            <main>
                {children}
            </main>
        </div>
    )
}