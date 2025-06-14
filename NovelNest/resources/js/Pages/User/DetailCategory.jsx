import React from 'react';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import './DetailCategory.scss';
import Userlayout from '@/Layouts/UserLayout';


export default function DetailCategory() {
  const category = { id: 1, title: 'Hành động' };
  const truyens = [
    { id: 1, title: 'Truyện 1', img: 'Dau-pha-thuong-khung-cover.jpg', views: 123 },
    { id: 2, title: 'Truyện 2', img: 'Dau-pha-thuong-khung-cover.jpg', views: 456 },
    { id: 3, title: 'Truyện 3', img: 'Dau-pha-thuong-khung-cover.jpg', views: 789 },
    { id: 4, title: 'Truyện 4', img: 'Dau-pha-thuong-khung-cover.jpg', views: 234 },
    { id: 5, title: 'Truyện 5', img: 'Dau-pha-thuong-khung-cover.jpg', views: 678 },
    { id: 6, title: 'Truyện 6', img: 'Dau-pha-thuong-khung-cover.jpg', views: 890 },
    { id: 7, title: 'Truyện 7', img: 'Dau-pha-thuong-khung-cover.jpg', views: 135 },
    { id: 8, title: 'Truyện 8', img: 'Dau-pha-thuong-khung-cover.jpg', views: 246 },
  ];

  return (
    <Userlayout title="Home">

    <div className="detail-category-page">
      <div className="detail-header">
        <button className="back-arrow" onClick={() => router.visit('/theloai')}>
          ←
        </button>
        <h2>Danh sách truyện của thể loại {category.title}</h2>
      </div>

      <div className="detail-grid">
        {truyens.map((story) => (
          <div
            key={story.id}
            className="detail-card"
            onClick={() => router.visit(`/truyen/${story.id}`)}
          >
            <img src={`/img/truyen/hinhAnh/${story.img}`} alt={story.title} />
            <div className="info">
              <div className="title">{story.title}</div>
              <div className="count">{story.views} lượt xem</div>
            </div>
          </div>
        ))}
      </div>
    </div>
      </Userlayout>
  );
}
