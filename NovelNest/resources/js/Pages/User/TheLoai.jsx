import Userlayout from '@/Layouts/UserLayout';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import './TheLoai.scss';
import ListCategory from '../../Components/ListCategory';
export default function TheLoai({ user }) {
  const categories = [
    { id: 1, title: 'Hành động', count: 24, img: 'hinh-nen-hoa.jpg' },
    { id: 2, title: 'Tình cảm', count: 18, img: 'hinh-nen-hoa.jpg' },
    { id: 3, title: 'Kinh dị', count: 12, img: 'hinh-nen-hoa.jpg' },
    { id: 4, title: 'Phiêu lưu', count: 33, img: 'hinh-nen-hoa.jpg' },
    { id: 5, title: 'Học đường', count: 10, img: 'hinh-nen-hoa.jpg' },
    { id: 6, title: 'Viễn tưởng', count: 15, img: 'hinh-nen-hoa.jpg' },
    { id: 7, title: 'Hài hước', count: 9, img: 'hinh-nen-hoa.jpg' },
    { id: 8, title: 'Drama', count: 7, img: 'hinh-nen-hoa.jpg' },
    { id: 9, title: 'Lịch sử', count: 5, img: 'hinh-nen-hoa.jpg' },
    { id: 10, title: 'Thể thao', count: 3, img: 'hinh-nen-hoa.jpg' },
    { id: 11, title: 'Bí ẩn', count: 8, img: 'hinh-nen-hoa.jpg' },
    { id: 12, title: 'Âm nhạc', count: 6, img: 'hinh-nen-hoa.jpg' },
    { id: 13, title: 'Trinh thám', count: 4, img: 'hinh-nen-hoa.jpg' },
    { id: 14, title: 'Siêu nhiên', count: 11, img: 'hinh-nen-hoa.jpg' },
    { id: 15, title: 'Chiến tranh', count: 2, img: 'hinh-nen-hoa.jpg' },
    { id: 16, title: 'Cổ trang', count: 13, img: 'hinh-nen-hoa.jpg' },
  ];

 const handleClick = (id) => {
    router.visit(`/theloai/a`);
  };

  return (
  <Userlayout title="TheLoai">
       <div className="category-page">
        <div className="header-category">
          <button className="back-arrow" onClick={() => router.visit('/')}>
               ←
             </button>
          <h2>Danh sách thể loại truyện</h2>
        </div>

        <ListCategory items={categories} onClickItem={handleClick} />
      </div>


  </Userlayout>
   
  );

}

