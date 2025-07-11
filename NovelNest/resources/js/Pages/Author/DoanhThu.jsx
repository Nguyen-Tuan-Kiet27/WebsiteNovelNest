import AuthorLayout from "../../Layouts/AuthorLayout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import './DoanhThu.scss'
import { useState } from "react";
import { router } from "@inertiajs/react";
export default function DoanhThu({user,top3Truyens,truyenDangHoatDong,doanhThuTuan,chartThang,chartNam,chartAll,top10Thang,top10Nam,top10All}){
    console.log(top10Thang)
    const [selected,setSelected] = useState(0);
    return(
        <AuthorLayout page='1' user={user} title='Doanh thu'>
            <div className="DoanhThu">
                <div className="mainDoanhThu">
                    <div className="headDT">
                        <h1>Doanh thu</h1>
                    </div>
                    <div className="bodyDT">
                        <div className="thongKe">
                            <div className="top3">
                                <h5>Top 3 doanh thu cao nhất</h5>
                                {top3Truyens.map(i=>(
                                    <div className="subTop3" key={i.id}>
                                    <p>{i.ten}</p>
                                    <p>{(i.doanhThu)}Xu</p>
                                </div>
                                ))}
                            </div>
                            <div className="truyenHoatDong">
                                <h5>Truyện đang hoạt động</h5>
                                <p>{truyenDangHoatDong}</p>
                            </div>
                            <div className="tuanNayAndRut">
                                <div className="tuanNay">
                                    <h5>Doanh thu tuần này</h5>
                                    <div>
                                        <p className="so">{doanhThuTuan}</p>
                                        <p>Xu</p>
                                    </div>
                                </div>
                                <div className="rut">
                                    <button onClick={()=>router.visit('/author/rutxu')}>Rút xu</button>
                                </div>
                            </div>
                        </div>
                        <div className="chartDT">
                            <h4>Biểu đồ thống kê</h4>
                            <div className="chart">
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        data={[chartThang,chartNam,chartAll][selected]}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="5 5" />
                                        <XAxis dataKey="mocThoiGian" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="tongDoanhThu" fill="#8884d8" name="Doanh thu" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="khac">
                                <div className="tuyChon">
                                    <select value={selected} onChange={(e) => setSelected(e.target.value)}>
                                        <option value="0">Tháng Này</option>
                                        <option value="1">Năm Nay</option>
                                        <option value="2">Từng Năm</option>
                                    </select>
                                </div>
                                <div className="tong">
                                    <p className="so">{[chartThang,chartNam,chartAll][selected].reduce((sum,row)=>sum + parseInt(row.tongDoanhThu || 0), 0)}&emsp;Xu</p>
                                </div>
                                <div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="tableDT">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="tenT">
                                            Truyện
                                        </th>
                                        <th className="doanhThuT">
                                            Doanh thu
                                        </th>
                                        <th className="luotBanT">
                                            Lượt bán
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[top10Thang,top10Nam,top10All][selected].map((i)=>(
                                       <tr key={i.id}>
                                            <td className="tenT">{i.ten}</td>
                                            <td className="doanhThuT">{i.doanhThu}Xu</td>
                                            <td className="luotBanT">{i.luotBan}</td>
                                        </tr>     
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthorLayout>
    )
}