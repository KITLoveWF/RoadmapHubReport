import React from "react";
import { useNavigate } from "react-router-dom";
import { useCheckLogin } from "../../hooks/userCheckLogin";
import "./home.css";
import socket from "#utils/socket";
import { connectSocket, disconnectSocket } from "#utils/socketHelper";
import api from "#utils/api.js";
import { logoutAndRedirect } from "#utils/logout.js";
import { useState, useEffect } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const { isLoggedIn, profile } = useCheckLogin();
  const [loggedFlag, setLoggedFlag] = useState(false);

  function onLogin() {
    navigate("/login");
  }

  function onSignup() {
    navigate("/signup");
  }

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  async function onLogout() {
    disconnectSocket(); // Disconnect socket before logout
    await logoutAndRedirect(navigate);
  }

  const getNotifications = async () => {
    // Backend tự động lấy user info từ token
    const response = await api.get("/notifications/receiver");
    //console.log("Notifications:", response.data);
    setNotifications(response.data);
    setUnreadCount(response.data.filter((notif) => !notif.isRead).length);
  };

  useEffect(() => {
    // Only connect socket if user is logged in
    if (isLoggedIn) {
      connectSocket(); // Connect socket with JWT token
      getNotifications();
      setLoggedFlag(true);
      // Listen for new notifications
      socket.on("newNotification", (data) => {
        console.log("📬 New notification received via socket:", data);
        getNotifications();
      });
    } else {
      setLoggedFlag(false);
    }

    return () => {
      socket.off("newNotification");
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if(loggedFlag){
      localStorage.setItem("loggedFlag", "true");
    }
    else{
      localStorage.removeItem("loggedFlag");
    }
  }, [loggedFlag]);

  const markAsRead = async (notificationId) => {
    try {
      // Backend tự động lấy user info từ token
      await api.put(`/notifications/markAsRead`, {
        notificationId: notificationId,
      });
      getNotifications();
      //console.log("Mark as read response:", response.data);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  // Format time ago helper
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " năm trước";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " tháng trước";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " ngày trước";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " giờ trước";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " phút trước";
    
    return "Vừa xong";
  };

  let notificationbutton;
  if (localStorage.getItem("loggedFlag") === "true") {
    notificationbutton = (
      <div className="notification-dropdown dropdown me-3" style={{ flexShrink: 0 }}>
        <button
          className="notification-bell-btn btn position-relative"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="bi bi-bell-fill"></i>
          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <div className="dropdown-menu dropdown-menu-end notification-menu">
          {/* Header */}
          <div className="notification-header">
            <h6 className="mb-0">Thông báo</h6>
            {unreadCount > 0 && (
              <span className="unread-count">{unreadCount} mới</span>
            )}
          </div>
          
          {/* Notification List */}
          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <a
                  key={index}
                  className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                  href={notif.link}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="notification-icon">
                    <i className={`bi ${!notif.isRead ? 'bi-bell-fill' : 'bi-bell'}`}></i>
                  </div>
                  <div className="notification-content">
                    <p className="notification-text" dangerouslySetInnerHTML={{ __html: notif.content }}></p>
                    <span className="notification-time">
                      {formatTimeAgo(notif.createDate)}
                    </span>
                  </div>
                  {!notif.isRead && <div className="unread-dot"></div>}
                </a>
              ))
            ) : (
              <div className="notification-empty">
                <i className="bi bi-bell-slash"></i>
                <p>Không có thông báo</p>
              </div>
            )}
          </div>
          
          {/* Footer - optional */}
          {notifications.length > 0 && (
            <div className="notification-footer">
              <a href="#" className="view-all-link">
                Xem tất cả thông báo
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-2 py-3">
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand */}
        <div
          className="d-flex align-items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.png"
            alt="Roadmap Hub logo"
            height="40"
            className="me-2"
          />
          <span className="h4 mb-0 text-white">Roadmap Hub</span>
        </div>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Collapse content */}
        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarNav"
        >
          {/* Search form */}
          <form className="d-flex mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search roadmaps..."
              aria-label="Search"
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/search/${e.target.value}`)
              }
            />
            <button className="btn btn-outline-light" type="submit">
              Search
            </button>
          </form>

          {/* Auth / Avatar */}
          {notificationbutton}
          {isLoggedIn ? (
            <div className="dropdown" style={{ flexShrink: 0 }}>
              <button
                className="btn p-0 border-0 rounded-circle overflow-hidden"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ width: "55px", height: "55px", flexShrink: 0 }}
              >
                <img
                  src={
                    profile.avatar ||
                    "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/03/avatar-trang-66.jpg"
                  }
                  alt="User Avatar"
                  style={{ width: "55px", height: "55px", objectFit: "cover", borderRadius: "50%" }}
                />
              </button>
              <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="/profile">
                    My Profile
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      navigate("/teams");
                    }}
                  >
                    Manage teams
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={onLogout}
                    type="button"
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="auth-buttons d-flex gap-3">
              <button className="btn login-btn" onClick={onLogin}>
                Login
              </button>
              <button className="btn signup-btn" onClick={onSignup}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
