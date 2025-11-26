import { useState, useEffect } from "react";
import "./TopicRoadmapClassroom.css";

export default function TopicRoadmapClassroom(props) {
  const { edit, handleSelectTopic, selectedRoadmap, setStep } = props;
  
  const topics = selectedRoadmap.data.roadmap.nodes.filter(t => t.type === "topic");

  return (
    <div className="topic-classroom-container">
      {/* Breadcrumb Navigation */}
      <div className="topic-breadcrumb">
        <span className="topic-breadcrumb-item" onClick={() => setStep(1)}>
          <i className="bi bi-house-fill"></i>
          Roadmaps
        </span>
        <span className="topic-breadcrumb-separator">
          <i className="bi bi-chevron-right"></i>
        </span>
        <span className="topic-breadcrumb-item">
          Topics
        </span>
      </div>

      {/* Header Section */}
      <div className="topic-header">
        <div className="topic-header-content">
          <div className="topic-header-icon">📚</div>
          <h2 className="topic-header-title">{selectedRoadmap.data.roadmap.name}</h2>
          <p className="topic-header-subtitle">
            {edit ? 'Quản lý và tạo quiz cho các chủ đề học tập' : 'Xem các quiz và bài kiểm tra'}
          </p>
          
          {/* Stats */}
          <div className="topic-stats">
            <div className="topic-stat-item">
              <i className="bi bi-diagram-3-fill"></i>
              <span>{topics.length} Topics</span>
            </div>
            <div className="topic-stat-item">
              <i className="bi bi-person-badge-fill"></i>
              <span>{edit ? 'Chế độ chỉnh sửa' : 'Chế độ xem'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Topic List */}
      <div className="topic-list-container">
        {topics.length > 0 ? (
          <div className="topic-grid">
            {topics.map((t, tIndex) => (
              <div key={tIndex} className="topic-card">
                <div className="topic-card-content">
                  {/* Topic Number */}
                  <div className="topic-number">{tIndex + 1}</div>

                  {/* Topic Info */}
                  <div className="topic-info">
                    <h3 className="topic-title">{t.data.label}</h3>
                    <p className="topic-description">
                      <i className="bi bi-lightbulb-fill"></i>
                      {edit ? 'Nhấn để tạo hoặc chỉnh sửa quiz' : 'Nhấn để xem quiz và làm bài'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="topic-actions">
                    {edit ? (
                      <button
                        className="topic-action-btn create-quiz-btn"
                        onClick={() => handleSelectTopic(t)}
                      >
                        <i className="bi bi-plus-circle-fill"></i>
                        Tạo Quiz
                      </button>
                    ) : (
                      <button
                        className="topic-action-btn view-quiz-btn"
                        onClick={() => handleSelectTopic(t)}
                      >
                        Xem Quiz
                        <i className="bi bi-arrow-right"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-topics-state">
            <div className="empty-topics-icon">📝</div>
            <h3 className="empty-topics-title">Chưa Có Topics</h3>
            <p className="empty-topics-description">
              Roadmap này chưa có chủ đề nào. Hãy thêm topics vào roadmap!
            </p>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-btn" onClick={() => setStep(1)}>
          <i className="bi bi-arrow-left"></i>
          Quay Lại Roadmaps
        </button>
      </div>
    </div>
  );
}