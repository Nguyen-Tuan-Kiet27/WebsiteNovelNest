import { useState, useEffect } from 'react';
import './DetailBlogStory.scss';
import { router } from '@inertiajs/react';
import Userlayout from '@/Layouts/UserLayout';

export default function DetailBlogStory({detailBlog,randomBlogs}){
    return(
        <Userlayout title={'Detail Blog'}>
             <div className="blog-detail">
                <div className="blog-main">
                    <img className="blog-image" src={detailBlog.hinhAnh} alt />
                    <h3 className='blog-title'>
                        {detailBlog.tieuDe}
                    </h3>
                    <div className="blog-content">
                        <p>{detailBlog.noiDung}</p>
                        <div className="blog-text" dangerouslySetInnerHTML={{ __html: detailBlog.content }} />
                    </div>
                </div>
                    <div className="related-blogs">
                        <h3>Các review đánh giá truyện khác</h3>
                        <div className="related-list">
                            {randomBlogs.map(item => (
                            <div key={item.id}  className="related-item" onClick={() => router.visit(`/blogtruyen/${item.id}`)}>
                                <img src={item.hinhAnh} alt={item.tieuDe} />
                            <h4>{item.tieuDe}</h4>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </Userlayout>
    );
}