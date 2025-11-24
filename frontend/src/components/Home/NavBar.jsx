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
  let notificationbutton;
  if (localStorage.getItem("loggedFlag") === "true") {
    notificationbutton = (
      <div className="dropdown me-3" style={{ flexShrink: 0 }}>
        <button
          className="btn btn-dark position-relative"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{ width: "35px", height: "35px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", minWidth: "35px" }}
        >
          <i className="bi bi-bell-fill" style={{ fontSize: "16px" }}></i>
          {unreadCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {unreadCount}
            </span>
          )}
        </button>
        <ul
          className="dropdown-menu dropdown-menu-dark"
          style={{ minWidth: "300px" }}
        >
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <li key={index}>
                <a
                  className={`dropdown-item ${!notif.read ? "fw-bold" : ""}`}
                  href={notif.link}
                  onClick={() => markAsRead(notif.id)}
                >
                  {notif.content}
                  {/* <small className="text-muted d-block">
                                                    {new Date(notif.createDate).toLocaleString()}
                                                </small> */}
                </a>
              </li>
            ))
          ) : (
            <li>
              <span className="dropdown-item">Không có thông báo</span>
            </li>
          )}
        </ul>
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
            src="../../../public/logo.png"
            alt="Logo"
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
