import { useEffect, useState } from 'react';
import './VerifyPass.scss';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import EmailAndPassword from './EmailAndPassword';
import UserLogin from '@/Components/UserLogin';


export default function({isShow,setIsShow,onOk}){
    const [eyePass, setEyePass] = useState(false);
    const [pass,setPass] = useState('');
    const [ePass,setEPass] = useState('')
    const [showEP,setShowPE] = useState(false);
    const [showLogin,setShowLogin] = useState(false);
    const [check,setCheck] = useState(true);
    const [loading,setLoading] = useState(false)
    const handleSubmit = async ()=>{
        setLoading(true);
        if(pass.length < 8){
            setEPass("Mật khẩu có ít nhất 8 ký tự!")
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post('/api/checkpass',{'pass':pass})
            setPass('');
            onOk();
        } catch (error) {
            console.log(error);
            if(error.response.data.matKhau)
                setEPass(error.response.data.matKhau)
            if(error.response.data.taiKhoan)
                alert(error.response.data.taiKhoan)
        } finally {setLoading(false);}
    }

    useEffect(()=>{
        const handleCheck = async ()=>{
            if(isShow)
            try {
                const response = await axios.get('/api/checkep');
                if(!response.data.value){
                    setShowPE(true);
                    setCheck(false);
                    return;
                }
                setCheck(false)
            } catch (error) {
                setShowLogin(true);
                setCheck(false)
                return;
            }
        }
        handleCheck();
        setEPass('');
        setEPass('');
    },[isShow])

    useEffect(()=>{
        if(!showEP && !check){
            setIsShow(false)
        }
    },[showEP])

    useEffect(()=>{
        if(!showLogin && !check){
            setIsShow(false)
        }
    },[showLogin])

    return(
        <div className="VeryfiPass" 
            style={{display:isShow?'flex':'none'}}
            onClick={()=>setIsShow(false)}
        >
            <EmailAndPassword isShow={showEP} setIsShow={setShowPE}/>
            <UserLogin userLoginIsVisible={showLogin} setUserLoginIsVisible={setShowLogin}/>
            <div className="mainVP"
                onClick={e=>e.stopPropagation()}
            >
                <label>Nhập mật khẩu xác nhận</label>
                <div>
                    <input value={pass}
                        onChange={(e)=>{setEPass('');
                            setPass(e.target.value)}}
                        type={eyePass?"text":"password"}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSubmit();
                            }
                        }}
                    />
                    <button onClick={()=>setEyePass(!eyePass)}>{eyePass?<FaEye/>:<FaEyeSlash/>}</button>
                </div>
                <label className='error'>{ePass}</label>
                <a href="/datlaimatkhau">Quên Mật khẩu?</a>
                <button disabled={loading} onClick={handleSubmit}>Xác nhận</button>
            </div>
        </div>
    )
}