import { useState } from 'react';
import AuthorLayout from '../../Layouts/AuthorLayout'
import VerifyPass from '../../Components/VerifyPass';
import './RutXu.scss';
import axios from 'axios';
export default function({user}){
    const [tenNganHang,setTenNganHang] = useState('');
    const [soTaiKhoan,setSoTaiKhoan] = useState('');
    const [tenNguoiNhan,setTenNguoiNhan] = useState('');
    const [soLuongXu,setSoLuongXu] = useState(50000);
    const [quyDoi,setQuyDoi] = useState('47500 VNĐ');
    const [eTenNganHang, setETenNganHang] = useState('');
    const [eSoTaiKhoan, setESoTaiKhoan] = useState('');
    const [eTenNguoiNhan,setETenNguoiNhan] = useState('');
    const [eSoLuongXu, setESoLuongXu] = useState('');

    const [showPass,setShowPass] = useState(false);

    const handleCheck = ()=>{
        let b = false;
        if(tenNganHang.trim().length == 0){
            setETenNganHang('Chưa nhập tên ngân hàng!');
            setTenNganHang(tenNganHang.trim());
            b = true;
        }
        if(soTaiKhoan.trim().length == 0){
            setSoTaiKhoan(soTaiKhoan.trim());
            setESoTaiKhoan('Chưa nhập số tài khoản!');
            b = true;
        }
        if(tenNguoiNhan.trim().length == 0){
            setETenNguoiNhan('Chưa nhập tên người nhận!');
            setTenNguoiNhan(tenNguoiNhan.trim());
            b = true;
        }
        if(soLuongXu < 50000){
            setESoLuongXu('Số lượng xu tối thiểu là 50.000!')
            b = true;
        }
        if(soLuongXu > user.soDu){
            setESoLuongXu('Không đủ số dư để rút!')
            b = true;
        }
        if(b) return;
        setShowPass(true)
    }

    const handleSubmit = async ()=>{
        try {
            const formData = new FormData();
            formData.append('soLuongXu',soLuongXu);
            formData.append('tenNganHang',tenNganHang.trim());
            formData.append('soTaiKhoan', soTaiKhoan);
            formData.append('tenNguoiNhan',tenNguoiNhan.trim());
            const response = await axios.post('/api/author/rutxu',formData);
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.log(error.response.data.error);
            alert(error.response.data.message);
            setShowPass(false);
        }
    }

    return(
        <AuthorLayout user={user} page={1} title='Rút xu'>
            <VerifyPass isShow={showPass} setIsShow={setShowPass} onOk={handleSubmit}/>
            <div className='RutXu'>
                <div className="main">
                    <div className="head">
                        <h1>Yêu cầu rút xu</h1>
                    </div>
                    <div className='body'>
                        <div>
                            <div>
                                <h3>Số dư: {user.soDu}Xu</h3>
                            </div>
                            <div>
                                <label>Tên ngân hàng:</label>
                                <label className='error'>{eTenNganHang}</label>
                                <input type="text" value={tenNganHang} onChange={(e)=>{setTenNganHang(e.target.value);setETenNganHang('')}}/>
                            </div>
                            <div>
                                <label>Số tài khoản:</label>
                                <label className='error'>{eSoTaiKhoan}</label>
                                <input type="number" value={soTaiKhoan} onChange={(e)=>{setSoTaiKhoan(e.target.value);setESoTaiKhoan('');console.log(e.target.value)}}/>
                            </div>
                            <div>
                                <label>Tên người nhận:</label>
                                <label className='error'>{eTenNguoiNhan}</label>
                                <input type="text" value={tenNguoiNhan} onChange={(e)=>{setTenNguoiNhan(e.target.value);setETenNguoiNhan('')}}/>
                            </div>
                            <div className='soLuong'>
                                <div>
                                    <label>Số lượng xu:</label>
                                    <label className='error'>{eSoLuongXu}</label>
                                    <input type="number" 
                                        value={soLuongXu}
                                        min={0}
                                        step={100}
                                        onChange={(e)=>{
                                            setSoLuongXu(e.target.value);
                                            setESoLuongXu('');
                                            setQuyDoi(Math.floor(e.target.value*0.95)+' VNĐ')
                                        }}/>
                                </div>
                                <div>
                                    <label>Quy đổi (95%):</label>
                                    <input type="text" disabled value={quyDoi}/>
                                </div>
                            </div>
                            <label style={{width:'100%', color:'red'}}>Chúng sau khi gửi yêu cầu tài khoản của bạn sẽ bị trừ xu trước và đợi xử lý hoàn tất, chúng tôi sẽ không chịu trách nhiệm nếu bạn nhập sai tên ngân hàng, số tài khoản và tên người nhận.</label>
                            <label style={{width:'100%', color:'orange'}}>Khi yêu cầu đã gửi sẽ không thể hủy!</label>
                            <button onClick={handleCheck}>Gửi yêu cầu</button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthorLayout>
    )
}