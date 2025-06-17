import AuthorLayout from "../../Layouts/AuthorLayout";
import './TruyenChuong.scss'
import { router } from "@inertiajs/react";
export default function TruyenChuong({user, truyen, chuongs}){
    return(
        <AuthorLayout page='2' user={user} title={`Quản lý chương truyện ${truyen.ten}`}>
            <div className="TruyenChuong">
                <div className="head">
                    <div>
                        <h1>{truyen.ten}</h1>
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
                                onClick={()=>router.visit(`/author/themchuong/${truyen.id}`)}
                            >+ Chương mới</button>
                        </div>
                    </div>
                </div>
                <div className="body">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                            <th>Số chương</th>
                            <th>Tên</th>
                            <th>Giá</th>
                            <th>Trạng thái</th>
                            <th>Lượt xem</th>
                            <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chuongs.map((chuong) => (
                            <tr key={chuong.id} onClick={()=>{router.visit(`/author/truyen/${chuong.id}`)}} className="rowChuong">
                                <td>{chuong.soChuong}</td>
                                <td>{chuong.ten}</td>
                                <td>{chuong.gia}</td>
                                <td>
                                {chuong.trangThai == 1 ? 'Hoạt động' : chuong.trangThai == 2?'Đã tắt':'Bị khóa'}
                                </td>
                                <td>{chuong.luotXem}</td>
                                <td>
                                    <button>Sửa</button>
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