import AdminLayout from "../../Layouts/AdminLayout";
import './QuanLyChuongBaoCao.scss'
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import VerifyPass from "../../Components/VerifyPass"
import axios from "axios";
export default function QuanLyTruyen({user,chuongs,truyen}){
    console.log(chuongs)
    const [showPass,setShowPass] = useState(false);
    const [idAction,setIdAction] = useState(null);

    const handleAction=(id,e)=>{
        e.stopPropagation();
        setIdAction(id);
        setShowPass(true);
    }
    const handleOkPass = async ()=>{
        try {
            const response = await axios.put(`/api/admin/changechuong/${idAction}?check=bc`);
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message)
        } finally{
            window.location.reload();
        }
    }
    return(
        <AdminLayout page='6' user={user} title='Quản lý truyện bị báo cáo'>
            <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleOkPass}/>
            <div className="quanLyTruyenBaoCao">
                <div>
                    <h1>Chương bị báo cáo của {truyen.ten}</h1>
                </div>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th className="ten">
                                    Tên
                                </th>
                                <th className="soLuong">
                                    Số lượng báo cáo
                                </th>
                                <th className="doanhThu">
                                    Doanh thu chương bị báo cáo
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
                                    onClick={()=>router.visit('/admin/chitietbaocao/'+i.id)}
                                >
                                    <td className="ten">
                                        {i.ten}
                                    </td>
                                    <td className="soLuong">
                                        {i.soLuong}
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