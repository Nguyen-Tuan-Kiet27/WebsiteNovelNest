import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './DetailStory.scss';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Userlayout from '@/Layouts/UserLayout';

export default function DocTruyen({chuong,truyen,chuongCuoi,idChuongTruoc,idChuongSau}) {
  console.log(idChuongTruoc);
  console.log(idChuongSau);

  const handleChuongTruoc=()=>{
    router.visit(`/chuong/${idChuongTruoc}`);
  }
  const handleChuongSau=()=>{
    router.visit(`/chuong/${idChuongSau}`);
  }
  const [showModal, setShowModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const handleClickChapter = (chapter) => {
      if (chapter?.gia > 0 && !chapter?.daMua) {
        setSelectedChapter(chapter);
        setShowModal(true);
      } else {
        router.visit(`/chuong/${chapter.id}`);
      }
  };
  return (
    <Userlayout>
      <div className="doc-truyen">
        <div className="doc-header">
          <button className="back-btn"
          onClick={() => router.visit(`/truyen/${chuong.id_Truyen}`)}>←</button>
          <span className="chapter-title">{`${truyen.ten} - Chương ${chuong.soChuong}: ${chuong.ten}`}</span>
        </div>
        <div className="doc-main">
          <div className="doc-content-wrapper">
            <div className="doc-nav">
              <button onClick={handleChuongTruoc} style={{opacity:chuong.soChuong==1?'0.5':'1'}} disabled={chuong.soChuong==1?true:false}>Chương trước</button>
              <button>
                Tóm tắt chương trước 
              </button>
              <button onClick={handleChuongSau} style={{opacity:chuongCuoi?'0.5':'1'}} disabled={chuongCuoi} >Chương tiếp</button>
            </div>
            <div className="doc-content" dangerouslySetInnerHTML={{ __html: chuong.noiDung }}/>
            <div className="doc-nav">
              <button onClick={handleChuongTruoc} style={{opacity:chuong.soChuong==1?'0.5':'1'}} disabled={chuong.soChuong==1?true:false}>Chương trước</button>
              <button>
                <FontAwesomeIcon icon={faList} />
              </button>
              <button onClick={handleChuongSau} style={{opacity:chuongCuoi?'0.5':'1'}} disabled={chuongCuoi}>Chương tiếp</button>
            </div>
          </div>
          <div className="doc-report">
            <button className="report-btn">Báo cáo vi phạm</button>
            <ul>
              <li>- Vi phạm pháp luật.</li>
              <li>- Ảnh hưởng đến quyền lợi Việt Nam.</li>
              <li>- Vi phạm bản quyền.</li>
            </ul>
          </div>
        </div>
      </div>

    </Userlayout>
   
  );
}
