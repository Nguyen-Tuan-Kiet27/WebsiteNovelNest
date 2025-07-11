import Userlayout from '@/Layouts/UserLayout';
import { Inertia } from '@inertiajs/inertia';
import { useState, useEffect, useRef } from 'react';
import './TaiKhoan.scss';
import { router } from '@inertiajs/react';
import { TiPen } from "react-icons/ti";
import axios from 'axios';
import { FaRegHeart, FaHeart  } from 'react-icons/fa';
import VerifyPass from '../../Components/VerifyPass';
import BuyPremium from '../../Components/BuyPremium';

export default function TaiKhoan({user,timePrem}){
    const [showTab,setShowTab] = useState(1);
    const hinh='https://www.westminstercollection.com/media/52253261/dn-change-checker-2022-canadian-mint-honouring-queen-elizabeth-ii-2-coin-product-images-2-1.jpg?height=450&bgcolor=fff'
    //đã mua
    const [daMuas,setDaMuas] = useState({});
    const [sDaMua,setSDaMua] = useState(1);
    const [hasMoreDaMua,setHasMoreDaMua] = useState(true);
    const [loadDaMua,setLoadDaMua] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [show, setShow] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleGetDaMuas = async ()=>{
      try {
          setLoadDaMua(true);
          const response = await axios.get(`/api/getdamua/${sDaMua}`);

          setDaMuas(prev => ({
            ...prev,
            ...response.data.daMuas
          }));
          
          setHasMoreDaMua(response.data.hasMore);
          setSDaMua(prev => prev + 1);
        } catch (error) {
          console.error(error?.response?.data?.message || error.message);
        } finally {
          setLoadDaMua(false);
        }
    }
    const handleToggle = (id,e) => {
        e.stopPropagation();
        setExpandedId(prev => (prev === id ? null : id));
    };
    //yêu thích
    const [yeuThichs,setYeuThichs] = useState({});
    const [sYeuThich,setSYeuThich] = useState(1);
    const [hasMoreYeuThich,setHasMoreYeuThich] = useState(true);
    const [loadYeuThich,setLoadYeuThich] = useState(false);
    const [timState, setTimState] = useState({});

    const handleGetYeuThichs = async () => {
        try {
          setLoadYeuThich(true);
          const response = await axios.get(`/api/getyeuthich/${sYeuThich}`);

          setYeuThichs(prev => ({
            ...prev,
            ...response.data.yeuThichs
          }));
          
          setHasMoreYeuThich(response.data.hasMore);
          setSYeuThich(prev => prev + 1);
        } catch (error) {
          console.error(error?.response?.data?.message || error.message);
        } finally {
          setLoadYeuThich(false);
        }
      };
    const toggleTim = async (id, e) => {
      e.stopPropagation();
      try {
        const response = await axios.post(
          `/api/favorite/${id}`
        )
        setTimState(prev => ({
          ...prev,
          [id]: !prev[id]
        }));
      } catch (error) {
        console.log(error.response.data.message)
      }
    };
    //lịch sử
    const [lichSus,setLichSus] = useState([]);
    const [sLichSu,setSLichSu] = useState(null);
    const [hasMoreLichSu,setHasMoreLichSu] = useState(true);
    const [loadLichSu,setLoadLichSu] = useState(false);
    const [expandedIdL, setExpandedIdL] = useState(null);


    const handleGetLichSus = async () => {
        try {
          setLoadLichSu(true);
          const response = await axios.get(`/api/getlichsu/`,{
            params: {
              lastTime: sLichSu,
            }
          });
          console.log(response.data.lichSus);
          setLichSus(prev => ([
            ...prev,
            ...response.data.lichSus
          ]));
          
          setHasMoreLichSu(response.data.hasMore);
          setSLichSu(response.data.minTime);
        } catch (error) {
          console.error(error?.response?.data?.message || error.message);
        } finally {
          setLoadLichSu(false);
        }
    };
    const handleToggleL = (id,e) => {
        e.stopPropagation();
        setExpandedIdL(prev => (prev === id ? null : id));
    };

    //Đổi tên:
    const [ten,setTen] = useState('')
    const [eTen,setETen] = useState('');
    const [showDoiTen,setShowDoiTen] = useState(false);
    const [showPass,setShowPass] = useState(false);
    const [showPremium,setShowPremium]=useState(false);
    const handleDoiTen = ()=>{
      if(ten.trim().length < 8){
        setETen('Tên phải dài từ 8 ký tự!');
        return;
      }
      setShowPass(true);
    }
    const handleDoiTenS = async ()=>{
      const formData = new FormData();
      formData.append('ten',ten);
      formData.append('_method','PUT');
      try {
        const response = await axios.post('/api/user/doiten',formData);
        alert('Đổi tên thành công');
        window.location.reload();
      } catch (error) {
        alert(error.response.data.message)
      }
    }
    //Đổi ảnh đại diện
    const [showChangeAvatar,setShowChangeAvatar] = useState(false);
    const avatar = new useRef();
    const [errorAV,setErrorAV] = useState('');
    const [fileAV,setFileAV] = useState(null);
    const [previewAV,setPreviewAV] = useState(null);
    const [showPassAV,setShowPassAV] = useState(false);

    const handleAVChange=(e)=>{
      const sfile = e.target.files[0];
        if(sfile){
            const img = new Image();
            const reader = new FileReader();
            reader.onloadend = event=>{
                img.onload = ()=>{
                    const {width, height} = img;
                    if(width/height != 1){
                        setErrorAV("Vui lòng chọn hình ảnh (1:1)!")
                        setPreviewAV(null)
                        setFileAV(null)
                    }else{
                        setFileAV(sfile)
                        setErrorAV(null)
                        setPreviewAV(event.target.result)
                    }
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(sfile)
        }else{
            setPreviewAV(null);
            setFileAV(null);
        }
        e.target.value = null;
    }
    const handleCheckAV=()=>{
      if(!fileAV){
        setErrorAV('Chưa chọn ảnh!')
        return;
      }
      setShowPassAV(true);
    }
    const handleSubmitAV = async ()=>{
      try {
        const formData = new FormData();
        formData.append('anhDaiDien',fileAV);
        formData.append('_method','PUT');
        const response = await axios.post('/api/doiavartar',formData,{
          headers: {
              'Content-Type': 'multipart/form-data',
          },
        })
        alert(response.data.message);
        window.location.reload();
      } catch (error) {
        alert(error.response.data.message);
        console.log(error.response.data.error);
      }
    }
    //Hiện thị thời gian prem
    const handleMouseMove = (e) => {
        setPosition({ x: e.pageX, y: e.pageY});
    };
    //////
    useEffect( ()=>{
      handleGetDaMuas();
      handleGetYeuThichs()
      handleGetLichSus()
    },[]);

  return (
    <Userlayout login={user} title='Tài khoản' page='4'>
      <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleDoiTenS}/>
      <VerifyPass isShow={showPassAV} setIsShow={setShowPassAV} onOk={handleSubmitAV}/>
      <BuyPremium isShow={showPremium} setShow={setShowPremium}/>
      {showDoiTen&& (
          <div className='popupDoiTen' onClick={()=>setShowDoiTen(false)}>
            <div className='mainDoiTen' onClick={(e)=>{e.stopPropagation()}}>
              <h5>ĐỔI TÊN</h5>
              <label className='error'>{eTen}</label>
              <input type="text" placeholder='Nhập tên mới' value={ten} onChange={(e)=>setTen(e.target.value)}/>
              <button onClick={handleDoiTen}>Xác nhận</button>
            </div>
          </div>
        )
      }
      {showChangeAvatar && (
        <div className='ChangeAvatar' onClick={()=>setShowChangeAvatar(false)}>
            <div className='main' onClick={e=>e.stopPropagation()}>
              <div className="inputAV">
                  <label>Ảnh đại diện size(1:1)</label>
                  <input ref={avatar} type="file" accept="image/*" style={{display:'none'}} onChange={handleAVChange}/>
                  <img src={previewAV || '/img/nguoiDung/d1_1.png'} onClick={()=>avatar.current.click()}/>
                  <label className="error">{errorAV}</label>
              </div>
              <button onClick={handleCheckAV}>Lưu</button>
            </div>
        </div>
      )}
      {(show && user.vaiTro>2) && (
          <div
              className="custom-tooltip"
              style={{
                  position: 'absolute',
                  top: position.y+20,
                  left: position.x+10,
              }}
          >
              {timePrem!=null?`Hiệu lực đến: ${timePrem}`:'Mua Premium'}
          </div>
      )}
      <div className="tai-khoan-page">
        <div className="tai-khoan-container">
          <div className="logout-btn">
            <button onClick={() => window.location.href = '/api/logout'}>Đăng xuất</button>
          </div>

          <div className="profile-section">
            <div className="profile-avatar">
              <div className="avatar-img">
                <img src={user.anhDaiDien.startsWith('http')?user.anhDaiDien:`/img/nguoiDung/${user.anhDaiDien}`}/>
                <button 
                  onClick={()=>setShowPremium(user.vaiTro>2)}
                  className={user.premium?'gold-button':'silver-button'}
                  onMouseEnter={() => setShow(true)}
                  onMouseLeave={() => setShow(false)}
                  onMouseMove={handleMouseMove}
                >
                  <label className={user.premium?'gold-text':'silver-text'}>{user.premium?'Prem':'STD'}</label>
                </button>
              </div>
              <button className="edit-avatar" onClick={()=>setShowChangeAvatar(true)}>Đổi Ảnh</button>
            </div>
            <div className='uName'>
              <p>Tên:&ensp;{user.ten}</p>
              <button onClick={()=>setShowDoiTen(true)}><TiPen /></button>
            </div>
            <div className="profile-info">
              <p className="user-id">ID:&ensp;{user.id}</p>
              <p className="user-title">{user.vaiTro==4?'Độc giả':user.vaiTro==3?'Tác giả':'Admin'}</p>
            </div>
            <div className="balance-section">
              <p>Số lượng xu: {user.soDu}</p>
              <button className="recharge-btn" onClick={()=>router.visit('/muaxu')}>Nạp xu</button>
            </div>
          </div>

          <div className="tab-section">
            <div className="tabs">
              <div className={showTab==1?'tab active':'tab'} onClick={()=>setShowTab(1)}>Đã mua</div>
              <div className={showTab==2?'tab active':'tab'} onClick={()=>setShowTab(2)}>Yêu thích</div>
              <div className={showTab==3?'tab active':'tab'} onClick={()=>setShowTab(3)}>Lịch sử</div>
            </div>

              <div className="list-items">
                  {/*Đã mua*/}
                  {showTab==1 && Object.values(daMuas).map(item => (
                    <div key={item.truyen.id}>
                      <div className="item" onClick={()=>router.visit(`/truyen/${item.truyen.id}`)} style={{cursor:'pointer'}}>
                        <div className="item-image"><img src={`/img/truyen/hinhAnh/${item.truyen.hinhAnh}`} alt="" /></div>
                        <div className="item-info">
                            <p><strong>{item.truyen.ten}</strong></p>
                            <p>Tác giả: {item.truyen.tacGia}</p>
                            <p>Số lượng: {item.truyen.soLuong}</p>
                            <p>Tổng tiền: {item.total} xu</p>
                        </div>
                        <div className="item-arrow" onClick={(e) => handleToggle(item.truyen.id,e)}>
                            {expandedId !== item.truyen.id ? '▲' : '▼'}
                        </div>
                      </div>

                      {expandedId === item.truyen.id && (
                        <div className="item-details">
                          {item.sub.map((chuong, idx) => (
                            <div className="chapter" key={chuong.id}>
                              <span className="chapter-title" onClick={()=>router.visit(`/chuong/${chuong.id}`)} style={{cursor:'pointer'}}>{`CHƯƠNG ${chuong.soChuong} : `+chuong.ten}</span>
                            </div>
                          ))}
                        </div>
                      )}       
                    </div>
                  ))}
                  {/*Yêu thích*/}
                  {showTab==2 && Object.values(yeuThichs).map(item => (
                    <div key={item.id} onClick={()=>router.visit(`/truyen/${item.id}`)} style={{cursor:'pointer'}}>
                      <div className="item">
                        <div className="item-image"><img src={`/img/truyen/hinhAnh/${item.hinhAnh}`} alt="" /></div>
                        <div className="item-info">
                            <p>&emsp;</p>
                            <p><strong>{item.ten}</strong></p>
                            <p>Thể loại: {item.the_loai.ten}</p>
                            <p>&emsp;</p>
                        </div>
                        <div className="item-arrow" onClick={(e) => toggleTim(item.id, e)}>
                            {!timState[item.id] ?<FaHeart style={{marginRight:'50px', color:'red'}}/>:<FaRegHeart style={{marginRight:'50px'}}/>}
                        </div>
                      </div> 
                    </div>
                  ))}
                  {/*Lịch sử:*/}
                  {showTab==3 && lichSus.map(item => (
                    /*Rút*/
                    item.loai == 4 && (
                      <div key={item.thoiGian}>
                        <div className="item" onClick={()=>router.visit(`/muaxu`)} style={{cursor:'pointer'}}>
                          <div className="item-image"><img src='/img/XuNovelNest.png' alt="" /></div>
                          <div className="item-info">
                              <p><strong>Rút xu:</strong></p>
                              <p>Số lượng xu: {item.lichSu.soLuongXu}</p>
                              <p>Giá trị: {item.lichSu.giaTri}₫</p>
                              <p>Trạng thái: {item.lichSu.trangThai == 0?'Đang chờ xử lý':item.lichSu.ketQua==1?'Đã hoàn thành':`Bị từ chối với lý do "${item.lichSu.lyDo}"`}</p>
                              <p>Thời gian: {item.thoiGian}</p>
                          </div>
                        </div>
                      </div>
                    )||
                    /*Mua*/
                    item.loai == 3 && (
                      <div key={item.thoiGian}>
                        <div className="item" onClick={()=>router.visit(`/truyen/${item.truyen.id}`)} style={{cursor:'pointer'}}>
                          <div className="item-image"><img src={`/img/truyen/hinhAnh/${item.truyen.hinhAnh}`} alt="" /></div>
                          <div className="item-info">
                              <p>Đã Mua: <strong>{item.truyen.ten}</strong></p>
                              <p>Thời gian: {item.thoiGian}</p>
                              <p>Số lượng: {item.soLuong}</p>
                              <p>Tổng tiền: {item.lichSu.gia} xu</p>
                          </div>
                          <div className="item-arrow" onClick={(e) => handleToggleL(item.thoiGian,e)}>
                              {expandedIdL !== item.truyen.id ? '▲' : '▼'}
                          </div>
                        </div>

                        {expandedIdL === item.thoiGian && (
                          <div className="item-details">
                            {item.sub.map((chuong, idx) => (
                              <div className="chapter" key={chuong.id}>
                                <span className="chapter-title" onClick={()=>router.visit(`/chuong/${chuong.id}`)} style={{cursor:'pointer'}}>{`CHƯƠNG ${chuong.soChuong} : `+chuong.ten}</span>
                              </div>
                            ))}
                          </div>
                        )}       
                      </div>
                    ) ||
                    /*Nap*/
                    item.loai == 2 && (
                      <div key={item.thoiGian}>
                        <div className="item" onClick={()=>router.visit(`/muaxu`)} style={{cursor:'pointer'}}>
                          <div className="item-image"><img src='/img/XuNovelNest.png' alt="" /></div>
                          <div className="item-info">
                              <p><strong>Nạp xu:</strong></p>
                              <p>Số lượng xu: {item.lichSu.soLuongXu}</p>
                              <p>Tổng tiền: {item.lichSu.menhGia}₫</p>
                              <p>Thời gian: {item.thoiGian}</p>
                          </div>
                        </div>
                      </div>
                    ) ||
                    /*Đọc*/
                    item.loai == 1 && (
                      <div key={item.thoiGian}>
                        <div className="item" onClick={()=>router.visit(`/chuong/${item.lichSu.id_Chuong}`)} style={{cursor:'pointer'}}>
                          <div className="item-image"><img src={`/img/truyen/hinhAnh/${item.truyen.hinhAnh}`} alt="" /></div>
                          <div className="item-info">
                              <p><strong>Đã đọc:</strong></p>
                              <p>Truyện: <strong>{item.truyen.ten}</strong></p>
                              <p>Chương {item.soChuong}: <strong>{item.tenChuong}</strong></p>
                              <p>Thời gian: {item.thoiGian}</p>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                  {/*/////////////////////////////////////////////*/}
              {showTab==1&&<div onClick={()=>{if(hasMoreDaMua && !loadDaMua)handleGetDaMuas()}} className="load-more">{hasMoreDaMua?'Xem thêm':'Không còn dữ liệu!'}</div>}
              {showTab==2&&<div onClick={()=>{if(hasMoreYeuThich && !loadYeuThich)handleGetYeuThichs()}} className="load-more">{hasMoreYeuThich?'Xem thêm':'Không còn dữ liệu!'}</div>}
              {showTab==3&&<div onClick={()=>{if(hasMoreLichSu && !loadLichSu)handleGetLichSus()}} className="load-more">{hasMoreLichSu?'Xem thêm':'Không còn dữ liệu!'}</div>}

            </div>
          </div>
        </div>
      </div>
    </Userlayout>
  )
}