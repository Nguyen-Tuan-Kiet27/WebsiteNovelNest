import Userlayout from '@/Layouts/UserLayout';
import { Inertia } from '@inertiajs/inertia';
import { useState, useEffect } from 'react';
import './TaiKhoan.scss';
import { router } from '@inertiajs/react';

export default function TaiKhoan({user,daMua}){
    console.log(daMua)
    const [expandedId, setExpandedId] = useState(null);

    const handleToggle = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
    };
    
  return (
    <div className="tai-khoan-page">
      <div className="tai-khoan-container">
        <div className="logout-btn">
          <button onClick={() => window.location.href = '/api/logout'}>Đăng xuất</button>
        </div>

        <div className="profile-section">
          <div className="profile-avatar">
            <div className="avatar-img"><img src={user.anhDaiDien}/></div>
            <button className="edit-avatar">Sửa</button>
          </div>
          <div className="profile-info">
            <p className="user-id">{user.id}</p>
            <p className="user-title">{user.vaiTro==4?'Độc giả':user.vaiTro==3?'Tác giả':'Admin'}</p>
          </div>
          <div className="balance-section">
            <p>Số lượng xu: {user.soDu}</p>
            <button className="recharge-btn" onClick={()=>router.visit('/muaxu')}>Nạp xu</button>
          </div>
        </div>

        <div className="tab-section">
          <div className="tabs">
            <div className="tab active">Đã mua</div>
            <div className="tab">Yêu thích</div>
            <div className="tab">Lịch sử</div>
          </div>

            <div className="list-items">
                {Object.values(daMua).map(item => (
                <div key={item.truyen.id}>
                    <div className="item">
                        <div className="item-image"><img src={`/img/truyen/hinhAnh/${item.truyen.hinhAnh}`} alt="" /></div>
                        <div className="item-info">
                            <p><strong>{item.truyen.ten}</strong></p>
                            <p>Tác giả: {item.truyen.tacGia}</p>
                            <p>Số lượng: {item.truyen.soLuong}</p>
                            <p>Tổng tiền: {item.total} xu</p>
                        </div>
                        <div className="item-arrow" onClick={() => handleToggle(item.truyen.id)}>
                            {expandedId !== item.truyen.id ? '▲' : '▼'}
                        </div>
                    </div>

                    {expandedId === item.truyen.id && (
                        <div className="item-details">
                            {item.sub.map((chuong, idx) => (
                                <div className="chapter" key={chuong.id}>
                                    <span className="chapter-title">{chuong.ten}</span>
                                    {/* <span className="chapter-price">{chuong.gia} xu</span> */}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            <div className="load-more">Xem thêm</div>
          </div>
        </div>
      </div>
    </div>
       
    )
}