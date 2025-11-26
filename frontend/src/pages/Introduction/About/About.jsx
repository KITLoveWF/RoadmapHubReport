import React from 'react';
import './About.css';
import { FiUsers, FiTarget, FiTrendingUp, FiAward, FiBookOpen, FiLayers, FiZap, FiHeart } from 'react-icons/fi';

function About() {
  const features = [
    {
      icon: <FiBookOpen />,
      title: 'Personalized Learning Paths',
      description: 'Create custom roadmaps tailored to your learning goals and track your progress every step of the way.'
    },
    {
      icon: <FiUsers />,
      title: 'Collaborative Classrooms',
      description: 'Join interactive classrooms, share knowledge with peers, and learn together in a supportive community.'
    },
    {
      icon: <FiLayers />,
      title: 'Structured Content',
      description: 'Access well-organized topics, quizzes, and resources designed to enhance your learning experience.'
    },
    {
      icon: <FiZap />,
      title: 'Real-time Progress',
      description: 'Monitor your achievements, track completed topics, and celebrate milestones as you advance.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Learners' },
    { number: '500+', label: 'Learning Paths' },
    { number: '50+', label: 'Expert Instructors' },
    { number: '95%', label: 'Success Rate' }
  ];

  const values = [
    {
      icon: <FiTarget />,
      title: 'Mission-Driven',
      description: 'We believe in making quality education accessible to everyone, everywhere.'
    },
    {
      icon: <FiTrendingUp />,
      title: 'Continuous Growth',
      description: 'We constantly evolve our platform to meet the changing needs of modern learners.'
    },
    {
      icon: <FiAward />,
      title: 'Excellence First',
      description: 'We maintain the highest standards in content quality and user experience.'
    },
    {
      icon: <FiHeart />,
      title: 'Community Focused',
      description: 'We foster a supportive environment where learners help each other succeed.'
    }
  ];

  return (
    <div className="about-wrapper">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">About RoadmapHub</h1>
          <p className="about-hero-subtitle">
            Empowering learners worldwide to achieve their goals through structured, 
            collaborative, and personalized learning experiences.
          </p>
        </div>
        <div className="hero-gradient"></div>
      </section>

      <div className="about-container">
        {/* Mission Section */}
        <section className="mission-section">
          <div className="section-header">
            <h2>Our Mission</h2>
            <div className="section-divider"></div>
          </div>
          <p className="mission-text">
            At RoadmapHub, we're on a mission to revolutionize online learning by providing a platform 
            that combines the structure of traditional education with the flexibility of modern technology. 
            We believe that everyone deserves access to high-quality learning resources and a supportive 
            community to help them achieve their educational and professional goals.
          </p>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid-about">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2>What Makes Us Different</h2>
            <div className="section-divider"></div>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="section-header">
            <h2>Our Core Values</h2>
            <div className="section-divider"></div>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vision Section */}
        <section className="vision-section">
          <div className="vision-content">
            <div className="vision-text">
              <h2>Our Vision</h2>
              <p>
                We envision a world where quality education knows no boundaries. Through RoadmapHub, 
                we're building a global community of learners and educators who inspire, support, and 
                challenge each other to reach new heights.
              </p>
              <p>
                Our platform is more than just a learning management system—it's a catalyst for personal 
                and professional transformation, designed to help you navigate your unique learning journey 
                with confidence and clarity.
              </p>
            </div>
            <div className="vision-illustration">
              <div className="vision-card-stack">
                <div className="vision-card card-1">
                  <FiBookOpen className="card-icon" />
                  <span>Learn</span>
                </div>
                <div className="vision-card card-2">
                  <FiUsers className="card-icon" />
                  <span>Collaborate</span>
                </div>
                <div className="vision-card card-3">
                  <FiTrendingUp className="card-icon" />
                  <span>Grow</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-card">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>Join thousands of learners who are already achieving their goals with RoadmapHub.</p>
            <button className="cta-button">Get Started Today</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;