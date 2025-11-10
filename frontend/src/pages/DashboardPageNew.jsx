import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const DashboardPageNew = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [careerHistory, setCareerHistory] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const config = {
          headers: { 'Authorization': `Bearer ${token}` }
        };

        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

        const userResponse = await axios.get(`${API_BASE_URL}/auth/me`, config);
        setUserData(userResponse.data);

        try {
          const careerResponse = await axios.get(`${API_BASE_URL}/career-history`, config);
          setCareerHistory(careerResponse.data.history || careerResponse.data || []);
        } catch (err) {
          console.log('No career history found');
          setCareerHistory([]);
        }

        try {
          const pathResponse = await axios.get(`${API_BASE_URL}/learning-path-history`, config);
          setLearningPaths(pathResponse.data.paths || pathResponse.data || []);
        } catch (err) {
          console.log('No learning paths found');
          setLearningPaths([]);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
          setTimeout(() => {
            logout();
            navigate('/login');
          }, 2000);
        } else {
          setError('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 mb-4">{error}</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary w-full">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl text-gray-900">CareerPath</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/quiz')}
                className="btn btn-primary btn-sm"
              >
                Take Quiz
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-primary rounded-2xl p-8 mb-8 text-white">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {userData?.name || user?.name || 'User'}! 👋
            </h1>
            <p className="text-indigo-100 mb-6">
              {userData?.email || user?.email}
            </p>
            <p className="text-indigo-50">
              Continue your career journey and track your progress towards your goals.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <span className="badge badge-primary">Active</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {careerHistory.length}
            </div>
            <div className="text-sm text-gray-600">Career Predictions</div>
          </div>

          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <span className="badge badge-success">In Progress</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {learningPaths.length}
            </div>
            <div className="text-sm text-gray-600">Learning Paths</div>
          </div>

          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <span className="badge" style={{backgroundColor: '#f3e8ff', color: '#7c3aed'}}>
                Growing
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {userData?.stats?.completion_rate || '0'}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/quiz')}
              className="card p-6 text-left hover-lift group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📝</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    Take Quiz
                  </h3>
                  <p className="text-sm text-gray-600">Discover your career path</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => navigate('/career-path')}
              className="card p-6 text-left hover-lift group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    Career Prediction
                  </h3>
                  <p className="text-sm text-gray-600">Get AI-powered insights</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => navigate('/learning-path')}
              className="card p-6 text-left hover-lift group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                    Learning Path
                  </h3>
                  <p className="text-sm text-gray-600">Build your roadmap</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Career Predictions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Career Predictions</h2>
            {careerHistory.length > 0 && (
              <span className="text-sm text-gray-600">
                {careerHistory.length} {careerHistory.length === 1 ? 'prediction' : 'predictions'}
              </span>
            )}
          </div>

          {careerHistory.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No predictions yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Take the quiz or fill out your profile to get AI-powered career recommendations
              </p>
              <button onClick={() => navigate('/quiz')} className="btn btn-primary">
                Get Started
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {careerHistory.map((career, index) => (
                <div key={career.id || index} className="card p-6 hover-lift">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {career.career_path || career.primary_career}
                      </h3>
                      {career.created_at && (
                        <p className="text-sm text-gray-500">
                          {new Date(career.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        // Handle delete
                      }}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {career.confidence && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Match Confidence</span>
                        <span className="text-sm font-semibold text-indigo-600">
                          {(career.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${career.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigate('/learning-path')}
                    className="btn btn-secondary w-full"
                  >
                    Generate Learning Path →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learning Paths */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Learning Paths</h2>
            {learningPaths.length > 0 && (
              <span className="text-sm text-gray-600">
                {learningPaths.length} {learningPaths.length === 1 ? 'path' : 'paths'}
              </span>
            )}
          </div>

          {learningPaths.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No learning paths yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create a personalized roadmap to achieve your career goals
              </p>
              <button onClick={() => navigate('/learning-path')} className="btn btn-gradient">
                Create Learning Path
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {learningPaths.map((path, index) => (
                <div key={path.id || index} className="card p-6 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📚</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {path.career_path || path.title}
                          </h3>
                          {path.created_at && (
                            <p className="text-sm text-gray-500">
                              Created {new Date(path.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            // Handle delete
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {path.overview && (
                        <p className="text-gray-700 mb-4 text-sm">{path.overview}</p>
                      )}

                      {path.progress !== undefined && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm font-semibold text-green-600">
                              {path.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all"
                              style={{ width: `${path.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => navigate('/learning-path', { state: { pathData: path } })}
                        className="btn btn-secondary btn-sm"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPageNew;
