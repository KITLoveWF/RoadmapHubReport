import './LoadingSpinner.css';

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner-content">
        <div className="spinner-circle">
          <div className="spinner-inner"></div>
        </div>
        <p className="spinner-text">Đang tải dữ liệu học sinh...</p>
        <p className="spinner-subtext">Vui lòng chờ một chút</p>
      </div>
    </div>
  );
}
