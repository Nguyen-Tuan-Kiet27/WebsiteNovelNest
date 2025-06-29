import React, { useEffect, useState } from "react";
import Userlayout from "../../Layouts/UserLayout";
import './DieuKhoanDichVu.scss';

export default function DieuKhoanDichVu({user,dieuKhoanDichVu}){
    return(
        <Userlayout title='Điều khoản dịch vụ.' login={user}>
            <div className="dieuKhoanDichVu">
                <h1>Điều khoản và dịch vụ - NovelNest</h1>
                <div className="mainDKDV">
                    <div dangerouslySetInnerHTML={{__html: dieuKhoanDichVu}}></div>
                </div>
            </div>
        </Userlayout>
    )
}