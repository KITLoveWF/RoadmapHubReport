import { useState, useRef, useEffect } from 'react';
import './AIChatBoxQuiz.css';
import api from '#utils/api.js';

const ChatBox = ({ quiz, topic, updateQuiz, addQuiz }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Xin chào! Tôi có thể giúp bạn với quiz. Hỏi tôi về cách thêm câu hỏi, chỉnh sửa hoặc quản lý quiz nhé!", 
      type: 'ai' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // FIXED: Proper async function without setTimeout antipattern
  const getAIResponse = async (message) => {
    try {
      const lowerMessage = message.toLowerCase();
      const AIResponse = await api.post('/quizzes/createQuizByAI',
        {   
          text: lowerMessage,
          topic: topic,
          quiz: quiz,
          history: messages
                  .filter(m => m.type === "user")
                  .map(m => `user: ${m.text}`)
                  .join("\n")
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if(AIResponse.data?.status === true && AIResponse.data?.message === "Quiz created successfully") {
        const newQuiz = {
            title: AIResponse.data?.tests?.quizTitle || "Quiz Mới",
            startTime: AIResponse.data?.tests?.startTime || "",
            endTime: AIResponse.data?.tests?.endTime || "",
            duration: AIResponse.data?.tests?.duration || 30,
            questions: AIResponse.data?.tests?.questions || []
        }
        addQuiz(topic,newQuiz);
      console.log("AI Response:", AIResponse.data);
      }
      if(AIResponse.data?.status === true && AIResponse.data?.message === "Quiz updated successfully") {
        console.log("AI Response:", AIResponse.data);
        const quizSelect = quiz.topics.find(t => t.topicId === topic.id);
        const Quiz = quizSelect.tests[parseInt(AIResponse.data?.tests?.QuizOrder)-1].questions.push(...AIResponse.data?.tests?.questions || []);
        updateQuiz(topic,parseInt(AIResponse.data?.tests?.QuizOrder)-1,Quiz);
        
      }
      return AIResponse.data?.message;
    } catch (error) {
      console.error('API Error:', error);
      return "Đã có lỗi xảy ra khi xử lý yêu cầu của bạn.";
    }
  };

  // FIXED: Removed setTimeout antipattern, proper async/await handling
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // FIXED: Proper await without setTimeout
      const aiResponseText = await getAIResponse(inputMessage);

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponseText,
        type: 'ai'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        type: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="chat-toggle" onClick={() => setIsOpen(true)}>
        💬 AI Assistant
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>🤖 AI Assistant</span>
        <button className="chat-close" onClick={() => setIsOpen(false)}>✕</button>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              {message?.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai">
            <div className="message-content">
              <div className="typing">AI đang suy nghĩ...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Bạn cần hỗ trợ gì?"
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage} 
          disabled={!inputMessage.trim() || isLoading}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBox;