import React from 'react';
import { router, usePage  } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import './DetailCategory.scss';
import Userlayout from '@/Layouts/UserLayout';

export default function DetailCategory({user,truyens,pageCount}) {
  console.log(truyens);
  const truyens1 = truyens.slice(0, 10);          // 10 cái đầu
  const truyens2 = truyens.slice(10,20);
  const truyens3 = truyens.slice(10,20);    
  const {url} = usePage();
  const queryString = url.split('?')[1]; // Lấy phần query string sau dấu ?
  const query = Object.fromEntries(new URLSearchParams(queryString));

  const [status, setStatus] = useState('all');
  const [chapterRange, setChapterRange] = useState('all');
  const [sortBy, setSortBy] = useState('new');
  const [page,setPage] = useState(1);
  const [searchText,setSearchText] = useState("");

  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const toggleSort = () => setShowSort(prev => !prev);
  const toggleFilter = () => setShowFilter(prev => !prev);

  useEffect(()=>{
    setStatus(query.status || 'all');
    setChapterRange(query.chapterRange || 'all');
    setSortBy(query.sortBy || 'new');
    setPage(query.page||1);
    setSearchText(query.searchText||"");
  },[])

  useEffect(()=>{
    console.log('page:',page)
  },[page])

  const handleApply = () => {
    router.visit(`/search?status=${status}&chapterRange=${chapterRange}&sortBy=${sortBy}&page=${page}&searchText=${searchText}`);
    setShowFilter(false);
    setShowSort(false);
  };

  const handleChangePage = (i) => {
    if(i!=page)
      router.visit(`/search?status=${status}&chapterRange=${chapterRange}&sortBy=${sortBy}&page=${i}&searchText=${searchText}`);
    setShowFilter(false);
    setShowSort(false);
  };

  const statusOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Hoàn thành', value: 'done' },
    { label: 'Đang ra', value: 'writing' }
  ];

  const chapterOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: '< 50', value: 'lt50' },
    { label: '50 - 100', value: '50-100' },
    { label: '100 - 200', value: '100-200' },
    { label: '200 - 500', value: '200-500' },
    { label: '500 - 1000', value: '500-1000' },
    { label: '> 1000', value: 'mr1000' }
  ];

  const sortOptions = [
    { label: 'Mới nhất', value: 'new' },
    { label: 'Xem nhiều', value: 'view' },
  ];
  return (
    <Userlayout title="Tìm Kiếm" login={user}>
      <div className="detail-category-page">
        <div className="detail-header">
          <button className="back-arrow" onClick={() => router.visit('/theloai')}>
            ←
          </button>
          <h2>Tìm kiếm: {searchText}</h2>
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
          {truyens1.map((story) => (
            <div
              key={story.id}
              className="detail-card"
              onClick={() => router.visit(`/truyen/${story.id}`)}
              title={story.ten}
            > 
              <img src={`/img/truyen/hinhAnh/${story.hinhAnh}`} alt={story.ten} />
              <div className="info">
                <div className="title"> {story.ten.length > 30 ? story.ten.slice(0, 30) + '...' : story.ten}</div>
                <div className="count">{story.luotXem} lượt xem</div>
              </div>
            </div>
          ))}
        </div>
        <div className="detail-grid">
          {truyens2.map((story) => (
            <div
              key={story.id}
              className="detail-card"
              onClick={() => router.visit(`/truyen/${story.id}`)}
              title={story.ten}
            > 
              <img src={`/img/truyen/hinhAnh/${story.hinhAnh}`} alt={story.ten} />
              <div className="info">
                <div className="title"> {story.ten.length > 30 ? story.ten.slice(0, 30) + '...' : story.ten}</div>
                <div className="count">{story.luotXem} lượt xem</div>
              </div>
            </div>
          ))}
        </div>
        <div className="detail-grid">
          {truyens3.map((story) => (
            <div
              key={story.id}
              className="detail-card"
              onClick={() => router.visit(`/truyen/${story.id}`)}
              title={story.ten}
            > 
              <img src={`/img/truyen/hinhAnh/${story.hinhAnh}`} alt={story.ten} />
              <div className="info">
                <div className="title"> {story.ten.length > 30 ? story.ten.slice(0, 30) + '...' : story.ten}</div>
                <div className="count">{story.luotXem} lượt xem</div>
              </div>
            </div>
          ))}
        </div>
        <div className='phanTrang'>
          <div>
            {
              pageCount!=1 && Array.from({ length: pageCount }, (_, i) => (
                <button key={i + 1} className={i+1 == page?'atc':''} onClick={()=>handleChangePage(i+1)}>{i + 1}</button>
              ))
            }
          </div>
        </div>
      </div>
    </Userlayout>
  );
}
