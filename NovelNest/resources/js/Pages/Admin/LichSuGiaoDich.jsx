import AdminLayout from "../../Layouts/AdminLayout";
import './LichSuGiaoDich.scss'
import { useEffect, useState } from "react";
import { router,usePage } from "@inertiajs/react";
export default function QuanLyTruyen({user,nguoiDung,lichSus}){
    console.log(lichSus)
    const {url} = usePage();
    const queryString = url.split('?')[1]; // Lấy phần query string sau dấu ?
    const query = Object.fromEntries(new URLSearchParams(queryString));
    const [popupTheLoai,setPupopTheLoai] = useState(false);
    const [sort,setsort] = useState('new');

    useEffect(()=>{
       setsort(query.sort || 'new')
    },[]);

    return(
        <AdminLayout page='2' user={user} title='Quản lý truyện'>
            <div className="quanLyTruyen">
                <div>
                    <h1>Lịch sử giao dịch của {nguoiDung.ten}</h1>
                    <div>
                        <div
                            onClick={()=>setPupopTheLoai(!popupTheLoai)}
                        >{sort=='new'?'Mới nhất':'Cũ nhất'}
                            <div 
                                style={popupTheLoai?{display:'flex'}:{display:'none'}}
                                onClick={(e)=>{ e.stopPropagation();}}
                            >
                                <button
                                    onClick={()=>{router.visit(`/admin/quanlylichsu/${nguoiDung.id}?sort=new`)}}
                                    style={sort=='new'?{backgroundColor:'greenyellow'}:{}}
                                >
                                    Mới nhất
                                </button>
                                <button
                                    onClick={()=>{router.visit(`/admin/quanlylichsu/${nguoiDung.id}?sort=old`)}}
                                    style={sort=='old'?{backgroundColor:'greenyellow'}:{}}
                                >
                                    Cũ nhất
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th className="loai">
                                    Loại
                                </th>
                                <th className="soLuong">
                                    Số lượng (Xu)
                                </th>
                                <th className="thoiGian">
                                    Thời gian
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {lichSus.map((i)=>(
                                <tr key={i.thoiGian}
                                >
                                    <td className="loai">
                                        {i.loai}
                                    </td>
                                    <td className="soLuong">
                                        {i.soLuong}
                                    </td>
                                    <td className="thoiGian">
                                        {i.thoiGian}
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