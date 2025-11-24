import React, { useState, useEffect } from "react";
import "./RoadmapManagement.css";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import api from "#utils/api";

const RoadmapManagement = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchRoadmaps();
  }, [pagination.page]);

  const fetchRoadmaps = async (search = false) => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("adminToken");

      let url = `/admin/roadmaps?page=${pagination.page}&limit=${pagination.limit}`;
      if (search && searchTerm.trim()) {
        url = `/admin/roadmaps/search?q=${encodeURIComponent(searchTerm)}&page=${pagination.page}&limit=${pagination.limit}`;
      }

      const res = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      if (res.data?.status === true) {
        setRoadmaps(res.data.roadmaps || []);
        setPagination((prev) => ({
          ...prev,
          total: res.data.pagination.total,
          totalPages: res.data.pagination.totalPages,
        }));
      } else {
        setError("Failed to load roadmaps");
      }
    } catch (err) {
      console.error("Failed to fetch roadmaps:", err);
      setError("Failed to load roadmaps");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchRoadmaps(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchRoadmaps(false);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleDeleteRoadmap = async (roadmapId) => {
    if (deleteConfirm !== roadmapId) {
      setDeleteConfirm(roadmapId);
    }

    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.delete(`/admin/roadmaps/${roadmapId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.status === true) {
        // Remove from local state
        setRoadmaps((prev) => prev.filter((roadmap) => roadmap.id !== roadmapId));
        setDeleteConfirm(null);

        // If no roadmaps left on current page and not on page 1, go back
        if (roadmaps.length === 1 && pagination.page > 1) {
          setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
        } else {
          fetchRoadmaps(searchTerm.trim() ? true : false);
        }
      } else {
        alert("Failed to delete roadmap");
      }
    } catch (err) {
      console.error("Failed to delete roadmap:", err);
      alert("Failed to delete roadmap");
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="roadmap-management">
      <div className="management-header">
        <div>
          <h1 className="management-title">Roadmap Management</h1>
          <p className="management-subtitle">
            View and manage all learning roadmaps
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
              placeholder="Search by roadmap name or description..."
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

      {/* Roadmap Table */}
      <div className="card-admin">
        {loading ? (
          <div className="table-loading">
            <div className="spinner"></div>
            <p>Loading roadmaps...</p>
          </div>
        ) : error ? (
          <div className="table-error">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => fetchRoadmaps()}>
              Retry
            </button>
          </div>
        ) : roadmaps.length === 0 ? (
          <div className="table-empty">
            <p>No roadmaps found</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Owner</th>
                    <th>Team</th>
                    <th>Learning</th>
                    <th>Teaching</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roadmaps.map((roadmap) => (
                    <tr key={roadmap.id}>
                      <td>
                        <div className="roadmap-name">{roadmap.name || "Untitled"}</div>
                      </td>
                      <td>
                        <div className="roadmap-description">
                          {truncateText(roadmap.description, 80)}
                        </div>
                      </td>
                      <td>{roadmap.ownerUsername || "N/A"}</td>
                      <td>{roadmap.teamName || "Personal"}</td>
                      <td>
                        <span className="badge badge-info">
                          {roadmap.learningCount || 0}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-success">
                          {roadmap.teachingCount || 0}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn-delete ${
                            deleteConfirm === roadmap.id ? "confirm" : ""
                          }`}
                          onClick={() => handleDeleteRoadmap(roadmap.id)}
                          title={
                            deleteConfirm === roadmap.id
                              ? "Click again to confirm"
                              : "Delete roadmap"
                          }
                        >
                          <FiTrash2 />
                          <span>
                            {deleteConfirm === roadmap.id ? "Confirm?" : "Delete"}
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
                  Page {pagination.page} of {pagination.totalPages} • {pagination.total} total roadmaps
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

export default RoadmapManagement;
