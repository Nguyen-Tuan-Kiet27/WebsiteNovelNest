import Userlayout from '@/Layouts/UserLayout';
import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import './Stories.scss';
import CardStories from '../../Components/CardStories';
export default function Home({login,truyen,chuongs}) {
    truyen={ten:'Đấu Phá Thương Khung – Thiên Tằm Thổ Đậu',hinhAnh: "Dau-pha-thuong-khung-cover.jpg",
        gioiThieu:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
        trangThai:'Đang hoàn thành',theLoai:'Ngôn tình',chuong:'35', tenChuong: 'hhhhh'}
const chapters = [
  { id: 1, ten: "Chương 1: Khởi đầu mới" },
  { id: 2, ten: "Chương 2: Bí mật được hé lộ" },
  { id: 3, ten: "Chương 3: Cuộc gặp gỡ định mệnh" },
  { id: 4, ten: "Chương 4: Bóng tối lan tràn" },
  { id: 5, ten: "Chương 5: Hy vọng le lói" },
  { id: 6, ten: "Chương 6: Ký ức bị chôn vùi" },
  { id: 7, ten: "Chương 7: Sự thật kinh hoàng" },
  { id: 8, ten: "Chương 8: Quyết định sinh tử" },
  { id: 9, ten: "Chương 9: Hành trình bắt đầu" },
  { id: 10, ten: "Chương 10: Ngọn lửa nổi dậy" },
  { id: 11, ten: "Chương 11: Đối mặt quá khứ" },
  { id: 12, ten: "Chương 12: Trận chiến đầu tiên" },
  { id: 13, ten: "Chương 13: Lời thề bảo vệ" },
  { id: 14, ten: "Chương 14: Âm mưu và phản bội" },
  { id: 15, ten: "Chương 15: Hy sinh thầm lặng" },
  { id: 16, ten: "Chương 16: Con đường lựa chọn" },
  { id: 17, ten: "Chương 17: Lằn ranh thiện ác" },
  { id: 18, ten: "Chương 18: Cái giá của quyền lực" },
  { id: 19, ten: "Chương 19: Hồi sinh từ tro tàn" },
  { id: 20, ten: "Chương 20: Hồi kết mở" },
];
const stories=[{id :1, ten:'Đấu Phá Thương Khung – Thiên Tằm Thổ Đậu',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {id :2, ten:'Phàm Nhân Tu Tiên – Vong Ngữ',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {id :3,ten:'Đại Chúa Tể',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {id :4,ten: 'Tử Dương',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {id :5,ten: 'Ma Thiên Ký',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {id :6,ten: 'Trường An Tứ Cư',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {id :7,ten: 'Mối Tình Đầu Của Nhân Vật Phản Diện',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {id :8,ten: 'Thần Mộ',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {id :9,ten: 'Tiên Nghịch',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {id :10,ten: 'Tinh Thần Biến',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {id :11,ten: 'Mối Tình Đầu Của Nhân Vật Phản Diện',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {id :12,ten: 'Thần Mộ',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {id :13,ten: 'Tiên Nghịch',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {id :14,ten: 'Tinh Thần Biến',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                
  ];

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
<Userlayout title="Stories">

    <div className='container' >
        <div ref={traiRef}>
            <div>
                <div className='storyInformation'>
                    <img src="/img/truyen/hinhNen/tai-anh-anime-nam-1.jpg" alt="" />
                    <div className='subStoryInformation'>
                        <img src="/img/truyen/hinhAnh/Dau-pha-thuong-khung-cover.jpg" alt="" />
                        <div className='information'>
                            <h5>Tên truyện: {truyen.ten}</h5>
                            <h5>Thể loại: {truyen.theLoai}</h5>
                            <h5>Trạng thái: {truyen.trangThai}</h5>
                            <h5>Chương: {truyen.chuong}</h5>  
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
        <div style={{maxHeight: traiHeight}}>
            <div className='storyChapter' style={{maxHeight: traiHeight2}}> 
            
                <button onClick={()=>router.visit(`/chuong/${chapters[0].id}`)}>
                    Đọc từ đầu
                </button>
                <div className='chuongMoi'>
                    <h5>Chương mới ra</h5>
                    { chapters.slice(chapters.length-4).reverse().map((chapter) =>(
                            <li key={chapter.id}
                            >
                                <a href={`/chuong/${chapter.id}`}>{chapter.ten}</a>
                            </li>
                        ))}
                </div>
                <div className='chuongs'>
                    <h5>Danh sách chương</h5>
                    {chapters.map((chapter) =>(
                        <li key={chapter.id}
                            // onClick={()=>{router.visit(`/chuong/${chapter.number}`)}}
                            
                        >
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
            {stories.map((story, id) => (
                <CardStories key={story.id} ten={story.ten} hinhAnh={story.hinhAnh} />
            ))}
            </div>
        </div>
    </div>

</Userlayout>

);

}