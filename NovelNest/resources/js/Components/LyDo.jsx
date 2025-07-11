import { useState } from "react"
import './LyDo.scss';
export default function({isShow,setIsShow,onOk}){
    const [value,setValue] = useState('');
    const [eValue,setEValue] = useState('');
    const handleSubmit = ()=>{
        if(value.trim().length == 0){
            setEValue('Chưa nhập lý do!');
            return;
        }
        onOk(value);
    }
    return(
        <div className="LyDo" style={isShow?{}:{display:'none'}} onClick={()=>{setIsShow(false);setValue(''),setEValue('')}}>
            <div className="main" onClick={e=>e.stopPropagation()}>
                <h2>LÝ DO</h2>
                <div>
                    <label className="error">{eValue}</label>
                    <textarea 
                        type='text' 
                        value={value} 
                        onChange={(e)=>{setValue(e.target.value);setEValue('')}}
                        onKeyDown={(e)=>{
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                </div>
                <button onClick={handleSubmit}>Xác nhận</button>
            </div>
        </div>
    )
}