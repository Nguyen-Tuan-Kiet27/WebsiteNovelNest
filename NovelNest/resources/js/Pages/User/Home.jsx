import Userlayout from '@/Layouts/UserLayout';
import { useState, useEffect } from 'react';
import './Home.scss';
import CardStories from '../../Components/CardStories';
import ListStories from '../../Components/ListStories';

export default function Home({user}) {
  const genres = [
    'Hành động', 'Lãng mạn', 'Kinh dị', 'Phiêu lưu',
    'Trinh thám', 'Lịch sử', 'Kỳ ảo', 'Hài hước',
    'Viễn tưởng', 'Tâm lý', 'Gia đình', 'Võ thuật',
    'Học đường', 'Thể thao', 'Âm nhạc', 'Chính kịch','Buồn'
  ];
  const stories=[{ten:'Đấu Phá Thương Khung – Thiên Tằm Thổ Đậu',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {ten:'Phàm Nhân Tu Tiên – Vong Ngữ',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {ten:'Đại Chúa Tể',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {ten: 'Tử Dương',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {ten: 'Ma Thiên Ký',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {ten: 'Trường An Tứ Cư',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {ten: 'Mối Tình Đầu Của Nhân Vật Phản Diện',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {ten: 'Thần Mộ',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {ten: 'Tiên Nghịch',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {ten: 'Tinh Thần Biến',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {ten: 'Mối Tình Đầu Của Nhân Vật Phản Diện',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {ten: 'Thần Mộ',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {ten: 'Tiên Nghịch',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                {ten: 'Tinh Thần Biến',hinhAnh: "Dau-pha-thuong-khung-cover.jpg"},
                
  ];
  const Theloai = [
  { ten: 'Cô gái bạo lực thời mạt thế xuyên thành nữ phụ vô dụng', theLoai: 'Hệ Thống, Huyền Huyễn' },
  { ten: 'Vô Hạn Lưu: Săn Chơi Khủng Bố Quỷ Quái', theLoai: 'Ngôn Tình' },
  { ten: 'Trùng sinh niên đại 80 làm quân tẩu', theLoai: 'Ngôn Tình, Xuyên Không' },
  { ten: 'Nữ Alpha Thuần Hóa Boss Phản Diện Thành Chồng Yêu', theLoai: 'Khoa Huyễn, Xuyên Nhanh' },
  { ten: 'Xuyên Vào Niên Đại Văn, Pháo Hôi Phàn Kích Xé Cốt', theLoai: 'Ngôn Tình, Hệ Thống' },
  { ten: 'Hành Trình Nghịch Tập Của Gia Tộc Pháo Hôi', theLoai: 'Tiên Hiệp, Xuyên Không' },
  { ten: 'Xuyên Thư 70, Nữ Phụ Hai Con Đổi Mệnh Gả Quân Nhân', theLoai: 'Xuyên Không, Sủng' },
  { ten: 'Trọng Sinh 80, Chị Gái Lên Tàu Ra Hải Đảo, Em Gái Giật Mình', theLoai: 'Dị Năng, Trùng Sinh' },
  { ten: 'Tôi trở nên nổi tiếng trong ngành giải trí nhờ bói toán', theLoai: 'Huyền Huyễn, Showbiz' },
  { ten: 'Ác Nữ Phản Diện Hết Hợp Đồng, Mời Thủ Trưởng Ly Hôn!', theLoai: 'Nữ Cường, Gia Đấu' },
];

  console.log(stories[0])
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', () => setScreenWidth(window.innerWidth));
    return () => window.removeEventListener('resize', () => setScreenWidth(window.innerWidth));
  }, []);

  const containerWidth = screenWidth * 0.9;
  const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const maxPerRow = Math.floor(containerWidth / (150 + remInPx));

  let genres1 = [];
  let genres2 = [];

  if (genres.length <= maxPerRow * 2) {
    genres1 = genres.slice(0, maxPerRow);
    genres2 = genres.slice(maxPerRow);
  } else {
    const half = Math.ceil(genres.length / 2);
    genres1 = genres.slice(0, half);
    genres2 = genres.slice(half);
  }

  return (
    <Userlayout title="Home">
      <div>
        <div className='banner'>
          <img src="img/banner.jpg" alt="" />
        </div>
        <div>
          <button className='TheLoai'>
            <img src="/img/theloai.svg" alt="" />Thể loại nổi bật
          </button>
          <div className='d-flex justify-content-center'>
            <div className="TheLoai-container">
              <div>
                {genres1.map((item, index) => (
                  <button className="TheLoai-box" key={index}>
                    {item}
                  </button>
                ))}
              </div>
              <div>
                {genres2.map((item, index) => (
                  <button className="TheLoai-box" key={index}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center mt-4 h-100'>
          <div className="hot-stories-wrapper">
            <h3 className="hot-title">Truyện hot</h3>
            <div className="hot-stories-container">
              {stories.map((story, index) => (
                <CardStories key={index} ten={story.ten} hinhAnh={story.hinhAnh} />
              ))}
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center'>
          <ListStories stories={Theloai} />
        </div>
        <div className='d-flex justify-content-center mt-4 h-100'>
          <div className="hot-stories-wrapper">
            <h3 className="hot-title">Đã hoàn thành</h3>
            <div className="hot-stories-container">
              {stories.map((story, index) => (
                <CardStories key={index} ten={story.ten} hinhAnh={story.hinhAnh} />
              ))}
            </div>
          </div>
        </div>
      </div>
   
   
    </Userlayout>
  );
}
