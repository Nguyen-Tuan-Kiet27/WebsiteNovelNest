import Userlayout from '@/Layouts/UserLayout';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import './TheLoai.scss';
import ListCategory from '../../Components/ListCategory';
export default function TheLoai({ user,theLoais,login}) {
 
  console.log(theLoais)
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
    <Userlayout title="TheLoai" login={login} page={2}>
      <div className="category-page">
          <div className="header-category">
            <button className="back-arrow" onClick={() => router.visit('/')}>←</button>
            <h2>Danh sách thể loại truyện</h2>
          </div>
          
        <ListCategory items={theLoais} />
      </div>
    </Userlayout>
  );


}

