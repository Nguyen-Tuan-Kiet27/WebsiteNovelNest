import './ThemTheLoai.scss';
import AdminLayout from '../../Layouts/AdminLayout';
import { useRef, useState } from 'react';
import axios from 'axios';
export default function ThemTheLoai({user}){

    const [name,setName] = useState('');
    const [preview,setPreview] = useState(null);
    const [file,setFile] = useState(null);
    const inputIMG = useRef();
    const [fileError,setFileError] = useState(null);
    const [nameError,setNameError] = useState(null); 

    const handleFileChange = (e)=>{
        const sfile = e.target.files[0];
        if(sfile){
            const img=new Image();
            const reader = new FileReader();
            reader.onloadend = (event)=>{
                img.onload = ()=>{
                    const { width, height } = img;
                    if (width !== height) {
                        setFileError("Vui lòng chọn hình ảnh vuống (1:1)!")
                        setPreview(null);
                        setFile(null);
                    }else{
                        setFile(sfile)
                        setFileError(null)
                        setPreview(event.target.result)
                    }
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(sfile)
        }else{
            setPreview(null);
            setFile(null);
        }
        e.target.value = null;
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        let b = false;
        if(!file){
            setFileError("Chưa chọn hình ảnh!")
            b=true;
        }
        if(!name){
            setNameError("Chưa nhập tên thể loại!")
            b=true;
        }
        if(b){
            return;
        }
        const formData = new FormData();
        formData.append('ten',name);
        formData.append('hinhAnh',file);
        try {
            const response = await axios.post(
                '/api/admin/themtheloai',
                formData,
                {
                     headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            alert(response.data.message);
            setFile(null);
            setName('');
            setPreview(null);
        } catch (error) {
            console.log(error.response.data.message)
            setNameError(error.response.data.message)
        }
    }

    return(
        <AdminLayout page='4' user={user}>
            <div className="themTheLoai">
                <div>
                    <h1>Thêm thể loại</h1>
                </div>
                <div>
                    <div>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className='inputHinhAnh'>
                                    <label>Chọn hình ảnh: </label>
                                    <div>
                                        <img src={preview} />
                                        <input ref={inputIMG} type="file" accept="image/*" onChange={handleFileChange} style={{display:'none'}}/>
                                        <div>
                                            <label>{fileError}</label>
                                            <button
                                                type="button"
                                                onClick={()=>inputIMG.current.click()}
                                            >
                                                Chọn ảnh
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='inputTen'>
                                    <label>Tên thể loại:</label>
                                    <input type="text" value={name} onChange={(e)=>{setName(e.target.value); setNameError(null)}} />
                                    <label>{nameError}</label>
                                </div>
                                <div className='buttonSubmit'>
                                    <button type='submit'>Thêm</button>
                                </div>

                            </form>
                        </div>
                        <div>
                            Danh sách thể loại.
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}