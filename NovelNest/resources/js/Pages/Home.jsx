import { Head } from '@inertiajs/react';
import Userlayout from '@/Layouts/UserLayout';
import './Home.scss';
export default function Home({user}) {
  const genres = [
    'Hành động', 'Lãng mạn', 'Kinh dị', 'Phiêu lưu',
    'Trinh thám', 'Lịch sử', 'Kỳ ảo', 'Hài hước',
    'Viễn tưởng', 'Tâm lý', 'Gia đình', 'Võ thuật',
    'Học đường', 'Thể thao', 'Âm nhạc', 'Chính kịch','Buồn'
  ];
  return (
    <Userlayout >
      <Head title="Trang chủ test" />
      <div>
        <div className='banner'>
          <img src="img/banner.jpg" alt="" />
        </div>
        <div>
             <button className='TheLoai'>
               <img src="/img/theloai.svg" alt="" />Thể loại nổi bật</button>
              
               <div className="TheLoai-container">
                  {genres.map((item, index) => (
                    <button className="TheLoai-box" key={index}>
                      {item}
                    </button>
                  ))}
                </div>
               
        </div>

        
      </div>
    </Userlayout>
  );
}
