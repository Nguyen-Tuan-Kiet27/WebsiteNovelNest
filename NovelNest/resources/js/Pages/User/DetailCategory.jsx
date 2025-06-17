import React from 'react';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import './DetailCategory.scss';
import Userlayout from '@/Layouts/UserLayout';


export default function DetailCategory({truyens,theLoai}) {
console.log(truyens)
  return (
    <Userlayout title="Home">

    <div className="detail-category-page">
      <div className="detail-header">
        <button className="back-arrow" onClick={() => router.visit('/theloai')}>
          ←
        </button>
        <h2>Danh sách truyện của thể loại {theLoai.ten}</h2>
      </div>

      <div className="detail-grid">
        {truyens.map((story) => (
          <div
            key={story.id}
            className="detail-card"
            onClick={() => router.visit(`/truyen/${story.id}`)}
          > 
            <img src={`/img/truyen/hinhAnh/${story.hinhAnh}`} alt={story.ten} />
            <div className="info">
              <div className="title">{story.ten}</div>
              <div className="count">{story.luotXem} lượt xem</div>
            </div>
          </div>
        ))}
      </div>
    </div>
      </Userlayout>
  );
}
