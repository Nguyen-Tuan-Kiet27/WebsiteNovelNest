import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faChevronLeft, faChevronRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import './DetailStory.scss';
import { router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Userlayout from '@/Layouts/UserLayout';
import useDetectDevTools from '@/hooks/useDetectDevTools';
import usePageVisibility from '@/hooks/usePageVisibility';
import axios from 'axios';
import { TbLockDollar } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";
import BuyChapter from '../../Components/BuyChappter';
import VerifyPass from '../../Components/VerifyPass';

export default function DocTruyen({user,chuong,truyen,chuongCuoi,idChuongTruoc,idChuongSau,chuongChuaMua,chuongs,daBaoCao}) {
  const [premium,setPremium] = useState(false);
  const [hiden,setHiden] = useState(false);
  const [devTool,setDevTool] = useState(false);
  const [content,setContent] = useState(chuong.noiDung);
  const [scrollY,setScrollY] = useState(0);
  const [reScrool,setReScrool] = useState(true);
  const [showBaoCao,setShowBaoCao] = useState(false);
  const [showLogin,setShowLogin] = useState(false);
  const [showTT,setShowTT] = useState(false);
  const [showModalChapter,setShowModalChapter] = useState(false)




  //Lượt xem:
  const [count, setCount] = useState(0); // bộ đếm
  const [paused, setPaused] = useState(false); // điều kiện tạm dừng
  const intervalRef = useRef(null);
  const idleTimerRef = useRef(null);

  const devToolRef = useRef(devTool);
  const hidenRef = useRef(hiden);
  const showBaoCaoRef = useRef(showBaoCao);
  const showLoginRef = useRef(showLogin);
  const showTTRef = useRef(showTT);
  const showModalChapterRef = useRef(showModalChapter);
  useEffect(() => { devToolRef.current = devTool }, [devTool]);
  useEffect(() => { hidenRef.current = hiden }, [hiden]);
  useEffect(() => { showBaoCaoRef.current = showBaoCao }, [showBaoCao]);
  useEffect(() => { showLoginRef.current = showLogin }, [showLogin]);
  useEffect(() => { showTTRef.current = showTT }, [showTT]);
  useEffect(() => { showModalChapterRef.current = showModalChapter }, [showModalChapter]);

  const resetIdleTimer = () => {
    if (
    !devToolRef.current &&
    !hidenRef.current &&
    !showBaoCaoRef.current &&
    !showLoginRef.current &&
    !showTTRef.current &&
    !showModalChapterRef.current
    ){
      clearTimeout(idleTimerRef.current);
      setPaused(false)
      idleTimerRef.current = setTimeout(() => {
        setPaused(true)
      }, 15000); // 15 giây
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        setCount(prev => {
          const next = prev + 1;
          console.log(next)
          if (next === 45) {
            clearInterval(interval); // dừng interval tại đây
            axios.post(`/api/lichsudoc/${chuong.id}`);
          }
          return next;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [paused]);

  useDetectDevTools(
    () => {
      if(reScrool){
        setScrollY(window.scrollY || window.pageYOffset);
        setReScrool(false);
      }
      setContent('<h1>DevTool đang mở, hãy tắt DevTool để tải lại nội dung!</h1>');
      setDevTool(true);
    },
    ()=>{
      setDevTool(false);
      if(!hiden){
        setContent(chuong.noiDung);
      }
    }
  );

  usePageVisibility(
    ()=>{
      setHiden(true);
      if(!devTool){
        if(reScrool){
          setScrollY(window.scrollY || window.pageYOffset);
          setReScrool(false);
        }
        setContent('<h1>Bạn đang không focus page, hãy quay lại nội dung sẽ được cập nhật!</h1>');
      }
    },
    ()=>{
      setHiden(false);
      if(!devTool){
        setContent(chuong.noiDung);
      }
    }
  )


  useEffect(()=>{
    if(user){
      setPremium(user.premium);
    }
    const blockKeys = (e) => {
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'c', 'j'].includes(e.key.toLowerCase())) ||
        ((e.ctrlKey || e.metaKey) && ['u', 's', 'p'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
      }
    };

    const disableContextMenu = (e) => e.preventDefault();

    document.addEventListener('keydown', blockKeys);
    document.addEventListener('contextmenu', disableContextMenu);
    //Lượt xem
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);
    resetIdleTimer();

    return () => {
      document.removeEventListener('keydown', blockKeys);
      document.removeEventListener('contextmenu', disableContextMenu);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('scroll', resetIdleTimer);
      clearTimeout(idleTimerRef.current);
    }
  },[])

  useEffect(() => {
    if (content === chuong.noiDung) {
      const scroll = () => {
        if(!reScrool){
          window.scrollTo({ top: scrollY, behavior: 'smooth' });
          setReScrool(true);
        }
      };
      // đảm bảo DOM render xong rồi mới cuộn
      const timeout = setTimeout(scroll, 100); 
      return () => clearTimeout(timeout);
    }
  }, [content]);

  const handleChuongTruoc=(e)=>{
    handleCheckChuong(e,{id:idChuongTruoc})
  }
  const handleChuongSau=(e)=>{
    handleCheckChuong(e,{id:idChuongSau})
  }
  const [showModal, setShowModal] = useState(false);

  const [audioSrc, setAudioSrc] = useState(null);
  const [type, setType] = useState('');
  const [showVoice, setShowVoice] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (t,e) => {
    setLoading(true);
    setType(e);
    try {
      const res = await fetch(`http://localhost:8000/api/audio/${chuong.id}/${t}`);
      
      if (!res.ok) throw new Error('Tạo audio thất bại');

      const blob = await res.blob(); // Lấy file nhị phân
      const audioUrl = URL.createObjectURL(blob); // Tạo URL tạm
      setAudioSrc(audioUrl);
    } catch (error) {
      alert('Không thể tạo file audio');
      console.error(error);
    }
    setLoading(false);
  };
  const handleShowVoice = ()=>{
    if(!premium){
      alert('Bạn cần nâng cấp tài khoản premium để sử dụng tính năng này!')
      return;
    }
    if(loading) return;
    setShowVoice(!showVoice)
  }

  const [tomTat,setTomTat] = useState('');
  const handleTomTat = async ()=>{
    const response = await axios.get(`/api/tomtat/${idChuongTruoc}`);
    setTomTat(response.data.message);
    setShowTT(true);
  }

  const chuongChuaMuaIds = new Set(chuongChuaMua.map(c => c.id));
  const [showDate,setShowDate] = useState(false)
  const [date,setDate] = useState('')
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [select,setSelect] = useState(null);
  const handleMouseMove = (e) => {
    setPosition({ x: e.pageX, y: e.pageY });
  };
  const handleCheckChuong = async (e,chapter)=>{
    if(user.vaiTro<3) return;
    if (chuongChuaMuaIds.has(chapter.id)) {
        e.preventDefault();      
        //hiển thị modal mua chương và truyền set chương đã chọn 
        setShowModal(true);
        setSelect(chapter);
    }
  }
  ///Báo cáo chương
  const [eBaoCao,setEBaoCao] = useState('');
  const [baoCao,setBaoCao] = useState('');
  const [showPass,setShowPass] = useState(false);
  const handleShowBaoCao = ()=>{
    if(!user){
      setShowLogin(true)
      return;
    }
    setShowBaoCao(true);
  }
  const handleBaoCao = ()=>{
    if(baoCao.trim().length < 20){
      setEBaoCao('Nội dung quá ngắn');
      return;
    }
    setShowPass(true);
  }
  const handleBaoCaoS = async ()=>{
    const formData = new FormData();
    formData.append('noiDung',baoCao);
    try {
      const response = await axios.post(`/api/user/baocaochuong/${chuong.id}`,formData);
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      setEBaoCao(error.response.data.message)
    }
  }

  /////////
  useEffect(() => {
    if (!devTool && !hiden && !showBaoCao && !showLogin && !showTT && !showModalChapter) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  }, [showBaoCao, showLogin, showTT, showModalChapter, devTool, hiden]);
  
  


  return (
    <Userlayout login={user} title={`${truyen.ten} - Chương ${chuong.soChuong}: ${chuong.ten}`}>
      <BuyChapter isShow={showModal} changeShow={setShowModal} select={select} chuongChuaMua={chuongChuaMua}/>
      <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleBaoCaoS}/>
      {showBaoCao &&(
        <div className='BaoCao' onClick={()=>setShowBaoCao(false)}>
          <div className='mainBaoCao' onClick={e=>e.stopPropagation()}>
              <h4>Báo cáo truyện</h4>
              <label className='error'>{eBaoCao}</label>
              <textarea value={baoCao} onChange={(e)=>{setBaoCao(e.target.value);setEBaoCao('')}} type="text" placeholder='Nhập lý do - vấn đề.'/>
              <button onClick={handleBaoCao}>Gửi</button>
          </div>
        </div>
      )}
      {(showTT)&&(
        <div className='tomTat'
              onClick={()=>setShowTT(false)}
        >
            <div className='mainTT'
                  onClick={(e)=>e.stopPropagation()}
            >
              <div>
                <h5>Tóm tắt chương trước</h5>
              </div>
              <p>
                {tomTat.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
        </div>
      )}
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
      <div className="doc-truyen">
        <div className="doc-header">
          <button className="back-btn"
          onClick={() => router.visit(`/truyen/${chuong.id_Truyen}`)}>←</button>
          <span className="chapter-title">{`${truyen.ten} - Chương ${chuong.soChuong}: ${chuong.ten}`}</span>
        </div>
        <div className="doc-main">
          <div className="doc-content-wrapper">
            <div className='audio'>
              <div className='pickVoice'
                onClick={handleShowVoice}
              >
                <label>{loading ? 'Đang lấy âm thanh...': (type || 'Chọn giọng đọc')} </label>
                <FontAwesomeIcon className="icon" style={{transform:showVoice?'rotate(0deg)':'rotate(-90deg)'}} icon={faCaretDown} />
                <div style={{display:showVoice?'block':'none',zIndex:'1002'}}>
                  <label onClick={()=>handleSelect(5,'Giọng nữ miền bắc')}>Giọng nữ miền bắc</label>
                  <label onClick={()=>handleSelect(4,'Giọng nam miền bắc')}>Giọng nam miền bắc</label>
                  <label onClick={()=>handleSelect(6,'Giọng nữ miền nam')}>Giọng nữ miền nam</label>
                  <label onClick={()=>handleSelect(3,'Giọng nam miền nam')}>Giọng nam miền nam</label>
                </div>
              </div>
              <audio controls key={audioSrc}>
                <source src={audioSrc} type="audio/mpeg" />
                Trình duyệt của bạn không hỗ trợ audio.
              </audio>
            </div>
            <div className="doc-nav">
              <a href={`/chuong/${idChuongTruoc}`}
                 onClick={(e) => {
                  if (chuong.soChuong === 1) {
                    e.preventDefault();
                    return;
                  }
                  handleChuongTruoc(e);
                 }} 
                 style={{opacity:chuong.soChuong==1?'0.5':'1'}} 
                 disabled={chuong.soChuong==1?true:false}
              >Chương trước</a>
              <button onClick={handleTomTat}
                      disabled={chuong.soChuong==1?true:false}
              >
                Tóm tắt chương trước 
              </button>
              <a href={`/chuong/${idChuongSau}`}
                  onClick={(e) => {
                    if (chuongCuoi) {
                      e.preventDefault();
                      return;
                    }
                    handleChuongSau(e);
                  }}
                  style={{opacity:chuongCuoi?'0.5':'1'}}
                  disabled={chuongCuoi} 
              >Chương tiếp</a>
            </div>
            <div className='hidenDoc'>
                {(!devTool && !hiden) &&
                  <div className='hiden' style={{opacity:'0.19'}}>
                   
                      {Array.from({ length: 30 }).map((_, index) => (
                        <div key={index} className='waterMask'>
                          <img src="/img/logo_v4.png" alt="" />
                          <h3>{user.email || '0306221133@caothang.edu.vn'}</h3>
                        </div>
                      ))}
                    
                  </div>
                }
                <div className="doc-content" dangerouslySetInnerHTML={{ __html: content }}/>
              </div>
            <div className="doc-nav">
              <a 
                href={`/chuong/${idChuongTruoc}`} 
                onClick={(e) => {
                  if (chuong.soChuong === 1) {
                    e.preventDefault();
                    return;
                  }
                  handleChuongTruoc(e);
                }} 
                style={{opacity:chuong.soChuong==1?'0.5':'1'}} 
                disabled={chuong.soChuong==1?true:false}
              >Chương trước</a>
              <button onClick={()=>setShowModalChapter(true)}>
                <FontAwesomeIcon icon={faList} />
              </button>
              <a href={`/chuong/${idChuongSau}`}
                  onClick={(e) => {
                    if (chuongCuoi) {
                      e.preventDefault();
                      return;
                    }
                    handleChuongSau(e);
                  }}
                  style={{opacity:chuongCuoi?'0.5':'1'}}
                  disabled={chuongCuoi} 
              >Chương tiếp</a>
            </div>
          </div>
          <div className="doc-report">
            <button disabled={daBaoCao} className="report-btn" onClick={handleShowBaoCao}>{daBaoCao?'Đã báo cáo':'Báo cáo vi phạm'}</button>
            <ul>
              <li>- Vi phạm pháp luật.</li>
              <li>- Ảnh hưởng đến quyền lợi Việt Nam.</li>
              <li>- Vi phạm bản quyền.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className='popupChapter' style={{display:showModalChapter?'flex':'none'}} onClick={()=>{setShowModalChapter(false)}}>
        <div className='storyChapter' onClick={(e)=>e.stopPropagation()}>
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
      
    </Userlayout>
   
  );
}
