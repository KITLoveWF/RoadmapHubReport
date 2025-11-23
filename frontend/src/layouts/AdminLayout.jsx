import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import "./AdminLayout.css";
import { 
  FiHome, 
  FiUsers, 
  FiMap, 
  FiLogOut, 
  FiMenu, 
  FiX 
} from "react-icons/fi";
import api from "#utils/api";

const AdminLayout = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const res = await api.get("/admin/check-auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data?.status === true) {
          setAdmin(res.data.admin);
        } else {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">RoadmapHub Admin</h2>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FiHome />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FiUsers />
            <span>User Management</span>
          </NavLink>

          <NavLink
            to="/admin/roadmaps"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FiMap />
            <span>Roadmap Management</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              {admin?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="admin-details">
              <p className="admin-name">{admin?.username}</p>
              <p className="admin-role">Administrator</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Navbar */}
        <header className="admin-navbar">
          <button className="hamburger-btn" onClick={toggleSidebar}>
            <FiMenu />
          </button>
          <div className="navbar-title">
            {location.pathname === "/admin/dashboard" && "Dashboard"}
            {location.pathname === "/admin/users" && "User Management"}
            {location.pathname === "/admin/roadmaps" && "Roadmap Management"}
          </div>
          <div className="navbar-actions">
            <span className="navbar-admin">Welcome, {admin?.username}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
