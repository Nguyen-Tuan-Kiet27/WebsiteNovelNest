import { router } from '@inertiajs/react';
import './ListStories.scss';
export default function Home({ten, stories}) {
     return (
    <div className="story-table">
      <h3 className="title">Truyện Mới</h3>
      <table className="table">
        <tbody>
          {stories.map((story, index) => (
            <tr key={index}>
              <td className="story-title"
              onClick={()=>{router.visit(`/truyen/${story.id}`)}}
              >
                <span>➤</span> {story.ten}
              </td>
              <td className="story-genres">{story.theLoai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}