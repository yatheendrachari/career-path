import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [topCareers, setTopCareers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch top careers on component mount
  useEffect(() => {
    const fetchTopCareers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:8000/careers');
        setTopCareers(response.data.careers || response.data || []);
      } catch (err) {
        console.error('Error fetching careers:', err);
        setError('Failed to load careers');
      } finally {
        setLoading(false);
      }
    };

    fetchTopCareers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="px-4 pt-20 pb-16 text-center animate-fadeIn">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Ideal Career Path
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              with AI
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Discover personalized career recommendations based on your skills, interests, and goals.
            Get a tailored learning roadmap to achieve your dream job.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button
              onClick={() => navigate('/quiz')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started →
            </button>

            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              Login
            </button>

            <button
              onClick={() => navigate('/career-path')}
              className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
            >
              Try Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-3xl font-bold text-blue-600 mb-1">1000+</p>
              <p className="text-gray-600 text-sm">Career Paths</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-3xl font-bold text-purple-600 mb-1">50K+</p>
              <p className="text-gray-600 text-sm">Users Guided</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <p className="text-3xl font-bold text-green-600 mb-1">95%</p>
              <p className="text-gray-600 text-sm">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Take Quiz</h3>
              <p className="text-gray-600">
                Answer questions about your skills, interests, and experience
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-all">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes your profile and matches you with ideal careers
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Roadmap</h3>
              <p className="text-gray-600">
                Receive a personalized learning path with actionable steps
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Careers Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Trending Career Paths
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Explore popular careers chosen by our users
          </p>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Careers Grid */}
          {!loading && !error && topCareers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {topCareers.map((career, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                  onClick={() => navigate('/career-path')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {career.title || career.name || career}
                    </h3>
                    <span className="text-2xl">
                      {career.icon || '💼'}
                    </span>
                  </div>

                  {career.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {career.description}
                    </p>
                  )}

                  {career.salary && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-500">Avg. Salary:</span>
                      <span className="text-sm font-semibold text-green-600">
                        {career.salary}
                      </span>
                    </div>
                  )}

                  {career.demand && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Demand:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${career.demand}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {career.tags && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {career.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* No Careers State */}
          {!loading && !error && topCareers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600 mb-4">No careers available at the moment</p>
              <button
                onClick={() => navigate('/career-path')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Discover Your Path
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who found their dream career with our AI-powered platform
          </p>
          <button
            onClick={() => navigate('/quiz')}
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-2xl transition-all hover:scale-105"
          >
            Start Free Quiz Now →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-gray-900 text-gray-400 text-center">
        <p className="mb-2">© 2024 Career Path Finder. All rights reserved.</p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="/contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

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

export default HomePage;
