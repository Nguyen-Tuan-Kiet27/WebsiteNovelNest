import AdminLayout from "../../Layouts/AdminLayout";
import './QuanLyTruyen.scss'
import { useState } from "react";
import { router } from "@inertiajs/react";
export default function QuanLyTruyen({user}){
    const [popupTheLoai,setPupopTheLoai] = useState(false);
    return(
        <AdminLayout page='4' user={user}>
            <div className="quanLyTruyen">
                <div>
                    <h1>Truyện</h1>
                    <div>
                        <div
                            onClick={()=>setPupopTheLoai(!popupTheLoai)}
                        >Tất cả thể loại
                            <div 
                                style={popupTheLoai?{display:'flex'}:{display:'none'}}
                                onClick={(e)=>{ e.stopPropagation();}}
                            >
                                <button
                                    onClick={()=>{router.visit('/admin/themtheloai')}}
                                >
                                    Thêm thể loại
                                </button>
                                <button
                                    onClick={()=>{router.visit('/admin/quanlytruyen')}}
                                >
                                    Tất cả thể loại
                                </button>
                            </div>
                        </div>
                        <input placeholder="Tìm kiếm"/>
                    </div>
                </div>
                <div>

                </div>
            </div>
        </AdminLayout>
    )
}