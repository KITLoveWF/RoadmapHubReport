import React, { useEffect, useState } from "react";
import api from "#utils/api";
import TopicRoadmapClassroom from "#components/Classroom/RoadmapClassroom/TopicRoadmapClassroom/TopicRoadmapClassroom.jsx";
import QuizRoadmapClassroom from "#components/Classroom/RoadmapClassroom/QuizRoadmapClassroom/QuizRoadmapClassroom.jsx";
import "./RoadmapClassroom.css";
export default function RoadmapClassroom(props) {
  const { classroomId } = props;
  const [step, setStep] = useState(1); // 1 = Roadmap, 2 = Topic, 3 = Quiz
  const [roadmaps, setRoadmaps] = useState([]);
  const [myRoadmaps, setMyRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quizzes, setQuizzes] = useState(null);
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      // Backend tự động lấy user info từ token
      const response = await api.get("/roadmaps/getRoadmapByUserId");
      setMyRoadmaps(response.data.data);
    };
    fetchData();
    const fetchInfor = async () => {
      // Backend tự động lấy user info từ token
      const response = await api.get("/profiles/get-profile");
      setUser(response.data?.profile);
    };

    fetchInfor();
  }, []);
  useEffect(() => {
    const fetchRoamapInClass = async () => {
      const response = await api.get("/classrooms/getRoadmapInClass", {
        params: { classroomId: classroomId },
      });
      if (response.data[0].roadmapId !== null) {
        const getRoadmap = await api.get("/roadmaps/getTopicRoadmapByUserId", {
          params: { roadmapId: response.data[0].roadmapId },
        });
        setRoadmaps([getRoadmap]);
      }
    };
    fetchRoamapInClass();
  }, []);
  const handleAddRoadmap = async () => {
    if (selectedRoadmap !== null) {
      const response = await api.post("/classrooms/addRoadmapIntoClass", {
        classroomId: classroomId,
        roadmapId: selectedRoadmap.id,
      });
      const getRoadmap = await api.get("/roadmaps/getTopicRoadmapByUserId", {
        params: { roadmapId: selectedRoadmap.id },
      });
      setRoadmaps([getRoadmap]);
    }
  };
  const handleSelectRoadmap = (r) => {
    setSelectedRoadmap(r);
    setStep(2);
  };
  const handleSelectTopic = (tIndex) => {
    setSelectedTopic(tIndex);
    setStep(3);
  };
  useEffect(() => {
    if (selectedRoadmap) {
      const fetchAll = async () => {
        const response = await api.get("/quizzes/getQuiz", {
          params: {
            userCreateQuiz: selectedRoadmap?.data.roadmap.accountId,
            roadmapId: selectedRoadmap?.data.roadmap.roadmapId,
            classroomId: classroomId,
          },
        });
        //console.log(response)
        if (selectedRoadmap.data.roadmap.accountId === user.accountId)
          setEdit(true);
        if (response.data.length === 0) {
          setQuizzes({
            userCreateQuiz: selectedRoadmap.data.roadmap.accountId,
            roadmapId: selectedRoadmap.data.roadmap.roadmapId,
            classroomId: classroomId,
            topics: selectedRoadmap.data.roadmap.nodes
              .filter((t) => t.type === "topic")
              .map((node) => ({
                topicId: node.id,
                topicName: node.data.label,
                tests: [
                  {
                    title: "",
                    startTime: "",
                    endTime: "",
                    duration: 30,
                    questions: [
                      {
                        question: "",
                        answers: [{ text: "", correct: false }],
                      },
                    ],
                  },
                ],
              })),
          });
        } else {
          setQuizzes(response.data[0]);
        }
      };
      fetchAll();
    }
  }, [selectedRoadmap]);

  const addQuiz = async (selectedTopic, newQuiz) => {
    const copy = { ...quizzes };
    const index = copy.topics.findIndex(
      (topic) => topic.topicId === selectedTopic.id
    );
    if (index !== -1) {
      copy.topics[index].tests = [...copy.topics[index].tests, newQuiz];
    }
    setQuizzes(copy);
    const response = await api.post("/quizzes/updateQuiz", { quiz: copy });
    //console.log(response);
  };
  const updateQuiz = async (selectedTopic, quizIndex, updatedQuiz) => {
    const copy = { ...quizzes };
    const index = copy.topics.findIndex(
      (topic) => topic.topicId === selectedTopic.id
    );

    if (index !== -1) {
      copy.topics[index].tests[quizIndex] = updatedQuiz;
    }
    setQuizzes(copy);
    const response = await api.post("/quizzes/updateQuiz", { quiz: copy });
    //console.log(response);
  };
  const removeQuiz = async (selectedTopic, quizIndex) => {
    const copy = { ...quizzes };
    const index = copy.topics.findIndex(
      (topic) => topic.topicId === selectedTopic.id
    );
    if (index !== -1) {
      copy.topics[index].tests.splice(quizIndex, 1);
    }
    setQuizzes(copy);
    const response = await api.post("/quizzes/updateQuiz", { quiz: copy });
    //console.log(response);
  };

  return (
    <div className="roadmap-classroom-container">
      {/* --- STEP 1: DANH SÁCH ROADMAP --- */}
      {step === 1 && (
        <>
          {/* Header */}
          <div className="roadmap-header-classroom">
            <h2>📚 Manage Roadmaps</h2>
            <p>Add and manage roadmaps for your classroom</p>
          </div>

          {/* Add Roadmap Section */}
          <div className="add-roadmap-section">
            <div className="add-roadmap-title">
              <i className="bi bi-plus-circle-fill"></i>
              Add New Roadmap
            </div>
            <div className="roadmap-select-group">
              <div className="roadmap-select-wrapper">
                <select
                  className="roadmap-select"
                  value={selectedRoadmap?.id || ""}
                  onChange={(e) => {
                    const roadmap = myRoadmaps.find((i) => i.id == e.target.value);
                    setSelectedRoadmap(roadmap);
                  }}
                >
                  <option value="">Select a roadmap from your list...</option>
                  {myRoadmaps?.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="add-roadmap-btn"
                onClick={handleAddRoadmap}
                disabled={!selectedRoadmap}
              >
                <i className="bi bi-plus-lg"></i>
                Add to Class
              </button>
            </div>
          </div>

          {/* Roadmap List */}
          <div className="roadmap-list-container">
            <div className="roadmap-list-header">
              <div className="roadmap-list-title">
                <i className="bi bi-map-fill"></i>
                Roadmaps In Class
              </div>
              {roadmaps[0]?.data.roadmap !== null && roadmaps.length > 0 && (
                <span className="roadmap-count-badge">
                  {roadmaps.length} roadmap{roadmaps.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {roadmaps[0]?.data.roadmap !== null && roadmaps.length > 0 ? (
              roadmaps.map((r) => (
                <div key={r.data.roadmap.roadmapId} className="roadmap-card-classroom">
                  <div className="roadmap-card-content">
                    <div className="roadmap-icon">🗺️</div>
                    <div className="roadmap-info">
                      <h3 className="roadmap-name">{r.data.roadmap.name}</h3>
                      <div className="roadmap-meta">
                        <span className="roadmap-meta-item">
                          <i className="bi bi-diagram-3-fill"></i>
                          {r.data.roadmap.nodes?.filter(n => n.type === 'topic').length || 0} topics
                        </span>
                        <span className="roadmap-meta-item">
                          <i className="bi bi-person-fill"></i>
                          Created by {r.data.roadmap.accountId === user.accountId ? 'you' : 'teacher'}
                        </span>
                      </div>
                    </div>
                    <button
                      className="view-topics-btn"
                      onClick={() => handleSelectRoadmap(r)}
                    >
                      View Topics
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-roadmap-state">
                <div className="empty-icon">📭</div>
                <h3 className="empty-title">No Roadmaps Available</h3>
                <p className="empty-description">
                  This classroom has no roadmaps. Add the first roadmap to get started!
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* --- STEP 2: DANH SÁCH TOPIC --- */}
      {step === 2 && selectedRoadmap !== null && (
        <TopicRoadmapClassroom
          edit={edit}
          handleSelectTopic={handleSelectTopic}
          roadmaps={roadmaps}
          selectedRoadmap={selectedRoadmap}
          setStep={setStep}
        />
      )}

      {/* --- STEP 3: FORM TẠO QUIZ --- */}
      {step === 3 && selectedTopic !== null && (
        <QuizRoadmapClassroom
          edit={edit}
          selectedTopic={selectedTopic}
          quizzes={quizzes}
          setStep={setStep}
          addQuiz={addQuiz}
          updateQuiz={updateQuiz}
          removeQuiz={removeQuiz}
        />
      )}
    </div>
  );
}
