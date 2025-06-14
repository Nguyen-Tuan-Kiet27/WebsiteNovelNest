import AuthorLayout from "../../Layouts/AuthorLayout";
import './Truyen.scss'
import { router } from "@inertiajs/react";
export default function Truyen({user, truyens}){
    console.log(truyens)
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
                            <tr key={truyen.id}>
                                <td>{truyen.ten}</td>
                                <td>{truyen.the_loai.ten}</td>
                                <td>
                                {truyen.trangThai == 1 ? 'Hoạt động' : 'Khóa'}
                                </td>
                                <td>{truyen.luotXem ?? 0}</td>
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