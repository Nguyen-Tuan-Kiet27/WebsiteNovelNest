import React from 'react';
import Userlayout from '@/Layouts/UserLayout';
import { useState, useEffect, useRef, useMemo  } from 'react';
import { router } from '@inertiajs/react';
import './Stories.scss';
import CardStories from '../../Components/CardStories';
import { FaRegHeart, FaShareSquare, FaHeart, FaArrowLeft  } from 'react-icons/fa';
import axios from 'axios';
import { TbLockDollar } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";
import BuyChapter from '../../Components/BuyChappter';
import UserLogin from '@/Components/UserLogin';
import EmailAndPassword from '@/Components/EmailAndPassword';

const rawComments = [
  { id: 1, id_NguoiDung: 101, id_BinhLuan: null, noiDung: "Bình luận gốc", thoiGian: "2025-07-04" },
  { id: 2, id_NguoiDung: 102, id_BinhLuan: 1, noiDung: "Trả lời 1", thoiGian: "2025-07-04" },
  { id: 3, id_NguoiDung: 103, id_BinhLuan: 2, noiDung: "Trả lời 1.1", thoiGian: "2025-07-04" },
  { id: 4, id_NguoiDung: 104, id_BinhLuan: 1, noiDung: "Trả lời 2", thoiGian: "2025-07-04" }
];
function buildCommentTree(comments) {
  const map = {};
  const roots = [];

  comments.forEach(comment => {
    map[comment.id] = { ...comment, replies: [] };
  });

  comments.forEach(comment => {
    if (comment.id_BinhLuan !== null) {
      map[comment.id_BinhLuan]?.replies.push(map[comment.id]);
    } else {
      roots.push(map[comment.id]);
    }
  });

  return roots;
}

function Comment({ comment, onReply }) {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showChildren, setShowChildren] = useState(false); // 👈 kiểm soát ẩn/hiện phản hồi

  const handleSubmit = () => {
    if (!replyContent.trim()) return;
    onReply(comment.id, replyContent);
    setReplyContent('');
    setShowReply(false);
    setShowChildren(true); // tự động mở replies sau khi gửi
  };

  return (
    <div style={{
      marginLeft: comment.id_BinhLuan ? 20 : 0,
      borderLeft: comment.id_BinhLuan ? '1px solid #ccc' : 'none',
      paddingLeft: 10,
      marginBottom: 10
    }}>
      <p className='rowBinhLuan'><b>{comment.nguoidung.ten}</b>: {comment.noiDung}</p>
      <small className='thoiGian'>{comment.ngayTao}</small>
      <br />

      <div style={{ marginTop: 4 }}>
        <button className='btnc' onClick={() => setShowReply(!showReply)} style={{ fontSize: '12px', marginRight: 10 }}>
          {showReply ? 'Hủy' : 'Trả lời'}
        </button>

        {/* Nút ẩn/hiện phản hồi nếu có replies */}
        {comment.replies.length > 0 && (
          <button className='btnc' onClick={() => setShowChildren(!showChildren)} style={{ fontSize: '12px' }}>
            {showChildren ? `Ẩn ${comment.replies.length} phản hồi` : `Hiện ${comment.replies.length} phản hồi`}
          </button>
        )}
      </div>

      {showReply && (
        <div style={{ marginTop: 6 }}>
          <textarea
            rows={2}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Nhập phản hồi..."
            style={{ width: '100%' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }}
            }
          />
          <button className='btnc' onClick={handleSubmit} style={{ fontSize: '12px', marginTop: 4 }}>Gửi</button>
        </div>
      )}

      {/* Hiển thị replies nếu đang mở */}
      {showChildren && comment.replies.length > 0 && (
        <div>
          {comment.replies.map(reply => (
            <Comment key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Stories({favorite,login,truyen,chuongs, soLuong,truyenDaHoanThanhs,chuongChuaMua,binhLuans}) {
    console.log(truyenDaHoanThanhs)
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
        const observer = new ResizeObserver(() => {
          if (traiRef.current) {
              const height = traiRef.current.offsetHeight;
              setTraiHeight(height);
              setTraiHeight2(height - 2);
          }
        });

        if (traiRef.current) {
            observer.observe(traiRef.current);
        }

        return () => observer.disconnect();
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
  //////////////
  const [comments, setComments] = useState(binhLuans);
  const [noiDung,setNoiDung] = useState('');
  const [loadingComment,setLoadingComment] = useState(false);
  const handleReply = async (parentId, content)=>{
    setLoadingComment(true);
    if(!login){
      setShowLogin(true);
      setLoadingComment(false);
      return;
    }
    if(content.trim().length == 0){
      alert('Chưa viết bình luận!')
      setLoadingComment(false);
      return;
    }
    try {
      const response = await axios.post(`/api/binhluan/${truyen.id}`,{
        noiDung: content,
        idBinhLuan: parentId
      })
      setNoiDung('');
      setComments(prev => [response.data.binhLuan, ...prev]);
      console.log(response.data.binhLuan);
    } catch (error) {
      alert(error.response.data.message);
    }finally{
      setLoadingComment(false);
    }
  };

  console.log(binhLuans)
  const handleComment = async ()=>{
    setLoadingComment(true);
    if(!login){
      setShowLogin(true);
      setLoadingComment(false);
      return;
    }
    if(noiDung.trim().length == 0){
      alert('Chưa viết bình luận!')
      setLoadingComment(false);
      return;
    }
    try {
      const response = await axios.post(`/api/binhluan/${truyen.id}`,{
        noiDung: noiDung
      })
      setNoiDung('');
      setComments(prev => [response.data.binhLuan, ...prev]);
      console.log(response.data.binhLuan);
    } catch (error) {
      alert(error.response.data.message);
    }finally{
      setLoadingComment(false);
    }
  }
  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);
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
    <div className='container1' >
      <button className="back-arrow" onClick={() => window.history.back()}><FaArrowLeft size={24} /></button>
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
                            <h4>Trạng thái: {!truyen.ngayKetThuc?'Chưa hoàn thành':'Đã hoàn thành'}</h4>
                            {console.log(truyen.ngayKetThuc)}
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
    <div className='binhLuan'>
      <h3>Bình luận</h3>
      <div className='tBinhLuanDiv'>
        <textarea spellCheck={false} value={noiDung} onChange={(e)=>{setNoiDung(e.target.value)}}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleComment();
            }}
          }
        />
        <button disabled={loadingComment} onClick={handleComment}>Bình luận</button>
      </div>
      {commentTree.map(comment => (
        <Comment key={comment.id} comment={comment} onReply={handleReply} />
      ))}
    </div>
    <div className='d-flex justify-content-center mt-4 h-100'>
        <div className="hot-stories-wrapper">
            <h3 className="hot-title">Đã hoàn thành</h3>
            <div className="hot-stories-container">
            {truyenDaHoanThanhs.map((story) => (
                <CardStories key={story.id} truyen={story} />
            ))}
            </div>
        </div>
    </div>

    <BuyChapter isShow={showModal} changeShow={setShowModal} select={select} chuongChuaMua={chuongChuaMua}/>
   





</Userlayout>

);

}