import React,{useState, useEffect} from "react";
import "./FriendRequestTo.css";
import api from "../../../../utils/api";

export default function FriendRequestTo() {
  const [requests, setRequests] = useState([]);
  const fetchRequests = async () => {
    try {
      const response = await api.get("/friends/friend-requests/to", {
        withCredentials: true,
      });
      setRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);
  const onAccept = async (id) => {
    await api.post(
      "/friends/friend-requests/to/accept",
      { id },
      {
        withCredentials: true,
      }
    );
    fetchRequests();
  };
  const onReject = async (id) => {
    await api.post(
      "/friends/friend-requests/to/reject",
      { id },
      {
        withCredentials: true,
      }
    );
    fetchRequests();
  };
  return (
    <div className="friends-card">
      <header>
        <h2>Lời mời kết bạn</h2>
        <p>Danh sách những người đang chờ bạn phản hồi.</p>
      </header>
      {requests?.length === 0 ? (
        <p className="friends-empty-state">Chưa có lời mời nào.</p>
      ) : (
        <ul className="friends-row-list">
          {requests.map((req) => (
            <li key={req.id} className="friends-row">
              <div className="friends-row-info">
                <p className="friends-row-title">Từ: {req.senderEmail}</p>
                <span className="friends-row-meta">{new Date(req.createAt).toLocaleString()}</span>
              </div>
              <div className="friends-row-actions">
                <button className="friends-btn primary" type="button" onClick={() => onAccept(req.id)}>
                  Accept
                </button>
                <button className="friends-btn danger" type="button" onClick={() => onReject(req.id)}>
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
