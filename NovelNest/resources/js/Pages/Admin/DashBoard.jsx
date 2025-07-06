import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import './DashBoard.scss';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
export default function DashBoard({user,top3Truyen,top3TacGia,soLuongTacGia,doanhThuHeThong,doanhThuTacGia,loiNhuanHeThong,napTheoNgay,napTheoThang,napTheoNam}){
    const [select,setSelect] = useState(0)
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
            <div style={{ background: "#fff", border: "1px solid #ccc", padding: 10 }}>
                <p><strong>{label}</strong></p>
                <p style={{ color: '#8884d8' }}>Tổng nạp: {payload[0].value.toLocaleString()}vnđ</p>
            </div>
            );
        }

        return null;
    };
    return(
        <AdminLayout user={user} page={1} title='Thống kê'>
            <div className='ThongKeAdmin'>
                <h1>Dash Board</h1>
                <div className='thongKeDoiTuong'>
                    <div className='top3Truyen'>
                        <h4>Top 3 truyện có doanh thu tác giả cao nhất</h4>
                        {
                            top3Truyen.map((i)=>(
                                <div key={i.id}>
                                    <p>{i.ten}</p>
                                    <p>{i.doanhThu}Xu</p>
                                </div>
                            ))
                        }
                        <a href='/admin/quanlytruyen?sort=thugiam'>xem thêm</a>
                    </div>
                    <div className='top3TacGia'>
                        <h4>Top 3 tác giả có doanh thu cao nhất</h4>
                        {
                            top3TacGia.map((i)=>(
                                <div key={i.id}>
                                    <p>{i.ten}</p>
                                    <p>{i.doanhThu}Xu</p>
                                </div>
                            ))
                        }
                        <a href='/admin/quanlytacgia?&sort=thugiam'>xem thêm</a>
                    </div>
                    <div className='soLuongTacGia'>
                        <div>
                            <h4>Số lượng tác giả</h4>
                            <p>{soLuongTacGia}</p>
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
                <div className='thongKeDoanhThu'>
                    <div className='doanhThuHeThong'>
                        <h4>Doanh thu nền tảng</h4>
                        <div>
                            <p>{doanhThuHeThong}</p>
                            <p>Xu</p>
                        </div>
                    </div>
                    <div className='doanhThuLoiNhuan'>
                        <h4>Lợi nhuận nền tảng</h4>
                        <div>
                            <p>{loiNhuanHeThong}</p>
                            <p>Xu</p>
                        </div>
                    </div>
                    <div className='doanhThuTacGia'>
                        <h4>Doanh thu tác giả</h4>
                        <div>
                            <p>{doanhThuTacGia}</p>
                            <p>Xu</p>
                        </div>
                    </div>
                </div>
                <div className='optison'>
                    <h4>Thống kê lượng nạp</h4>
                </div>
                <div className='optison' style={{paddingTop:'10px'}}>
                    <p>Xem theo:</p>
                    <select value={select} onChange={e=>setSelect(e.target.value)}>
                        <option value="0">Tháng Này</option>
                        <option value="1">Năm Nay</option>
                        <option value="2">Từng Năm</option>
                    </select>
                </div>
                <div className='bieuDo'>
                    {console.log(napTheoNgay)}
                    <ResponsiveContainer width="95%" height={400} className='chart'>
                        <LineChart data={[napTheoNgay,napTheoThang,napTheoNam][select]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="thoiGian" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="tongNap" stroke="#8884d8" strokeWidth={2} name='Tổng nạp'/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </AdminLayout>
    )
}