import AuthorLayout from "../../Layouts/AuthorLayout";
import './ThemChuong.scss'
import { router } from "@inertiajs/react";
import Editor from '@/Components/Editor';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
export default function Truyen({user, truyen}){
    const [ten,setTen] = useState('');
    const [phi,setPhi] = useState(false);
    const [xu,setXu] = useState(0);
    const [noiDung,setNoiDung] = useState('');
    const [errorTen,setErrorTen] = useState('');
    const tenLabelRef = useRef(null);
    const [mrErrorTen,setMrErrorTen] = useState(0);
    const [errorNoiDung,setErrorNoiDung] = useState('');
    useEffect(() => {
        if (tenLabelRef.current) {
            const el = tenLabelRef.current;
            const style = window.getComputedStyle(el);
            const width = el.offsetWidth;
            const marginRight = parseFloat(style.marginRight);
            const total = width + marginRight;
            setMrErrorTen(total);
        }
    }, []);
    const handleChangePhi = (e)=>{
        setPhi(e.target.checked);
        if(e.target.checked==false)
            setXu(0)
    }
    const handleChangeXu = (e)=>{
        const raw = e.target.value;
        const num = parseInt(raw, 10);
        if (isNaN(num) || num < 0) {
            setXu(0);
        } else {
            setXu(num);
            e.target.value = num;
        }
    }
    const handleSubmit =  async ()=>{
        let b = false;
        if(!ten){
            setErrorTen('Chưa nhập tên chương!');
            b = true;
        }
        if(!noiDung || noiDung=='<p></p>'){
            setErrorNoiDung("Chưa viết nội dung chương!");
            b = true;
        }
        if(b) return;
        const formData = new FormData();
        formData.append('ten',ten);
        formData.append('gia',xu);
        formData.append('noiDung',noiDung);
        formData.append('soChuong',parseInt(truyen.soLuongChuong)+1);
        try {
            const response = await axios.post(
                `/api/author/themchuong/${truyen.id}`,
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
            if(error.response.data.errorSoChuong)
                alert(error.response.data.errorSoChuong);
            if(error.response.data.message)
                alert(error.response.data.message, ' :', error.response.data.error)
        }
    }
    useEffect(()=>{
        setErrorNoiDung('');
        console.log(noiDung);
    },[noiDung]);
    return(
        <AuthorLayout page='2' user={user} title={`Thêm chương truyện ${truyen.ten}`}>
            <div className="ThemChuong">
                <div className="head">
                    <div>
                        <h1>Thêm chương {parseInt(truyen.soLuongChuong)+1} truyện: {truyen.ten}</h1>
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
                                <input type="checkBox" onChange={handleChangePhi}/>
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
                    <div className="buttonSM">
                        <button onClick={() => window.history.back()}>Hủy</button>
                        <button onClick={handleSubmit} >Thêm</button>
                    </div>
                </div>
            </div>
        </AuthorLayout>
    )
}