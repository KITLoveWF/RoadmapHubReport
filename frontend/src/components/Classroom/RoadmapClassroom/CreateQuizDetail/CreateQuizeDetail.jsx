import { useEffect, useState } from "react";
import "./CreateQuizeDetail.css";

export default function CreateQuizDetail(props){
    const { topic,
            selectedQuizIndex,
            selectedTopic,
            updateQuiz,
            setSelectedQuizIndex
    } = props; 
    const [title,setTitle] = useState(topic.tests[selectedQuizIndex].title);
    const [startTime,setStartTime] = useState(topic.tests[selectedQuizIndex].startTime);
    const [endTime,setEndTime] = useState(topic.tests[selectedQuizIndex].endTime);
    const [duration,setDuration] = useState(topic.tests[selectedQuizIndex].duration);
    const [questions,setQuestion] = useState(topic.tests[selectedQuizIndex].questions)
    const [newQuiz , setNewQuiz] = useState({
        title:title,
        startTime:startTime,
        endTime:endTime,
        duration:duration,
        questions:questions
    })
    const [errors, setErrors] = useState({});
    
    useEffect(()=>{
        setNewQuiz({
        title:title,
        startTime:startTime,
        endTime:endTime,
        duration:duration,
        questions:questions
    })
    },[title,startTime,endTime,duration,questions])
    
    const getMinEndTime = () => {
        if (!startTime) return "";
        const start = new Date(startTime);
        start.setMinutes(start.getMinutes() + duration); // cộng thêm duration phút
        return start.toISOString().slice(0, 16); // format lại cho datetime-local
    };

    // Validation functions
    const validateQuiz = () => {
        const newErrors = {};

        // Validate title
        if (!title || title.trim() === '') {
            newErrors.title = 'Quiz title is required';
        }

        // Validate start time
        if (!startTime) {
            newErrors.startTime = 'Start time is required';
        }

        // Validate end time
        if (!endTime) {
            newErrors.endTime = 'End time is required';
        }

        // Validate start time < end time
        if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
            newErrors.endTime = 'End time must be after start time';
        }

        // Validate questions
        if (questions.length === 0) {
            newErrors.questions = 'At least one question is required';
        } else {
            const questionErrors = [];
            questions.forEach((q, qIndex) => {
                const qError = {};

                // Validate question content
                if (!q.question || q.question.trim() === '') {
                    qError.question = `Question ${qIndex + 1} content is required`;
                }

                // Validate answers exist
                if (!q.answers || q.answers.length === 0) {
                    qError.answers = `Question ${qIndex + 1} must have at least one answer`;
                } else {
                    // Count correct answers
                    const correctAnswersCount = q.answers.filter(a => a.correct).length;
                    
                    // Validate each answer has content
                    const emptyAnswers = q.answers.filter(a => !a.text || a.text.trim() === '');
                    if (emptyAnswers.length > 0) {
                        qError.answerContent = `Question ${qIndex + 1} has empty answers. All answers must have content`;
                    }

                    // Validate exactly one correct answer
                    if (correctAnswersCount === 0) {
                        qError.correctAnswer = `Question ${qIndex + 1} must have exactly 1 correct answer`;
                    } else if (correctAnswersCount > 1) {
                        qError.correctAnswer = `Question ${qIndex + 1} can only have 1 correct answer (currently ${correctAnswersCount})`;
                    }
                }

                if (Object.keys(qError).length > 0) {
                    questionErrors.push(qError);
                }
            });

            if (questionErrors.length > 0) {
                newErrors.questionDetails = questionErrors;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveQuiz = () => {
        if (validateQuiz()) {
            updateQuiz(selectedTopic, selectedQuizIndex, newQuiz);
        }
    };

    const getQuestionError = (qIndex) => {
        if (errors.questionDetails && errors.questionDetails[qIndex]) {
            return errors.questionDetails[qIndex];
        }
        return {};
    };
    return(
    <div className="quiz-editor-container">
        {/* Header */}
        <div className="quiz-header">
            <h2>
                <i className="bi bi-pencil-square"></i>
                Edit Quiz
            </h2>
            <p>Update your quiz details, questions, and answers</p>
        </div>

        {/* Basic Info Section */}
        <div className="quiz-basic-info">
            <h4>
                <i className="bi bi-info-circle"></i>
                Basic Information
            </h4>
            
            <div className="mb-3">
                <label className="form-label">
                    <i className="bi bi-card-heading"></i>
                    Quiz Title
                    {errors.title && <span className="text-danger"> *</span>}
                </label>
                <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    placeholder="Enter quiz title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
            </div>

            <div className="time-inputs-grid">
                <div className="mb-3">
                    <label className="form-label">
                        <i className="bi bi-calendar-check"></i>
                        Start Time
                        {errors.startTime && <span className="text-danger"> *</span>}
                    </label>
                    <input
                        type="datetime-local"
                        className={`form-control ${errors.startTime ? 'is-invalid' : ''}`}
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                    {errors.startTime && <div className="invalid-feedback d-block">{errors.startTime}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        <i className="bi bi-calendar-x"></i>
                        End Time
                        {errors.endTime && <span className="text-danger"> *</span>}
                    </label>
                    <input
                        type="datetime-local"
                        className={`form-control ${errors.endTime ? 'is-invalid' : ''}`}
                        min={getMinEndTime()}
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                    {errors.endTime && <div className="invalid-feedback d-block">{errors.endTime}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        <i className="bi bi-clock"></i>
                        Duration (minutes)
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        min="10"
                        placeholder="e.g. 60"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                    />
                </div>
            </div>
        </div>

        {/* Questions Section */}
        <div className="questions-section">
            <div className="questions-header">
                <h4>
                    <i className="bi bi-question-circle"></i>
                    Questions
                </h4>
                <span className="questions-count">
                    {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
                </span>
            </div>

            {questions.length === 0 ? (
                <div className="empty-state">
                    <i className="bi bi-inbox"></i>
                    <h5>No questions yet</h5>
                    <p>Click the button below to add your first question</p>
                </div>
            ) : (
                questions.map((q, qIndex) => {
                    const qError = getQuestionError(qIndex);
                    return (
                    <div key={qIndex} className={`question-card ${Object.keys(qError).length > 0 ? 'has-error' : ''}`}>
                        {Object.keys(qError).length > 0 && (
                            <div className="question-error-banner">
                                <i className="bi bi-exclamation-triangle-fill"></i>
                                <div className="error-messages">
                                    {qError.question && <p>{qError.question}</p>}
                                    {qError.answers && <p>{qError.answers}</p>}
                                    {qError.answerContent && <p>{qError.answerContent}</p>}
                                    {qError.correctAnswer && <p>{qError.correctAnswer}</p>}
                                </div>
                            </div>
                        )}
                        
                        <div className="question-header">
                            <div className="question-number">{qIndex + 1}</div>
                            <div className="question-input-wrapper">
                                <input
                                    type="text"
                                    className={`question-input ${qError.question ? 'is-invalid' : ''}`}
                                    placeholder={`Enter question ${qIndex + 1}...`}
                                    value={q.question}
                                    onChange={(e) => {
                                        const newQuestions = [...questions];
                                        newQuestions[qIndex] = {
                                            ...newQuestions[qIndex],
                                            question: e.target.value
                                        };
                                        setQuestion(newQuestions);
                                    }}
                                />
                                <button
                                    className="btn-delete-question"
                                    onClick={() => {
                                        let newQuestions = [...questions];
                                        newQuestions = newQuestions.filter((a, index) => index !== qIndex);
                                        setQuestion(newQuestions);
                                    }}
                                >
                                    <i className="bi bi-trash"></i>
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="answers-section">
                            <h5>
                                <i className="bi bi-list-check"></i>
                                Answers
                                {(qError.correctAnswer || qError.answerContent || qError.answers) && <span className="text-danger"> *</span>}
                            </h5>
                            
                            {q.answers.map((a, aIndex) => (
                                <div key={aIndex} className={`answer-item ${a.correct ? 'correct-answer' : ''}`}>
                                    <div className="answer-index">{String.fromCharCode(65 + aIndex)}</div>
                                    <input
                                        type="text"
                                        className={`answer-input ${qError.answerContent ? 'is-invalid' : ''}`}
                                        placeholder={`Answer ${String.fromCharCode(65 + aIndex)}...`}
                                        value={a.text}
                                        onChange={(e) => {
                                            const newQuestions = [...questions];
                                            newQuestions[qIndex].answers[aIndex] = {
                                                ...newQuestions[qIndex].answers[aIndex],
                                                text: e.target.value
                                            };
                                            setQuestion(newQuestions);
                                        }}
                                    />
                                    <div className={`answer-correct-checkbox ${a.correct ? 'checked' : ''}`}>
                                        <input
                                            type="checkbox"
                                            checked={a.correct}
                                            onChange={(e) => {
                                                const newQuestions = [...questions];
                                                
                                                // If checking this answer
                                                if (e.target.checked) {
                                                    // Uncheck all other answers first (only 1 correct answer allowed)
                                                    newQuestions[qIndex].answers.forEach((ans, idx) => {
                                                        if (idx !== aIndex) {
                                                            ans.correct = false;
                                                        }
                                                    });
                                                }
                                                
                                                newQuestions[qIndex].answers[aIndex] = {
                                                    ...newQuestions[qIndex].answers[aIndex],
                                                    correct: e.target.checked
                                                };
                                                setQuestion(newQuestions);
                                            }}
                                        />
                                        <span>{a.correct ? 'Correct Answer' : 'Mark as Correct'}</span>
                                    </div>
                                    <button
                                        className="btn-delete-answer"
                                        onClick={() => {
                                            const newQuestions = [...questions];
                                            newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter(
                                                (a, index) => index !== aIndex
                                            );
                                            setQuestion(newQuestions);
                                        }}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                            ))}

                            <button
                                className="btn-add-answer"
                                onClick={() => {
                                    const newQuestions = [...questions];
                                    newQuestions[qIndex].answers = [
                                        ...newQuestions[qIndex].answers,
                                        { text: "", correct: false }
                                    ];
                                    setQuestion(newQuestions);
                                }}
                            >
                                <i className="bi bi-plus-circle"></i>
                                Add Answer
                            </button>
                        </div>
                    </div>
                    );
                })
            )}
        </div>

        {/* Action Buttons */}
        <div className="quiz-actions">
            <button 
                className="btn-add-question" 
                onClick={() => {
                    const newQuestion = [...questions];
                    newQuestion.push({
                        question: "",
                        answers: [{ text: "", correct: false }]
                    });
                    setQuestion(newQuestion);
                }}
            >
                <i className="bi bi-plus-circle-fill"></i>
                Add Question
            </button>

            <button 
                className="btn-save-quiz" 
                onClick={handleSaveQuiz}
            >
                <i className="bi bi-check-circle-fill"></i>
                Save Quiz
            </button>

            <button 
                className="btn-back" 
                onClick={() => setSelectedQuizIndex(null)}
            >
                <i className="bi bi-arrow-left"></i>
                Back to Quizzes
            </button>
        </div>
    </div>
    )
}