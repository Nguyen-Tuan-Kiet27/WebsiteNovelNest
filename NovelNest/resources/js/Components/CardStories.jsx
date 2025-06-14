import { router } from '@inertiajs/react';
import './CardStories.scss';
export default function Home({ten, hinhAnh,id}) {
    const tenCut = ten.length > 20 ? ten.slice(0,20) + "..." : ten;
    return (
        <div className="story-card" title={ten}
            onClick={()=>{router.visit(`/truyen/${id}`)}}
        >
            <img src={`/img/truyen/hinhAnh/${hinhAnh}`} alt={ten} className="story-image" />
            <p className="story-title">{tenCut}</p>
        </div>
    );

}