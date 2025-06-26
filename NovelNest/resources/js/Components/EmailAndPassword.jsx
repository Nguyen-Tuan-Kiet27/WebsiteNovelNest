import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './EmailAndPassword.scss';

export default function EmailAndPassword({isShow,setIsShow}){
    const [eyePass, setEyePass] = useState(false);
    const [eyeRePass, setEyeRePass] = useState(false);
    const [pass,setPass] = useState('');
    const [ePass,setEPass] = useState('');
    const [rePass,setRePass] = useState('');
    const [eRePass,setERePass] = useState('');
    const [email,setEmail] = useState('');
    const [eEmail,setEEmail] = useState('');
    const [pEmail,setPEmail] = useState('');
    const [otp,setOtp] = useState('');
    const [eOtp,setEOtp] = useState('');
    const [awaitTime,setAwaitTime] = useState(-1);
    const [loading,setLoading] = useState(false);
    const [done,setDone] = useState(false);

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
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){
            setEmail(email.trim());
            setEEmail('Email không hợp lệ!')
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
                email: email.trim(),
                pass: pass.trim(),
                otp: otp
            })
            setDone(true);
        } catch (error) {
            setEOtp(error.response.data.message);
        }
        setLoading(false);
    }
    const handleGuiMa = async ()=>{
        setLoading(true);
        let b = false;
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){
            setEmail(email.trim());
            setEEmail('Email không hợp lệ!');
            setPEmail('');
            b = true;
        }
        if(b){
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post('/api/send-otp',{
                email: email
            })
            setPEmail(response.data.message);
            setEEmail('')
            setAwaitTime(60);
        } catch (error) {
            setPEmail('');
            setEEmail('Mỗi lần gửi mã cách nhau 60s!');
            setAwaitTime(Math.ceil(error.response.data.time));
            console.log(error.response.data.error)
        }
        setLoading(false);
    }
    useEffect(()=>{
        const timer = setTimeout(()=>{
            if(done)
                window.location.reload();
        },2000)
        return ()=>clearTimeout(timer);
    },[done])

    useEffect(()=>{
        const timer = setTimeout(()=>{
            if(awaitTime > -1){
                setAwaitTime(awaitTime-1)
            }
        },1000)
        return () => clearTimeout(timer);
    },[awaitTime])
    return(
        <div className="emailAndPassword" style={{display:isShow?'flex':'none'}}
            onClick={()=>setIsShow(false)}
        >
              <div className="mainEAP" onClick={(e)=>e.stopPropagation()}>
                    {!done
                    ? <>
                    <h3>Đặt mật khẩu thanh toán</h3>
                    <div>
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
                        <p>Email khôi phục:</p>
                        <span className="error">{eEmail}</span>
                        <span className="pass">{pEmail}</span>
                        <div>
                            <input value={email}
                                onChange={(e)=>{setEmail(e.target.value);setEEmail('')}} 
                                type="email" 
                                placeholder="Nhập email"
                            />
                            <button onClick={handleGuiMa} disabled={awaitTime!=-1 || loading}>{awaitTime==-1?"Gửi mã":awaitTime+'s'}</button>
                        </div>
                        <p>Mã xác thực:</p>
                        <span className="error">{eOtp}</span>
                        <div>
                            <input value={otp} 
                                onChange={(e)=>{setOtp(e.target.value);setEOtp('')}} 
                                type="number"
                            />
                        </div>
                    </div>
                
                    <button onClick={handleSubmit} disabled={loading}>Xác nhận</button>
                    </>
                        :   <h3 style={{color:'green'}}>Đặt mật khẩu thành công!</h3>
                    }
                </div>
            
        </div>
    )
}