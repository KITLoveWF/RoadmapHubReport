import { useState } from "react";
import api from "#utils/api.js";
import AlertError from "#components/SignUp/AlertError.jsx";
import "#components/Roadmap/CreateRoadmap/CreateRoadmap.css";

export default function TeamRoadmapModal({ teamId, roadmap, onClose, onSuccess }) {
  const isEditing = Boolean(roadmap);
  const [title, setTitle] = useState(roadmap?.name || "");
  const [description, setDescription] = useState(roadmap?.description || "");
  const [isPublic, setIsPublic] = useState(Boolean(roadmap?.isPublic));
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!teamId) {
      setErrorMessage("Không xác định được nhóm");
      return;
    }
    if (!title.trim()) {
      setErrorMessage("Tên roadmap không được để trống");
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing) {
        await api.put(`/teams/${teamId}/roadmaps/${roadmap.id}`, {
          name: title.trim(),
          description,
          isPublic,
        });
      } else {
        await api.post(`/teams/${teamId}/roadmaps`, {
          name: title.trim(),
          description,
          isPublic,
        });
      }
      const successMessage = isEditing ? "Đã cập nhật roadmap." : "Đã tạo roadmap.";
      onSuccess?.(successMessage);
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || "Không thể lưu roadmap";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="popup-header">
          <h2 className="popup-title">{isEditing ? "Update roadmap" : "Create roadmap"}</h2>
        </div>
        <p className="popup-subtitle">Quản lý roadmap chung cho cả nhóm.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ROADMAP TITLE</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          {errorMessage && <AlertError content={errorMessage} />}
          <div className="form-group">
            <label className="form-label">DESCRIPTION</label>
            <textarea
              className="form-control"
              placeholder="Enter Description"
              maxLength={255}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="toggle-label">
              <span>{isPublic ? "Public" : "Private"}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={() => setIsPublic((prev) => !prev)}
                />
                <span className="slider" />
              </label>
            </label>
          </div>
          <div className="button-group">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-create" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
