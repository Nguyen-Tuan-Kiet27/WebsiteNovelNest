import { useState, useEffect } from 'react';
import './blogStories.scss';
import Userlayout from '@/Layouts/UserLayout';
import { router } from '@inertiajs/react';

export default function blogStories({blogTruyen,login}){
    const [blogs, setBlogs] = useState(blogTruyen);
    const [visibleCount, setVisibleCount] = useState(5);


    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 5);
    };
    return(
        <Userlayout title="BlogTruyen" login={login} page={3}>
                <div className="container-blog">
                    {blogs.slice(0, visibleCount).map(blog => (
                        <div key={blog.id} className="blog-item" onClick={() => router.visit(`/blogtruyen/${blog.id}`)}>
                            <div className="image-wrapper">
                                <img src={'/img/blog/'+blog.hinhAnh} alt="Ảnh" />
                            </div>
                            <div className="blog-info">
                                <h5>{blog.tieuDe}</h5>
                            <p>{blog.noiDung.length > 200 ? blog.noiDung.slice(0, 200) + '...' : blog.noiDung}</p>
                                <small>{blog.ngayTao}</small>
                            </div>
                        </div>
                    ))}

                {visibleCount < blogs.length && (
                    <div className="load-more-wrapper">
                        <button onClick={handleLoadMore}>Xem thêm</button>
                    </div>
                )}
            </div>
        </Userlayout>
    );
}