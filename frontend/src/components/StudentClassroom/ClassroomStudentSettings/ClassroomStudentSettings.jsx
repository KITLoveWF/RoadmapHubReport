import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '#utils/api.js';
import Modal from '#components/Modal/Modal.jsx';
import './ClassroomStudentSettings.css';

export default function ClassroomStudentSettings({ classroomId, classroomName,profile }) {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleLeaveClassroom = async () => {
    try {
      setLeaveLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await api.delete(
        '/studentclassrooms/remove',
        {
            data:{classroomId:classroomId,studentId:profile.accountId},
            withCredentials: true
        }
      );

      if (response.data.success || response.status === 200) {
        setSuccessMessage(response.data.message);
        setShowConfirmModal(false);
        
        // Redirect sau 1.5 giây
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(response.data.message || 'Rời khỏi lớp học thất bại');
      }
    } catch (error) {
      console.error('Error leaving classroom:', error);
      setError(
        error.response?.data?.message || 
        'Có lỗi xảy ra khi rời khỏi lớp học'
      );
    } finally {
      setLeaveLoading(false);
    }
  };

  // ✅ Modal body
  const modalBody = (
    <div className="leave-confirm-body">
      <p className="warning-text">
        Are you sure you want to leave the classroom <strong>"{classroomName}"</strong>?
      </p>
      <p className="warning-text warning-info">
        ℹ️ After leaving, you will no longer have access to this classroom. 
        You can request your teacher to add you back.
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
        disabled={leaveLoading}
      >
        Cancel
      </button>
      <button
        type="button"
        className="btn btn-warning"
        onClick={handleLeaveClassroom}
        disabled={leaveLoading}
      >
        {leaveLoading ? (
          <>
            <span className="spinner"></span> Leaving...
          </>
        ) : (
          '✓ Leave Classroom'
        )}
      </button>
    </div>
  );

  return (
    <div style={{width: '100%', maxWidth: '850px'}}>
    <div className="classroom-student-settings-container">
      <div className="settings-section">
        <h2>Settings</h2>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            ✓ {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Leave Classroom Section */}
        <div className="leave-zone">
          <div className="leave-zone-header">
            <h3>🚪 Leave Classroom</h3>
            <p>Manage your access rights</p>
          </div>

          <div className="leave-zone-content">
            <div className="leave-section">
              <div className="leave-info">
                <h4>Leave Classroom "{classroomName}"</h4>
                <p>You will lose access to all materials and assignments in this classroom</p>
              </div>
              <button
                className="btn-leave-classroom"
                onClick={() => setShowConfirmModal(true)}
                disabled={leaveLoading}
              >
                🚪 Leave
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="info-section">
          <h3>ℹ️ Information</h3>
          <ul className="info-list">
            <li>You can request your teacher to add you back to the classroom at any time</li>
            <li>Your learning data in this classroom will be retained</li>
            <li>You will no longer receive notifications from this classroom</li>
          </ul>
        </div>
      </div>

      {/* ✅ Sử dụng Modal Component */}
      {showConfirmModal && (
        <Modal
          header={<h3 style={{ margin: 0 }}>⚠️ Confirm Leave Classroom</h3>}
          body={modalBody}
          footer={modalFooter}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
    </div>
  );
}