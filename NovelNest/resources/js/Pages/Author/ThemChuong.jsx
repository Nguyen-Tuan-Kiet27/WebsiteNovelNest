import AuthorLayout from "../../Layouts/AuthorLayout";
import './ThemChuong.scss'
import { router } from "@inertiajs/react";
import Editor from '@/Components/Editor';
export default function Truyen({user, truyen}){
    return(
        <AuthorLayout page='2' user={user} title={`Thêm chương truyện ${truyen.ten}`}>
            <div className="ThemChuong">
                <div className="head">
                    <div>
                        <h1>Thêm chương truyện: {truyen.ten}</h1>
                    </div>
                </div>
                <div className="body">
                    <div>
                        <div className="tenChuong">
                            <label>Tên chương</label>
                            <input type="text" />
                        </div>
                        <div className="gia">
                            <input type="checkBox" />
                            <label>Có phí</label>
                            <div>
                                <input type="number" />
                                <label>xu</label>
                            </div>
                            
                        </div>
                    </div>
                    <div className="noiDung">
                        <Editor></Editor>
                    </div>
                </div>
            </div>
        </AuthorLayout>
    )
}