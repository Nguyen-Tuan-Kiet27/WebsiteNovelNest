import React from 'react';
import Userlayout from '@/Layouts/UserLayout';
import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import './Stories.scss';
import CardStories from '../../Components/CardStories';
import { FaRegHeart, FaShareSquare, FaHeart  } from 'react-icons/fa';
import axios from 'axios';
import { TbLockDollar } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";
import BuyChapter from '../../Components/BuyChappter';
import UserLogin from '@/Components/UserLogin';
import EmailAndPassword from '@/Components/EmailAndPassword';

export default function Stories({favorite,login,truyen,chuongs, soLuong,truyenDaHoanThanhs,chuongChuaMua}) {
    const traiRef = useRef();
    const [traiHeight, setTraiHeight] = useState(0);
    const [traiHeight2, setTraiHeight2] = useState(0);
    const chuongChuaMuaIds = new Set(chuongChuaMua.map(c => c.id));
    const [showLogin,setShowLogin] = useState(false);
    const [modalEP,setModalEP] = useState(false);
    const [love,setLove]=useState(favorite);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [showDate,setShowDate] = useState(false)
    const [date,setDate] = useState('')

    const handleMouseMove = (e) => {
        setPosition({ x: e.pageX, y: e.pageY });
    };

    useEffect(() => {
        if (traiRef.current) {
            setTraiHeight(traiRef.current.offsetHeight);
            setTraiHeight2(traiRef.current.offsetHeight-2);
        }
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [select,setSelect] = useState(null);
    const handleCheckChuong = async (e,chapter)=>{
        if(login.vaiTro<3) return;
        if (chuongChuaMuaIds.has(chapter.id)) {
            e.preventDefault();
            //chưa đăng nhập
            if(!login){
              setShowLogin(true)
              return;
            }
            try {
                const response = await axios.get('/api/checkep');
                if(!response.data.value){
                    setModalEP(true);
                    return;
                }
            } catch (error) {
                setShowLogin(true);
                return;
            }
            //hiển thị modal mua chương và truyền set chương đã chọn 
            setShowModal(true);
            setSelect(chapter);
        }
    }
    const handleFavorite= async ()=>{
      try {
        const response = await axios.post(
          `/api/favorite/${truyen.id}`
        )
        setLove(response.data.flag);
      } catch (error) {
        console.log(error.response.data.message)
      }
    }
    
return(
<Userlayout title="Stories" login={login} >
    <UserLogin userLoginIsVisible={showLogin} setUserLoginIsVisible={setShowLogin}/>
    <EmailAndPassword isShow={modalEP} setIsShow={setModalEP}/>
    {(showDate) && (
        <div
            className="custom-tooltip"
            style={{
                position: 'absolute',
                top: position.y + 20,
                left: position.x + 10,
            }}
        >
            {`Ngày đăng: `+date}
        </div>
    )}
    <div className='container' >
      <button className="back-arrow" onClick={() => window.history.back()}>←</button>
        <div ref={traiRef}>
            <div>
              
                <div className='storyInformation'>
                    <img src={`/img/truyen/hinhNen/${truyen.hinhNen}`} alt="" />
                    <div className='fas' style={login?{}:{display:'none'}}>
                      <button className='favorite' onClick={handleFavorite}>
                        {love && <FaHeart className='i ied'/> ||<FaRegHeart className='i'/>}
                      </button>
                      <button>
                        <FaShareSquare className='i'/>
                      </button>
                    </div>
                    
                    <div className='subStoryInformation'>
                        <img src={`/img/truyen/hinhAnh/${truyen.hinhAnh}`} alt="" />
                        <div className='information'>
                            <h4>Tên truyện: {truyen.ten}</h4>
                            <h4>Thể loại: {truyen.the_loai.ten}</h4>
                            <h4>Trạng thái: {truyen.ngayKetThuc?'Chưa hoàn thành':'Đã hoàn thành'}</h4>
                            <h4>Chương: {soLuong}</h4>  
                        </div>
                    </div>
                </div>
            </div>
            <div className='gioiThieu'>
                <h4>Giới thiệu truyện:</h4>
                <div>
                    <p>
                      {truyen.gioiThieu.split('\n').map((line, index) => (
                        <span key={index}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                </div>
            </div>
        </div>
        <div style={{maxHeight: traiHeight, minHeight:traiHeight}} className='chapterInStory'>
            <div className='storyChapter' style={{maxHeight: traiHeight2}}> 
            
                <button onClick={()=>router.visit(`/chuong/${chuongs[0].id}`)}>
                    Đọc từ đầu
                </button>
                <div className='chuongMoi chapter-list'>
                    <h5>Chương mới ra</h5>
                    { chuongs.slice(chuongs.length-4).reverse().map((chapter) =>(
                            <li key={chapter.id}
                            >
                                <a
                                    href={`/chuong/${chapter.id}`}
                                    onClick={(e)=>handleCheckChuong(e,chapter)}
                                    onMouseEnter={() => {setShowDate(true);setDate(new Date(chapter.ngayTao).toLocaleDateString('vi-VN'))}}
                                    onMouseLeave={() => setShowDate(false)}
                                    onMouseMove={handleMouseMove}
                                    >
                                    {chuongChuaMuaIds.has(chapter.id) ? (
                                      <TbLockDollar style={{ color: 'gray' }} />
                                    ) : (
                                      <GoDotFill style={{ color: 'gray' }}/>
                                    )}
                                    &ensp;
                                    {`CHƯƠNG ${chapter.soChuong}:`} &ensp; {chapter.ten.toUpperCase()}
                                </a>
                            </li>
                    ))}
                </div>
                <div className='chuongs chapter-list'>
                    <h5>Danh sách chương</h5>
                    {chuongs.map((chapter) =>(
                      <li key={chapter.id}>
                          <a
                            href={`/chuong/${chapter.id}`}
                            onClick={(e) => handleCheckChuong(e,chapter)}
                                  // title={}
                            onMouseEnter={() => {setShowDate(true); setDate(new Date(chapter.ngayTao).toLocaleDateString('vi-VN'))}}
                            onMouseLeave={() => setShowDate(false)}
                            onMouseMove={handleMouseMove}
                          >
                            {chuongChuaMuaIds.has(chapter.id) ? (
                              <TbLockDollar style={{ color: 'gray' }} />
                            ) : (
                              <GoDotFill style={{ color: 'gray' }}/>
                            )}
                            &ensp;
                            {`CHƯƠNG ${chapter.soChuong}:`} &ensp; {chapter.ten.toUpperCase()}
                          </a>
                      </li>
                    ))}

                </div>
            </div>
        </div>
    </div>
    <div className='d-flex justify-content-center mt-4 h-100'>
        <div className="hot-stories-wrapper">
            <h3 className="hot-title">Đã hoàn thành</h3>
            <div className="hot-stories-container">
            {truyenDaHoanThanhs.map((story, id) => (
                <CardStories key={story.id} ten={story.ten} hinhAnh={story.hinhAnh} />
            ))}
            </div>
        </div>
    </div>

    <BuyChapter isShow={showModal} changeShow={setShowModal} select={select} chuongChuaMua={chuongChuaMua}/>
   





</Userlayout>

);

}