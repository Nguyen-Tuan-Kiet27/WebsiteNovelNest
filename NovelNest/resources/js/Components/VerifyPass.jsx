import { useState } from 'react';
import './VerifyPass.scss';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';

export default function({isShow,setIsShow,onOk}){
    const [eyePass, setEyePass] = useState(false);
    const [pass,setPass] = useState('');
    const [ePass,setEPass] = useState('')
    const handleSubmit = async ()=>{
        if(pass.length < 8){
            setEPass("Mật khẩu có ít nhất 8 ký tự!")
            return;
        }
        try {
            const response = await axios.post('/api/checkpass',{'pass':pass})
            onOk();
        } catch (error) {
            if(error.response.data.matKhau)
                setEPass(error.response.data.matKhau)
            if(error.response.data.taiKhoan)
                alert(error.response.data.taiKhoan)
        }
    }

    return(
        <div className="VeryfiPass" 
            style={{display:isShow?'flex':'none'}}
            onClick={()=>setIsShow(false)}
        >
            <div className="mainVP"
                onClick={e=>e.stopPropagation()}
            >
                <label>Nhập mật khẩu thanh toán</label>
                <div>
                    <input value={pass}
                        onChange={(e)=>{setEPass('');
                            setPass(e.target.value)}}
                        type={eyePass?"text":"password"}
                    />
                    <button onClick={()=>setEyePass(!eyePass)}>{eyePass?<FaEye/>:<FaEyeSlash/>}</button>
                </div>
                <label className='error'>{ePass}</label>
                <a href="">Quên Mật khẩu?</a>
                <button onClick={handleSubmit}>Xác nhận</button>
            </div>
        </div>
    )
}