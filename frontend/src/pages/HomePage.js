import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaRocket, FaBrain, FaGraduationCap, FaTrophy, FaChartLine, FaUsers } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Your Ideal <span className="text-gradient">Career Path</span>
          </h1>
          <p className="hero-subtitle">
            Leverage AI-powered insights to unlock your potential and navigate your professional journey with confidence
          </p>
          <div className="hero-buttons">
            {user ? (
              <Link to="/career-path" className="btn btn-hero">
                Start Your Journey
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-hero">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-hero-outline">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">
            <FaBrain /> AI Analysis
          </div>
          <div className="floating-card card-2">
            <FaGraduationCap /> Learning Paths
          </div>
          <div className="floating-card card-3">
            <FaTrophy /> Quiz & Assess
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaBrain />
            </div>
            <h3>AI Career Analysis</h3>
            <p>Our advanced ML model analyzes your skills, interests, and experience to predict your ideal career paths with high accuracy.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaGraduationCap />
            </div>
            <h3>Personalized Learning</h3>
            <p>Get customized learning roadmaps powered by GPT-4 and Claude, complete with resources, timelines, and milestones.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaTrophy />
            </div>
            <h3>Interactive Quizzes</h3>
            <p>Test your knowledge with AI-generated quizzes tailored to your learning path and track your progress.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>Progress Tracking</h3>
            <p>Monitor your career development journey with detailed analytics and insights through your personal dashboard.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaRocket />
            </div>
            <h3>Resume Analysis</h3>
            <p>Upload your resume for instant AI-powered career recommendations based on your existing qualifications.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3>Industry Insights</h3>
            <p>Access real-time salary data, job market trends, and industry-specific guidance for informed decision-making.</p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3>95%</h3>
            <p>Prediction Accuracy</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Career Paths</p>
          </div>
          <div className="stat-item">
            <h3>10K+</h3>
            <p>Learning Resources</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>AI Support</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Transform Your Career?</h2>
        <p>Join thousands of professionals who have discovered their true potential</p>
        {!user && (
          <Link to="/signup" className="btn btn-cta">
            Start Your Free Journey
          </Link>
        )}
      </section>
    </div>
  );
};

export default HomePage;
