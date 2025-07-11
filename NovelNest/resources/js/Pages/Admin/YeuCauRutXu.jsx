import './YeuCauRutXu.scss';
import AdminLayout from '../../Layouts/AdminLayout';
import { BsCopy } from "react-icons/bs";
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import LyDo from '../../Components/LyDo';
import VerifyPass from '../../Components/VerifyPass';
export default function({user,LSRs}){
    const [yeuCauRuts,setYeuCauRuts]=useState(LSRs);
    const [xuLy,setXuLy] = useState(null);
    const [daNhan,setDaNhan] = useState(false);
    const xuLyRef = useRef(null);
    const daNhanRef = useRef(false);

    useEffect(() => {
        const channel = window.Echo.channel('admin-lich-su-rut');

        channel.listen('.LichSuRutMoi', (e) => {
            setYeuCauRuts(prev => [...prev,e.lichSuRut]);
        });

        channel.listen('.AnLichSuRut', (e) => {
            setYeuCauRuts((prev) => prev.filter(x => x.id !== e.lichSuRut.id));
            console.log('Nhận được data :', e.lichSuRut)
        });

        const handleBeforeUnload = () => {
            if (daNhanRef.current && xuLyRef.current) {
                const blob = new Blob(
                    [JSON.stringify({ id: xuLyRef.current.id })],
                    { type: 'application/json' }
                );
                navigator.sendBeacon('/api/admin/huynhanyeucau', blob);
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);


        return () => {
            window.Echo.leave('admin-lich-su-rut');
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (daNhanRef.current && xuLyRef.current) {
                axios.post('/api/admin/huynhanyeucau', { id: xuLyRef.current.id });
            }
        };
    }, []);

    const handleNhanXuLy = async (yeuCau)=>{
        try {
            const response = await axios.put('/api/admin/nhanyeucau',{id:yeuCau.id});
            setXuLy(yeuCau);
            xuLyRef.current = yeuCau;
            setDaNhan(true);
            daNhanRef.current = true;
        } catch (error) {
            alert(error.response.data.message);
            console.log(error.response.data.message);
            console.log(error.response.data.error);
        }
    }

    const handleHuyNhanXuLy = async ()=>{
        try {
            const response = await axios.post('/api/admin/huynhanyeucau',{id:xuLy.id});
            setXuLy(null);
            xuLyRef.current = null;
            setDaNhan(false);
            daNhanRef.current = false;
        } catch (error) {
            alert(error.response.data.message);
            console.log(error.response.data.message);
            console.log(error.response.data.error);
        }
    }

    const [showLyDo,setShowLyDo] = useState(false);
    const [lyDo,setLyDo] = useState('');
    const [showPassTC,setShowPassTC] = useState(false);
    const handleTuChoi = async ()=>{
        try {
            const response = await axios.put('/api/admin/tuchoiyeucau',{id:xuLy.id,lyDo:lyDo})
            setXuLy(null);
            xuLyRef.current = null;
            setDaNhan(false);
            daNhanRef.current = false;
            setShowPassTC(false)
            setShowLyDo(false)
            alert('Đã từ chối yêu cầu rút tiền!');
        } catch (error) {
            alert(error.response.data.message);
            console.log(error.response.data.error);
        }
    }

    const [showPassHT,setShowPassHT] = useState(false);
    const handleHoanThanh = async ()=>{
        try {
            const response = await axios.put('/api/admin/hoanthanhyeucau',{id:xuLy.id})
            setXuLy(null);
            xuLyRef.current = null;
            setDaNhan(false);
            daNhanRef.current = false;
            setShowPassHT(false)
            alert('Đã hoàn thành yêu cầu rút tiền!');
            
        } catch (error) {
            alert(error.response.data.message);
            console.log(error.response.data.error);
        }
    }


    return(
        <AdminLayout user={user} page='5' title='Quản lý yêu cầu rút tiền'>
            <LyDo isShow={showLyDo} setIsShow={setShowLyDo} onOk={(e)=>{setLyDo(e); setShowPassTC(true)}}/>
            <VerifyPass isShow={showPassTC} setIsShow={setShowPassTC} onOk={handleTuChoi}/>
            <VerifyPass isShow={showPassHT} setIsShow={setShowPassHT} onOk={handleHoanThanh}/>
            <div className="QuanLyThongTinWeb">
                {daNhan && (
                    <div className='XuLyYeuCau'>
                        <div className='main'>
                            <h3>Chuyển khoản</h3>
                            <div>
                                <div>
                                    <p>Tên ngân hàng:</p>
                                    <p>Số tài khoản:</p>
                                    <p>Tên người nhận:</p>
                                    <p>Số tiền:</p>
                                </div>
                                <div>
                                    <p>{xuLy.tenNganHang}</p>
                                    <p>{xuLy.soTaiKhoan}</p>
                                    <p>{xuLy.tenNguoiNhan}</p>
                                    <p>{xuLy.giaTri} VNĐ</p>
                                </div>
                            </div>
                            <div>
                                <button onClick={handleHuyNhanXuLy}>Hủy</button>
                                <button onClick={()=>setShowLyDo(true)}>Từ chối</button>
                                <button onClick={()=>setShowPassHT(true)}>Hoàn thành</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="main">
                    <div className="head">
                        <h1>Quản lý yêu cầu rút tiền</h1>
                    </div>
                    <div className="body">
                            <table>
                                <thead>
                                    <tr>
                                        <th className='id'>UID</th>
                                        <th className='soTaiKhoan'>Số tài khoản</th>
                                        <th className='tenNganHang'>Tên ngân hàng</th>
                                        <th className='giaTri'>Số tiền (VNĐ)</th>
                                        <th className='hanhDong'>Hành động</th>
                                    </tr>
                                </thead>
                            </table>
                            <div>
                                <table>
                                    <tbody>
                                        {yeuCauRuts.map(i=>(
                                            <tr key={i.id}>
                                                <td className='id'>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const target = e.currentTarget;
                                                            target.style.color = 'red';
                                                            navigator.clipboard.writeText(i.id_NguoiDung);
                                                            setTimeout(() => {
                                                            target.style.color = 'black';
                                                            }, 1000);
                                                        }}
                                                        title="Copy ID"
                                                    >
                                                        <BsCopy />
                                                    </button>
                                                </td>
                                                <td className='soTaiKhoan'>{i.soTaiKhoan}</td>
                                                <td className='tenNganHang'>{i.tenNganHang}</td>
                                                <td className='giaTri'>{i.giaTri}</td>
                                                <td className='hanhDong'>
                                                    <button
                                                        onClick={()=>handleNhanXuLy(i)}
                                                    >Nhận xử lý</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}