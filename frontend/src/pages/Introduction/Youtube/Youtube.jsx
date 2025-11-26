import React, { useState, useEffect } from 'react';
import './Youtube.css';
import { FiYoutube, FiBell, FiMail } from 'react-icons/fi';

function Youtube() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubscribed(true);
      setIsSubmitting(false);
      setEmail('');
    }, 1500);
  };

  return (
    <div className="youtube-wrapper">
      <div className="youtube-container">
        {/* Animated Background Elements */}
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>

        {/* Main Content */}
        <div className="youtube-content">
          {/* YouTube Icon */}
          <div className="youtube-icon-wrapper">
            <div className="icon-glow"></div>
            <FiYoutube className="youtube-icon" />
          </div>

          {/* Coming Soon Badge */}
          <div className="coming-soon-badge">
            <span className="badge-text">Coming Soon</span>
            <span className="badge-pulse"></span>
          </div>

          {/* Title */}
          <h1 className="youtube-title">
            RoadmapHub YouTube Channel
          </h1>

          {/* Subtitle */}
          <p className="youtube-subtitle">
            We're creating amazing video tutorials, learning guides, and educational content 
            to help you master new skills faster.
          </p>

          {/* Features Preview */}
          <div className="features-preview">
            <div className="feature-item">
              <div className="feature-icon">🎬</div>
              <span>Step-by-step Tutorials</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📚</div>
              <span>Complete Roadmap Guides</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💡</div>
              <span>Tips & Best Practices</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <span>Live Q&A Sessions</span>
            </div>
          </div>

          {/* Notification Section */}
          <div className="notification-section">
            {subscribed ? (
              <div className="success-message">
                <FiBell className="success-icon" />
                <div>
                  <h3>You're on the list!</h3>
                  <p>We'll notify you when our YouTube channel launches.</p>
                </div>
              </div>
            ) : (
              <>
                <h3 className="notification-title">
                  Get notified when we launch
                </h3>
                <form className="subscribe-form" onSubmit={handleSubscribe}>
                  <div className="input-wrapper">
                    <FiMail className="input-icon" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="subscribe-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <FiBell />
                        Notify Me
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Launch Info */}
          <div className="launch-info">
            <p className="info-text">
              💜 We're working hard to bring you high-quality educational content. 
              Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Youtube;