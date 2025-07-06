import AuthorLayout from "../../Layouts/AuthorLayout";
import './ThemBlog.scss'
import { router } from "@inertiajs/react";
import Editor from '@/Components/Editor';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
export default function Truyen({user}){
    const anhNen = useRef()
    const [previewAN, setPreviewAN] = useState(null);
    const [fileAN,setFileAN] = useState(null);
    const [errorAN,setErrorAN] = useState(null);

    const [ten,setTen] = useState('');
    const [eTen,setETen] = useState('');
    const [noiDung,setNoiDung] = useState('');
    const [eNoiDung,setENoiDung] = useState('');

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
    const handleSubmit= async ()=>{
        let b=false;
        if(!fileAN){
            setErrorAN('Chưa chọn ảnh bìa!');
            b = true;
        }
        if(!ten.trim()){
            setETen('Chưa nhập tên blog!');
            setTen('');
            b=true;
        }
        if(!noiDung || noiDung=='<p></p>'){
            setENoiDung("Chưa viết nội dung blog!");
            b = true;
        }
        if(b) return;
        try {
            const formData = new FormData();
            formData.append('tieuDe',ten);
            formData.append('noiDung',noiDung);
            formData.append('hinhAnh',fileAN)
            const response = await axios.post('/api/author/themblog',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            alert(error.response.data.message)
        }
    }
    useEffect(()=>{setENoiDung('')},[noiDung])
    return(
        <AuthorLayout page='3' user={user} title={`Viết blog`}>
            <div className="ThemBlog">
                <div className="head">
                    <div>
                        <h1>Viết blog</h1>
                    </div>
                </div>
                <div className="body">
                    <div className="hinhAnh">
                        <div className="inputAN">
                            <label>Ảnh bìa size(16:9)</label>
                            <input ref={anhNen} type="file" accept="image/*" style={{display:'none'}} onChange={handleANChange}/>
                            <img src={previewAN || '/img/blog/d16_9.png'} onClick={()=>anhNen.current.click()}/>
                            <label className="error">{errorAN}</label>
                        </div>
                    </div>
                    <div className="tenBlog">
                        <div className="tenChuong">
                            <div>
                                <label>Tên blog</label>
                                <input type="text" value={ten} onChange={(e)=>{setTen(e.target.value);setETen('')}}/>
                                <label className="error">{eTen}</label>
                            </div>
                        </div>
                    </div>
                    <div className="noiDung">
                        <label>Nội dung</label>
                        <p className="error" style={{margin:'0'}}>{eNoiDung}</p>
                        <Editor onChange={setNoiDung} value={noiDung}/>
                    </div>
                    <div className="buttonSM">
                        <button onClick={() => window.history.back()}>Hủy</button>
                        <button onClick={handleSubmit} >Thêm</button>
                    </div>
                </div>
            </div>
        </AuthorLayout>
    )
}