import AuthorLayout from "../../Layouts/AuthorLayout";
import './SuaChuong.scss'
import { router } from "@inertiajs/react";
import Editor from '@/Components/Editor';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
export default function SuaChuong({user, truyen, chuong}){
    const [ten,setTen] = useState('');
    const [phi,setPhi] = useState(false);
    const [xu,setXu] = useState(0);
    const [noiDung,setNoiDung] = useState('');
    const [errorTen,setErrorTen] = useState('');
    const tenLabelRef = useRef(null);
    const [mrErrorTen,setMrErrorTen] = useState(0);
    const [errorNoiDung,setErrorNoiDung] = useState('');
    const [tomTat,setTomTat] = useState('');
    const [errorTomTat,setErrorTomTat] = useState('');
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef(null);
    const [end,setEnd] = useState(false);
    const refCheckBox = useRef(null);
    const [rawXu, setRawXu] = useState(100);
    useEffect(() => {
        if (tenLabelRef.current) {
            const el = tenLabelRef.current;
            const style = window.getComputedStyle(el);
            const width = el.offsetWidth;
            const marginRight = parseFloat(style.marginRight);
            const total = width + marginRight;
            setMrErrorTen(total);
        }
        setTen(chuong.ten)
        setNoiDung(chuong.noiDung)
        setTomTat(chuong.tomTat)
        if(chuong.gia > 0){
            setXu(chuong.gia)
            setRawXu(chuong.gia)
            setPhi(true)
        }
    }, []);

    useEffect(()=>{
        refCheckBox.current.checked = phi;
    },[phi])

    const handleChangePhi = (e)=>{
        setPhi(e.target.checked);
        if(e.target.checked==false)
            setXu(0)
        else{
            setXu(100);
            setRawXu(100);
        }
    }
    const handleChangeXu = (e)=>{
        setRawXu(e.target.value);
    }
    const handleBlurXu = ()=>{
            const num = parseInt(rawXu, 10);
        if (isNaN(num) || num < 100) {
            setXu(100);
            setRawXu("100");
        } else {
            setXu(num);
        }
    }
    const handleTomTat = async ()=>{
        setLoading(true);
        try {
            const response = await axios.post(
                '/api/tomtat',{
                    text: noiDung,
                }
            );
            alert('Đã tóm tắt nội dung chương!');
            setTomTat(response.data.summary);
        } catch (error) {
            alert('Có lỗi không xác định, hãy kiểm tra lại nội dung đã được tóm tắt!')
            setTomTat(error.response.data.summary);
        }
        setLoading(false);
    }
    const handleSubmit =  async ()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'   // cuộn mượt; bỏ dòng này nếu muốn cuộn ngay lập tức
        });
        if(!isChanged()){
            alert('Không có thay đổi để lưu!')
            return;
        }
        let b = false;
        if(!ten){
            setErrorTen('Chưa nhập tên chương!');
            b = true;
        }
        if(!noiDung || noiDung=='<p></p>'){
            setErrorNoiDung("Chưa viết nội dung chương!");
            b = true;
        }
        if(!tomTat){
            setErrorTomTat("Chưa viết tóm tắt nội dung chương!");
            b = true;
        }
        if(b) return;
        const formData = new FormData();
        formData.append('ten',ten);
        formData.append('gia',xu);
        formData.append('noiDung',noiDung);
        formData.append('tomTat',tomTat);
        formData.append('_method', 'PUT');
        try {
            const response = await axios.post(
                `/api/author/suachuong/${chuong.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            alert(response.data.message);
            router.visit(`/author/truyen/${truyen.id}`)
        } catch (error) {
            if(error.response.data.errorTen)
                alert(error.response.data.errorTen);
            if(error.response.data.message)
                alert(error.response.data.message, ' :', error.response.data.error)
        }
    }
    useEffect(()=>{
        setErrorNoiDung('');
    },[noiDung]);
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
        textarea.style.height = 'auto'; // Reset trước
        textarea.style.height = `${textarea.scrollHeight}px`; // Resize theo nội dung mới
        }
    }, [tomTat]);

    const isChanged = ()=>{
         const tenChanged = ten.trim() != chuong.ten?.trim();
        const noiDungChanged = noiDung.trim() != chuong.noiDung?.trim();
        const tomTatChanged = tomTat.trim() != chuong.tomTat?.trim();
        const xuChanged = parseInt(xu) != parseInt(chuong.gia || 0);
        return tenChanged || noiDungChanged || tomTatChanged || xuChanged;
    }
    return(
        <AuthorLayout page='2' user={user} title={`Sửa chương ${chuong.soChuong} truyện ${truyen.ten}`}>
            <div className="suaChuong">
                <div className="head">
                    <div>
                        <h1>Sửa chương {chuong.soChuong} truyện: {truyen.ten}</h1>
                    </div>
                </div>
                <div className="body">
                    <div>
                        <div className="tenChuong">
                            <div>
                                <label ref={tenLabelRef}>Tên chương</label>
                                <input type="text" value={ten} onChange={e=>{setTen(e.target.value);setErrorTen('');}}/>
                            </div>
                            <label className="error" style={{marginLeft:`${mrErrorTen}px`}}>{errorTen}</label>
                        </div>
                        <div className="gia">
                            <div>
                                <input ref={refCheckBox} type="checkBox" onChange={handleChangePhi}/>
                                <label>Có phí</label>
                            </div>
                            <div style={{display:phi?'flex':'none'}}>
                                <input type="number" value={xu} onChange={handleChangeXu}/>
                                <label>xu</label>
                            </div>
                            
                        </div>
                    </div>
                    <div className="noiDung">
                        <label>Nội dung</label>
                        <Editor onChange={setNoiDung} value={noiDung}/>
                    </div>
                    <label className="error" style={{marginTop:'10px'}}>{errorNoiDung}</label>
                    <div className="tomTat">
                        <div>
                            <label>Tóm tắt chương</label>
                            {
                                user.premium && <button onClick={handleTomTat} disabled={loading}>AI {loading&&'đang'} tóm tắt</button>
                            }
                        </div>
                        <textarea 
                            ref={textareaRef}
                            value={tomTat} 
                            onChange={(e)=>{setTomTat(e.target.value);setErrorTomTat('')}}
                            spellCheck={false}
                        ></textarea>
                        <label className="error" style={{marginTop:'10px'}}>{errorTomTat}</label>
                    </div>
                    <div className="end">
                        <input type="checkBox" checked={chuong.gia==null?true:false}/>
                        <label style={{marginLeft:'10px',color:'green'}}>Chương cuối, hoàn thành truyện!</label>
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