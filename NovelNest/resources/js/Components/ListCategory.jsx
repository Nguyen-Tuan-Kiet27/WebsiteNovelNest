// resources/js/Pages/DetailCategory.jsx

import React from 'react';
import { router } from '@inertiajs/react';
import './ListCategory.scss'


export default function ListCategory({ items, onClickItem }) {
  return (
    <div className="category-grid">
      {items.map((item) => (
        <div
          key={item.id}
          className="category-card"
          onClick={() => onClickItem?.(item.id)}
        >
          <img src={`/img/theLoai/${item.img}`} alt={item.title} />
          <div className="info">
            <div className="title">{item.title}</div>
            <div className="count">{item.count} truyện</div>
          </div>
        </div>
      ))}
    </div>
  );
}
