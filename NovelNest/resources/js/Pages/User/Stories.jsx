import Userlayout from '@/Layouts/UserLayout';
import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import './Stories.scss';
import CardStories from '../../Components/CardStories';
export default function Stories({login,truyen,chuongs, soLuong,truyenDaHoanThanhs}) {
console.log(chuongs);
console.log(truyen);

    const traiRef = useRef();
    const [traiHeight, setTraiHeight] = useState(0);
    const [traiHeight2, setTraiHeight2] = useState(0);

    useEffect(() => {
        if (traiRef.current) {
            setTraiHeight(traiRef.current.offsetHeight);
            setTraiHeight2(traiRef.current.offsetHeight-2);
        }
    }, []);

return(
<Userlayout title="Stories" login={login} >

    <div className='container' >
        <div ref={traiRef}>
            <div>
                <div className='storyInformation'>
                    <img src="/img/truyen/hinhNen/tai-anh-anime-nam-1.jpg" alt="" />
                    <div className='subStoryInformation'>
                        <img src="/img/truyen/hinhAnh/Dau-pha-thuong-khung-cover.jpg" alt="" />
                        <div className='information'>
                            <h5>Tên truyện: {truyen.ten}</h5>
                            <h5>Thể loại: {truyen.the_loai.ten}</h5>
                            <h5>Trạng thái: {truyen.ngayKetThuc?'Chưa hoàn thành':'Đã hoàn thành'}</h5>
                            <h5>Chương: {soLuong}</h5>  
                        </div>
                    </div>
                </div>
            </div>
            <div className='gioiThieu'>
                <h4>Giới thiệu truyện:</h4>
                <div>
                    <p>Giới thiệu: {truyen.gioiThieu}</p>
                </div>
            </div>
        </div>
        <div style={{maxHeight: traiHeight, minHeight:traiHeight}}>
            <div className='storyChapter' style={{maxHeight: traiHeight2}}> 
            
                <button onClick={()=>router.visit(`/chuong/${chapters[0].id}`)}>
                    Đọc từ đầu
                </button>
                <div className='chuongMoi'>
                    <h5>Chương mới ra</h5>
                    { chuongs.slice(chuongs.length-4).reverse().map((chapter) =>(
                            <li key={chapter.id}
                            >
                                <a href={`/chuong/${chapter.id}`}>{chapter.ten}</a>
                            </li>
                        ))}
                </div>
                <div className='chuongs'>
                    <h5>Danh sách chương</h5>
                    {chuongs.map((chapter) =>(
                        <li key={chapter.id}>
                            <a href={`/chuong/${chapter.id}`}>{chapter.ten}</a>
                        </li>
                    ))}

                </div>
            </div>
        </div>
    </div>
    <div className='d-flex justify-content-center mt-4 h-100'>
        <div className="hot-stories-wrapper">
            <h3 className="hot-title">Đã hoàn thành</h3>
            <div className="hot-stories-container">
            {truyenDaHoanThanhs.map((story, id) => (
                <CardStories key={story.id} ten={story.ten} hinhAnh={story.hinhAnh} />
            ))}
            </div>
        </div>
    </div>

</Userlayout>

);

}