import AdminLayout from "../../Layouts/AdminLayout";
import './ChiTietBaoCao.scss'
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import VerifyPass from "../../Components/VerifyPass"
import axios from "axios";
export default function QuanLyTruyen({user,chuong,truyen,baoCaos}){
    console.log(baoCaos)
    const [showPass,setShowPass] = useState(false);
    const [idAction,setIdAction] = useState(true);

    const handleBoQua=()=>{
        setIdAction(true);
        setShowPass(true);
    }
    const handleKhoa=()=>{
        setIdAction(false);
        setShowPass(true);
    }
    const handleOkPass = async ()=>{
        try {
            let response;
            if(!idAction){
                response = await axios.put(`/api/admin/changechuong/${chuong.id}?check=bc`);
            }
            else{
                response = await axios.put(`/api/admin/boquabaocao/${chuong.id}`)
            }
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message)
        } finally{
            router.visit('/admin/quanlychuongbaocao/'+truyen.id)
        }
    }
    return(
        <AdminLayout page='6' user={user} title='Quản lý truyện bị báo cáo'>
            <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleOkPass}/>
            <div className="ChiTietBaoCao">
                <div>
                    <h1>Chương bị báo cáo của {truyen.ten}</h1>
                </div>
                <div className="main">
                    <div className="content">
                        <h2>Chương {chuong.soChuong}: {chuong.ten}</h2>
                        <div dangerouslySetInnerHTML={{ __html: chuong.noiDung }} />
                    </div>
                    <div className="baoCao">
                        <div className="tuyChon">
                            <div>
                                <button onClick={handleBoQua}>
                                    Bỏ qua
                                </button>
                                <button onClick={handleKhoa}>
                                    Khóa
                                </button>
                            </div>
                            <h2>Báo cáo</h2>
                        </div>
                        <div className="noiDungBaoCao">
                            {
                                baoCaos.map(i=>(
                                    <p key={i.id}><strong>{i.nguoi_dung.ten}: </strong>{i.noiDung}</p>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}