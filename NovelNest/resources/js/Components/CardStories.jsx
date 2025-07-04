import { router } from '@inertiajs/react';
import './CardStories.scss';
export default function Home({truyen}) {
    if(!truyen)return null;
    const tenCut = truyen.ten.length > 20 ? truyen.ten.slice(0,20) + "..." : truyen.ten;
    return (
        <div className="story-card" title={truyen.ten}
            onClick={()=>{router.visit(`/truyen/${truyen.id}`)}}
        >
            <img src={`/img/truyen/hinhAnh/${truyen.hinhAnh}`} alt={truyen.ten} className="story-image" />
            <p className="story-title">{tenCut}</p>
        </div>
    );

}