import Userlayout from '@/Layouts/UserLayout';
import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import './Stories.scss';
import CardStories from '../../Components/CardStories';
import { FaRegHeart, FaShareSquare, FaHeart  } from 'react-icons/fa';
import axios from 'axios';





export default function Stories({favorite,login,truyen,chuongs, soLuong,truyenDaHoanThanhs}) {
    console.log(truyen);
    const traiRef = useRef();
    const [traiHeight, setTraiHeight] = useState(0);
    const [traiHeight2, setTraiHeight2] = useState(0);

    const [love,setLove]=useState(favorite);
   

    useEffect(() => {
        if (traiRef.current) {
            setTraiHeight(traiRef.current.offsetHeight);
            setTraiHeight2(traiRef.current.offsetHeight-2);
        }
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [selectedChapters, setSelectedChapters] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isAllSelected, setIsAllSelected] = useState(false);

    const handleToggleSelectAll = () => {
        const paidChapters = chuongs.filter(ch => ch.gia > 0);
        
        if (isAllSelected) {
            setSelectedChapters([]);
            setTotalPrice(0);
            setIsAllSelected(false);
        } else {
            setSelectedChapters(paidChapters);
            const total = paidChapters.reduce((sum, ch) => sum + ch.gia, 0);
            setTotalPrice(total);
            setIsAllSelected(true);
        }
        };

  const handleFavorite= async ()=>{
    try {
      const response = await axios.post(
        `/api/favorite/${truyen.id}`
      )
    } catch (error) {
      console.log(error.response.data.message)
    }
   
    
  }
return(
<Userlayout title="Stories" login={login} >
    <div className='container' >
        <div ref={traiRef}>
            <div>
                <div className='storyInformation'>
                    <img src={`/img/truyen/hinhNen/${truyen.hinhNen}`} alt="" />
                    <div className='fas' style={login?{}:{display:'none'}}>
                      <button className='favorite' onClick={handleFavorite}>
                        <FaRegHeart className='i'/>
                      </button>
                      <button>
                        <FaShareSquare className='i'/>
                      </button>
                    </div>
                    
                    <div className='subStoryInformation'>
                        <img src={`/img/truyen/hinhAnh/${truyen.hinhAnh}`} alt="" />
                        <div className='information'>
                            <h5>Tên truyện: {truyen.ten}</h5>
                            <h5>Thể loại: {truyen.the_loai.ten}</h5>
                            <h5>Trạng thái: {truyen.ngayKetThuc?'Chưa hoàn thành':'Đã hoàn thành'}</h5>
                            <h5>Chương: {soLuong}</h5>  
                        </div>
                    </div>
                </div>
            </div>
            <div className='gioiThieu'>
                <h4>Giới thiệu truyện:</h4>
                <div>
                    <p>Giới thiệu: {truyen.gioiThieu}</p>
                </div>
            </div>
        </div>
        <div style={{maxHeight: traiHeight, minHeight:traiHeight}}>
            <div className='storyChapter' style={{maxHeight: traiHeight2}}> 
            
                <button onClick={()=>router.visit(`/chuong/${chuongs[0].id}`)}>
                    Đọc từ đầu
                </button>
                <div className='chuongMoi'>
                    <h5>Chương mới ra</h5>
                    { chuongs.slice(chuongs.length-4).reverse().map((chapter) =>(
                            <li key={chapter.id}
                            >
                                <a
                                    href={`/chuong/${chapter.id}`}
                                   onClick={(e) => {
                                        if (chapter.gia > 0) {
                                            e.preventDefault();
                                            setShowModal(true);
                                            // tự động chọn chương đang click
                                            setSelectedChapters([chapter]);
                                            setTotalPrice(chapter.gia);
                                        }
                                        }}
                                    >
                                    {chapter.ten}
                                </a>
                            </li>
                    ))}
                </div>
                <div className='chuongs'>
                    <h5>Danh sách chương</h5>
                    {chuongs.map((chapter) =>(
                        <li key={chapter.id}>
                           <a
                                href={`/chuong/${chapter.id}`}
                               onClick={(e) => {
                                    if (chapter.gia > 0) {
                                        e.preventDefault();
                                        setShowModal(true);
                                        // tự động chọn chương đang click
                                        setSelectedChapters([chapter]);
                                        setTotalPrice(chapter.gia);
                                    }
                                    }}
                            >
                                {chapter.ten}
                            </a>
                        </li>
                    ))}

                </div>
            </div>
        </div>
    </div>
    <div className='d-flex justify-content-center mt-4 h-100'>
        <div className="hot-stories-wrapper">
            <h3 className="hot-title">Đã hoàn thành</h3>
            <div className="hot-stories-container">
            {truyenDaHoanThanhs.map((story, id) => (
                <CardStories key={story.id} ten={story.ten} hinhAnh={story.hinhAnh} />
            ))}
            </div>
        </div>
    </div>

   

{showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h5>Đây là chương trả phí. Mua ngay để đọc tiếp!</h5>
      <button onClick={handleToggleSelectAll}>
  {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
</button>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Tên chương</th>
            <th>Giá (VND)</th>
          </tr>
        </thead>
        <tbody>
          {chuongs.filter(ch => ch.gia > 0).map(ch => (
            <tr key={ch.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedChapters.some(c => c.id === ch.id)}
                 onChange={(e) => {
                    const isChecked = e.target.checked;
                    if (isChecked) {
                        const newSelected = [...selectedChapters, ch];
                        setSelectedChapters(newSelected);
                        setTotalPrice(prev => prev + ch.gia);
                        if (newSelected.length === chuongs.filter(c => c.gia > 0).length) {
                        setIsAllSelected(true);
                        }
                    } else {
                        const newSelected = selectedChapters.filter(c => c.id !== ch.id);
                        setSelectedChapters(newSelected);
                        setTotalPrice(prev => prev - ch.gia);
                        setIsAllSelected(false);
                    }
                    }}

                />
              </td>
              <td>{ch.ten}</td>
              <td>{ch.gia.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Thông báo ưu đãi nếu chọn chương cuối */}
      {selectedChapters.some(c => c.soChuong === chuongs[chuongs.length - 1].soChuong) && (
        <div style={{ color: "green", marginTop: "10px" }}>
          Khi mua bao gồm chương cuối bạn sẽ được giảm giá 10%
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <strong>Tổng:</strong>{' '}
        {selectedChapters.some(c => c.soChuong === chuongs[chuongs.length - 1].soChuong)
          ? (totalPrice * 0.9).toLocaleString() + ' VND (đã giảm 10%)'
          : totalPrice.toLocaleString() + ' VND'}
      </div>

      {/* Nút điều khiển */}
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={() => {
          setShowModal(false);
          router.visit(`/truyen/${truyen.id}`);
        }}>
          Hủy
        </button>
        <button
          onClick={() => {
            if (selectedChapters.length > 0) {
              // xử lý logic mua ở đây
              const chapterToRead = selectedChapters[0];
              setShowModal(false);
              router.visit(`/chuong/${chapterToRead.id}`);
            }
          }}
        >
          Mua & Đọc
        </button>
      </div>
    </div>
  </div>
)}



</Userlayout>

);

}