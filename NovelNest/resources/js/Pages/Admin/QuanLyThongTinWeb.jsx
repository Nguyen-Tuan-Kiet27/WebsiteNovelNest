import { useEffect, useState } from "react";
import AdminLayout from "../../Layouts/AdminLayout";
import './QuanLyThongTinWeb.scss';
import VerifyPass from  '../../Components/VerifyPass';
import Editor from '../../Components/Editor';
import axios from "axios";
import { router } from "@inertiajs/react";

export default function({user,dknd,dktg,eml,fb,yt,slides}){
    const [showPass,setShowPass] = useState(false)
    const [email,setEmail]=useState('');
    const [youtube,setYoutube]=useState('');
    const [facebook,setFacebook] = useState('')
    const [dieuKhoanND,setDieuKhoanND]=useState('')
    const [dieuKhoanTG,setDieuKhoanTG]=useState('')
    const [value,setValue]=useState(null);

    const resets = ()=>{
        setEmail(eml.giaTri);
        setFacebook(fb.giaTri);
        setYoutube(yt.giaTri);
        setDieuKhoanND(dknd.giaTri)
        setDieuKhoanTG(dktg.giaTri)
        setValue(null);
    }

    const handleChangeLink = (e,v2)=>{
        if(value == null || value.khoa!=e.khoa){
            resets();
            console.log(e)
            setValue(e);
        }else{
            if(value.giaTri == v2){
                alert('Không có thay đổi để lưu!')
                resets();
                return;
            }
            setValue(prev=>({...prev,giaTri:v2}))
            setShowPass(true);
        }
    }

    const handleOnOk = async ()=>{
        try {
            const response = await axios.put('/api/superadmin/suathongtin',{thongTin:value});
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message);
            console.error(error.response.data.error);
        } finally{
            window.location.reload();
        }
    }

    const [slideID,setSlideID] = useState(0);
    const [trangThaiSlide,setTrangThaiSlide] = useState(0);
    const [showPassS, setShowPassS] = useState(false);

    const handleSetSlide = (id,trangThai)=>{
        setSlideID(id);
        setTrangThaiSlide(Math.abs(trangThai-1));
        setShowPassS(true);
    }

    const handleSuaSlide = async ()=>{
        try {
            const response = await axios.put(`/api/superadmin/suatrangthaislide/${slideID}`,{trangThai:trangThaiSlide})
            alert(response.data.message)
            window.location.reload();
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    const [showPassD, setShowPassD] = useState(false);

    const handleSetDSlide = (id)=>{
        setSlideID(id);
        setShowPassD(true);
    }

    const haldeDSlide = async ()=>{
        try {
            const response = await axios.delete(`/api/superadmin/xoaslide/${slideID}`)
            alert(response.data.message)
            window.location.reload();
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    useEffect(()=>{
        resets();
    },[]);
    return(
        <AdminLayout page={8} title='Quản lý thông tin trang web' user={user}>
            <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleOnOk}/>
            <VerifyPass isShow={showPassS} setIsShow={setShowPassS} onOk={handleSuaSlide}/>
            <VerifyPass isShow={showPassD} setIsShow={setShowPassD} onOk={haldeDSlide}/>
            <div className="QuanLyThongTinWeb">
                <div className="main">
                    <div className="head">
                        <h1>Quản lý thông tin trang web</h1>
                    </div>
                    <div className="body">
                        <div className="link">
                            <h3>Liên kết:</h3>
                            <div>
                                <label>Liên kết Facebook:</label>
                                <div>
                                    <input type="text" disabled={value?.khoa != fb.khoa} value={facebook} onChange={e=>setFacebook(e.target.value)}/>
                                    <button onClick={()=>handleChangeLink(fb,facebook)}>{value?.khoa == fb.khoa?'Lưu':'Sửa'}</button>
                                    <button style={value?.khoa != fb.khoa?{display:'none'}:{}} onClick={resets}>Hủy</button>
                                </div>
                            </div>
                            <div>
                                <label>Liên kết Youtube:</label>
                                <div>
                                    <input type="text" disabled={value?.khoa != yt.khoa} value={youtube} onChange={e=>setYoutube(e.target.value)}/>
                                    <button onClick={()=>handleChangeLink(yt,youtube)}>{value?.khoa == yt.khoa?'Lưu':'Sửa'}</button>
                                    <button style={value?.khoa != yt.khoa?{display:'none'}:{}} onClick={resets}>Hủy</button>
                                </div>
                            </div>
                            <div>
                                <label>Email:</label>
                                <div>
                                    <input type="text" disabled={value?.khoa != eml.khoa} value={email} onChange={e=>setEmail(e.target.value)}/>
                                    <button onClick={()=>handleChangeLink(eml,email)}>{value?.khoa == eml.khoa?'Lưu':'Sửa'}</button>
                                    <button style={value?.khoa != eml.khoa?{display:'none'}:{}} onClick={resets}>Hủy</button>
                                </div>
                            </div>
                        </div>
                        <div className="baner">
                            <h3>Slider:</h3>
                            <div className="bts">
                                <button><a href="/admin/themslide">+ Tạo slide</a></button>
                            </div>
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="hinhAnh">Hình ảnh</th>
                                            <th className="lienKet">Liên kết</th>
                                            <th className="trangThai">Trạng thái</th>
                                            <th className="hanhDong">Hành động</th>
                                        </tr>
                                    </thead>
                                </table>
                                <div className="tbody">
                                    <table>
                                        <tbody>
                                            {slides.map((i)=>(
                                                <tr key={i.id} style={{backgroundColor:i.trangThai==1?'rgba(48, 217, 62, 0.68)':'rgba(255, 1, 1, 0.41)'}}>
                                                    <td className="hinhAnh"><img src={`/img/quangCao/${i.hinhAnh}`} /></td>
                                                    <td className="lienKet"><a href={i.lienKet}>{i.lienKet}</a></td>
                                                    <td className="trangThai">{i.trangThai==1?'Hiển thị':'Đã khóa'}</td>
                                                    <td className="hanhDong">
                                                        <div>
                                                            <button className="suaB" onClick={()=>router.visit(`/admin/suaslide/${i.id}`)}>
                                                                Sửa
                                                            </button>
                                                            <button className="khoaB" onClick={()=>handleSetSlide(i.id,i.trangThai)}>
                                                                {i.trangThai==1?'Khóa':'Hiển thị'}
                                                            </button>
                                                            <button className="xoaB" onClick={()=>handleSetDSlide(i.id)}>
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>    
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="dieuKhoan">
                            <h3>Điều khoản - Chính sách:</h3>
                            <div >
                                <h4>Điều khoản - Chính sách người dùng:</h4>
                                {console.log(dknd)}
                                <div dangerouslySetInnerHTML={{__html: dknd.giaTri}}/>
                                <button onClick={()=>handleChangeLink(dknd,dieuKhoanND)}>Sửa Điều khoản - Chính sách người dùng</button>
                            </div>
                            <div >
                                <h4>Điều khoản - Chính sách tác giả:</h4>
                                <div dangerouslySetInnerHTML={{__html: dktg.giaTri}}/>
                                <button onClick={()=>handleChangeLink(dktg,dieuKhoanTG)}>Sửa Điều khoản - Chính sách tác giả</button>
                            </div>
                        </div>
                    </div>
                </div>
                {   (value?.khoa == dknd.khoa || value?.khoa == dktg.khoa) && 
                    <div className="SuaDieuKhoan">
                        <div className="main">
                            <h4>Sửa Điều khoản - Chính sách {value.khoa == dknd.khoa?'người dùng':'tác giả'}</h4>
                            <Editor value={value.khoa == dknd.khoa?dieuKhoanND:dieuKhoanTG} onChange={value.khoa == dknd.khoa?setDieuKhoanND:setDieuKhoanTG}/>
                            <div className="blh">
                                <button onClick={resets}>Hủy</button>
                                <button onClick={()=>handleChangeLink(value.khoa == dknd.khoa?dknd:dktg,value.khoa == dknd.khoa?dieuKhoanND:dieuKhoanTG)}>Lưu</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </AdminLayout>
    )
}