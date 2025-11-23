import React, { useState, useEffect } from "react";
import "./UserManagement.css";
import { FiSearch, FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import api from "#utils/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editClassroomLimit, setEditClassroomLimit] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const fetchUsers = async (search = false) => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("adminToken");

      let url = `/admin/users?page=${pagination.page}&limit=${pagination.limit}`;
      if (search && searchTerm.trim()) {
        url = `/admin/users/search?q=${encodeURIComponent(searchTerm)}&page=${pagination.page}&limit=${pagination.limit}`;
      }

      const res = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.status === true) {
        setUsers(res.data.accounts || []);
        if (res.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            total: res.data.pagination.total,
            totalPages: res.data.pagination.totalPages,
          }));
        }
      } else {
        setError("Failed to load users");
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(false);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleEditLimit = (userId, currentLimit) => {
    setEditingUserId(userId);
    setEditClassroomLimit(currentLimit.toString());
  };

  const handleSaveLimit = async (userId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.put(
        `/admin/users/${userId}/limit`,
        { classroomLimit: parseInt(editClassroomLimit) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.status === true) {
        // Update local state
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId
              ? { ...user, classroomLimit: parseInt(editClassroomLimit) }
              : user
          )
        );
        setEditingUserId(null);
      } else {
        alert("Failed to update classroom limit");
      }
    } catch (err) {
      console.error("Failed to update limit:", err);
      alert("Failed to update classroom limit");
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditClassroomLimit("");
  };

  const handleDeleteUser = async (userId) => {
    if (deleteConfirm !== userId) {
      setDeleteConfirm(userId);
      setTimeout(() => setDeleteConfirm(null), 5000); // Reset after 5s
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.delete(`/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.status === true) {
        // Remove from local state
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        setDeleteConfirm(null);
        
        // If no users left on current page and not on page 1, go back
        if (users.length === 1 && pagination.page > 1) {
          setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
        } else {
          fetchUsers(searchTerm.trim() ? true : false);
        }
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="user-management">
      <div className="management-header">
        <div>
          <h1 className="management-title">User Management</h1>
          <p className="management-subtitle">
            Manage all registered users and their permissions
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card-admin mb-6">
        <form className="search-bar" onSubmit={handleSearch}>
          <div className="search-input-group">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by username, email, or full name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="search-actions">
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            {searchTerm && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* User Table */}
      <div className="card-admin">
        {loading ? (
          <div className="table-loading">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : error ? (
          <div className="table-error">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => fetchUsers()}>
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="table-empty">
            <p>No users found</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>Username</th>
                    <th style={{ width: '25%' }}>Email</th>
                    <th style={{ width: '20%' }}>Full Name</th>
                    <th style={{ width: '15%' }}>Classroom Limit</th>
                    <th style={{ width: '25%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.username || "N/A"}</strong>
                      </td>
                      <td>{user.email || "N/A"}</td>
                      <td>{user.fullname || "N/A"}</td>
                      <td>
                        {editingUserId === user.id ? (
                          <div className="inline-edit">
                            <input
                              type="number"
                              className="edit-input"
                              value={editClassroomLimit}
                              onChange={(e) => setEditClassroomLimit(e.target.value)}
                              min="0"
                              max="100"
                            />
                            <button
                              className="edit-action-btn save"
                              onClick={() => handleSaveLimit(user.id)}
                              title="Save"
                            >
                              <FiCheck />
                            </button>
                            <button
                              className="edit-action-btn cancel"
                              onClick={handleCancelEdit}
                              title="Cancel"
                            >
                              <FiX />
                            </button>
                          </div>
                        ) : (
                          <div className="limit-display">
                            <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                              {user.classroomLimit || 0}
                            </span>
                            <button
                              className="edit-btn"
                              onClick={() =>
                                handleEditLimit(user.id, user.classroomLimit || 0)
                              }
                              title="Edit limit"
                            >
                              <FiEdit2 />
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <button
                          className={`btn-delete ${
                            deleteConfirm === user.id ? "confirm" : ""
                          }`}
                          onClick={() => handleDeleteUser(user.id)}
                          title={
                            deleteConfirm === user.id
                              ? "Click again to confirm"
                              : "Delete user"
                          }
                        >
                          <FiTrash2 />
                          <span>
                            {deleteConfirm === user.id ? "Confirm Delete?" : "Delete User"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 0 && (
              <div className="pagination">
                <div className="pagination-info">
                  Page {pagination.page} of {pagination.totalPages} • {pagination.total} total users
                </div>
                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.page === 1}
                    title="First page"
                  >
                    ««
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    title="Previous page"
                  >
                    «
                  </button>
                  
                  {/* Page numbers */}
                  {(() => {
                    const pages = [];
                    const totalPages = pagination.totalPages;
                    const currentPage = pagination.page;
                    
                    // Always show first page
                    if (totalPages > 0) {
                      pages.push(
                        <button
                          key={1}
                          className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </button>
                      );
                    }
                    
                    // Show ellipsis or pages around current
                    if (currentPage > 3) {
                      pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
                    }
                    
                    // Show pages around current page
                    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                      pages.push(
                        <button
                          key={i}
                          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                          onClick={() => handlePageChange(i)}
                        >
                          {i}
                        </button>
                      );
                    }
                    
                    // Show ellipsis before last page
                    if (currentPage < totalPages - 2) {
                      pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
                    }
                    
                    // Always show last page if more than 1 page
                    if (totalPages > 1) {
                      pages.push(
                        <button
                          key={totalPages}
                          className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </button>
                      );
                    }
                    
                    return pages;
                  })()}
                  
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    title="Next page"
                  >
                    »
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={pagination.page === pagination.totalPages}
                    title="Last page"
                  >
                    »»
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
