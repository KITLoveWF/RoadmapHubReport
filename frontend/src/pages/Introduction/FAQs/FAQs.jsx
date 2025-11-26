import React, { useState } from 'react';
import './FAQs.css';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';

function FAQs() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'What is RoadmapHub?',
          answer: 'RoadmapHub is a comprehensive learning platform that helps you create personalized learning paths, join collaborative classrooms, and track your progress through structured roadmaps. Whether you\'re learning a new skill, preparing for a career change, or teaching others, RoadmapHub provides the tools you need to succeed.'
        },
        {
          question: 'How do I create an account?',
          answer: 'Creating an account is simple! Click the "Sign Up" button in the top navigation bar, enter your email address, create a password, and verify your email. You can also sign up using your Google or GitHub account for faster registration.'
        },
        {
          question: 'Is RoadmapHub free to use?',
          answer: 'Yes! RoadmapHub offers a free tier that includes access to public roadmaps, basic classroom features, and progress tracking. We also offer premium plans with additional features like unlimited private roadmaps, advanced analytics, and priority support.'
        }
      ]
    },
    {
      category: 'Roadmaps',
      questions: [
        {
          question: 'What is a learning roadmap?',
          answer: 'A learning roadmap is a structured path that breaks down complex topics into manageable steps. Each roadmap contains topics, resources, quizzes, and milestones to help you progress systematically toward your learning goals. You can create your own roadmaps or follow ones created by experts.'
        },
        {
          question: 'Can I create my own roadmap?',
          answer: 'Absolutely! Creating your own roadmap is one of RoadmapHub\'s core features. You can define topics, add resources, create quizzes, set milestones, and even make your roadmap public to share with the community. Our intuitive editor makes it easy to organize your content.'
        },
        {
          question: 'How do I follow a roadmap?',
          answer: 'Browse our public roadmap library, find a roadmap that matches your interests, and click "Start Learning." You\'ll be able to track your progress, complete quizzes, and mark topics as completed as you work through the material.'
        },
        {
          question: 'Can I share my roadmap with others?',
          answer: 'Yes! You can make your roadmap public for anyone to follow, share it via a direct link, or add it to specific classrooms. You can also collaborate with team members by granting them edit permissions.'
        }
      ]
    },
    {
      category: 'Classrooms',
      questions: [
        {
          question: 'What are classrooms in RoadmapHub?',
          answer: 'Classrooms are collaborative learning spaces where instructors can guide students through specific roadmaps. They include features like discussion forums, assignments, quizzes, progress monitoring, and real-time communication between teachers and students.'
        },
        {
          question: 'How do I join a classroom?',
          answer: 'You can join a classroom by entering a classroom code provided by your instructor, accepting an invitation via email, or searching for public classrooms in our directory. Once joined, you\'ll have access to all classroom materials and activities.'
        },
        {
          question: 'Can I create my own classroom?',
          answer: 'Yes! Any user can create a classroom. As a classroom owner, you can add roadmaps, invite students, create assignments, monitor progress, and facilitate discussions. You can set your classroom as public or private depending on your needs.'
        },
        {
          question: 'How many students can join a classroom?',
          answer: 'Free accounts can have up to 30 students per classroom. Premium accounts support unlimited students. Classroom owners can manage student enrollment and remove inactive members at any time.'
        }
      ]
    },
    {
      category: 'Progress & Quizzes',
      questions: [
        {
          question: 'How is my progress tracked?',
          answer: 'Your progress is automatically tracked as you complete topics, pass quizzes, and reach milestones. You can view detailed analytics including completion percentages, time spent, quiz scores, and learning streaks on your dashboard.'
        },
        {
          question: 'Can I take quizzes multiple times?',
          answer: 'Yes! You can retake quizzes as many times as you need. Your highest score will be recorded, and you can review your answers to learn from mistakes. Some classroom quizzes may have attempt limits set by instructors.'
        },
        {
          question: 'What happens if I fail a quiz?',
          answer: 'Failing a quiz is part of the learning process! You can review the correct answers, study the related materials, and retake the quiz when you\'re ready. Your progress won\'t be blocked, but completing quizzes helps reinforce your knowledge.'
        }
      ]
    },
    {
      category: 'Account & Privacy',
      questions: [
        {
          question: 'How do I change my password?',
          answer: 'Go to your account settings, click on "Security," and select "Change Password." You\'ll need to enter your current password and then create a new one. We recommend using a strong, unique password for security.'
        },
        {
          question: 'Is my data secure?',
          answer: 'Yes, we take security seriously. All data is encrypted in transit and at rest. We never share your personal information with third parties without your consent. Read our Privacy Policy for detailed information about how we protect your data.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account at any time from your account settings. Please note that this action is permanent and will remove all your roadmaps, progress data, and classroom memberships. Export any important data before deletion.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'I found a bug. How do I report it?',
          answer: 'We appreciate bug reports! You can report issues through our Contact page, email us at support@roadmaphub.com, or submit a detailed report via our GitHub repository. Please include screenshots and steps to reproduce the issue.'
        },
        {
          question: 'Which browsers are supported?',
          answer: 'RoadmapHub works best on modern browsers including Chrome, Firefox, Safari, and Edge (latest versions). We recommend keeping your browser up to date for the best experience and security.'
        },
        {
          question: 'Is there a mobile app?',
          answer: 'Currently, RoadmapHub is optimized for web browsers on both desktop and mobile devices. A dedicated mobile app is in development and will be available soon. You can add our web app to your home screen for a native-like experience.'
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="faqs-wrapper">
      <div className="faqs-container">
        {/* Header */}
        <div className="faqs-header">
          <div className="header-icon">
            <FiHelpCircle />
          </div>
          <h1>Frequently Asked Questions</h1>
          <p className="faqs-subtitle">
            Find answers to common questions about RoadmapHub. Can't find what you're looking for? 
            <a href="/contact" className="contact-link">Contact us</a> and we'll be happy to help!
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="faqs-content">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h2 className="category-title">{category.category}</h2>
              <div className="category-questions">
                {category.questions.map((faq, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`;
                  const isExpanded = expandedIndex === index;
                  
                  return (
                    <div
                      key={questionIndex}
                      className={`faq-item ${isExpanded ? 'expanded' : ''}`}
                    >
                      <button
                        className="faq-question"
                        onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                      >
                        <span className="question-text">{faq.question}</span>
                        <FiChevronDown className="question-icon" />
                      </button>
                      {isExpanded && (
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="faqs-cta">
          <h3>Still have questions?</h3>
          <p>Our support team is here to help you succeed.</p>
          <a href="/contact-us" className="cta-button">Contact Support</a>
        </div>
      </div>
    </div>
  );
}

export default FAQs;