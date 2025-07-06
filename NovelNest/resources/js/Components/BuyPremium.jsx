import { useState } from 'react';
import './BuyPremium.scss';
import VerifyPass from './VerifyPass';
import axios from 'axios';
export default function({isShow,setShow}){
    const [showPass,setShowPass] = useState(false)
    const handleMuaPremium = async () =>{
        try {
            const response = await axios.put('/api/muapremium');
            alert(response.data.message)
            window.location.reload();
        } catch (error) {
            alert(error.response.data.message)
            console(error.response.data.error)
        }
    }
    return(
        <div onClick={()=>setShow(false)} style={{display:isShow?'flex':'none'}} className="BuyPremium">
            <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleMuaPremium}/>
            <div className="main" onClick={e=>e.stopPropagation()}>
                <div className="head">
                    <h1>ĐĂNG KÝ PREMIUM</h1>
                </div>
                <div className="body">
                    <p>20.000 XU</p>
                    <p>Hiệu lực 30 NGÀY.</p>
                    <p>Khi trở thành thành viên PREMIUM,</p>
                    <p>bạn sẽ được hưởng những đại ngội sau:</p>
                    <p>Đọc truyện không quảng cáo.</p>
                    <p>Mở khóa chức năng nghe truyện.</p>
                    <p>Mở chức năng tóm tắt chương bằng AI với TÁC GIẢ.</p>
                    <p>Nếu bạn đã mua trước đó sẽ được cộng thêm thời gian.</p>
                    <button onClick={()=>setShowPass(true)}>Đăng ký</button>
                </div>
            </div>
        </div>
    )
}