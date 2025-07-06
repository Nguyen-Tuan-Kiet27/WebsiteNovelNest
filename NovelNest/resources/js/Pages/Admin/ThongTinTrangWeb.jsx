import AdminLayout from "../../Layouts/AdminLayout";
import './DoiNguAdmin.scss'
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import VerifyPass from "../../Components/VerifyPass"
import axios from "axios";
export default function QuanLyTruyen({user}){
    return(
        <AdminLayout page='8' user={user} title='Quản lý thông tin web'>
            <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleOkPass}/>
            <div className="DoiNguAdmin">
                <div>
                    <h1>Đội ngũ admin</h1>
                </div>
                <div className="main">
                    <div>
                        
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}