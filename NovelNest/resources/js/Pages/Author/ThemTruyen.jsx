import { useEffect, useRef, useState } from "react";
import AuthorLayout from "../../Layouts/AuthorLayout";
import './ThemTruyen.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons';
import { router } from "@inertiajs/react";
import axios from "axios";
export default function ThemTruyen({user,theLoais}){
    const anhBia = useRef();
    const anhNen = useRef()
    const [previewAB, setPreviewAB] = useState(null);
    const [previewAN, setPreviewAN] = useState(null);
    const [fileAB,setFileAB] = useState(null);
    const [fileAN,setFileAN] = useState(null);
    const [errorAB,setErrorAB] = useState(null);
    const [errorAN,setErrorAN] = useState(null);
    const [errorTen,setErrorTen] = useState(null);
    const [errorTL,setErrorTL] = useState(null);
    const [errorGT,setErrorGT] = useState(null);
    const [ten,setTen] = useState('');
    const [theLoai,setTheLoai] = useState('');
    const [idTheLoai,setIDTheLoai] = useState(null);
    const [showTheLoai,setShowTheLoai] = useState(false);
    const [gioiThieu,setGioiThieu] = useState('');

    const handleABChange = (e)=>{
        const sfile = e.target.files[0];
        if(sfile){
            const img = new Image();
            const reader = new FileReader();
            reader.onloadend = event=>{
                img.onload = ()=>{
                    const {width, height} = img;
                    if(width/height < 3/6 || width/height >  73/100){
                        setErrorAB("Vui lòng chọn hình ảnh (3:5 - 73:100)!")
                        setPreviewAB(null)
                        setFileAB(null)
                    }else{
                        setFileAB(sfile)
                        setErrorAB(null)
                        setPreviewAB(event.target.result)
                    }
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(sfile)
        }else{
            setPreviewAB(null);
            setFileAB(null);
        }
        e.target.value = null;
    }

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

    const handleSubmit = async ()=>{
        let b = false;
        if(!fileAB){
            setErrorAB('Chưa chọn ảnh bìa!');
            b = true;
        }
        if(!fileAN){
            setErrorAN('Chưa chọn ảnh nền!');
            b = true;
        }
        if(!ten.trim()){
            setErrorTen('Chưa nhập tên truyện!');
            setTen('');
            b=true;
        }
        if(!idTheLoai || !theLoai){
            setErrorTL('Chưa chọn thể loại!');
            b=true
        }
        if(!gioiThieu.trim()){
            setErrorGT('Chưa viết giới thiệu truyện!');
            setGioiThieu('');
            b=true;
        }
        if(b){
            return;
        }
        const formData = new FormData();
        formData.append('ten',ten);
        formData.append('id_TheLoai',idTheLoai)
        formData.append('gioiThieu',gioiThieu)
        formData.append('hinhAnh',fileAB)
        formData.append('hinhNen',fileAN)
        try {
            const response = await axios.post(
                '/api/author/themtruyen',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            alert(response.data.message);
            setTen('');
            setTheLoai('');
            setIDTheLoai(null);
            setGioiThieu('');
            setFileAB(null);
            setPreviewAB(null);
            setFileAN(null);
            setPreviewAN(null);
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    return(
        <AuthorLayout page='2' user={user} title='Thêm truyện mới'>
            <div className="ThemTruyen">
                <div className="head">
                        <h1>Thêm truyện</h1>
                </div>
                <div className="body">
                    <div>
                        <div className="inputAnhBia">
                            <label>
                                {'Ảnh bìa size(2:3)'}
                            </label>
                            <input ref={anhBia} type="file" accept="image/*" style={{display:'none'}} onChange={handleABChange}/>
                            <img src={previewAB || '/img/truyen/hinhAnh/d2_3.png'} onClick={()=>anhBia.current.click()}/>
                            <label className="error">{errorAB}</label>
                        </div>
                        <div className="inputTen">
                            <label>Tên truyện</label>
                            <input type="text" value={ten} onChange={e=>{setTen(e.target.value); setErrorTen(null)}}/>
                            <label className="error">{errorTen}</label>
                        </div>
                        <div className="inputTLaAN">
                            <div className="inputTL"
                                onClick={()=>setShowTheLoai(!showTheLoai)}
                            >
                                <label>Thể Loại</label>
                                <div className="dropTheLoai">
                                    <label>{theLoai}</label> 
                                    <FontAwesomeIcon className="icon" style={{transform:showTheLoai?'rotate(0deg)':'rotate(-90deg)'}} icon={faCaretDown} />
                                </div>
                                <label className="error">{errorTL}</label>
                                <div className="listTheLoai" style={{display:showTheLoai?'block':'none'}}>
                                    {theLoais.map((tl,i)=>(
                                        <div
                                            key={i}
                                            onClick={()=>{setIDTheLoai(tl.id);setErrorTL(null);setTheLoai(tl.ten)}}
                                        >
                                            {tl.ten}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="inputAN">
                                <label>Ảnh nền size(16:9)</label>
                                <input ref={anhNen} type="file" accept="image/*" style={{display:'none'}} onChange={handleANChange}/>
                                <img src={previewAN || '/img/truyen/hinhNen/d16_9.png'} onClick={()=>anhNen.current.click()}/>
                                <label className="error">{errorAN}</label>
                            </div>
                        </div>
                    </div>
                    <div className="inputGioiThieu">
                        <label>Giới thiệu truyện</label>
                        <textarea value={gioiThieu} onChange={e=>{setGioiThieu(e.target.value);setErrorGT(null)}} spellCheck={false}></textarea>
                        <label className="error">{errorGT}</label>
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