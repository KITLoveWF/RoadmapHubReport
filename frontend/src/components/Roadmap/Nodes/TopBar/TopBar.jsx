import { useEffect, useState } from "react";
import "./TopBar.css"; 
import UpdateRoadmap from "#components/Roadmap/UpdateRoadmap/UpdateRoadmap.jsx";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../utils/api.js";
export default function TopBar(props) {
  const {onSaveNode} = props;
  const { name, id, teamId, roadmapId } = useParams();
  const isTeamRoadmap = Boolean(teamId && roadmapId);
  const [title, setTitle] = useState("Untitled Roadmap");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (name) {
      setTitle(name);
    }
  }, [name]);

  useEffect(() => {
    if (!isTeamRoadmap) {
      return;
    }
    let isMounted = true;
    const fetchTeamRoadmapMeta = async () => {
      try {
        const response = await api.get(`/teams/${teamId}/roadmaps/${roadmapId}`);
        const roadmap = response.data?.roadmap;
        if (isMounted && roadmap?.name) {
          setTitle(roadmap.name);
        }
      } catch (error) {
        console.error("Failed to fetch team roadmap detail", error);
      }
    };

    fetchTeamRoadmapMeta();
    return () => {
      isMounted = false;
    };
  }, [isTeamRoadmap, teamId, roadmapId]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  const liveViewClick = async () => {
    if (isTeamRoadmap) {
      navigate(`/roadmap/view/${roadmapId}?teamId=${teamId}`);
      return;
    }

    if (id) {
      navigate(`/roadmap/view/${id}`);
      return;
    }

    try {
      const roadmap = await api.get(`/roadmaps/getYourRoadmap/${name}`, {
        withCredentials: true,
      });
      if (roadmap.data?.id) {
        navigate(`/roadmap/view/${roadmap.data.id}`, { state: roadmap.data });
      }
    } catch (error) {
      console.error("Không thể mở live view", error);
    }
  };

  return (
    <div className="topbar">
      
        <div className="topbar-left">
        {isEditing ? (
          <UpdateRoadmap
            onClose={() => setIsEditing(false)}
            nameRoadmap={title}
            roadmapId={isTeamRoadmap ? roadmapId : id}
            teamId={isTeamRoadmap ? teamId : null}
            onUpdated={(payload) => {
              if (payload?.name) {
                setTitle(payload.name);
              }
            }}
          />
        ) : (
          <>
            <strong onClick={handleTitleClick}>{title}</strong>
            <button className="edit-btn" onClick={handleTitleClick}>
              <i className="bi bi-pencil-square"></i>
            </button>
          </>
        )}
      </div>

      <div className="topbar-center">
        <div className="dropdown-button">
          <i className="bi bi-globe"></i>
          <span>Anyone can view</span>
          <i className="bi bi-chevron-down"></i>
        </div>
        <button className="view-btn">
          <i className="bi bi-eye"></i>
          <span onClick={liveViewClick}>Live View</span>
        </button>
      </div>
      <form onSubmit={onSaveNode}>
      <button className="save-btn-topbar-edit-roadmap" onClick={onSaveNode}>
        <i className="bi bi-save"></i>
        <span>Save Roadmap</span>
      </button>
      </form>
    </div>
  );
}