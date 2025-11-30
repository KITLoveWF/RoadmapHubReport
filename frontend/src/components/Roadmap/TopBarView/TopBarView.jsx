import React from 'react';
import { Link } from 'react-router-dom';
import './TopBarView.css';
import { useEffect } from 'react';
export default function TopBarView(props) {
    const {
        roadmap = {},
        roadmapId,
        user,
        deleteRoadmap,
        loading,
        isMarked = false,
        onToggleMark,
        markLoading = false,
    } = props;
    const [User,setUser]=React.useState({});
    useEffect(() => {
        if(!loading) {
          setUser(user);
        }
    }, [loading, user]);
    const canManage = User.id && roadmap?.accountId && User.id === roadmap.accountId;
    const bookmarkDisabled = !onToggleMark || markLoading || !(roadmap?.id || roadmapId);
    const bookmarkClass = isMarked ? "btn-bookmark marked" : "btn-bookmark";
    const bookmarkIcon = isMarked ? "bi bi-bookmark-fill" : "bi bi-bookmark";

    return (
        <div className="topbar-container">
            <div className="topbar-navigation">
                <Link to="/" className="back-link">
                    <i className="bi bi-arrow-left"></i> All Roadmaps
                </Link>

                <div className="actions-group">
                    <button
                        className={bookmarkClass}
                        type="button"
                        onClick={onToggleMark}
                        disabled={bookmarkDisabled}
                        aria-label={isMarked ? "Bỏ đánh dấu roadmap" : "Đánh dấu roadmap"}
                    >
                        {markLoading ? (
                            <i className="bi bi-arrow-repeat spin"></i>
                        ) : (
                            <i className={bookmarkIcon}></i>
                        )}
                    </button>
                    {User.id === roadmap.accountId && (
                    <div className="dropdown">
                        <button className="btn-schedule" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-three-dots-vertical"></i>
                            Action
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item edit-item" href={`/roadmap/edit/${roadmap.name}/${roadmap.id}`}><i className="bi bi-pencil-fill me-3"></i>Edit</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item delete-item" href="/" onClick={deleteRoadmap}> <i className="bi bi-trash-fill me-3"></i>Delete</a></li>
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