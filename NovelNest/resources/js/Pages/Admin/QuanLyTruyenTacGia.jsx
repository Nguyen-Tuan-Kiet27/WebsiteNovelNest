import AdminLayout from "../../Layouts/AdminLayout";
import './QuanLyTruyenTacGia.scss'
import { useEffect, useState } from "react";
import { router,usePage } from "@inertiajs/react";
import VerifyPass from "../../Components/VerifyPass"
import axios from "axios";
export default function QuanLyTruyen({user,nguoiDung,theLoais, tenTheLoai,truyens}){
    console.log(truyens)
    const {url} = usePage();
    const queryString = url.split('?')[1]; // Lấy phần query string sau dấu ?
    const query = Object.fromEntries(new URLSearchParams(queryString));
    const [popupTheLoai,setPupopTheLoai] = useState(false);
    const [theLoai,setTheLoai] = useState('all');
    const [searchText,setSearchText] = useState('');
    const [sort,setSort] = useState('macdinh');
    const [showSort,setShowSort] = useState(false);

    const [showPass,setShowPass] = useState(false);
    const [idAction,setIdAction] = useState(null);

    useEffect(()=>{
       setTheLoai(query.theLoai || 'all')
       setSearchText(query.searchText || '')
       setSort(query.sort || 'macdinh')
    },[]);
    const handleSearch = ()=>{
        if(searchText.trim()!=query.searchText)
            router.visit(`/admin/quanlytruyen?theLoai=${theLoai}&searchText=${searchText.trim()}`)
    }
    const handleAction=(id,e)=>{
        e.stopPropagation();
        setIdAction(id);
        setShowPass(true);
    }
    const handleOkPass = async ()=>{
        try {
            const response = await axios.put(`/api/admin/changetruyen/${idAction}`);
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message)
        } finally{
            window.location.reload();
        }
    }
    return(
        <AdminLayout page='3' user={user} title='Quản lý truyện'>
            <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleOkPass}/>
            <div className="quanLyTruyen">
                <div>
                    <h1>Truyện của {nguoiDung.ten}</h1>
                    <div>
                        <div
                            onClick={()=>setShowSort(!showSort)}
                        >{sort=='thutang'?'Doanh thu tăng':sort=='thugiam'?'Doanh thu giảm':'Mặc định'}
                            <div 
                                style={showSort?{display:'flex'}:{display:'none'}}
                                onClick={(e)=>{ e.stopPropagation();}}
                            >
                                <button
                                    onClick={()=>{router.visit(`/admin/quanlytruyentacgia/${nguoiDung.id}?theLoai=${theLoai}&searchText=${query.searchText || ''}`)}}
                                    style={sort=='macdinh'?{backgroundColor:'greenyellow'}:{}}
                                >
                                    Mặc định
                                </button>
                                <button
                                    onClick={()=>{router.visit(`/admin/quanlytruyentacgia/${nguoiDung.id}?theLoai=${theLoai}&searchText=${query.searchText || ''}&sort=thutang`)}}
                                    style={sort=='thutang'?{backgroundColor:'greenyellow'}:{}}
                                >
                                    Doanh thu tăng
                                </button>
                                <button
                                    onClick={()=>{router.visit(`/admin/quanlytruyentacgia/${nguoiDung.id}?theLoai=${theLoai}&searchText=${query.searchText || ''}&sort=thugiam`)}}
                                    style={sort=='thugiam'?{backgroundColor:'greenyellow'}:{}}
                                >
                                    Doanh thu giảm
                                </button>

                            </div>
                        </div>
                        <div
                            onClick={()=>setPupopTheLoai(!popupTheLoai)}
                        >{tenTheLoai}
                            <div 
                                style={popupTheLoai?{display:'flex'}:{display:'none'}}
                                onClick={(e)=>{ e.stopPropagation();}}
                            >
                                <button
                                    onClick={()=>{router.visit('/admin/themtheloai')}}
                                >
                                    Quản lý thể loại
                                </button>
                                <button
                                    onClick={()=>{router.visit(`/admin/quanlytruyentacgia/${nguoiDung.id}?searchText=${query.searchText || ''}`)}}
                                    style={theLoai=='all'?{backgroundColor:'greenyellow'}:{}}
                                >
                                    Tất cả thể loại
                                </button>
                                {
                                    theLoais.map((i)=>(
                                        <button
                                            key={i.id}
                                            onClick={()=>{if(theLoai != i.id)router.visit(`/admin/quanlytruyentacgia/${nguoiDung.id}?theLoai=${i.id}&searchText=${query.searchText || ''}`)}}
                                            style={theLoai==i.id?{backgroundColor:'greenyellow'}:{}}
                                        >
                                            {i.ten}
                                        </button>
                                    ))
                                }
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
                                <th className="tao">
                                    Ngày tạo
                                </th>
                                <th className="loai">
                                    Thể loại
                                </th>
                                <th className="trangThai">
                                    Trạng thái
                                </th>
                                <th className="doanhThu">
                                    Doanh thu
                                    </th>
                                <th className="hanhDong">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {truyens.map((i)=>(
                                <tr key={i.id}
                                    style={i.trangThai==0?{backgroundColor:'red'}:i.trangThai==2?{backgroundColor:'yellow'}:{}}
                                    onClick={()=>router.visit('/admin/quanlychuong/'+i.id)}
                                >
                                    <td className="ten">
                                        {i.ten}
                                    </td>
                                    <td className="tao">
                                        {i.ngayBatDau}
                                    </td>
                                    <td className="loai">
                                        {i.theloai.ten}
                                    </td>
                                    <td className="trangThai">
                                        {i.trangThai==1?'Hoạt động':i.trangThai==2?'Đã khóa':'Bị cấm'}
                                    </td>
                                    <td className="doanhThu">
                                        {i.doanhThu || 0}
                                    </td>
                                    <td className="hanhDong">
                                        <button
                                            onClick={(e)=>handleAction(i.id,e)}
                                        >{i.trangThai==1?'Khóa':'Khôi phục'}</button>
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