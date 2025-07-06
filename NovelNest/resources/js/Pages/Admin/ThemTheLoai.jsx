import './ThemTheLoai.scss';
import AdminLayout from '../../Layouts/AdminLayout';
import { useRef, useState } from 'react';
import axios from 'axios';
import VerifyPass from "../../Components/VerifyPass"
export default function ThemTheLoai({user,theLoais}){

    const [name,setName] = useState('');
    const [preview,setPreview] = useState(null);
    const [file,setFile] = useState(null);
    const inputIMG = useRef();
    const [fileError,setFileError] = useState(null);
    const [nameError,setNameError] = useState(null); 
    const [loading,setLoading] = useState(false);
    const [idTheLoai,setIDTheLoai] = useState(null);

    const [showPass,setShowPass] = useState(false)

    const [sua,setSua] = useState(false);
    const [nameTerm, setNameTerm] = useState('');

    const handleFileChange = (e)=>{
        const sfile = e.target.files[0];
        if(sfile){
            const img=new Image();
            const reader = new FileReader();
            reader.onloadend = (event)=>{
                img.onload = ()=>{
                    const { width, height } = img;
                    if (width !== height) {
                        setFileError("Vui lòng chọn hình ảnh vuông (1:1)!")
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

    const handleSubmit = async ()=>{
        if(loading)
            return;
        setLoading(true)
        if(sua && file==null && name==nameTerm){
            alert('Không có gì để cập nhật!');
            setLoading(false)
            return;
        }
        let b = false;
        if(!file && !sua){
            setFileError("Chưa chọn hình ảnh!")
            b=true;
        }
        if(!name.trim()){
            setNameError("Chưa nhập tên thể loại!")
            setName('')
            b=true;
        }
        if(b){
            return;
        }
        const formData = new FormData();
        formData.append('ten',name);
        formData.append('hinhAnh',file);
        if(sua)
            formData.append('_method','PUT')
        try {
            let response;
            if(!sua){
                response = await axios.post(
                    '/api/admin/themtheloai',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            }else{
                response = await axios.post(
                    `/api/admin/suatheloai/${idTheLoai}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            }
            alert(response.data.message);
            setFile(null);
            setName('');
            setPreview(null);
            window.location.reload();
        } catch (error) {
            console.log(error.response.data.message)
            setNameError(error.response.data.message)
        } finally{
            setLoading(false)
        }
    }

    const handleSua=(i)=>{
        setSua(true);
        setIDTheLoai(i.id)
        setPreview(`/img/theLoai/${i.hinhAnh}`)
        setFile(null)
        setName(i.ten)
        setNameTerm(i.ten)
    }
    const handleHuy=()=>{
        setSua(false);
        setIDTheLoai(null)
        setPreview(null)
        setFile(null)
        setName('')
        setNameTerm('')
    }

    return(
        <AdminLayout page='4' user={user} title='Quản lý thể loại'>
            <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleSubmit}/>
            <div className="themTheLoai">
                <div>
                    <h1>Quản lý thể loại</h1>
                </div>
                <div>
                    <div>
                        <div className='form'>
                            <form onSubmit={(e)=>{e.preventDefault();setShowPass(true);}}>
                                <div className='inputHinhAnh'>
                                    <label>Chọn hình ảnh (1:1): </label>
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
                                    <button disabled={loading} type='button' onClick={handleHuy} style={sua?{marginRight:'20%'}:{display:'none'}}>Hủy</button>
                                    <button disabled={loading} type='submit'>{sua?'Lưu':'Thêm'}</button>
                                </div>

                            </form>
                        </div>
                        <div className='danhSach'>
                            <table>
                                <thead>
                                    <tr>
                                        <th className='id'>
                                            ID
                                        </th>
                                        <th className='ten'>
                                            Tên
                                        </th>
                                        <th className='ten'>
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                            </table>
                            <div>
                                <table>
                                    <tbody>
                                        {theLoais.map((i) => (
                                            <tr key={i.id}>
                                                <td className='id'>
                                                    {i.id}
                                                </td>
                                                <td className='ten'>
                                                    {i.ten}
                                                </td>
                                                <td className='hanhDong'>
                                                    <button onClick={()=>handleSua(i)}>Sửa</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}