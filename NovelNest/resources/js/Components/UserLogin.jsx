import './UserLogin.scss';
import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
export default function UserLogin({setUserLoginIsVisible, userLoginIsVisible}){
    const [dieuKhoanDV,setDieuKhoanDV] = useState(false)

    const handleFacebook = ()=>{
        if(!dieuKhoanDV){
            return;
        }
        const currentUrl = window.location.href;
        window.location.href = `/auth/facebook?redirect=${encodeURIComponent(currentUrl)}`;
    }
    const handleGoogle = ()=>{
        if(!dieuKhoanDV){
            return;
        }
        const currentUrl = window.location.href;
        window.location.href = `/auth/google?redirect=${encodeURIComponent(currentUrl)}`;
    }

    return(
        <div className="UserLogin"
            onClick={()=>{setUserLoginIsVisible(false)}}
            style={{display: userLoginIsVisible ? 'flex' : 'none'}}
        >
            <div
                onClick={(e)=>{ e.stopPropagation();}}
            >
                <h5>Bạn chưa đăng nhập</h5>
                <h6>Đăng nhập bằng</h6>
                <div>
                    <div>
                        <p>
                            <input type='checkbox'
                                onChange={(e)=>setDieuKhoanDV(e.target.checked)}
                            ></input> Đồng ý với điều khoản dịch vụ <span style={{display: !dieuKhoanDV ? 'inline' : 'none', color:"red",fontSize:"20px"}}>*</span>
                        </p> 
                        <button onClick={handleFacebook}>Facebook</button>
                        <button onClick={handleGoogle}>Google</button>
                    </div>
                </div>
            </div>
        </div>
    )
}