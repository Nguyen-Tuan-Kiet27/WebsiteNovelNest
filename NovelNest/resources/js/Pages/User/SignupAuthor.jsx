import React, { useEffect, useState } from "react";
import Userlayout from "../../Layouts/UserLayout";
import './SignupAuthor.scss'
import { router } from "@inertiajs/react";
import axios from "axios";

export default function SignupAuthor({user,dieuKhoan}){
    const [otp,setOtp] = useState('');
    const [eOtp,setEOtp] = useState('');
    const [loading,setLoading] = useState(false);
    const [awaitTime,setAwaitTime] = useState(-1);
    const [showOtp,setShowOtp] = useState(false);
    const [passed,setPassed] = useState(false);

    const handleSubmit = async ()=>{
        if(!showOtp){
            setShowOtp(true);
            handleGuiMa();
            return;
        }
        if(otp.trim().length != 6){
            setEOtp('Mã xác thực phải đủ 6 chữ số!');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('/api/verify-otp',{
                email: user.email,
                otp: otp
            })
            const response1 = await axios.put('api/signupauthor');
            alert("Đăng ký tác giả thành công!")
            router.visit('/author');
        } catch (error) {
            setLoading(false);
            console.log(error)
            setEOtp(error.response.data.message);
        }
        setLoading(false);
    }
    const handleGuiMa = async ()=>{
        setLoading(true);
        try {
            const response = await axios.post('/api/send-otp',{
                email: user.email
            })
            setEOtp('')
            setPassed(true);
            setAwaitTime(60);
        } catch (error) {
            setPassed(false);
            setEOtp('Mỗi lần gửi mã cách nhau 60s!');
            console.log(error);
            setAwaitTime(Math.ceil(error.response.data.time));
        }
        setLoading(false);
    }
    useEffect(()=>{
        const timer = setTimeout(()=>{
            if(awaitTime > -1){
                setAwaitTime(awaitTime-1)
            }
        },1000)
        return () => clearTimeout(timer);
    },[awaitTime])
    return(
        <Userlayout title='Đăng ký tác giả.' page='5' login={user}>
            <div className="dieuKhoanTacGia">
                <div className="mainDKTG">
                    <h1>Điều Khoản Dành Cho Tác Giả – <b>NovelNest</b></h1>
                    <p>Khi bạn đăng ký trở thành <b>Tác Giả</b> trên NovelNest, bạn đồng ý với các điều khoản sau:</p>
                    <div className="subDKTG">
                        <div className="dieuKhoan">
                            <div dangerouslySetInnerHTML={{ __html: dieuKhoan }} />
                        </div>
                        <div className="dangKy">
                            <h5>Đăng ký trở thành tác giả:</h5>
                            <div style={{display:showOtp?'block':'none'}}>
                                {passed&&<>
                                    <p style={{marginBottom:'0',color:'green'}}>Chúng tôi đã gửi mã xác thực đến:</p>
                                    <p style={{color:'green'}}>{user.email}</p>
                                </>}
                                <span className="error">{eOtp}</span>
                                <div className="otp">
                                    <input value={otp} 
                                        onChange={(e)=>{setOtp(e.target.value);setEOtp('')}} 
                                        type="number"
                                        placeholder="Nhập OTP"
                                    />
                                    <button onClick={handleGuiMa} disabled={awaitTime!=-1 || loading}>{awaitTime==-1?(loading?"Đang gửi":"Gửi mã"):awaitTime+'s'}</button>
                                </div>
                            </div>
                            
                            <button onClick={handleSubmit} disabled={loading}>Đăng ký</button>
                        </div>
                    </div>
                </div>
            </div>
        </Userlayout>
    )
}