import React from 'react';
import { Link } from 'react-router-dom';
import './TopBarView.css';
import { useEffect } from 'react';
export default function TopBarView(props) {
    const { roadmap = {}, user, deleteRoadmap, loading } = props;
    const [User,setUser]=React.useState({});
    useEffect(() => {
        if(!loading) {
          setUser(user);
        }
    }, [loading]);
    const canManage = User.id && roadmap?.accountId && User.id === roadmap.accountId;

    return (
        <div className="topbar-container">
            <div className="topbar-navigation">
                <Link to="/" className="back-link">
                    <i className="bi bi-arrow-left"></i> All Roadmaps
                </Link>

                <div className="actions-group">
                    <button className="btn-bookmark">
                        <i className="bi bi-bookmark"></i>
                    </button>
                    {canManage && roadmap?.id && (
                    <div class="dropdown">
                        <button className="btn-schedule" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-three-dots-vertical"></i>
                            Action
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href={`/roadmap/edit/${roadmap.name}/${roadmap.id}`}>Edit</a></li>
                            <li><a class="dropdown-item" href="/" onClick={deleteRoadmap}>Delete</a></li>
                        </ul>
                    </div>
                    )}
                      
                    <button className="btn-share">
                        <i className="bi bi-share"></i>
                        Share
                    </button>
                </div>
            </div>

            <div className="roadmap-header">
                <h1 className="roadmap-title">{roadmap?.name || "Roadmap"}</h1>
                <p className="roadmap-subtitle">
                    {roadmap?.description || ""}
                </p>
            </div>

            <div className="roadmap-tabs">
                <button className="tab-btn active">
                    <i className="bi bi-map"></i> Roadmap
                </button>
            </div>
        </div>
    );
}