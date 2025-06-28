import './Notification.scss';
export default function Notification ({title,content,isOpen,setOpen}){
    return(
        <div className="notification" style={{display:isOpen?'flex':'none'}}>
            <div>
                <h2>{title}</h2>
                <p>{content}</p>
                <button onClick={()=>setOpen(false)}>Đóng</button>
            </div>
        </div>
    )
}