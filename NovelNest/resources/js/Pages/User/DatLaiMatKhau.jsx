import React from "react";
import Userlayout from '@/Layouts/UserLayout';
import './DatLaiMatKhau.scss';
import { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function({user}){
    const [otp,setOtp] = useState('');
    const [eOtp,setEOtp] = useState('');
    const [loading,setLoading] = useState(false);
    const [awaitTime,setAwaitTime] = useState(-1);
    const [passed,setPassed] = useState(false);
    const [eyePass, setEyePass] = useState(false);
    const [eyeRePass, setEyeRePass] = useState(false);
    const [pass,setPass] = useState('');
    const [ePass,setEPass] = useState('');
    const [rePass,setRePass] = useState('');
    const [eRePass,setERePass] = useState('');
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

    const handleSubmit= async ()=>{
        setLoading(true);
        let b = false;
        if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pass.trim())){
            setPass(pass.trim());
            setEPass('Mật khẩu phải có ít nhất 8 ký tự, bao gồm số và chữ!')
            b = true;
        }
        if(rePass.trim() != pass.trim()){
            setERePass('Mật khẩu không trùng khớp!')
            b = true;
        }
        if(otp.trim().length != 6){
            setEOtp('Mã xác thực phải đủ 6 chữ số!');
            b = true;
        }
        if(b){
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post('/api/verify-otp',{
                email: user.email,
                pass: pass.trim(),
                otp: otp
            })
            alert('Đặt lại mật khẩu thành công!');
            window.history.back();
        } catch (error) {
            setEOtp(error.response.data.message);
        }
        setLoading(false);
    }
    return(
        <Userlayout login={user} page='4' title='Đặt lại mật khẩu'>
            <div className="DatLaiMatKhau">
                <div className="mainDatLaiMatKhau">
                    <h1>Đặt lại mật khẩu</h1>
                    <h4>OTP sẽ được gửi đến {user.email}</h4>
                    {passed&&<>
                        <p style={{marginBottom:'0',color:'green'}}>Mã đã được gửi.</p>
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
                    <span className="error">{ePass}</span>
                    <div>
                        <input value={pass} 
                            onChange={(e)=>{setPass(e.target.value);setEPass('');}} 
                            type={eyePass?"text":"password"} 
                            placeholder="Nhập mật khẩu"
                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                            title="Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số"
                        />
                        <button onClick={()=>setEyePass(!eyePass)}>{eyePass?<FaEye/>:<FaEyeSlash/>}</button>
                    </div>
                    <span className="error">{eRePass}</span>
                    <div>
                        <input value={rePass} 
                            onChange={(e)=>{setRePass(e.target.value);setERePass('')}} 
                            type={eyeRePass?"text":"password"} 
                            placeholder="Nhập lại mật khẩu"
                        />
                        <button onClick={()=>setEyeRePass(!eyeRePass)}>{eyeRePass?<FaEye/>:<FaEyeSlash/>}</button>
                    </div>
                    <button onClick={handleSubmit} disabled={loading}>Xác nhận</button>
                </div>
            </div>
        </Userlayout>
    )
}