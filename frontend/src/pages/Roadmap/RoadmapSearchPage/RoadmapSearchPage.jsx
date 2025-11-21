import React, {useState, useEffect} from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import RoadmapCardInHome from '#components/RoadmapView/RoadmapCardInHome/RoadmapCardInHome.jsx';
import './RoadmapSearchPage.css';
import api from '../../../utils/api';

export default function RoadmapSearchPage({ handleBookmarkToggle }) {
  const [selectedFilter, setSelectedFilter] = useState('popular');
  const [index, setIndex] = useState(1);
  const { query } = useParams();
  const [roadmapsList, setRoadmapsList] = useState([]);
  const navigate = useNavigate(); 

  const onClickFilter = (filter) => {
    setSelectedFilter(filter);
  };
  
  const ViewPageRoadmap = (roadmap) => {
    navigate(`/roadmap/view/${roadmap.id}`, { state: roadmap });
  };

  const fetchMoreRoadmaps = async (page = index) => {
    const response = await api.get(`/roadmaps/search/${query}/${selectedFilter}/${page}`, {
      withCredentials: true
    });
    console.log('Fetched roadmaps: ', response.data.data, "index: ", page);
    if(response.data.status === "success" && page > 1) {
      setRoadmapsList([...roadmapsList, ...response.data.data]);
      setIndex(page + 1);
    }
    else if(response.data.status === "success" && page === 1) {
      setRoadmapsList(response.data.data);
      setIndex(page + 1);
    }
  };

  useEffect(() => {
    setIndex(1);
    fetchMoreRoadmaps(1);
  }, [query, selectedFilter]);
  //xử lý scroll để load thêm roadmap
  useEffect(() => {
  const handleWindowScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      if (scrollTop + windowHeight >= fullHeight - 1) {
        console.log("Chạm đáy trang!");
        fetchMoreRoadmaps(index);
      }
    };
    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [index, fetchMoreRoadmaps]);


  return (
    <div className="search-page-container">
      <h1 className="search-page-title">Result Roadmaps</h1>
      <div className="filter-bar">
        <h3>Filter by:</h3>
        <button
            className={selectedFilter==='popular'?'selected':''}
            onClick={()=>onClickFilter('popular')}
        >Popular</button>
        <button
            className={selectedFilter==='newest'?'selected':''}
            onClick={()=>onClickFilter('newest')}
        >Newest</button>
        <button
            className={selectedFilter==='oldest'?'selected':''}
            onClick={()=>onClickFilter('oldest')}
        >Oldest</button>
        </div>
      <div className="search-roadmap-grid">
        {roadmapsList.map(r => (
          <div key={r.id} className="search-card-wrapper" onClick={() => ViewPageRoadmap(r)}>
            <RoadmapCardInHome
              id={r.id}
              name={r.name}
              description={r.description}
              author={r.author}
              learning={r.learning}
              teaching={r.teaching}
              isUserCard={r.isUserCard}
              onBookmarkToggle={handleBookmarkToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
