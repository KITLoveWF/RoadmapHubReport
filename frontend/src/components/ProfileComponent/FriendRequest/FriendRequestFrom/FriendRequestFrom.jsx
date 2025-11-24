import React, {useState,useEffect} from "react";
import "./FriendRequestFrom.css";
import api from "../../../../utils/api";

export default function FriendRequestFrom() {
  const [requests, setRequests] = useState([]);
  const fetchRequests = async () => {
    try {
      const response = await api.get("/friends/friend-requests/from", {
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

  const onCancel = async (id) => {
    await api.post(
      "/friends/friend-requests/from/cancel",
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
        <h2>Yêu cầu bạn bè đã gửi</h2>
        <p>Theo dõi các lời mời bạn đã gửi cho người khác.</p>
      </header>
      {requests?.length === 0 ? (
        <p className="friends-empty-state">Bạn chưa gửi lời mời nào.</p>
      ) : (
        <ul className="friends-row-list">
          {requests.map((req) => (
            <li key={req.id} className="friends-row">
              <div className="friends-row-info">
                <p className="friends-row-title">Tới: {req.receiverEmail}</p>
                <span className="friends-row-meta">{new Date(req.createAt).toLocaleString()}</span>
              </div>
              <div className="friends-row-actions">
                {req.requestState === "pending" ? (
                  <button className="friends-btn danger" type="button" onClick={() => onCancel(req.id)}>
                    Hủy lời mời
                  </button>
                ) : (
                  <span className="friends-status-pill">{req.requestState}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
