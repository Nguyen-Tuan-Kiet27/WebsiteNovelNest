import React from 'react';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import './DetailCategory.scss';
import Userlayout from '@/Layouts/UserLayout';


export default function DetailCategory({truyens,theLoai}) {
console.log(truyens)

    const [status, setStatus] = useState('all');
  const [chapterRange, setChapterRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const toggleSort = () => setShowSort(prev => !prev);
  const toggleFilter = () => setShowFilter(prev => !prev);

  const handleApply = () => {
    router.visit(`/theloai/${theLoai.id}?status=${status}&chapterRange=${chapterRange}&sortBy=${sortBy}`);
    setShowFilter(false);
    setShowSort(false);
  };

  const statusOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Hoàn thành', value: 'completed' },
    { label: 'Đang ra', value: 'ongoing' }
  ];

  const chapterOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: '< 50', value: 'lt50' },
    { label: '50 - 100', value: '50-100' },
    { label: '100 - 200', value: '100-200' },
    { label: '200 - 500', value: '200-500' },
    { label: '500 - 1000', value: '500-1000' },
    { label: '1000', value: '1000' }
  ];

  const sortOptions = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Xem nhiều', value: 'popular' },
    { label: 'Đánh giá cao', value: 'top-rated' }
  ];
  return (
    <Userlayout title="Home">
      <div className="detail-category-page">
        <div className="detail-header">
          <button className="back-arrow" onClick={() => router.visit('/theloai')}>
            ←
          </button>
          <h2>Danh sách truyện của thể loại {theLoai.ten}</h2>
        </div>
        <div className="top-buttons">
              <button className="toggle-btn" onClick={toggleSort}>
                <img src="/img/sapxep.svg" alt="" /> Sắp xếp
              </button>
              <button className="toggle-btn" onClick={toggleFilter}>
                <img src="/img/image 13.svg" alt="" /> Phân loại
              </button>
            </div>
            {showSort && (
            <div className="modal-overlay" onClick={() => setShowSort(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h4>Sắp xếp theo</h4>
                {sortOptions.map(opt => (
                  <button key={opt.value}
                    className={sortBy === opt.value ? 'active' : ''}
                    onClick={() => setSortBy(opt.value)}>
                    {opt.label}
                  </button>
                ))}
                <button className="apply-btn" onClick={handleApply}>Áp dụng</button>
              </div>
            </div>
            )}
            {showFilter && (
            <div className="modal-overlay" onClick={() => setShowFilter(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h4>Phân loại theo</h4>
                <div className="filter-group">
                  <label>Trạng thái:</label>
                  <div className="filter-options">
                    {statusOptions.map(opt => (
                      <button key={opt.value}
                              className={status === opt.value ? 'active' : ''}
                              onClick={() => setStatus(opt.value)}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label>Số chương:</label>
                  <div className="filter-options">
                    {chapterOptions.map(opt => (
                      <button key={opt.value}
                              className={chapterRange === opt.value ? 'active' : ''}
                              onClick={() => setChapterRange(opt.value)}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="apply-btn" onClick={handleApply}>Áp dụng</button>
              </div>
            </div>
          )}

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
