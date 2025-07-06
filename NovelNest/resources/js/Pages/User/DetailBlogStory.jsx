import { useState, useEffect } from 'react';
import './DetailBlogStory.scss';
import { router } from '@inertiajs/react';
import Userlayout from '@/Layouts/UserLayout';

export default function DetailBlogStory({login,detailBlog,randomBlogs}){
    
    return(
        <Userlayout title='Detail Blog' login={login} page={3}>
            <div className='tong'>
                <button className="back-arrow" onClick={() => window.history.back()}>←</button>
                <div className="blog-detail">
                    <div className="blog-main">
                        <img className="blog-image" src={'/img/blog/'+detailBlog.hinhAnh} alt={detailBlog.hinhAnh} />
                        <h3 className='blog-title'>
                            {detailBlog.tieuDe}
                        </h3>
                        <div className="blog-content">
                            <div className="blog-text">
                                {/* {detailBlog.noiDung.split('\n').map((line, index) => (
                                    <p key={index}>{line.trim()}</p>
                                ))} */}
                                <div dangerouslySetInnerHTML={{ __html: detailBlog.noiDung }} />
                            </div>
                        </div>
                    </div>
                        <div className="related-blogs">
                            <h3>Các review đánh giá truyện khác</h3>
                            <div className="related-list">
                                {randomBlogs.map(item => (
                                <div key={item.id}  className="related-item" onClick={() => router.visit(`/blogtruyen/${item.id}`)}>
                                    <img src={'/img/blog/'+item.hinhAnh} alt={item.tieuDe} />
                                <h4>{item.tieuDe}</h4>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
           
        </Userlayout>
    );
}