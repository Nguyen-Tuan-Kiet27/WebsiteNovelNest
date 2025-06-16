import AuthorLayout from "../../Layouts/AuthorLayout";
import './TruyenChuong.scss'
import { router } from "@inertiajs/react";
export default function Truyen({user, truyen, chuong}){
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

                </div>
            </div>
        </AuthorLayout>
    )
}