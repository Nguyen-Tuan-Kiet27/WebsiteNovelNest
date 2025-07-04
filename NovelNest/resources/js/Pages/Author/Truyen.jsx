import { useEffect, useRef } from "react";
import AuthorLayout from "../../Layouts/AuthorLayout";
import './Truyen.scss'
import { router } from "@inertiajs/react";
export default function Truyen({user, truyens}){
    return(
        <AuthorLayout page='2' user={user} title='Quản lý truyện'>
            <div className="Truyen">
                <div className="head">
                    <div>
                        <h1>Truyện</h1>
                    </div>
                    <div className="option">
                        <div>
                            <label>
                                Mới nhất
                            </label>

                            <label>
                                Hoạt động
                            </label>
                            <p></p>
                        </div>
                        <div>
                            <button
                                onClick={()=>router.visit('/author/themtruyen')}
                            >+ Truyện mới</button>
                        </div>
                    </div>
                </div>
                <div className="body">

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                            <th>Tên</th>
                            <th>Thể loại</th>
                            <th>Trạng thái</th>
                            <th>Lượt xem</th>
                            <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {truyens.map((truyen) => (
                            <tr key={truyen.id} onClick={()=>{router.visit(`/author/truyen/${truyen.id}`)}} className="rowTruyen">
                                <td>{truyen.ten}</td>
                                <td>{truyen.the_loai.ten}</td>
                                <td style={truyen.trangThai==0?{backgroundColor:red}:{}}>
                                {truyen.trangThai == 1 ? 'Hoạt động' : (truyen.trangThai == 2?'Đã khóa':'Bị cấm')}
                                </td>
                                <td>{truyen.luotXem ?? 0}</td>
                                <td>
                                    <button
                                        className='hanhDong' onClick={(e)=>{e.stopPropagation(); router.visit(`/author/suatruyen/${truyen.id}`);}}
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