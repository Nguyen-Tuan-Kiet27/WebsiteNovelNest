import { router } from '@inertiajs/react';
import './UserLayout.scss';
import { Head, usePage } from '@inertiajs/react';
import UserLogin from '@/Components/UserLogin';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EmailAndPassword from '../Components/EmailAndPassword';

export default function Userlayout({children,title,login,page}){
    /////test
    /////////
    const {url} = usePage();
    const queryString = url.split('?')[1]; // Lấy phần query string sau dấu ?
    const query = Object.fromEntries(new URLSearchParams(queryString));
    const headRef = useRef();
    const [mrtMain, setMrtMain] = useState(0)
    const {flash} = usePage().props;
    const [userLoginIsVisible, setUserLoginIsVisible] = useState(false);
    const [modalEP,setModalEP] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [show, setShow] = useState(false);
    const [searchText,setSearchText] = useState('');

    const [thongTin,setThongTin] = useState([]);

    const handleGetThongTin = async ()=>{
        try {
        const response = await axios.get('/api/getthongtin');
        setThongTin(response.data.thongTin);
        } catch (error) {
        console.log('Có lỗi xảy ra khi lấy thông tin:'.error.response.data)
        }
    }

    useEffect(() => {
        if(flash.loginf)
            window.location.reload();
        console.log(flash.block)
        if(flash.block)
            alert(flash.block);
        if (window.location.hash === '#_=_') {
            window.history.replaceState(null, null, window.location.pathname + window.location.search);
        }
        setSearchText(query.searchText || "")
        setMrtMain(headRef.current.offsetHeight+20)
        handleGetThongTin();
    }, []);
    const handleClickLogin = ()=>{
        if(login || flash.loginf)
            router.visit('/taikhoan');
        else
            setUserLoginIsVisible(true);
    }
    const handleClickDangTruyen = async ()=>{
        if(login || flash.loginf){
            try {
                const response = await axios.get('/api/checkep');
                if(!response.data.value){
                    setModalEP(true);
                    return;
                }
            } catch (error) {
                setUserLoginIsVisible(true);
                return;
            }
            try {
                const response = await axios.get('/api/checkrole');
                const role = response.data.role;
                if(role<3){
                    router.visit('/author');
                }else{
                    router.visit('/signupauthor')
                }
            } catch (error) {
                alert('Đã có lỗi xảy ra, bạn chưa đăng nhập');
                setUserLoginIsVisible(true);
            }
        }else{
            setUserLoginIsVisible(true);
        }
    }
    const handleMouseMove = (e) => {
        setPosition({ x: e.pageX, y: e.pageY% headRef.current.offsetHeight });
    };
    const handleSearch = ()=>{
        if(searchText.trim()!=query.searchText)
            router.visit(`/search?searchText=${searchText.trim()}`)
    }
    return(
        <>
            <UserLogin userLoginIsVisible={userLoginIsVisible} setUserLoginIsVisible={setUserLoginIsVisible} ></UserLogin>
            <EmailAndPassword isShow={modalEP} setIsShow={setModalEP}/>
            <Head title={`NovelNest - ${title}`} />
            <header>
                <div ref={headRef} className="header">
                    <div className='subHeader'>
                        <div>
                            <img src="/img/logo_v4.png" alt="" />
                        </div>
                            <button className='buttonHeader'
                                onClick={()=>router.visit('/')}
                                style={page==1?{backgroundColor:'#E9CF73'}:{}}
                            >
                                <img src="/img/khampha.svg" alt="" />
                                Khám Phá
                            </button>
                            <button className='buttonHeader'
                                onClick={()=>router.visit('/theloai')}
                                style={page==2?{backgroundColor:'#E9CF73'}:{}}
                            >
                                <img src="/img/theloai.svg" alt="" />
                                Thể Loại
                            </button>
                            <button className='buttonHeader'
                                style={page==3?{backgroundColor:'#E9CF73'}:{}}
                                onClick={()=>router.visit('/blogtruyen')}
                            >
                                <img src="/img/blog.svg" alt="" />
                                Blog Truyện
                            </button>
                            <button className='buttonHeader' 
                                onClick={handleClickDangTruyen}
                                style={page==5?{backgroundColor:'#E9CF73'}:{}}
                            >
                                <img src="/img/dangtruyen.svg" alt="" />
                                Đăng Truyện
                            </button>
                            <button className='buttonHeader'
                                onClick={handleClickLogin}
                                style={page==4?{backgroundColor:'#E9CF73'}:{}}
                                onMouseEnter={() => setShow(true)}
                                onMouseLeave={() => setShow(false)}
                                onMouseMove={handleMouseMove}
                            >
                                <img src="/img/dangnhap.svg" alt="" />
                                {login||flash.loginf?"Tài Khoản":"Đăng Nhập"}
                                {(show&&login) && (
                                    <div
                                        className="custom-tooltip"
                                        style={{
                                            position: 'absolute',
                                            top: position.y + 20,
                                            left: position.x,
                                        }}
                                    >
                                        {login.ten}
                                    </div>
                                )}
                            </button>
                            
                            <div className='searchHeader'>
                                <input className='inputSearchHeader' 
                                        type="text" value={searchText}
                                        onChange={e=>setSearchText(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                            handleSearch();
                                            }
                                        }}
                                />
                               <img src="/img/search.svg" alt="" />
                            </div>
                    </div>
                </div>
                   
              
            </header>
            <main style={{marginTop: mrtMain}}>
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
                                <li><a href={thongTin[0]}> FaceBook</a></li>
                                <li><a href={thongTin[1]}> Youtube</a></li>
                                <li><a href={"https://mail.google.com/mail/?view=cm&fs=1&to="+thongTin[2]} target="_blank"> Email</a></li>
                            </ul>
                        </div>
                        
                </div>
            </footer>
        </>

    );
}