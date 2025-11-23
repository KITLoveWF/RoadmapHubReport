import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import AlertError from "#components/SignUp/AlertError.jsx";
import api from "#utils/api";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra nếu đã login admin rồi thì redirect vào dashboard
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      // Verify token validity
      api
        .get("/admin/check-auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data?.status === true) {
            navigate("/admin/dashboard");
          }
        })
        .catch(() => {
          // Token invalid, remove it
          localStorage.removeItem("adminToken");
        });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!username.trim()) {
      setError("Username is required");
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(
        "/admin/login",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.status === true) {
        // Lưu token vào localStorage
        localStorage.setItem("adminToken", res.data.token);
        // Redirect to admin dashboard
        navigate("/admin/dashboard");
      } else {
        setError(res.data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Admin login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box card">
        <div className="admin-login-header">
          <h1 className="admin-login-title">Admin Login</h1>
          <p className="admin-login-subtitle">
            Access the RoadmapHub administration panel
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <AlertError content={error} />
          </div>
        )}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="admin-login-footer">
          <p className="text-muted">
            This is a restricted area. Unauthorized access is prohibited.
          </p>
          <a href="/" className="back-home-link">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
