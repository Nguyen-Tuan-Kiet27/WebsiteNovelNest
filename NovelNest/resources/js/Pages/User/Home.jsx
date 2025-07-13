import Userlayout from '@/Layouts/UserLayout';
import { useState, useEffect, useRef } from 'react';
import './Home.scss';
import CardStories from '../../Components/CardStories';
import ListStories from '../../Components/ListStories';
import { router } from '@inertiajs/react';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';

export default function Home({login,theLoais,truyenHots,truyenMois,truyenDaHoanThanhs,slides}) {
  console.log(truyenDaHoanThanhs)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const bannerRef = useRef(null);
  const [widthBanner, setWidthBanner] = useState(0);

  const [current, setCurrent] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    if (slides.length === 0) return;

    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  useEffect(() => {
    window.addEventListener('resize', () => setScreenWidth(window.innerWidth));
    if (bannerRef.current) {
      setWidthBanner(bannerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (bannerRef.current) {
        setWidthBanner(bannerRef.current.offsetWidth);
      }
    };
    // if (slides.length === 0) return;
    // timerRef.current = setInterval(() => {
    //   setCurrent(prev => (prev + 1) % slides.length);
    // }, 5000);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', () => setScreenWidth(window.innerWidth));
      window.removeEventListener('resize', handleResize);
    }
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

  

  // useEffect(() => {
  //   if (slides.length === 0) return;
  //   timerRef.current = setInterval(() => {
  //     setCurrent(prev => (prev + 1) % slides.length);
  //   }, 5000);
  //   return () => clearInterval(timerRef.current);
  // }, [current]);
  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
  };

  const goToSlide = (index) => {
    setCurrent(index);
    resetTimer();
  };

  return (
    <Userlayout title="Home" login={login} page={1}>
      <div className='tong'>
        <div className='banner'>{
          slides.length != 0 &&
          <div ref={bannerRef}>
              <div>
                <AnimatePresence initial={false}>
                  <motion.a
                    key={slides[current]?.id}
                    href={slides[current]?.lienKet}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ x: widthBanner, opacity: 0 }}     // Bắt đầu từ bên phải
                    animate={{ x: 0, opacity: 1 }}        // Di chuyển về giữa và hiện dần
                    exit={{ x: -widthBanner, opacity: 0 }}        // Trượt sang trái khi rời đi
                    transition={{ duration: 1 }}
                  >
                    <img
                      src={`/img/quangcao/${slides[current]?.hinhAnh}`}
                      alt=""
                    />
                  </motion.a>
                </AnimatePresence>
                <div>
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      style={{backgroundColor:index==current?'yellow':'white'}}
                    ></button>
                  ))}
                </div>
              </div>
          </div>
        }
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
        <div className='truyenMoi d-flex justify-content-center'>
          <ListStories stories={truyenMois} />
        </div>
        <div className='d-flex justify-content-center mt-4 h-100'>
          <div className="hot-stories-wrapper">
            <h3 className="hot-title">Đã hoàn thành</h3>
            <div className="hot-stories-container">
              {truyenDaHoanThanhs.map((story) => (
                <CardStories key={story.id} truyen={story} />
              ))}
            </div>
          </div>
        </div>
      </div>
   
   
    </Userlayout>
  );
}
