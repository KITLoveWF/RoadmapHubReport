import React, {useState, useEffect, useCallback} from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import RoadmapCardInHome from '#components/RoadmapView/RoadmapCardInHome/RoadmapCardInHome.jsx';
import './RoadmapSearchPage.css';
import api from '../../../utils/api';

export default function RoadmapSearchPage() {
  const [selectedFilter, setSelectedFilter] = useState('popular');
  const [index, setIndex] = useState(1);
  const { query } = useParams();
  const [roadmapsList, setRoadmapsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate(); 
  const pageSize = 16;

  const onClickFilter = (filter) => {
    setSelectedFilter(filter);
  };
  
  const ViewPageRoadmap = (roadmap) => {
    navigate(`/roadmap/view/${roadmap.id}`, { state: roadmap });
  };

  const fetchMoreRoadmaps = useCallback(async (page) => {
    if (isLoading || (!hasMore && page !== 1)) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.get(`/roadmaps/search/${query}/${selectedFilter}/${page}`, {
        withCredentials: true
      });
      console.log('Fetched roadmaps: ', response.data.data, 'index: ', page);
      if (response.data.status === 'success') {
        const normalized = (response.data.data || []).map((roadmap) => ({
          ...roadmap,
          isUserCard: false,
        }));
        setRoadmapsList((prev) => (page === 1 ? normalized : [...prev, ...normalized]));
        setIndex(page + 1);
        setHasMore(normalized.length === pageSize);
      } else if (page === 1) {
        setRoadmapsList([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to fetch roadmaps: ', error);
    } finally {
      setIsLoading(false);
    }
  }, [query, selectedFilter, hasMore, isLoading, pageSize]);

  useEffect(() => {
    setIndex(1);
    setHasMore(true);
    fetchMoreRoadmaps(1);
  }, [query, selectedFilter, fetchMoreRoadmaps]);
  //xử lý scroll để load thêm roadmap
  useEffect(() => {
  const handleWindowScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      if (scrollTop + windowHeight >= fullHeight - 1 && !isLoading && hasMore) {
        console.log("Chạm đáy trang!");
        fetchMoreRoadmaps(index);
      }
    };
    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [index, fetchMoreRoadmaps, hasMore, isLoading]);

  const handleBookmarkToggle = async (id, nextState) => {
    try {
      await api.post(`/roadmaps/mark/${id}`, {
        roadmapId: id,
      }, { withCredentials: true });
      setRoadmapsList((prev) =>
        prev.map((roadmap) =>
          roadmap.id === id ? { ...roadmap, isMarked: nextState } : roadmap
        )
      );
    } catch (error) {
      console.error('Failed to toggle bookmark: ', error);
    }
  };


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
          <div key={r.id} className="search-card-wrapper" 
            onClick={() => ViewPageRoadmap(r)}
            >
            <RoadmapCardInHome
              id={r.id}
              name={r.name}
              description={r.description}
              author={r.author}
              learning={r.learning}
              teaching={r.teaching}
              isUserCard={false}
              isMarked={r.isMarked}
              onBookmarkToggle={handleBookmarkToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
