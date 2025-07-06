import AdminLayout from "../../Layouts/AdminLayout";
import './QuanLyTruyenBaoCao.scss'
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import VerifyPass from "../../Components/VerifyPass"
import axios from "axios";
export default function QuanLyTruyen({user,truyens}){
    console.log(truyens)

    const [showPass,setShowPass] = useState(false);
    const [idAction,setIdAction] = useState(null);

    const handleAction=(id,e)=>{
        e.stopPropagation();
        setIdAction(id);
        setShowPass(true);
    }
    const handleOkPass = async ()=>{
        try {
            const response = await axios.put(`/api/admin/changetruyen/${idAction}?check=bc`);
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
                    <h1>Truyện bị báo cáo</h1>
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
                                <th className="loai">
                                    Thể loại
                                </th>
                                <th className="doanhThu">
                                    Doanh thu chương bị báo cáo
                                </th>
                                <th className="tacGia">
                                    Tác giả
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
                                    onClick={()=>router.visit('/admin/quanlychuongbaocao/'+i.id)}
                                >
                                    <td className="ten">
                                        {i.ten}
                                    </td>
                                    <td className="soLuong">
                                        {i.soLuong}
                                    </td>
                                    <td className="loai">
                                        {i.theloai.ten}
                                    </td>
                                    <td className="doanhThu">
                                        {i.doanhThu || 0}
                                    </td>
                                    <td className="tacGia">
                                        {i.nguoidung.ten}
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