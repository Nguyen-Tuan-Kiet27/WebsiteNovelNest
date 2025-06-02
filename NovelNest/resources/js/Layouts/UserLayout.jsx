import './Userlayout.scss';
export default function Userlayout({children}){
    return(
        <>
            <header>
                <div className="header">
                    <div className='subHeader'>
                        <div>
                            <img src="/img/logo_v3.png" alt="" />
                        </div>
                        

                            <button className='buttonHeader'>
                                <img src="/img/khampha.svg" alt="" />
                                Khám Phá
                            </button>
                            <button className='buttonHeader'>
                                <img src="/img/theloai.svg" alt="" />
                                Thể Loại
                            </button>
                            <button className='buttonHeader'>
                                <img src="/img/blog.svg" alt="" />
                                Blog Truyện
                            </button>
                            <button className='buttonHeader'>
                                <img src="/img/dangtruyen.svg" alt="" />
                                Đăng Truyện
                            </button>
                            <button className='buttonHeader'>
                                <img src="/img/dangnhap.svg" alt="" />
                                Đăng Nhập
                            </button>
                            
                            <div className='searchHeader'>
                                <input className='inputSearchHeader' type="text"
                                />
                               <img src="/img/search.svg" alt="" />
                            </div>
                    </div>
                </div>
                   
              
            </header>
            <main>
            {children}
            </main>
        </>

    );
}