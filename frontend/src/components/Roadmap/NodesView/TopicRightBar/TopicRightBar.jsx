import { useEffect, useState } from "react";
import "./TopicRightBar.css";
import QuizItem from "../SmallItem/QuizItem/QuizItem";
import ItemTopic from "../SmallItem/ItemTopic/ItemTopic";
import api from "../../../../utils/api.js";

export default function TopicRightBar({ selectedNode, onTopicStatusUpdate }) {
  const [activeTab, setActiveTab] = useState("content");
  const [topicStatus, setTopicStatus] = useState(selectedNode?.data?.topicStatus ?? "none");
  const [items, setItems] = useState(selectedNode?.data?.itemsTopic ?? []);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setTopicStatus(selectedNode?.data?.topicStatus ?? "none");
    setItems(selectedNode?.data?.itemsTopic ?? []);
    setErrorMessage("");
  }, [selectedNode]);

  const getLearnTopic = async () => {
    const response = await api.get(`/learnTopic/get-learnTopic/${selectedNode?.id}`, {
      withCredentials: true,
    });
    return response.data.success;
  };

  const createLearnTopic = async (status) => {
    await api.post(
      `learnTopic/create-learnTopic`,
      { topicId: selectedNode?.id, process: status },
      { withCredentials: true }
    );
  };

  const updateLearnTopic = async (status) => {
    await api.post(
      `learnTopic/update-learnTopic`,
      { topicId: selectedNode?.id, process: status },
      { withCredentials: true }
    );
  };

  const deleteLearnTopic = async (status) => {
    await api.post(
      `learnTopic/delete-learnTopic`,
      { topicId: selectedNode?.id, process: status },
      { withCredentials: true }
    );
  };

  const persistTopicStatus = async (nextStatus) => {
    const exists = await getLearnTopic();
    if (nextStatus === "none") {
      if (exists) {
        await deleteLearnTopic(nextStatus);
      }
      return;
    }
    if (!exists) {
      await createLearnTopic(nextStatus);
    } else {
      await updateLearnTopic(nextStatus);
    }
  };

  const handleStatusSelect = async (event) => {
    const nextStatus = event.target.value;
    const prevStatus = topicStatus;
    setTopicStatus(nextStatus);
    setErrorMessage("");
    setSaving(true);
    try {
      await persistTopicStatus(nextStatus);
      onTopicStatusUpdate?.(selectedNode.id, nextStatus);
    } catch (error) {
      console.error("Không thể cập nhật trạng thái topic", error);
      setTopicStatus(prevStatus);
      setErrorMessage("Không thể lưu trạng thái. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className={`topic-rightbar ${selectedNode ? "open" : ""}`}>
      <div className="tab-status-row">
        <div className="tab-list-compact">
          <button
            className={`tab-compact ${activeTab === "content" ? "active" : ""}`}
            onClick={() => setActiveTab("content")}
          >
            <span className="tab-icon">📄</span>
            Content
          </button>
          <button
            className={`tab-compact ${activeTab === "feedback" ? "active" : ""}`}
            onClick={() => setActiveTab("feedback")}
          >
            <span className="tab-icon">💬</span>
            Feedback
          </button>
          <button
            className={`tab-compact ${activeTab === "quiz" ? "active" : ""}`}
            onClick={() => setActiveTab("quiz")}
          >
            <span className="tab-icon">🎯</span>
            Quiz
          </button>
        </div>

        <select
          className="status-select-inline"
          value={topicStatus}
          onChange={handleStatusSelect}
          disabled={saving}
        >
          <option value="none">None</option>
          <option value="progress">In Progress</option>
          <option value="done">Done</option>
          <option value="skip">Skip</option>
        </select>
      </div>
      {errorMessage && <p className="status-error">{errorMessage}</p>}

      {/* Content Area */}
      <div className="rightbar-content">
        {activeTab === "content" && (
          <div className="content-panel-simple">
            {/* Title as H1 */}
            <h2 className="topic-title-view-roadmap">
              {selectedNode?.data?.titleTopic || "there is no title"}
            </h2>
            
            {/* Description as paragraph */}
            <p className="topic-description-view-roadmap" dangerouslySetInnerHTML={{ __html: selectedNode?.data?.descriptionTopic || "there is no content" }}>
            </p>
            
            <div className="links-divider">
              <span className="divider-label">Resources</span>
              <hr />
            </div>
            <div className="links-list">
            </div>
              {items.map((item, idx) => (
                <ItemTopic
                  key={idx}
                  type={item.type}
                  title={item.title}
                  href={item.url}
                  onTypeChange={() => {}}
                />
              ))}
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="feedback-panel-simple">
            <div className="content-section">
              <h4 className="section-label">Feedback Notes</h4>
              <textarea
                className="feedback-input"
                placeholder="Write feedback here..."
                rows={6}
              />
            </div>
            
            <button className="submit-btn">Submit Feedback</button>
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="quiz-panel-simple">
            <div className="quiz-list">
              <QuizItem name="bài 1" />
              <QuizItem name="bài 2" />
              <QuizItem name="bài 3" />
              <QuizItem name="bài 4" />
              <QuizItem name="bài 5" />
              <QuizItem name="bài 6" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
  