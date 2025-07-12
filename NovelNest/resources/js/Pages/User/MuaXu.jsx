import React, { useEffect, useState } from "react";
import Userlayout from "../../Layouts/UserLayout";
import './MuaXu.scss'
import EmailAndPassword from "../../Components/EmailAndPassword";
import axios from "axios";
export default function({user,pay}){
    const [passModal,setPassModal] = useState(false);
    const [xu,setXu] = useState(0);
    const [gia,setGia] = useState(0);
    const [modalThanhToan,setModalThanhToan] = useState(false);

    const handleClickMua = (tien,xu)=>{
        if(!user.email || !user.matKhau){
            setPassModal(true);
            return;
        }
        setGia(tien);
        setXu(xu);
        setModalThanhToan(true);
    }

    const handleVNPay = async ()=>{
        try {
            const res = await axios.post('/api/vnpay/create-payment', {
                amount: gia,
                xu: xu
            });

            if (res.data.redirect_url) {
                window.location.href = res.data.redirect_url;
            }
        } catch (err) {
            console.error('Lỗi khi tạo link thanh toán:', err);
        }
    }
    const handleMomo = async ()=>{
        try {
            const res = await axios.post('/api/momo/create-payment', {
                amount: gia,
                xu: xu
            });

            if (res.data.redirect_url) {
                window.location.href = res.data.redirect_url;
            }
        } catch (err) {
            console.error('Lỗi khi tạo link thanh toán:', err);
        }
    }
    useEffect(()=>{
        if(pay){
            if(pay==1){
                alert('Nạp tiền thành công');
            }
            else{
                alert('Nạp tiền thất bại'+pay);
            }
        }
    },[])
    return(
        <Userlayout login={user} title='Mua xu' page='4'>
            <div className="modalThanhToan" style={{display:modalThanhToan?'flex':'none'}} onClick={()=>setModalThanhToan(false)}>
                <div onClick={e=>e.stopPropagation()}>
                    <h3>Chọn phương thức thanh toán:</h3>
                    <div className="thongTinThanhToan">
                        <p>Số lượng: {xu} Xu</p>
                        <p>Giá:  {gia}₫</p>
                    </div>
                    <div className="phuongThucThanhToan">
                        <button onClick={handleVNPay}>
                            <img src="/img/thanhToanVNPay.png" alt="" />
                        </button>
                        <button onClick={handleMomo}>
                            <img src="/img/thanhToanMOMO.png" alt="" />
                        </button>
                    </div>
                </div>
            </div>
            <EmailAndPassword isShow={passModal} setIsShow={setPassModal}/>
            <div className="muaXu">
                <div className="mainMuaXu">
                    <div>
                        <h1>Mua xu</h1>
                    </div>
                    <div>
                        <div className="option">
                            <img src='/img/Mua10.png' alt="" />
                            <p>Số lượng xu: 10.000</p>
                            <p>Giá: 10.000₫</p>
                            <button onClick={()=>handleClickMua(10000,10000)}>Mua</button>
                        </div>
                        <div className="option">
                            <img src='/img/Mua20.png' alt="" />
                            <p>Số lượng xu: 20.000</p>
                            <p>Giá: 20.000₫</p>
                            <button onClick={()=>handleClickMua(20000,20000)}>Mua</button>
                        </div>
                        <div className="option">
                            <img src='/img/Mua50.png' alt="" />
                            <p>Số lượng xu: 50.000</p>
                            <p>Giá: 50.000₫</p>
                            <button onClick={()=>handleClickMua(50000,50000)}>Mua</button>
                        </div>
                    </div>
                    <div>
                        <div className="option">
                            <img src='/img/Mua100.png' alt="" />
                            <p>Số lượng xu: 100.000</p>
                            <p>Giá: 98.000₫</p>
                            <button onClick={()=>handleClickMua(98000,100000)}>Mua</button>
                        </div>
                        <div className="option">
                            <img src='/img/Mua200.png' alt="" />
                            <p>Số lượng xu: 200.000</p>
                            <p>Giá: 192.000₫</p>
                            <button onClick={()=>handleClickMua(192000,200000)}>Mua</button>
                        </div>
                        <div className="option">
                            <img src='/img/Mua500.png' alt="" />
                            <p>Số lượng xu: 500.000</p>
                            <p>Giá: 480.000₫</p>
                            <button onClick={()=>handleClickMua(480000,500000)}>Mua</button>
                        </div>
                    </div>
                </div>
            </div>
        </Userlayout>
    )
}