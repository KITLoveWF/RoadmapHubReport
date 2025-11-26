import React, { useState } from 'react';
import './ContactUs.css';
import { FiMail, FiPhone, FiMapPin, FiSend, FiFacebook, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <div className="contact-us-wrapper">
      <div className="contact-us-container">
        {/* Header */}
        <div className="contact-header">
          <h1>Get In Touch</h1>
          <p className="contact-subtitle">
            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-card">
              <h2>Send Us a Message</h2>
              
              {submitStatus === 'success' && (
                <div className="success-message">
                  ✓ Message sent successfully! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="contact-info-section">
            <div className="info-card">
              <h2>Contact Information</h2>
              <p className="info-description">
                Feel free to reach out through any of these channels. We're here to help!
              </p>

              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon">
                    <FiMail />
                  </div>
                  <div className="info-details">
                    <h3>Email</h3>
                    <p>22110046@student.hcmute.edu.vn</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <FiPhone />
                  </div>
                  <div className="info-details">
                    <h3>Phone</h3>
                    <p>0336248641</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <FiMapPin />
                  </div>
                  <div className="info-details">
                    <h3>Address</h3>
                    <p>01 Đ. Võ Văn Ngân, Linh Chiểu, Thủ Đức, Thành phố Hồ Chí Minh</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="social-section">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a href="#" className="social-link facebook" aria-label="Facebook">
                    <FiFacebook />
                  </a>
                  <a href="#" className="social-link twitter" aria-label="Twitter">
                    <FiTwitter />
                  </a>
                  <a href="#" className="social-link linkedin" aria-label="LinkedIn">
                    <FiLinkedin />
                  </a>
                  <a href="#" className="social-link github" aria-label="GitHub">
                    <FiGithub />
                  </a>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="hours-card">
              <h3>Office Hours</h3>
              <div className="hours-list">
                <div className="hours-item">
                  <span className="day">Monday - Friday</span>
                  <span className="time">9:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Saturday</span>
                  <span className="time">10:00 AM - 4:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Sunday</span>
                  <span className="time">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
