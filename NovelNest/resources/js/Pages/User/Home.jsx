import Userlayout from '@/Layouts/UserLayout';
import { useState, useEffect } from 'react';
import './Home.scss';
import CardStories from '../../Components/CardStories';
import ListStories from '../../Components/ListStories';
import { router } from '@inertiajs/react';

export default function Home({login,theLoais,truyenHots,truyenMois,truyenDaHoanThanhs}) {

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

  if (theLoais.length <= maxPerRow * 2) {
    genres1 = theLoais.slice(0, maxPerRow);
    genres2 = theLoais.slice(maxPerRow);
  } else {
    const half = Math.ceil(theLoais.length / 2);
    genres1 = theLoais.slice(0, half);
    genres2 = theLoais.slice(half);
  }

  return (
    <Userlayout title="Home" login={login} page={1}>
      <div>
        <div className='banner'>
          <img src="/img/banner.jpg" alt="" />
        </div>
        <div>
          <button className='TheLoai'>
            <img src="/img/theloai.svg" alt="" />Thể loại nổi bật
          </button>
          <div className='d-flex justify-content-center'>
            <div className="TheLoai-container">
              <div>
                {genres1.map((item) => (
                  <button className="TheLoai-box" key={item.id}
                  onClick={() => router.visit(`/theloai/${item.id}`)}>
                    {item.ten}
                  </button>
                ))}
              </div>
              <div>
                {genres2.map((item) => (
                  <button className="TheLoai-box" key={item.id}
                    onClick={() => router.visit(`/theloai/${item.id}`)}>
                    {item.ten}
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
              {truyenHots.map((story) => (
                <CardStories truyen={story} key={story.id}/>
              ))}
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center'>
          <ListStories stories={truyenMois} />
        </div>
        <div className='d-flex justify-content-center mt-4 h-100'>
          <div className="hot-stories-wrapper">
            <h3 className="hot-title">Đã hoàn thành</h3>
            <div className="hot-stories-container">
              {truyenDaHoanThanhs.map((story) => (
                <CardStories key={story.id} ten={story.ten} hinhAnh={story.hinhAnh} />
              ))}
            </div>
          </div>
        </div>
      </div>
   
   
    </Userlayout>
  );
}
