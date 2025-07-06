import { useEffect, useRef } from "react";
import AuthorLayout from "../../Layouts/AuthorLayout";
import './Blog.scss'
import { router } from "@inertiajs/react";
export default function Truyen({user, baiViets}){
    return(
        <AuthorLayout page='3' user={user} title='Quản lý blog'>
            <div className="Truyen">
                <div className="head">
                    <div>
                        <h1>Blog</h1>
                    </div>
                    <div className="option">
                        <div>
                            
                        </div>
                        <div>
                            <button
                                onClick={()=>router.visit('/author/themblog')}
                            >+ Viết blog</button>
                        </div>
                    </div>
                </div>
                <div className="body">

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                            <th>Tiêu đề</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {baiViets.map((baiViet) => (
                            <tr key={baiViet.id} onClick={()=>{window.open('/blogtruyen/'+baiViet.id,'_blank')}} className="rowTruyen">
                                <td>{baiViet.tieuDe}</td>
                                <td>{baiViet.ngayTao}</td>
                                <td>
                                    <button
                                        className='hanhDong'
                                        onClick={(e)=>{e.stopPropagation();router.visit('/author/suablog/'+baiViet.id)}}
                                    >Sửa</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </AuthorLayout>
    )
}