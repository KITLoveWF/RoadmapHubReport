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
        setError(response.data.message || 'Xóa lớp học thất bại');
      }
    } catch (error) {
      console.error('Error deleting classroom:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi xóa lớp học');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ✅ Modal body
  const modalBody = (
    <div className="delete-confirm-body">
      <p className="warning-text">
        Bạn có chắc chắn muốn xóa lớp học này không?
      </p>
      <p className="warning-text warning-important">
        ❗ Hành động này <strong>không thể hoàn tác</strong>. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
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
        Hủy
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={handleDeleteClassroom}
        disabled={deleteLoading}
      >
        {deleteLoading ? (
          <>
            <span className="spinner"></span> Đang xóa...
          </>
        ) : (
          '✓ Xóa lớp học'
        )}
      </button>
    </div>
  );

  return (
    <div className="classroom-settings-container">
      <div className="settings-section">
        <h2>Cài đặt lớp học</h2>

        {/* Danger Zone */}
        <div className="danger-zone">
          <div className="danger-zone-header">
            <h3>⚠️ Vùng nguy hiểm</h3>
            <p>Những hành động này không thể hoàn tác</p>
          </div>

          <div className="danger-zone-content">
            <div className="delete-section">
              <div className="delete-info">
                <h4>Xóa lớp học</h4>
                <p>Xóa lớp học này và tất cả dữ liệu liên quan của nó</p>
              </div>
              <button
                className="btn-delete-classroom"
                onClick={() => setShowConfirmModal(true)}
              >
                Xóa lớp học
              </button>
            </div>
          </div>
        </div>

        {error && <div className="error-message">❌ {error}</div>}
      </div>

      {/* ✅ Sử dụng Modal Component */}
      {showConfirmModal && (
        <Modal
          header={<h3 style={{ margin: 0 }}>⚠️ Xác nhận xóa lớp học</h3>}
          body={modalBody}
          footer={modalFooter}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}