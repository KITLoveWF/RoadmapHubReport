import React, { useState } from 'react';
import './Guides.css';
import { FiBook, FiMap, FiUsers, FiCheckCircle, FiPlayCircle, FiAward } from 'react-icons/fi';

function Guides() {
  const [activeGuide, setActiveGuide] = useState(0);

  const guides = [
    {
      id: 'getting-started',
      title: 'Getting Started with RoadmapHub',
      icon: <FiPlayCircle />,
      color: '#667eea',
      description: 'Learn the basics of RoadmapHub and start your learning journey',
      steps: [
        {
          title: 'Create Your Account',
          content: 'Sign up using your email or connect with Google/GitHub. Verify your email to unlock all features.'
        },
        {
          title: 'Complete Your Profile',
          content: 'Add your name, bio, and learning interests. This helps us recommend relevant roadmaps and connect you with like-minded learners.'
        },
        {
          title: 'Explore Roadmaps',
          content: 'Browse our public roadmap library. Use filters to find roadmaps that match your interests and skill level.'
        },
        {
          title: 'Start Learning',
          content: 'Choose a roadmap and click "Start Learning." Work through topics at your own pace and track your progress.'
        }
      ]
    },
    {
      id: 'create-roadmap',
      title: 'Creating Your First Roadmap',
      icon: <FiMap />,
      color: '#f093fb',
      description: 'Step-by-step guide to creating and publishing your own learning roadmap',
      steps: [
        {
          title: 'Plan Your Roadmap',
          content: 'Decide on the topic, target audience, and learning outcomes. Break down the subject into logical topics and subtopics.'
        },
        {
          title: 'Create the Roadmap',
          content: 'Click "Create Roadmap" from your dashboard. Enter a title, description, and choose visibility settings (public or private).'
        },
        {
          title: 'Add Topics',
          content: 'Click "Add Topic" to create sections. For each topic, add a title, description, and learning resources (links, videos, articles).'
        },
        {
          title: 'Create Quizzes',
          content: 'Add quizzes to test knowledge. Create multiple-choice questions with explanations for each answer.'
        },
        {
          title: 'Set Milestones',
          content: 'Define milestones to mark major achievements. This helps learners stay motivated and track their progress.'
        },
        {
          title: 'Publish & Share',
          content: 'Review your roadmap, make it public if desired, and share the link with your community or add it to classrooms.'
        }
      ]
    },
    {
      id: 'join-classroom',
      title: 'Joining and Using Classrooms',
      icon: <FiUsers />,
      color: '#4ecdc4',
      description: 'Learn how to join classrooms and collaborate with other learners',
      steps: [
        {
          title: 'Find a Classroom',
          content: 'Browse public classrooms or enter a classroom code provided by your instructor. You can also accept email invitations.'
        },
        {
          title: 'Join the Classroom',
          content: 'Click "Join" and you\'ll be added to the classroom. You\'ll see the classroom roadmap, discussion forum, and assignments.'
        },
        {
          title: 'Access Course Materials',
          content: 'Navigate through the classroom roadmap. Complete topics, watch videos, read resources, and take notes.'
        },
        {
          title: 'Complete Assignments',
          content: 'Check the assignments section regularly. Submit your work before deadlines and review feedback from instructors.'
        },
        {
          title: 'Participate in Discussions',
          content: 'Use the forum to ask questions, share insights, and help classmates. Active participation enhances learning.'
        },
        {
          title: 'Track Your Progress',
          content: 'Monitor your completion status, quiz scores, and overall performance. Aim for consistent progress.'
        }
      ]
    },
    {
      id: 'create-classroom',
      title: 'Creating and Managing Classrooms',
      icon: <FiBook />,
      color: '#ff6b6b',
      description: 'Guide for instructors to create and manage effective classrooms',
      steps: [
        {
          title: 'Create a Classroom',
          content: 'Go to "My Classrooms" and click "Create New Classroom." Enter a name, description, and choose visibility settings.'
        },
        {
          title: 'Add a Roadmap',
          content: 'Select a roadmap from your collection or choose from public roadmaps. This will be the learning path for your students.'
        },
        {
          title: 'Invite Students',
          content: 'Share the classroom code or send email invitations. You can also make the classroom public for open enrollment.'
        },
        {
          title: 'Create Assignments',
          content: 'Design assignments with clear instructions, deadlines, and grading criteria. Link them to specific topics in the roadmap.'
        },
        {
          title: 'Monitor Progress',
          content: 'Use the dashboard to see student progress, quiz scores, and engagement. Identify students who need additional support.'
        },
        {
          title: 'Facilitate Discussions',
          content: 'Moderate the forum, answer questions, and encourage peer-to-peer learning. Create discussion prompts to spark conversations.'
        },
        {
          title: 'Provide Feedback',
          content: 'Review submissions, grade assignments, and provide constructive feedback. Recognize achievements and offer guidance.'
        }
      ]
    },
    {
      id: 'track-progress',
      title: 'Tracking Your Learning Progress',
      icon: <FiCheckCircle />,
      color: '#95e1d3',
      description: 'Make the most of RoadmapHub\'s progress tracking features',
      steps: [
        {
          title: 'View Your Dashboard',
          content: 'Access your personal dashboard to see an overview of all active roadmaps, classrooms, and recent activity.'
        },
        {
          title: 'Check Completion Status',
          content: 'Each roadmap shows a progress bar indicating percentage complete. Click for detailed breakdown by topic.'
        },
        {
          title: 'Review Quiz Results',
          content: 'See all your quiz attempts, scores, and correct/incorrect answers. Identify areas that need more study.'
        },
        {
          title: 'Celebrate Milestones',
          content: 'Track completed milestones and achievements. Share your progress with the community or on social media.'
        },
        {
          title: 'Analyze Learning Patterns',
          content: 'Use analytics to see when you\'re most productive, which topics take longer, and your learning streak.'
        },
        {
          title: 'Set Goals',
          content: 'Create personal learning goals with target completion dates. Get reminders to stay on track.'
        }
      ]
    },
    {
      id: 'best-practices',
      title: 'Best Practices for Success',
      icon: <FiAward />,
      color: '#ffd93d',
      description: 'Tips and strategies to maximize your learning on RoadmapHub',
      steps: [
        {
          title: 'Set a Learning Schedule',
          content: 'Dedicate specific times for learning. Consistency is more effective than sporadic long sessions.'
        },
        {
          title: 'Take Effective Notes',
          content: 'Use the built-in note-taking feature. Summarize key concepts in your own words to reinforce learning.'
        },
        {
          title: 'Engage with the Community',
          content: 'Ask questions, answer others\' questions, and participate in discussions. Teaching others reinforces your knowledge.'
        },
        {
          title: 'Practice Actively',
          content: 'Don\'t just read—do. Complete exercises, take quizzes, and work on projects to apply what you\'ve learned.'
        },
        {
          title: 'Review Regularly',
          content: 'Revisit completed topics periodically. Spaced repetition helps transfer knowledge to long-term memory.'
        },
        {
          title: 'Seek Feedback',
          content: 'Share your work with instructors and peers. Constructive feedback accelerates improvement.'
        },
        {
          title: 'Stay Motivated',
          content: 'Celebrate small wins, join study groups, and remind yourself of your learning goals when motivation dips.'
        }
      ]
    }
  ];

  return (
    <div className="guides-wrapper">
      <div className="guides-container">
        {/* Header */}
        <div className="guides-header">
          <h1>RoadmapHub Guides</h1>
          <p className="guides-subtitle">
            Comprehensive tutorials to help you master every feature of RoadmapHub
          </p>
        </div>

        {/* Guide Navigation */}
        <div className="guides-nav">
          {guides.map((guide, index) => (
            <button
              key={guide.id}
              className={`guide-nav-item ${activeGuide === index ? 'active' : ''}`}
              onClick={() => setActiveGuide(index)}
              style={{ '--guide-color': guide.color }}
            >
              <div className="nav-icon">{guide.icon}</div>
              <div className="nav-text">
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Active Guide Content */}
        <div className="guide-content">
          <div className="guide-header" style={{ '--guide-color': guides[activeGuide].color }}>
            <div className="guide-icon">{guides[activeGuide].icon}</div>
            <div>
              <h2>{guides[activeGuide].title}</h2>
              <p>{guides[activeGuide].description}</p>
            </div>
          </div>

          <div className="guide-steps">
            {guides[activeGuide].steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number" style={{ backgroundColor: guides[activeGuide].color }}>
                  {index + 1}
                </div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="guides-cta">
          <h3>Ready to Put This Into Practice?</h3>
          <p>Start using RoadmapHub today and accelerate your learning journey.</p>
          <button className="cta-button" >Get Started Now</button>
        </div>
      </div>
    </div>
  );
}

export default Guides;