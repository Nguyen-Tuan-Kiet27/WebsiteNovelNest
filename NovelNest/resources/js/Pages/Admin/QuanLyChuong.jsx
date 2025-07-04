import AdminLayout from "../../Layouts/AdminLayout";
import './QuanLyTruyen.scss'
import { useEffect, useState } from "react";
import { router,usePage } from "@inertiajs/react";
import VerifyPass from "../../Components/VerifyPass"
import axios from "axios";
export default function QuanLyTruyen({user,truyen,chuongs}){
    const {url} = usePage();
    const queryString = url.split('?')[1]; // Lấy phần query string sau dấu ?
    const query = Object.fromEntries(new URLSearchParams(queryString));
    const [searchText,setSearchText] = useState('');

    const [showPass,setShowPass] = useState(false);
    const [idAction,setIdAction] = useState(null);

    useEffect(()=>{
       setSearchText(query.searchText || '')
    },[]);
    const handleSearch = ()=>{
        if(searchText.trim()!=query.searchText)
            router.visit(`/admin/quanlychuong/${truyen.id}?searchText=${searchText.trim()}`)
    }
    const handleAction=(id,e)=>{
        e.stopPropagation();
        setIdAction(id);
        setShowPass(true);
    }
    const handleOkPass = async ()=>{
        try {
            const response = await axios.put(`/api/admin/changechuong/${idAction}`);
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message)
        } finally{
            window.location.reload();
        }
    }
    return(
        <AdminLayout page='4' user={user} title='Quản lý truyện'>
            <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleOkPass}/>
            <div className="quanLyTruyen">
                <div>
                    <h1>Chương của truyện: {truyen.ten}</h1>
                    <div>
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
                                    Giá
                                </th>
                                <th className="trangThai">
                                    Trạng thái
                                </th>
                                <th className="tacGia">
                                    Lượt xem
                                </th>
                                <th className="hanhDong">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {chuongs.map((i)=>(
                                <tr key={i.id}
                                    style={i.trangThai==0?{backgroundColor:'red'}:i.trangThai==2?{backgroundColor:'yellow'}:{}}
                                    onClick={() => window.open(`/chuong/${i.id}`, '_blank')}
                                >
                                    <td className="ten">
                                        Chương {i.soChuong}: {i.ten}
                                    </td>
                                    <td className="tao">
                                        {i.ngayTao}
                                    </td>
                                    <td className="loai">
                                        {i.gia}
                                    </td>
                                    <td className="trangThai">
                                        {i.trangThai==1?'Hoạt động':i.trangThai==2?'Đang duyệt':'Bị cấm'}
                                    </td>
                                    <td className="tacGia">
                                        {i.luotXem}
                                    </td>
                                    <td className="hanhDong">
                                        <button
                                            onClick={(e)=>handleAction(i.id,e)}
                                        >{!i.trangThai==0?'Khóa':'Khôi phục'}</button>
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