import AdminLayout from "../../Layouts/AdminLayout";
import './QuanLyTacGia.scss'
import { useEffect, useState } from "react";
import { router,usePage } from "@inertiajs/react";
import VerifyPass from "../../Components/VerifyPass"
import axios from "axios";
import { BsCopy } from "react-icons/bs";
export default function QuanLyTruyen({user,tacGias}){
    console.log(tacGias)
    const {url} = usePage();
    const queryString = url.split('?')[1]; // Lấy phần query string sau dấu ?
    const query = Object.fromEntries(new URLSearchParams(queryString));
    const [popupTheLoai,setPupopTheLoai] = useState(false);
    const [sort,setsort] = useState('macdinh');
    const [searchText,setSearchText] = useState('');

    const [showPass,setShowPass] = useState(false);
    const [idAction,setIdAction] = useState(null);

    useEffect(()=>{
       setsort(query.sort || 'macdinh')
       setSearchText(query.searchText || '')
    },[]);

    const handleSearch = ()=>{
        if(searchText.trim()!=query.searchText)
            router.visit(`/admin/quanlytacgia?sort=${sort}&searchText=${searchText.trim()}`)
    }
    const handleAction=(id,e)=>{
        e.stopPropagation();
        setIdAction(id);
        setShowPass(true);
    }
    const handleOkPass = async ()=>{
        try {
            const response = await axios.put(`/api/admin/changenguoidung/${idAction}`);
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message)
        } finally{
            window.location.reload();
        }
    }
    return(
        <AdminLayout page='3' user={user} title='Quản lý tác giả'>
            <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleOkPass}/>
            <div className="quanLyTruyen">
                <div>
                    <h1>Quản lý tác giả</h1>
                    <div>
                        <div
                            onClick={()=>setPupopTheLoai(!popupTheLoai)}
                        >{sort=='thutang'?'Doanh thu tăng':sort=='thugiam'?'Doanh thu giảm':'Mặc định'}
                            <div 
                                style={popupTheLoai?{display:'flex'}:{display:'none'}}
                                onClick={(e)=>{ e.stopPropagation();}}
                            >
                                <button
                                    onClick={()=>{router.visit(`/admin/quanlytacgia?searchText=${query.searchText || ''}`)}}
                                    style={sort=='macdinh'?{backgroundColor:'greenyellow'}:{}}
                                >
                                    Mặc định
                                </button>
                                <button
                                    onClick={()=>{router.visit(`/admin/quanlytacgia?searchText=${query.searchText || ''}&sort=thutang`)}}
                                    style={sort=='thutang'?{backgroundColor:'greenyellow'}:{}}
                                >
                                    Doanh thu tăng
                                </button>
                                <button
                                    onClick={()=>{router.visit(`/admin/quanlytacgia?searchText=${query.searchText || ''}&sort=thugiam`)}}
                                    style={sort=='thugiam'?{backgroundColor:'greenyellow'}:{}}
                                >
                                    Doanh thu giảm
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
                                <th className="id">
                                    ID
                                </th>
                                <th className="ten">
                                    Tên
                                </th>
                                <th className="email">
                                    Emai
                                </th>
                                <th className="soDu">
                                    Doanh thu
                                </th>
                                <th className="hanhDong">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tacGias.map((i)=>(
                                <tr key={i.id}
                                    style={i.trangThai==0?{backgroundColor:'red'}:i.trangThai==2?{backgroundColor:'yellow'}:{}}
                                    onClick={()=>router.visit('/admin/quanlytruyentacgia/'+i.id)}
                                >
                                    <td className="id">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const target = e.currentTarget;
                                                target.style.color = 'red';
                                                navigator.clipboard.writeText(i.id);
                                                setTimeout(() => {
                                                target.style.color = 'black';
                                                }, 1000);
                                            }}
                                            title="Copy ID"
                                        >
                                            <BsCopy />
                                        </button>
                                    </td>
                                    <td className="ten">
                                        {i.ten}
                                    </td>
                                    <td className="email">
                                        {i.email}
                                    </td>
                                    <td className="tacGia">
                                        {i.doanhThu}
                                    </td>
                                    <td className="hanhDong">
                                        {/* <button
                                            onClick={(e)=>handleAction(i.id,e)}
                                        >{i.trangThai==1?'Khóa':'Khôi phục'}</button> */}
                                        <button
                                            disabled={i.vaiTro<3}
                                            onClick={(e)=>handleAction(i.id,e)}
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