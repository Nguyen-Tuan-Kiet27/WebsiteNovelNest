import { useEffect, useRef, useState } from "react";
import AuthorLayout from "../../Layouts/AuthorLayout";
import './SuaTruyen.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons';
import { router } from "@inertiajs/react";
import axios from "axios";
export default function SuaTruyen({user,theLoais,truyen}){
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
    const [trangThai,setTrangThai] = useState(null);
    const [showTrangThai,setShowTrangThai]=useState(false);

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

    const isChanged = () => {
        const tenChanged = ten.trim() != truyen.ten;
        const theLoaiChanged = idTheLoai != truyen.id_TheLoai;
        const gioiThieuChanged = gioiThieu.trim() != truyen.gioiThieu;
        const trangThaiChanged = trangThai!=truyen.trangThai;
        const abChanged = fileAB !== null; // ảnh bìa mới được chọn
        const anChanged = fileAN !== null; // ảnh nền mới được chọn
        console.log(ten)
        console.log(theLoai)
        console.log(gioiThieu)
        console.log(trangThai)
        return tenChanged || theLoaiChanged || gioiThieuChanged || abChanged || anChanged || trangThaiChanged;
    };
    const handleSubmit = async ()=>{
        if(!isChanged()){
            alert("Bạn chưa thay đổi gì để lưu.");
            return;
        }
        let b = false;
        if(!ten.trim()){
            setErrorTen('Chưa nhập tên truyện!');
            setTen('');
            b=true;
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
        formData.append('trangThai',trangThai)
        formData.append('_method', 'PUT');
        try {
            const response = await axios.post(
                `/api/author/suatruyen/${truyen.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            alert(response.data.message);
            router.visit('/author/truyen')
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    useEffect(()=>{
        setTheLoai(theLoais.find(tl => tl.id === truyen.id_TheLoai)?.ten);
        setIDTheLoai(truyen.id_TheLoai)
        setTen(truyen.ten);
        setGioiThieu(truyen.gioiThieu)
        setTrangThai(truyen.trangThai)
    },[])

    return(
        <AuthorLayout page='2' user={user} title={`Sửa truyện_${truyen.ten}`}>
            <div className="SuaTruyen">
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
                            <img src={previewAB ||`/img/truyen/hinhAnh/${truyen.hinhAnh}`} onClick={()=>anhBia.current.click()}/>
                            <label className="error">{errorAB}</label>
                        </div>
                        <div className="inputTen">
                            <label>Tên truyện</label>
                            <input type="text" value={ten} onChange={e=>{setTen(e.target.value); setErrorTen(null)}}/>
                            <label className="error">{errorTen}</label>
                            <label style={{marginTop:'20px'}}>Trạng thái</label>
                            <div className="trangThai">
                                <label onClick={()=>{setShowTrangThai(!showTrangThai);console.log(showTrangThai)}}>
                                    {trangThai==1?'Hoạt động':'Khóa'}
                                    <FontAwesomeIcon className="icon" style={{transform:showTrangThai?'rotate(0deg)':'rotate(-90deg)'}} icon={faCaretDown}/>
                                </label>
                                <div style={{display:showTrangThai?'flex':'none'}}>
                                    <label onClick={()=>{setTrangThai(1);setShowTrangThai(false)}}>Hoạt động</label>
                                    <label onClick={()=>{setTrangThai(2);setShowTrangThai(false)}}>Khóa</label>
                                </div>
                            </div>
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
                                <img src={previewAN || `/img/truyen/hinhNen/${truyen.hinhNen}`} onClick={()=>anhNen.current.click()}/>
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
                        <button onClick={handleSubmit} >Sửa</button>
                    </div>
                </div>
            </div>
        </AuthorLayout>
    )
}