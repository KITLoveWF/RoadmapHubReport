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
        Bạn có chắc chắn muốn rời khỏi lớp học <strong>"{classroomName}"</strong> không?
      </p>
      <p className="warning-text warning-info">
        ℹ️ Sau khi rời khỏi, bạn sẽ không còn quyền truy cập vào lớp học này. 
        Bạn có thể yêu cầu giáo viên thêm bạn vào lại.
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
        Hủy
      </button>
      <button
        type="button"
        className="btn btn-warning"
        onClick={handleLeaveClassroom}
        disabled={leaveLoading}
      >
        {leaveLoading ? (
          <>
            <span className="spinner"></span> Đang rời khỏi...
          </>
        ) : (
          '✓ Rời khỏi lớp'
        )}
      </button>
    </div>
  );

  return (
    <div className="classroom-student-settings-container">
      <div className="settings-section">
        <h2>Cài đặt của bạn</h2>

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
            <h3>🚪 Rời khỏi lớp học</h3>
            <p>Quản lý quyền truy cập của bạn</p>
          </div>

          <div className="leave-zone-content">
            <div className="leave-section">
              <div className="leave-info">
                <h4>Rời khỏi lớp học "{classroomName}"</h4>
                <p>Bạn sẽ mất quyền truy cập vào tất cả tài liệu và bài tập trong lớp này</p>
              </div>
              <button
                className="btn-leave-classroom"
                onClick={() => setShowConfirmModal(true)}
                disabled={leaveLoading}
              >
                🚪 Rời khỏi
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="info-section">
          <h3>ℹ️ Thông tin</h3>
          <ul className="info-list">
            <li>Bạn có thể yêu cầu giáo viên thêm bạn vào lớp học bất cứ lúc nào</li>
            <li>Dữ liệu học tập của bạn trong lớp này sẽ vẫn được giữ lại</li>
            <li>Bạn sẽ không nhận được thông báo từ lớp học này nữa</li>
          </ul>
        </div>
      </div>

      {/* ✅ Sử dụng Modal Component */}
      {showConfirmModal && (
        <Modal
          header={<h3 style={{ margin: 0 }}>⚠️ Xác nhận rời khỏi lớp học</h3>}
          body={modalBody}
          footer={modalFooter}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}