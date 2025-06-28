import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faChevronLeft, faChevronRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import './DetailStory.scss';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Userlayout from '@/Layouts/UserLayout';
import useDetectDevTools from '@/hooks/useDetectDevTools';
import usePageVisibility from '@/hooks/usePageVisibility';

export default function DocTruyen({user,chuong,truyen,chuongCuoi,idChuongTruoc,idChuongSau}) {
  const [premium,setPremium] = useState(false);
  const [hiden,setHiden] = useState(false);
  const [devTool,setDevTool] = useState(false);
  const [content,setContent] = useState(chuong.noiDung);
  const [scrollY,setScrollY] = useState(0);
  const [reScrool,setReScrool] = useState(true);

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
      if(!hiden)
        setContent(chuong.noiDung);
    }
  );

  usePageVisibility(
    ()=>{
      setHiden(true);
      console.log(devTool)
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
      if (key === 'printscreen') {
        e.preventDefault();
      }
    };

    const disableContextMenu = (e) => e.preventDefault();

    document.addEventListener('keydown', blockKeys);
    document.addEventListener('contextmenu', disableContextMenu);

    return () => {
      document.removeEventListener('keydown', blockKeys);
      document.removeEventListener('contextmenu', disableContextMenu);
    };
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

  const handleChuongTruoc=()=>{
    router.visit(`/chuong/${idChuongTruoc}`);
  }
  const handleChuongSau=()=>{
    router.visit(`/chuong/${idChuongSau}`);
  }
  const [showModal, setShowModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const handleClickChapter = (chapter) => {
      if (chapter?.gia > 0 && !chapter?.daMua) {
        setSelectedChapter(chapter);
        setShowModal(true);
      } else {
        router.visit(`/chuong/${chapter.id}`);
      }
  };

  const [selectedVoice, setSelectedVoice] = useState(null); // 0, 1, 2, 3
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

  return (
    <Userlayout login={user?true:false} title={`${truyen.ten} - Chương ${chuong.soChuong}: ${chuong.ten}`}>
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
              <button onClick={handleChuongTruoc} style={{opacity:chuong.soChuong==1?'0.5':'1'}} disabled={chuong.soChuong==1?true:false}>Chương trước</button>
              <button>
                Tóm tắt chương trước 
              </button>
              <button onClick={handleChuongSau} style={{opacity:chuongCuoi?'0.5':'1'}} disabled={chuongCuoi} >Chương tiếp</button>
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
              <button onClick={handleChuongTruoc} style={{opacity:chuong.soChuong==1?'0.5':'1'}} disabled={chuong.soChuong==1?true:false}>Chương trước</button>
              <button>
                <FontAwesomeIcon icon={faList} />
              </button>
              <button onClick={handleChuongSau} style={{opacity:chuongCuoi?'0.5':'1'}} disabled={chuongCuoi}>Chương tiếp</button>
            </div>
          </div>
          <div className="doc-report">
            <button className="report-btn">Báo cáo vi phạm</button>
            <ul>
              <li>- Vi phạm pháp luật.</li>
              <li>- Ảnh hưởng đến quyền lợi Việt Nam.</li>
              <li>- Vi phạm bản quyền.</li>
            </ul>
          </div>
        </div>
      </div>

    </Userlayout>
   
  );
}
