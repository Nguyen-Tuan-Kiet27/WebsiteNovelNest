import Userlayout from '@/Layouts/UserLayout';
import { useState, useEffect } from 'react';
import './Home.scss';
export default function Home({login}) {

  //TEST
  ////////////////////////////

  const genres = [
    'Hành động', 'Lãng mạn', 'Kinh dị', 'Phiêu lưu',
    'Trinh thám', 'Lịch sử', 'Kỳ ảo', 'Hài hước',
    'Viễn tưởng', 'Tâm lý', 'Gia đình', 'Võ thuật',
    'Học đường', 'Thể thao', 'Âm nhạc', 'Chính kịch','Buồn'
  ];

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
    <Userlayout title="Home" login={login}>
      <div>
        <div className='banner'>
          <img src="/img/banner.jpg" alt="" />
        </div>
        <div>
             <button className='TheLoai'>
               <img src="/img/theloai.svg" alt="" />Thể loại nổi bật</button>
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

        
      </div>
    </Userlayout>
  );
}
