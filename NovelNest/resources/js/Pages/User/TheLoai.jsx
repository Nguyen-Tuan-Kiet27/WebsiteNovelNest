import Userlayout from '@/Layouts/UserLayout';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import './TheLoai.scss';
import ListCategory from '../../Components/ListCategory';
export default function TheLoai({ user }) {
  const categories = [
    { id: 1, title: 'Hành động', count: 24, img: 'Dau-pha-thuong-khung-cover.jpg' },
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

 const [status, setStatus] = useState('all');
  const [chapterRange, setChapterRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const toggleSort = () => setShowSort(prev => !prev);
  const toggleFilter = () => setShowFilter(prev => !prev);

  const handleApply = () => {
    router.visit(`/theloai?status=${status}&chapterRange=${chapterRange}&sortBy=${sortBy}`);
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
    <Userlayout title="TheLoai">
      <div className="category-page">
          <div className="header-category">
            <button className="back-arrow" onClick={() => router.visit('/')}>←</button>
            <h2>Danh sách thể loại truyện</h2>
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
        <ListCategory items={categories} />
      </div>
    </Userlayout>
  );


}

