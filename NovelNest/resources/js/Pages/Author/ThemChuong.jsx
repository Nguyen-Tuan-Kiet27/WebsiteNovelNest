import AuthorLayout from "../../Layouts/AuthorLayout";
import './ThemChuong.scss'
import { router } from "@inertiajs/react";
import Editor from '@/Components/Editor';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
export default function Truyen({user, truyen}){
    const [ten,setTen] = useState('');
    const [phi,setPhi] = useState(false);
    const [xu,setXu] = useState(0);
    const [noiDung,setNoiDung] = useState('<p>Xung quanh lập tức có không ít người rút điện thoại ra chụp hình, đèn flash lóe lên liên tục. Trong khoảnh khắc, tôi có cảm giác mình như minh tinh bị paparazzi vây quanh, ngày mai thể nào cũng thành tiêu điểm tin tức — nữ sinh nổi tiếng của trường lộ tin yêu đương với hot boy đình đám.</p><p>Thật ra cũng đúng, tôi xem như là một trong những “gương mặt thân quen” của các cuộc bầu chọn hoa khôi khoa, hoa khôi trường, còn Lâm Duệ Chu thì khỏi phải nói, nổi tiếng rầm rộ.</p><p>Trong lòng tôi vô cùng cảm động, thầm nghĩ đàn anh Lâm Duệ Chu đúng là tốt quá mà, vậy mà cũng chịu đứng ra chống lưng cho tôi đến mức này.</p><p>Sau khi về, tôi nhất định sẽ tặng anh một trăm chiếc qu -ần l- ót đỏ!</p><p>Cố Thần thì ngơ ngác: “Cậu… hai người…”</p><p>Tôi diễn cho tròn vai, lập tức nắm tay Lâm Duệ Chu, nhìn Cố Thần bằng ánh mắt khiêu khích.</p><p>Cố Thần lập tức mất kiểm soát, chỉ tay vào tôi mắng lớn:</p><p>"Được lắm, Tang Dư, tôi đã nói rồi, sao cô không chịu thân mật với tôi, thì ra là sớm đã quyến rũ bạn cùng phòng của tôi! Lần trước tôi về nhà thấy cô và Lâm Duệ Chu ở phòng khách, còn tưởng cô đến tìm tôi để quay lại, hóa ra là…"</p><p>Tốc độ bịa chuyện của anh ta đúng là nhanh như chớp.</p><p>Nhưng còn chưa kịp để tôi mở miệng, Lâm Duệ Chu đã lên tiếng:</p><p>"Cậu hiểu lầm rồi. Tang Dư vẫn chưa quen tôi. Là sau khi cô ấy chia tay cậu, mà không đúng… là sau khi cậu cắm sừng cô ấy với bạn cùng phòng của cô ấy, tôi mới bắt đầu theo đuổi cô ấy."</p><p>Lâm Duệ Chu đúng là đại thần, mấy câu nhẹ nhàng đã giải thích rõ mọi hiểu lầm.</p><p>Chuyện Cố Thần theo đuổi tôi trước kia ai cũng biết, sau này ở bên Kiều Lộ Lộ, cô ta còn rất phô trương. Giờ Lâm Duệ Chu nói thẳng trước mặt bao người rằng Cố Thần là kẻ phản bội.</p><p>Mọi người đều hiểu chuyện gì đang xảy ra, bắt đầu bàn tán xôn xao sau lưng anh ta.</p><p>Cố Thần giận dữ, quẳng lại một câu:</p><p>"Tang Dư, cô cứ chờ đó cho tôi!"</p><p>Rồi tức tối bỏ đi.</p><p>Thấy mọi người vẫn còn tụ lại xem náo nhiệt, tôi phất tay nói:</p><p>"Mọi người giải tán đi, mà nếu có quay video đăng lên thì nhớ chỉnh da tôi mịn tí nha~"</p><p>Chờ đám đông tản gần hết, tôi quay sang nhìn Lâm Duệ Chu như nhìn tổ tiên nhà mình vậy:</p><p>"Em cảm ơn anh đã ra mặt giúp em. Sau này em nhất định báo đáp, làm trâu làm ngựa cũng không từ!"</p><p>Ai ngờ Lâm Duệ Chu lại nhìn tôi, bình tĩnh nói:</p><p>"Ai nói với cô là tôi ra mặt giúp cô?"</p><p>Hả?</p><p>Đến lượt tôi ngạc nhiên.</p><p>Nhưng anh chẳng thèm để tâm đến phản ứng của tôi, chỉ đặt tay lên đầu tôi xoay người lại, chỉ về phía cổng ký túc:</p><p>"Sắp tới giờ giới nghiêm rồi, mau vào đi. Bắt đầu từ ngày mai, tôi chính thức theo đuổi em."</p><p>Tôi vào ký túc rồi mà đầu óc vẫn chưa tiêu hóa nổi lời của Lâm Duệ Chu.</p><p>Ngồi trên giường, cầm điện thoại định hỏi anh rốt cuộc có ý gì, thì Kiều Lộ Lộ mặt đầy khó chịu từ nhà vệ sinh bước ra:</p><p>"Tang Dư, vừa nãy cô đã nói gì với bạn trai tôi trước cổng ký túc xá?"</p><p>Cô ta giơ điện thoại cho tôi xem, tôi mới thấy có người đã quay video của tôi, Lâm Duệ Chu và Cố Thần rồi đăng lên confession của trường.</p><p>Kiều Lộ Lộ tưởng tôi vẫn còn dây dưa với Cố Thần, liền chạy đến hỏi tội.</p><p>Tôi vừa định giải thích, thì bạn cùng phòng trên giường hét lên, kéo rèm ra:</p><p>"Á! Tang Dư, đàn anh Lâm Duệ Chu tỏ tình với cậu rồi á?"</p><p>Kiều Lộ Lộ cũng ngẩn người. Cô ta cứ tưởng tôi còn vương vấn Cố Thần, nên thậm chí chưa thèm bấm vào video xem.</p><p>Bạn cùng phòng thì đã mở video ra xem, bên trong là Lâm Duệ Chu kiên định nói:</p><p>"Đúng, tôi đang theo đuổi Tang Dư."</p><p>Mặt Kiều Lộ Lộ tái xanh.</p><p>Một bạn cùng phòng khác vừa cầm bàn chải đánh răng vừa ra khỏi nhà vệ sinh, lập tức bật chế độ chế giễu:</p><p>"Chà, có người cứ ôm chặt lấy một cái cây cong vẹo, mà đâu có biết Tang Dư tụi mình được đại thần theo đuổi rồi cơ đấy. Cậu thích cướp đồ của người khác lắm mà, giỏi thì đi cướp luôn cả anh Lâm xem nào?"</p><p>Kiều Lộ Lộ trừng mắt phản bác:</p><p>"Tôi cướp đồ của ai chứ? Nếu là đồ của cô ta thật, thì người khác cướp được chắc?"</p><p>"Mới một cái video mà đã tưởng Lâm Duệ Chu thích cô ta? Biết đâu anh ấy chỉ lịch sự nói vài câu thôi thì sao!"</p><p>Bạn cùng phòng vẫn không tha:</p><p>"Lịch sự? Tôi chẳng thấy anh ấy lịch sự nói mấy câu với cô bao giờ. Nếu tôi nhớ không lầm, hồi anh ấy chơi bóng rổ, cô còn mang nước đến suốt mấy ngày liền đấy nhỉ."</p><p>"Cô!"</p><p>Thấy hai người sắp cãi nhau to, tôi đập bàn đứng dậy:</p><p>"Kiều Lộ Lộ, tôi nhớ cô ngủ hay há miệng ngáy đúng không? Không muốn nửa đêm bị tôi nhét tất thối vào miệng thì im đi!"</p><p>Kiều Lộ Lộ mặt xanh mét, nhưng cuối cùng cũng ngậm miệng.</p><p>Sau khi rửa mặt xong, tôi leo lên giường, cầm điện thoại nhắn tin cho Lâm Duệ Chu.</p><p>[Đàn anh, anh nói theo đuổi em… là nói đùa đúng không?]</p><p>Anh trả lời: [Không, là theo đuổi thật.]</p><p>Tôi lại hỏi:</p><p>[Vậy có phải anh cá cược với ai đó không, kiểu như nếu tán đổ được em trong thời gian nào đó thì sẽ thắng gì đó…]</p>');
    const [errorTen,setErrorTen] = useState('');
    const tenLabelRef = useRef(null);
    const [mrErrorTen,setMrErrorTen] = useState(0);
    const [errorNoiDung,setErrorNoiDung] = useState('');
    const [tomTat,setTomTat] = useState('');
    const [errorTomTat,setErrorTomTat] = useState('');
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef(null);
    const [end,setEnd] = useState(false);
    useEffect(() => {
        if (tenLabelRef.current) {
            const el = tenLabelRef.current;
            const style = window.getComputedStyle(el);
            const width = el.offsetWidth;
            const marginRight = parseFloat(style.marginRight);
            const total = width + marginRight;
            setMrErrorTen(total);
        }
    }, []);
    const handleChangePhi = (e)=>{
        setPhi(e.target.checked);
        if(e.target.checked==false)
            setXu(0)
    }
    const handleChangeXu = (e)=>{
        const raw = e.target.value;
        const num = parseInt(raw, 10);
        if (isNaN(num) || num < 0) {
            setXu(0);
        } else {
            setXu(num);
            e.target.value = num;
        }
    }
    const handleTomTat = async ()=>{
        setLoading(true);
        try {
            const response = await axios.post(
                '/api/tomtat',{
                    text: noiDung,
                }
            );
            alert('Đã tóm tắt nội dung chương!');
            setTomTat(response.data.summary);
        } catch (error) {
            alert('Có lỗi không xác định, hãy kiểm tra lại nội dung đã được tóm tắt!')
            setTomTat(error.response.data.summary);
        }
        setLoading(false);
    }
    const handleSubmit =  async ()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'   // cuộn mượt; bỏ dòng này nếu muốn cuộn ngay lập tức
        });
        let b = false;
        if(!ten){
            setErrorTen('Chưa nhập tên chương!');
            b = true;
        }
        if(!noiDung || noiDung=='<p></p>'){
            setErrorNoiDung("Chưa viết nội dung chương!");
            b = true;
        }
        if(!tomTat){
            setErrorTomTat("Chưa viết tóm tắt nội dung chương!");
            b = true;
        }
        if(b) return;
        const formData = new FormData();
        formData.append('ten',ten);
        formData.append('gia',xu);
        formData.append('noiDung',noiDung);
        formData.append('soChuong',parseInt(truyen.soLuongChuong)+1);
        formData.append('tomTat',tomTat);
        formData.append('end',end);
        try {
            const response = await axios.post(
                `/api/author/themchuong/${truyen.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            alert(response.data.message);
            router.visit(`/author/truyen/${truyen.id}`)
        } catch (error) {
            if(error.response.data.errorTen)
                alert(error.response.data.errorTen);
            if(error.response.data.errorSoChuong)
                alert(error.response.data.errorSoChuong);
            if(error.response.data.message)
                alert(error.response.data.message, ' :', error.response.data.error)
        }
    }
    useEffect(()=>{
        setErrorNoiDung('');
    },[noiDung]);
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
        textarea.style.height = 'auto'; // Reset trước
        textarea.style.height = `${textarea.scrollHeight}px`; // Resize theo nội dung mới
        }
    }, [tomTat]);
    return(
        <AuthorLayout page='2' user={user} title={`Thêm chương truyện ${truyen.ten}`}>
            <div className="ThemChuong">
                <div className="head">
                    <div>
                        <h1>Thêm chương {parseInt(truyen.soLuongChuong)+1} truyện: {truyen.ten}</h1>
                    </div>
                </div>
                <div className="body">
                    <div>
                        <div className="tenChuong">
                            <div>
                                <label ref={tenLabelRef}>Tên chương</label>
                                <input type="text" value={ten} onChange={e=>{setTen(e.target.value);setErrorTen('');}}/>
                            </div>
                            <label className="error" style={{marginLeft:`${mrErrorTen}px`}}>{errorTen}</label>
                        </div>
                        <div className="gia">
                            <div>
                                <input type="checkBox" onChange={handleChangePhi}/>
                                <label>Có phí</label>
                            </div>
                            <div style={{display:phi?'flex':'none'}}>
                                <input type="number" value={xu} onChange={handleChangeXu}/>
                                <label>xu</label>
                            </div>
                            
                        </div>
                    </div>
                    <div className="noiDung">
                        <label>Nội dung</label>
                        <Editor onChange={setNoiDung} value={noiDung}/>
                    </div>
                    <label className="error" style={{marginTop:'10px'}}>{errorNoiDung}</label>
                    <div className="tomTat">
                        <div>
                            <label>Tóm tắt chương</label>
                            {
                                user.premium && <button onClick={handleTomTat} disabled={loading}>AI {loading&&'đang'} tóm tắt</button>
                            }
                        </div>
                        <textarea 
                            ref={textareaRef}
                            value={tomTat} 
                            onChange={(e)=>{setTomTat(e.target.value);setErrorTomTat('')}}
                            spellCheck={false}
                        ></textarea>
                        <label className="error" style={{marginTop:'10px'}}>{errorTomTat}</label>
                    </div>
                    <div className="end">
                        <input type="checkBox" onChange={e=>setEnd(e.target.checked)}/>
                        <label style={{marginLeft:'10px',color:'green'}}>Chương cuối, hoàn thành truyện!</label>
                    </div>
                    <div className="buttonSM">
                        <button onClick={() => window.history.back()}>Hủy</button>
                        <button onClick={handleSubmit} >Thêm</button>
                    </div>
                </div>
            </div>
        </AuthorLayout>
    )
}