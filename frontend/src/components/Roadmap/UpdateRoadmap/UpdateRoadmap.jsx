import React, { useState, useEffect } from 'react';
import api from '#utils/api.js'
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateRoadmap.css';
import AlertError from '#components/SignUp/AlertError.jsx';

export default function UpdateRoadmap(props) {
    const routeParams = useParams();
    const {
        onClose,
        nameRoadmap,
        teamId: propTeamId,
        roadmapId: propRoadmapId,
        onUpdated,
    } = props;
    const resolvedTeamId = propTeamId ?? routeParams.teamId ?? null;
    const resolvedRoadmapId = propRoadmapId ?? routeParams.roadmapId ?? routeParams.id ?? '';
    const resolvedName = nameRoadmap ?? routeParams.name ?? '';
    const isTeamRoadmap = Boolean(resolvedTeamId && resolvedRoadmapId);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [error, setError] = useState('');
    const [currentRoadmapId, setCurrentRoadmapId] = useState(resolvedRoadmapId || '');
    const navigate = useNavigate();
    useEffect(() => {
        setCurrentRoadmapId(resolvedRoadmapId || '');
    }, [resolvedRoadmapId]);
    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            try {
                if (isTeamRoadmap) {
                    const response = await api.get(`/teams/${resolvedTeamId}/roadmaps/${resolvedRoadmapId}`);
                    const data = response.data?.roadmap;
                    if (isMounted && data) {
                        setTitle(data.name || '');
                        setDescription(data.description || '');
                        setIsPublic(Boolean(data.isPublic));
                        setCurrentRoadmapId(data.id);
                    }
                    return;
                }
                if (!resolvedName) {
                    return;
                }
                const response  = await api.get(`/roadmaps/edit/${encodeURIComponent(resolvedName)}`);
                if (!isMounted) {
                    return;
                }
                setTitle(response.data.name);
                setDescription(response.data.description);
                setCurrentRoadmapId(response.data.id);
                setIsPublic(Boolean(response.data.isPublic));
            } catch (fetchError) {
                if (isMounted) {
                    setError(fetchError.response?.data?.message || 'Không thể tải thông tin roadmap.');
                }
            }
        }
        fetchData();
        return () => {
            isMounted = false;
        };
    }, [isTeamRoadmap, resolvedTeamId, resolvedRoadmapId, resolvedName]);
   
    const onhandleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            setError('Tên roadmap không được để trống.');
            return;
        }
        try {
            if (isTeamRoadmap) {
                const response = await api.put(`/teams/${resolvedTeamId}/roadmaps/${resolvedRoadmapId}`, {
                    name: trimmedTitle,
                    description,
                    isPublic,
                });
                if (response.data?.success === false) {
                    setError(response.data.message || 'Không thể cập nhật roadmap.');
                    return;
                }
                onUpdated?.({ name: trimmedTitle, description, isPublic });
                onClose();
                return;
            }

            if (!resolvedName) {
                setError('Không xác định được roadmap cần cập nhật.');
                return;
            }
            const response = await api.post(`/roadmaps/edit/${encodeURIComponent(resolvedName)}`, {
                name: trimmedTitle,
                description,
                roadmapId: currentRoadmapId,
                isPublic: isPublic,
            });

            if(response.data.success){
                onUpdated?.({ name: trimmedTitle, description, isPublic });
                navigate(`/roadmap/edit/${trimmedTitle}/${currentRoadmapId}`)
                onClose();
            }
            else {
                setError(response.data.message);
            }
        } catch (submitError) {
            setError(submitError.response?.data?.message || 'Không thể cập nhật roadmap.');
        }
    }
    
    return (
    <div className="popup-overlay">
    <div className="popup-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <div className="popup-header">
            <h2 className="popup-title">Update Roadmap</h2>
        </div>
        <p className="popup-subtitle">Update a title and description to your roadmap.</p>

        <form onSubmit={onhandleSubmit}>
            <div className="form-group">
                <label className="form-label">ROADMAP TITLE</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter Title"
                    onChange={(e)=>setTitle(e.target.value)}
                    value={title}
                />
            </div>
            {error && <AlertError content={error}/>}
            <div className="form-group">
                <label className="form-label">DESCRIPTION</label>
                <textarea 
                    className="form-control" 
                    placeholder="Enter Description"
                    maxLength={80}
                    onChange={(e)=>setDescription(e.target.value)}
                    value={description}
                />
            </div>

            <div className="form-group">
                <label className="toggle-label">
                    <span>{isPublic ? 'Public' : 'Private'}</span>
                    <label className="switch">
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                    />
                    <span className="slider"></span>
                    </label>
                </label>
            </div>

            <div className="button-group">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-create" >Update</button>
            </div>
        </form>
    </div>
    </div>)
}