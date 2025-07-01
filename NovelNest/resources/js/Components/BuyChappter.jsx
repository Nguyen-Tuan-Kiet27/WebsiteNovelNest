import { router } from '@inertiajs/react';
import './BuyChapter.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import VerifyPass from './VerifyPass';
export default function BuyChapter({isShow,changeShow,select,chuongChuaMua}){
    const [selectedChapters, setSelectedChapters] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [showVP,setShowVP] = useState(false);
    const handleToggleSelectAll = () => {
        
        if (isAllSelected) {
            setSelectedChapters([]);
            setTotalPrice(0);
            setIsAllSelected(false);
        } else {
            setSelectedChapters(chuongChuaMua);
            const total = chuongChuaMua.reduce((sum, ch) => sum + ch.gia, 0);
            setTotalPrice(total);
            setIsAllSelected(true);
        }
    };
    useEffect(()=>{
        if (select) {
            setSelectedChapters([select]);
            setTotalPrice(select?.gia || 0);
        } else {
            setSelectedChapters([]);
            setTotalPrice(0);
        }
    },[select])

    const handleSubmit= async ()=>{
        if (selectedChapters.length > 0) {
            setShowVP(true);
        }
        else{
            alert('Chưa chọn chương để mua')
        }
    }
    const handleVPOk = async ()=>{
        try {
            const response = await axios.post('/api/muachuong',
                {'chuongMuas':selectedChapters},    
            )
            alert(response.data.message);
            router.visit(`/chuong/${select.id}`);
        } catch (error) {
            console.log(error.response.data.message)
            alert(error.response.data.soDu)
        }
    }
    return(
        <>
            <VerifyPass isShow={showVP} setIsShow={setShowVP} onOk={handleVPOk}/>
            {isShow && (
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
                            <th>Giá (Xu)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {chuongChuaMua.map(ch => (
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
                                        if (newSelected.length === chuongChuaMua.length) {
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

                    <div style={{ color: "green", marginTop: "10px" }}>
                    Khi mua bao gồm chương cuối bạn sẽ được giảm giá 10%
                    </div>

                    <div style={{ marginTop: '10px' }}>
                        <strong>Tổng:</strong>{' '}
                        {selectedChapters.some(c => c.soChuong === chuongChuaMua[chuongChuaMua.length - 1].soChuong)
                        ? Math.ceil(totalPrice * 0.9).toLocaleString() + ' Xu (đã giảm 10%)'
                        : totalPrice.toLocaleString() + ' Xu'}
                    </div>

                    {/* Nút điều khiển */}
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button onClick={() => {
                        changeShow(false);
                        }}>
                        Hủy
                        </button>
                        <button
                        onClick={handleSubmit}
                        >
                        Mua & Đọc
                        </button>
                    </div>
                </div>
            </div>
            )}
        </>
    );
}