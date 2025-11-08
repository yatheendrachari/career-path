import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [careerHistory, setCareerHistory] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all dashboard data
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
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

        // Fetch user profile
        const userResponse = await axios.get(`${API_BASE_URL}/auth/me`, config);
        setUserData(userResponse.data);

        // Fetch career prediction history
        try {
          const careerResponse = await axios.get(`${API_BASE_URL}/career-history`, config);
          setCareerHistory(careerResponse.data.history || careerResponse.data || []);
        } catch (err) {
          console.log('No career history found');
          setCareerHistory([]);
        }

        // Fetch learning path history
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

  // Delete career prediction
  const handleDeleteCareer = async (careerId) => {
    if (!window.confirm('Are you sure you want to delete this career prediction?')) {
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      await axios.delete(`${API_BASE_URL}/career-history/${careerId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setCareerHistory(prev => prev.filter(c => c.id !== careerId));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete career prediction');
    }
  };

  // Delete learning path
  const handleDeletePath = async (pathId) => {
    if (!window.confirm('Are you sure you want to delete this learning path?')) {
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      await axios.delete(`${API_BASE_URL}/learning-path-history/${pathId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setLearningPaths(prev => prev.filter(p => p.id !== pathId));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete learning path');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {userData?.name || user?.name || 'User'}!
              </h1>
              <p className="text-blue-100">
                {userData?.email || user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/quiz')}
            className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-all hover:scale-105"
          >
            <span className="text-3xl mb-2 block">📝</span>
            <h3 className="font-bold text-gray-900 mb-1">Take Quiz</h3>
            <p className="text-sm text-gray-600">Discover your career path</p>
          </button>

          <button
            onClick={() => navigate('/career-path')}
            className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-all hover:scale-105"
          >
            <span className="text-3xl mb-2 block">🎯</span>
            <h3 className="font-bold text-gray-900 mb-1">Career Prediction</h3>
            <p className="text-sm text-gray-600">Get AI-powered insights</p>
          </button>

          <button
            onClick={() => navigate('/learning-path')}
            className="bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-all hover:scale-105"
          >
            <span className="text-3xl mb-2 block">📚</span>
            <h3 className="font-bold text-gray-900 mb-1">Learning Path</h3>
            <p className="text-sm text-gray-600">Build your roadmap</p>
          </button>
        </div>

        {/* Career Predictions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Career Predictions</h2>
            {careerHistory.length > 0 && (
              <span className="text-sm text-gray-600">
                {careerHistory.length} {careerHistory.length === 1 ? 'prediction' : 'predictions'}
              </span>
            )}
          </div>

          {careerHistory.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <span className="text-6xl mb-4 block">🎯</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No predictions yet</h3>
              <p className="text-gray-600 mb-6">
                Take the quiz or fill out your profile to get AI-powered career recommendations
              </p>
              <button
                onClick={() => navigate('/quiz')}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {careerHistory.map((career, index) => (
                <div key={career.id || index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {career.career_path || career.primary_career}
                      </h3>
                      {career.created_at && (
                        <p className="text-sm text-gray-500">
                          {new Date(career.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteCareer(career.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>

                  {career.confidence && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Confidence</span>
                        <span className="text-sm font-semibold text-blue-600">
                          {(career.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${career.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {career.recommendations && career.recommendations.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Alternative paths:</p>
                      <div className="flex flex-wrap gap-2">
                        {career.recommendations.slice(0, 3).map((rec, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                          >
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigate('/learning-path')}
                    className="mt-4 w-full py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-all"
                  >
                    Generate Learning Path
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learning Paths Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Learning Paths</h2>
            {learningPaths.length > 0 && (
              <span className="text-sm text-gray-600">
                {learningPaths.length} {learningPaths.length === 1 ? 'path' : 'paths'}
              </span>
            )}
          </div>

          {learningPaths.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <span className="text-6xl mb-4 block">📚</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No learning paths yet</h3>
              <p className="text-gray-600 mb-6">
                Create a personalized roadmap to achieve your career goals
              </p>
              <button
                onClick={() => navigate('/learning-path')}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
              >
                Create Learning Path
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {learningPaths.map((path, index) => (
                <div key={path.id || index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {path.career_path || path.title}
                      </h3>
                      {path.created_at && (
                        <p className="text-sm text-gray-500">
                          Created: {new Date(path.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeletePath(path.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>

                  {path.overview && (
                    <p className="text-gray-700 mb-4 line-clamp-2">{path.overview}</p>
                  )}

                  {path.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-semibold text-green-600">
                          {path.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {path.learning_phases && path.learning_phases.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {path.learning_phases.length} learning phases
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {path.learning_phases.slice(0, 3).map((phase, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
                          >
                            {phase.phase || phase}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigate('/learning-path', { state: { pathData: path } })}
                    className="w-full py-2 bg-purple-50 text-purple-600 font-medium rounded-lg hover:bg-purple-100 transition-all"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        {userData?.stats && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600 mb-1">
                  {userData.stats.predictions_count || careerHistory.length}
                </p>
                <p className="text-gray-600 text-sm">Career Predictions</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600 mb-1">
                  {userData.stats.paths_count || learningPaths.length}
                </p>
                <p className="text-gray-600 text-sm">Learning Paths</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600 mb-1">
                  {userData.stats.completion_rate || '0'}%
                </p>
                <p className="text-gray-600 text-sm">Completion Rate</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
