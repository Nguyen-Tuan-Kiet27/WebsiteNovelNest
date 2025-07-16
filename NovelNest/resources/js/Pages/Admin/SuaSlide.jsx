import AdminLayout from '../../Layouts/AdminLayout';
import './SuaSlide.scss';
import VerifyPass from '../../Components/VerifyPass' 
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { router } from '@inertiajs/react';
export default function ({user,slide}){
    const anhNen = useRef()
    const [previewAN, setPreviewAN] = useState(null);
    const [fileAN,setFileAN] = useState(null);
    const [errorAN,setErrorAN] = useState(null);

    const [ten,setTen] = useState(slide.lienKet);
    const [eTen,setETen] = useState('');

    const [showPass,setShowPass]=useState(false);

    const handleANChange = e=>{
        const sfile = e.target.files[0];
        if(sfile){
            const img = new Image();
            const reader = new FileReader();
            reader.onloadend = (event)=>{
                img.onload = ()=>{
                    const {width, height} = img;
                    if(width/height > 2/1 || width/height < 36/25){
                        setErrorAN('Vui lòng chọn hình ảnh (36:25 - 2:1)')
                        setPreviewAN(null)
                        setFileAN(null)
                    }else{
                        setErrorAN(null)
                        setPreviewAN(event.target.result)
                        setFileAN(sfile)
                    }
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(sfile);
        }else{
            e.target.value = null;
        }
    }

    const handleCheck = ()=>{
        if(ten.trim()==slide.lienKet && fileAN==null){
            alert('Không có thay đổi để lưu!')
            return;
        }
        let b=false;
        if(!ten.trim()){
            setETen('Chưa nhập liên kết!');
            setTen('');
            b=true;
        }
        if(b) return;
        setShowPass(true);
    }

    const handleSubmit= async ()=>{
        try {
            const formData = new FormData();
            formData.append('lienKet',ten);
            formData.append('hinhAnh',fileAN);
            formData.append('_method','PUT');
            const response = await axios.post('/api/superadmin/suaslide/'+slide.id,formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            alert(response.data.message);
            router.visit('/admin/quanlythongtinweb')
        } catch (error) {
            alert(error.response.data.message)
        }
    }

   

    return(
        <AdminLayout page='8' user={user} title='Sửa slide'>
            <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleSubmit}/>
            <div className="ThemSlide">
                <div className="head">
                    <div>
                        <h1>Sửa slide</h1>
                    </div>
                </div>
                <div className="body">
                    <div className="hinhAnh">
                        <div className="inputAN">
                            <label>Ảnh hiển thị size(16:9)</label>
                            <input ref={anhNen} type="file" accept="image/*" style={{display:'none'}} onChange={handleANChange}/>
                            <img src={previewAN || '/img/QuangCao/'+slide.hinhAnh} onClick={()=>anhNen.current.click()}/>
                            <label className="error">{errorAN}</label>
                        </div>
                        <div className="tenBlog">
                            <div className="tenChuong">
                                <div>
                                    <label>Liên kết:</label>
                                    <input type="text" value={ten} onChange={(e)=>{setTen(e.target.value);setETen('')}}/>
                                    <label className="error">{eTen}</label>
                                </div>
                            </div>
                        </div>
                        <div className="buttonSM">
                            <button onClick={() => window.history.back()}>Hủy</button>
                            <button onClick={handleCheck} >Lưu</button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}