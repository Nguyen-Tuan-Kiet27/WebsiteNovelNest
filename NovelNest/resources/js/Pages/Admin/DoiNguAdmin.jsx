import AdminLayout from "../../Layouts/AdminLayout";
import './DoiNguAdmin.scss'
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import VerifyPass from "../../Components/VerifyPass"
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function QuanLyTruyen({user,admins}){
    const [showPass,setShowPass] = useState(false)
    const [eyePass, setEyePass] = useState(false);

    const [tenDangNhap,setTenDangNhap]=useState('');
    const [tenHienThi,setTenHienThi]=useState('');
    const [pass,setPass] = useState('');

    const [eTDN,setETDN]=useState('');
    const [eTHT,setETHT]=useState('');
    const [eP,setEP]=useState('');

    const [sua,setSua] = useState(false);
    const [tenDangNhapTerm,setTenDangNhapTerm] = useState('');
    const [tenHienThiTerm,setTenHienThiTerm] = useState('');
    const [passTerm,setPassTerm] = useState('');
    const [idAdmin,setIdAdmin] = useState('');



    const handleSubmit = ()=>{
        let b = false;
        const coDauTiengViet = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
        const coChuVaSo = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
        if(sua && pass.trim()==passTerm && tenDangNhap.trim()==tenDangNhapTerm && tenHienThi.trim() == tenHienThiTerm){
            setTenDangNhap(tenDangNhap.trim())
            setTenHienThi(tenHienThi.trim())
            setPass(pass.trim())
            alert('Không có thay đổi nào để lưu!')
            return;
        }
        if(tenDangNhap.trim().length<8){
            setETDN('Phải có ít nhất 8 ký tự!')
            setTenDangNhap(tenDangNhap.trim())
            b=true;
        }
        if(coDauTiengViet.test(tenDangNhap)){
            setETDN('Phải không có dấu tiếng Việt!')
            setTenDangNhap(tenDangNhap.trim())
            b=true
        }
        if(tenHienThi.trim().length<8){
            setETHT('Phải có ít nhất 8 ký tự!')
            setTenHienThi(tenHienThi.trim())
            b = true;
        }
        if(coDauTiengViet.test(pass)){
            setEP('Phải không có dấu tiếng Việt!')
            setPass(pass.trim())
            b=true
        }
        if(!coChuVaSo.test(pass)){
            setEP('Phải có chữ và số!')
            setPass(pass.trim())
            b=true;
        }
        if(pass.trim().length<8){
            setEP('Phải có ít nhất 8 ký tự!')
            setPass(pass.trim());
            b=true;
        }
        if(b) return;
        setShowPass(true)
    }

    const handleSua = (i)=>{
        setSua(true);
        setEP('');
        setETDN('');
        setETHT('');
        setPass(i.matKhau);
        setTenDangNhap(i.tenDangNhap);
        setTenHienThi(i.ten);
        setPassTerm(i.matKhau);
        setTenDangNhapTerm(i.tenDangNhap);
        setTenHienThiTerm(i.ten);
        setIdAdmin(i.id);
    }

    const handleHuy = ()=>{
        setSua(false);
        setEP('');
        setETDN('');
        setETHT('');
        setPass('');
        setTenDangNhap('');
        setTenHienThi('');
    }

    const handleApi = async()=>{
        const formData = new FormData();
        formData.append('tenDangNhap',tenDangNhap.trim());
        formData.append('tenHienThi',tenHienThi.trim());
        formData.append('matKhau',pass.trim());
        if(sua)
            formData.append('_method','PUT');
        try {
            let response;
            if(sua){
                response = await axios.post(`/api/superadmin/suaadmin/${idAdmin}`,formData,{});
            }else{
                response = await axios.post('/api/superadmin/themadmin',formData,{});
            }
            alert(response.data.message)
            window.location.reload();
        } catch (error) {
            if(error.response.data.eTDN){
                setETDN(error.response.data.eTDN);
            }
            if(error.response.data.message){
                alert(error.response.data.message);
                console.log(error.response.data.error)
            }
        }
    }
    return(
        <AdminLayout page='7' user={user} title='Đội ngũ admin'>
            <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleApi}/>
            <div className="DoiNguAdmin">
                <div>
                    <h1>Đội ngũ admin</h1>
                </div>
                <div className="main">
                    <div className="them">
                        <div className="form">
                            <h2>Thêm Admin</h2>
                            <div>
                                <label>Tên đăng nhập:</label>
                                <label className="error">{eTDN}</label>
                                <input type="text" value={tenDangNhap} onChange={(e)=>{setTenDangNhap(e.target.value);setETDN('')}}/>
                            </div>
                            <div>
                                <label>Tên hiển thị:</label>
                                <label className="error">{eTHT}</label>
                                <input type="text" value={tenHienThi} onChange={e=>{setTenHienThi(e.target.value);setETHT('')}}/>
                            </div>
                            <div>
                                <label>Mật khẩu:</label>
                                <label className="error">{eP}</label>
                                <div>
                                    <input type={eyePass?'text':'password'} value={pass} onChange={e=>{setPass(e.target.value);setEP('')}}/>
                                    <button onClick={()=>setEyePass(!eyePass)}>{eyePass?<FaEye/>:<FaEyeSlash/>}</button>
                                </div>
                            </div>
                            <div className="buttonF">
                                <button style={sua?{}:{display:'none'}} onClick={handleHuy}>Hủy</button>
                                <button onClick={handleSubmit}>{sua?'Lưu':'Tạo'}</button>
                            </div>
                        </div>
                    </div>
                    <div className="danhSach">
                        <h2>Danh Sách Admin</h2>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th className="id" >
                                            ID
                                        </th>
                                        <th className="tenDangNhap">
                                            Tên đăng nhập
                                        </th>
                                        <th className="tenHienThi">
                                            Tên hiển thị
                                        </th>
                                        <th className="hanhDong">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>                                
                            </table>
                            <div>
                                <table>
                                    <tbody>
                                        {admins.map((i)=>(
                                            <tr key={i.id}>
                                                <td className="id" >
                                                    {i.id}
                                                </td>
                                                <td className="tenDangNhap">
                                                    {i.tenDangNhap}
                                                </td>
                                                <td className="tenHienThi">
                                                    {i.ten}
                                                </td>
                                                <td className="hanhDong">
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