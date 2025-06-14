import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './DetailStory.scss';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function DocTruyen({chuong}) {
    const chuong1={
        id: 1,ten: 'bông hoa',soChuong:15,
        noiDung:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
    }
  return (
    <div className="doc-truyen">
      <div className="doc-header">
        <button className="back-btn"
        onClick={() => router.visit(`/truyen/{$id}`)}>←</button>
        <span className="chapter-title">{`Chương ${chuong1.soChuong}: ${chuong1.ten}`}</span>
      </div>
      <div className="doc-main">
        <div className="doc-content-wrapper">
          <div className="doc-nav">
            <button>Chương trước</button>
            <button>
              Tóm tắt chương trước <FontAwesomeIcon icon={faList} />
            </button>
            <button>Chương tiếp</button>
          </div>
          <div className="doc-content">
            <p>{chuong1.noiDung}</p>
          </div>
          <div className="doc-nav">
            <button>Chương trước</button>
            <button>
              <FontAwesomeIcon icon={faList} />
            </button>
            <button>Chương tiếp</button>
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
  );
}
