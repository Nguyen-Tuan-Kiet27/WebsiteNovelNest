import { router } from '@inertiajs/react';
import './UserLayout.scss';
import { Head, usePage } from '@inertiajs/react';
import UserLogin from '@/Components/UserLogin';
import { useState, useEffect } from 'react';

export default function Userlayout({children,title,login}){
    /////test
    /////////
    const {flash} = usePage().props;
    const [userLoginIsVisible, setUserLoginIsVisible] = useState(false);
    useEffect(() => {
        if (window.location.hash === '#_=_') {
            window.history.replaceState(null, null, window.location.pathname + window.location.search);
        }
    }, []);
    const handleClickLogin = ()=>{
        if(login || flash.loginf)
            router.visit('/taikhoan');
        else
            setUserLoginIsVisible(true);
    }
    return(
        <>
            <UserLogin userLoginIsVisible={userLoginIsVisible} setUserLoginIsVisible={setUserLoginIsVisible} ></UserLogin>
            <Head title={`NovelNest - ${title}`} />
            <header>
                <div className="header">
                    <div className='subHeader'>
                        <div>
                            <img src="/img/logo_v4.png" alt="" />
                        </div>
                            <button className='buttonHeader'
                                onClick={()=>router.visit('/')}
                            >
                                <img src="/img/khampha.svg" alt="" />
                                Khám Phá
                            </button>
                            <button className='buttonHeader'
                                onClick={()=>router.visit('/theloai')}
                            >
                                <img src="/img/theloai.svg" alt="" />
                                Thể Loại
                            </button>
                            <button className='buttonHeader'>
                                <img src="/img/blog.svg" alt="" />
                                Blog Truyện
                            </button>
                            <button className='buttonHeader'>
                                <img src="/img/dangtruyen.svg" alt="" />
                                Đăng Truyện
                            </button>
                            <button className='buttonHeader'
                                onClick={handleClickLogin}
                            >
                                <img src="/img/dangnhap.svg" alt="" />
                                {login||flash.loginf?"Tài Khoản":"Đăng Nhập"}
                            </button>
                            
                            <div className='searchHeader'>
                                <input className='inputSearchHeader' type="text"
                                />
                               <img src="/img/search.svg" alt="" />
                            </div>
                    </div>
                </div>
                   
              
            </header>
            <main>
                {children}
            </main>
            <footer>
                <div>   
                        <div>
                            <img src="/img/logo_v3.png" alt="" />
                        </div>

                        <div>
                            <h5>Truy cập:</h5>
                            <ul>
                                <li><a href="#">Trang Chủ</a></li>
                                <li><a href="#">Chính sách</a></li>
                                <li><a href="#">Về chúng tôi</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5>Liên hệ:</h5>
                            <ul>
                                <li><a href="#"> FaceBook</a></li>
                                <li><a href="#"> Youtube</a></li>
                                <li><a href="#"> Email</a></li>
                            </ul>
                        </div>
                        
                </div>
            </footer>
        </>

    );
}