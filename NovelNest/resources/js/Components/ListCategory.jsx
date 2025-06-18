// resources/js/Pages/DetailCategory.jsx

import React from 'react';
import { router } from '@inertiajs/react';
import './ListCategory.scss'


export default function ListCategory({ items, onClickItem,theloais }) {
  return (
    <div className="category-grid">
      {items.map((item) => (
        <div
          key={item.id}
          className="category-card"
          onClick={() => router.visit(`/theloai/${item.id}`)}
        >
          <img src={`/img/theLoai/${item.hinhAnh}`} alt={item.title} />
          <div className="info">
            <div className="title">{item.ten}</div>
            <div className="count">{item.soLuongTruyen} truyện</div>
          </div>
        </div>
      ))}
    </div>
  );
}
