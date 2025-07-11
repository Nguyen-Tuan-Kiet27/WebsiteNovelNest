import AdminLayout from "../../Layouts/AdminLayout";
import './QuanLyNguoiDung.scss'
import { useEffect, useState } from "react";
import { router,usePage } from "@inertiajs/react";
import VerifyPass from "../../Components/VerifyPass";
import LyDo from "../../Components/LyDo";
import axios from "axios";
export default function QuanLyTruyen({user,nguoiDungs}){
    console.log(nguoiDungs)
    const {url} = usePage();
    const queryString = url.split('?')[1]; // Lấy phần query string sau dấu ?
    const query = Object.fromEntries(new URLSearchParams(queryString));
    const [popupTheLoai,setPupopTheLoai] = useState(false);
    const [sort,setsort] = useState('macdinh');
    const [searchText,setSearchText] = useState('');

    const [showPass,setShowPass] = useState(false);
    const [idAction,setIdAction] = useState(null);
    const [lyDo,setLyDo] = useState('');
    const [trangThai,setTrangThai] = useState(0)

    const [showLyDo,setShowLyDo] = useState(false)

    useEffect(()=>{
       setsort(query.sort || 'macdinh')
       setSearchText(query.searchText || '')
    },[]);

    const handleSearch = ()=>{
        if(searchText.trim()!=query.searchText)
            router.visit(`/admin/quanlynguoidung?sort=${sort}&searchText=${searchText.trim()}`)
    }
    const handleAction=(id,trangThai,e)=>{
        e.stopPropagation();
        setIdAction(id);
        setTrangThai(Math.abs(trangThai-1))
        if(trangThai==0){
            setShowPass(true);
            setLyDo('');
        }else{
            setShowLyDo(true);
        }
    }
    const handleOkPass = async ()=>{
        try {
            const response = await axios.put(`/api/admin/changenguoidung/${idAction}`,{trangThai:trangThai,lyDo:lyDo});
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message)
        } finally{
            window.location.reload();
        }
    }
    return(
        <AdminLayout page='2' user={user} title='Quản lý truyện'>
            <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleOkPass}/>
            <LyDo isShow={showLyDo} setIsShow={setShowLyDo} onOk={(e)=>{setShowPass(true);setLyDo(e)}}/>
            <div className="quanLyTruyen">
                <div>
                    <h1>Quản lý người dùng</h1>
                    <div>
                        <div
                            onClick={()=>setPupopTheLoai(!popupTheLoai)}
                        >{sort=='dutang'?'Số dư tăng':sort=='dugiam'?'Số dư giảm':'Mặc định'}
                            <div 
                                style={popupTheLoai?{display:'flex'}:{display:'none'}}
                                onClick={(e)=>{ e.stopPropagation();}}
                            >
                                <button
                                    onClick={()=>{router.visit(`/admin/quanlynguoidung?searchText=${query.searchText || ''}`)}}
                                    style={sort=='macdinh'?{backgroundColor:'greenyellow'}:{}}
                                >
                                    Mặc định
                                </button>
                                <button
                                    onClick={()=>{router.visit(`/admin/quanlynguoidung?searchText=${query.searchText || ''}&sort=dutang`)}}
                                    style={sort=='dutang'?{backgroundColor:'greenyellow'}:{}}
                                >
                                    Số dư tăng
                                </button>
                                <button
                                    onClick={()=>{router.visit(`/admin/quanlynguoidung?searchText=${query.searchText || ''}&sort=dugiam`)}}
                                    style={sort=='dugiam'?{backgroundColor:'greenyellow'}:{}}
                                >
                                    Số dư giảm
                                </button>

                            </div>
                        </div>
                        <input placeholder="Tìm kiếm" 
                                value={searchText} 
                                onChange={(e)=>setSearchText(e.target.value)} 
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                    handleSearch();
                                    }
                                }}
                        />
                    </div>
                </div>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th className="ten">
                                    Tên
                                </th>
                                <th className="email">
                                    Emai
                                </th>
                                <th className="soDu">
                                    Số dư
                                </th>
                                <th className="hanhDong">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {nguoiDungs.map((i)=>(
                                <tr key={i.id}
                                    style={i.trangThai==0?{backgroundColor:'red'}:i.trangThai==2?{backgroundColor:'yellow'}:{}}
                                    onClick={()=>router.visit('/admin/quanlylichsu/'+i.id)}
                                >
                                    <td className="ten">
                                        {i.ten}
                                    </td>
                                    <td className="email">
                                        {i.email}
                                    </td>
                                    <td className="tacGia">
                                        {i.soDu}
                                    </td>
                                    <td className="hanhDong">
                                        <button
                                            disabled={i.vaiTro<3}
                                            onClick={(e)=>handleAction(i.id,i.trangThai,e)}
                                        >{i.vaiTro<3?'Admin':i.trangThai==1?'Khóa':'Khôi phục'}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}