import { useState } from 'react';
import Modal from '#components/Modal/Modal.jsx';
import './ClassroomSettings.css';
import api from '../../../../utils/api.js'
import { useNavigate } from 'react-router-dom';
export default function ClassroomSettings({ classroomId, onDelete }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDeleteClassroom = async () => {
    try {
      setDeleteLoading(true);
      setError(null);

      const response = await api.post(
        '/classrooms/delete',
        { classroomId: classroomId },
        { withCredentials: true }
      );

      if (response.data.success || response.status === 200) {
        setShowConfirmModal(false);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(response.data.message || 'Delete classroom failed');
      }
    } catch (error) {
      console.error('Error deleting classroom:', error);
      setError(error.response?.data?.message || 'An error occurred while deleting the classroom');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ✅ Modal body
  const modalBody = (
    <div className="delete-confirm-body">
      <p className="warning-text">
        Are you sure you want to delete this classroom?
      </p>
      <p className="warning-text warning-important">
        ❗ This action <strong>cannot be undone</strong>. All related data will be permanently deleted.
      </p>
    </div>
  );

  // ✅ Modal footer
  const modalFooter = (
    <div className="modal-actions">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setShowConfirmModal(false)}
        disabled={deleteLoading}
      >
        Cancel
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={handleDeleteClassroom}
        disabled={deleteLoading}
      >
        {deleteLoading ? (
          <>
            <span className="spinner"></span> Deleting...
          </>
        ) : (
          '✓ Delete Classroom'
        )}
      </button>
    </div>
  );

  return (
    <div className="classroom-settings-container">
      <div className="settings-section">
        <h2>Classroom Settings</h2>

        {/* Danger Zone */}
        <div className="danger-zone">
          <div className="danger-zone-header">
            <h3>⚠️ Danger Zone</h3>
            <p>These actions cannot be undone</p>
          </div>

          <div className="danger-zone-content">
            <div className="delete-section">
              <div className="delete-info">
                <h4>Delete Classroom</h4>
                <p>Delete this classroom and all related data</p>
              </div>
              <button
                className="btn-delete-classroom"
                onClick={() => setShowConfirmModal(true)}
              >
                Delete Classroom
              </button>
            </div>
          </div>
        </div>

        {error && <div className="error-message">❌ {error}</div>}
      </div>

      {/* ✅ Sử dụng Modal Component */}
      {showConfirmModal && (
        <Modal
          header={<h3 style={{ margin: 0 }}>⚠️ Confirm Delete Classroom</h3>}
          body={modalBody}
          footer={modalFooter}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}