import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { FiUsers, FiMap, FiEye, FiGrid, FiPieChart } from "react-icons/fi";
import api from "#utils/api";

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get("/admin/statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);

      if (res.data?.status === true) {
        setStatistics(res.data.statistics);
      } else {
        setError("Failed to load statistics");
      }
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchStatistics}>
          Retry
        </button>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: statistics?.totalUsers || 0,
      icon: <FiUsers />,
      color: "primary",
      bgColor: "var(--color-primary-light)",
    },
    {
      title: "Total Roadmaps",
      value: statistics?.totalRoadmaps || 0,
      icon: <FiMap />,
      color: "secondary",
      bgColor: "var(--color-secondary-light)",
    },
    {
      title: "Public Roadmaps",
      value: statistics?.publicRoadmaps || 0,
      icon: <FiEye />,
      color: "success",
      bgColor: "var(--color-success-light)",
    },
    {
      title: "Total Classrooms",
      value: statistics?.totalClassrooms || 0,
      icon: <FiGrid />,
      color: "warning",
      bgColor: "var(--color-warning-light)",
    },
    {
      title: "Total Teams",
      value: statistics?.totalTeams || 0,
      icon: <FiPieChart />,
      color: "info",
      bgColor: "var(--color-info-light)",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">
          Welcome to RoadmapHub Admin Panel. Here's an overview of your platform.
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card card" key={index}>
            <div
              className="stat-icon"
              style={{ backgroundColor: stat.bgColor }}
            >
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value.toLocaleString()}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h3 className="card-title">Quick Actions</h3>
          <div className="quick-actions">
            <a href="/admin/users" className="action-link">
              <FiUsers />
              <span>Manage Users</span>
            </a>
            <a href="/admin/roadmaps" className="action-link">
              <FiMap />
              <span>Manage Roadmaps</span>
            </a>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Platform Insights</h3>
          <div className="insights">
            <div className="insight-item">
              <span className="insight-label">Private Roadmaps:</span>
              <span className="insight-value">
                {(statistics?.totalRoadmaps || 0) - (statistics?.publicRoadmaps || 0)}
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Public Roadmaps Ratio:</span>
              <span className="insight-value">
                {statistics?.totalRoadmaps > 0
                  ? `${((statistics.publicRoadmaps / statistics.totalRoadmaps) * 100).toFixed(1)}%`
                  : "0%"}
              </span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Avg Classrooms per User:</span>
              <span className="insight-value">
                {statistics?.totalUsers > 0
                  ? (statistics.totalClassrooms / statistics.totalUsers).toFixed(2)
                  : "0"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
