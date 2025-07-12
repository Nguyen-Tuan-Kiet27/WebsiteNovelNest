import { useEffect, useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import './DashBoard.scss';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie,Cell
} from 'recharts';
export default function DashBoard({user,tacGiaPNguoiDung,doanhThuTheoNgay,doanhThuTheoThang,doanhThuTheoNam,napRutTheoNgay,napRutTheoThang,napRutTheoNam,nguoiDungTheoNgay,nguoiDungTheoThang,nguoiDungTheoNam}){
    const [select,setSelect] = useState(0)
    const [selectNguoiDung,setSelectNguoiDung] = useState(0)
    const [selectDoanhThu,setSelectDoanhThu] = useState(0)

    return(
        <AdminLayout user={user} page={1} title='Thống kê'>
            <div className='ThongKeAdmin'>
                <h1>Dash Board</h1>
                <div className='thongKeDoiTuong'>
                    <div className='nguoiDungMoi'>
                        <div>
                            <h4>Số lượng người dùng mới:</h4>
                            <select value={selectNguoiDung} onChange={e=>setSelectNguoiDung(e.target.value)}>
                                <option value="0">Tháng Này</option>
                                <option value="1">Năm Nay</option>
                                <option value="2">Từng Năm</option>
                            </select>
                        </div>
                        <div className='bieuDo'>
                            <ResponsiveContainer width="93%" height={350}>
                                <BarChart data={[nguoiDungTheoNgay,nguoiDungTheoThang,nguoiDungTheoNam][selectNguoiDung]} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="thoiGian" />
                                    <YAxis />
                                    <Tooltip/>
                                    <Bar dataKey="soLuong" fill="#8884d8" name='Số Lượng:'/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className='soLuongTacGia'>
                            <h4>Số lượng tác giả/độc giả:</h4>
                            <div>
                                <div>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={tacGiaPNguoiDung}
                                                cx="175px"
                                                cy="175px"
                                                // label={({ name, percent }) => `${name}: ${percent}%`}
                                                // outerRadius={120}
                                                fill="#8884d8"
                                                dataKey="soLuong"
                                                // labelLine={false}
                                            >
                                                {tacGiaPNguoiDung.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={['#FF8042','#0088FE'][index % 2]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => {
                                                    const total = tacGiaPNguoiDung.reduce((sum, i) => sum + i.soLuong, 0);
                                                    const percent = ((value / total) * 100).toFixed(1);
                                                    return [`${value} người`, `${percent}%`];
                                                }}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                    </div>
                </div>
                <div className='thongKeDoanhThu'>
                    <div>
                        <h4>Thống kê doanh thu:</h4>
                        <select value={selectDoanhThu} onChange={e=>setSelectDoanhThu(e.target.value)}>
                            <option value="0">Tháng Này</option>
                            <option value="1">Năm Nay</option>
                            <option value="2">Từng Năm</option>
                        </select>
                    </div>
                    <div className='bieuDo'>
                        <ResponsiveContainer width="95%" height={400}>
                            <LineChart data={[doanhThuTheoNgay,doanhThuTheoThang,doanhThuTheoNam][selectDoanhThu]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="thoiGian" />
                                <YAxis />
                                <Tooltip formatter={(value) => new Intl.NumberFormat().format(value) + ' Xu'} />
                                <Legend />
                                <Line type="monotone" dataKey="heThong" stroke='#8884d8' name="Doanh thu hệ thống" />
                                <Line type="monotone" dataKey="tacGia" stroke='#82ca9d' name="Doanh thu tác giả" />
                                <Line type="monotone" dataKey="loiNhuan" stroke='#ff7300' name="Lợi nhuận hệ thống" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className='optison'>
                    <h4>Thống kê lượng nạp/rút: </h4>
                    <select value={select} onChange={e=>setSelect(e.target.value)}>
                        <option value="0">Tháng Này</option>
                        <option value="1">Năm Nay</option>
                        <option value="2">Từng Năm</option>
                    </select>
                </div>
                <div className='bieuDo'>
                    <ResponsiveContainer width="95%" height={400} className='chart'>
                        <LineChart data={[napRutTheoNgay,napRutTheoThang,napRutTheoNam][select]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="thoiGian" />
                            <YAxis />
                            <Tooltip formatter={(value) => new Intl.NumberFormat().format(value) + ' VNĐ'} />
                            <Legend />
                            <Line type="monotone" dataKey="tongNap" stroke="#82ca9d" strokeWidth={2} name='Tổng nạp'/>
                            <Line type="monotone" dataKey="tongRut" stroke="#ff6384" strokeWidth={2} name='Tổng rút'/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </AdminLayout>
    )
}