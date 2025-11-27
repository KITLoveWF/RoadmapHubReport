import { useEffect, useState } from "react";
import CreateQuizDetail from "../CreateQuizDetail/CreateQuizeDetail.jsx";
import DoQuizDetail from "../DoQuizDetail/DoQuizDetail.jsx";
import "./QuizRoadmapClassroom.css";

export default function QuizRoadmapClassroom(props) {
  const {
    edit,
    submitQuiz,
    addQuiz,
    setStep,
    updateQuiz,
    removeQuiz,
    quizzes,
    selectedTopic
  } = props;
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);
  
  // Check if quizzes is null or undefined
  if (!quizzes || !quizzes.topics) {
    return (
      <div className="quiz-classroom-container">
         <div className="quiz-breadcrumb">
            <span className="quiz-breadcrumb-item" onClick={() => setStep(1)}>
              <i className="bi bi-house-fill"></i>
              Roadmaps
            </span>
            <span className="quiz-breadcrumb-separator">
              <i className="bi bi-chevron-right"></i>
            </span>
            <span className="quiz-breadcrumb-item" onClick={() => setStep(2)}>
              Topics
            </span>
            <span className="quiz-breadcrumb-separator">
              <i className="bi bi-chevron-right"></i>
            </span>
            <span className="quiz-breadcrumb-item">
              Quizzes
            </span>
          </div>
        <div className="empty-quiz-state">
          <div className="empty-quiz-icon">⚠️</div>
          <h3 className="empty-quiz-title">Đang Tải Dữ Liệu...</h3>
          <p className="empty-quiz-description">
            Vui lòng đợi trong giây lát.
          </p>
        </div>
        <div className="back-button-container">
            <button className="back-to-topic-btn" onClick={() => setStep(2)}>
              <i className="bi bi-arrow-left"></i>
              Quay Lại Topics
            </button>
          </div>
      </div>
    );
  }

  const topic = quizzes.topics.find(t => t.topicId === selectedTopic.id);
  const [newQuiz, setQuiz] = useState({
    title: "",
    startTime: "",
    endTime: "",
    duration: 30,
    questions: [
      {
        question: "",
        answers: [{ text: "", correct: false }]
      }
    ]
  });

  return (
    <>
      {selectedQuizIndex === null ? (
        <div className="quiz-classroom-container">
          {/* Breadcrumb Navigation */}
          <div className="quiz-breadcrumb">
            <span className="quiz-breadcrumb-item" onClick={() => setStep(1)}>
              <i className="bi bi-house-fill"></i>
              Roadmaps
            </span>
            <span className="quiz-breadcrumb-separator">
              <i className="bi bi-chevron-right"></i>
            </span>
            <span className="quiz-breadcrumb-item" onClick={() => setStep(2)}>
              Topics
            </span>
            <span className="quiz-breadcrumb-separator">
              <i className="bi bi-chevron-right"></i>
            </span>
            <span className="quiz-breadcrumb-item">
              Quizzes
            </span>
          </div>

          {/* Header Section */}
          <div className="quiz-header-content" style={{ marginBottom: '32px' }}>
            <div className="quiz-header-icon">{edit ? '✏️' : '📝'}</div>
            <h2 className="quiz-header-title">
              {edit ? 'Manage Quiz' : 'Take Quiz'}
            </h2>
            <p className="quiz-header-subtitle">
              {edit 
                ? 'Create and edit quizzes for learners' 
                : 'Complete quizzes to test your knowledge on the topic'}
            </p>
            <div className="quiz-topic-name">
              📚 {topic.topicName}
            </div>
          </div>

          {/* Quiz Grid */}
          {topic.tests && topic.tests.length > 0 ? (
            <div className="quiz-grid">
              {topic.tests.map((quiz, index) => (
              <div className="quiz-card" key={index}>
                {/* Card Header */}
                <div className="quiz-card-header">
                  <div className="quiz-card-number">Quiz #{index + 1}</div>
                  <h3 className="quiz-card-title">
                    {quiz.title || `Quiz ${index + 1}`}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="quiz-card-body">
                  {/* Duration */}
                  <div className="quiz-info-item">
                    <div className="quiz-info-icon">⏱️</div>
                    <div>
                      <span className="quiz-info-label">Duration: </span>
                      <span className="quiz-info-value">{quiz.duration} minutes</span>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="quiz-info-item">
                    <div className="quiz-info-icon">📅</div>
                    <div className="quiz-date-range">
                      <div><span className="quiz-info-label">Start:</span> {new Date(quiz.startTime).toLocaleString('en-US')}</div>
                      <div><span className="quiz-info-label">End:</span> {new Date(quiz.endTime).toLocaleString('en-US')}</div>
                    </div>
                  </div>

                  {/* Questions Count */}
                  <div className="quiz-info-item">
                    <div className="quiz-info-icon">❓</div>
                    <div>
                      <span className="quiz-info-label">Questions: </span>
                      <span className="quiz-info-value">{quiz.questions?.length || 0} questions</span>
                    </div>
                  </div>

                  {/* Score (only for students) */}
                  {!edit && (
                    <div className="quiz-score">
                      <i className="bi bi-trophy-fill"></i>
                      <span className="quiz-score-text">Your Score:</span>
                      <span className="quiz-score-value">{quiz.point || 0}/10</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="quiz-card-actions">
                  {edit ? (
                    <>
                      <button
                        className="quiz-action-btn edit-quiz-btn"
                        onClick={() => setSelectedQuizIndex(index)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                        Edit
                      </button>
                      <button
                        className="quiz-action-btn delete-quiz-btn"
                        onClick={() => removeQuiz(selectedTopic, index)}
                      >
                        <i className="bi bi-trash-fill"></i>
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      className="quiz-action-btn do-quiz-btn"
                      onClick={() => setSelectedQuizIndex(index)}
                    >
                      Do Quiz
                      <i className="bi bi-arrow-right-circle-fill"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}

              {/* Add New Quiz Card (only for edit mode) */}
              {edit && (
                <div
                  className="add-quiz-card"
                  onClick={() => addQuiz(selectedTopic, newQuiz)}
                >
                  <div className="add-quiz-icon">
                    <i className="bi bi-plus-lg"></i>
                  </div>
                  <h3 className="add-quiz-title">Create New Quiz</h3>
                  <p className="add-quiz-description">
                    Click to add a new quiz for this topic
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-quiz-state">
              <div className="empty-quiz-icon">📝</div>
              <h3 className="empty-quiz-title">
                {edit ? 'No Quizzes Available' : 'No Assignments Available'}
              </h3>
              <p className="empty-quiz-description">
                {edit 
                  ? 'This topic has no quizzes. Click the "Create New Quiz" button to add the first quiz!' 
                  : 'The teacher has not created any quizzes for this topic. Please check back later!'}
              </p>
              {edit && (
                <button 
                  className="empty-quiz-action-btn"
                  onClick={() => addQuiz(selectedTopic, newQuiz)}
                >
                  <i className="bi bi-plus-circle-fill"></i>
                  Create First Quiz
                </button>
              )}
            </div>
          )}

          {/* Back Button */}
          <div className="back-button-container">
            <button className="back-to-topic-btn" onClick={() => setStep(2)}>
              <i className="bi bi-arrow-left"></i>
              Back to Topics
            </button>
          </div>
        </div>
      ) : (
        <>
          {edit && (
            <CreateQuizDetail
              topic={topic}
              selectedQuizIndex={selectedQuizIndex}
              setSelectedQuizIndex={setSelectedQuizIndex}
              updateQuiz={updateQuiz}
              setStep={setStep}
              selectedTopic={selectedTopic}
            />
          )}
          {!edit && (
            <DoQuizDetail
              topic={topic}
              selectedQuizIndex={selectedQuizIndex}
              setSelectedQuizIndex={setSelectedQuizIndex}
              updateQuiz={updateQuiz}
              setStep={setStep}
              selectedTopic={selectedTopic}
              submitQuiz={submitQuiz}
            />
          )}
        </>
      )}
    </>
  );
}