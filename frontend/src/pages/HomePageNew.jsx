import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/NavbarNew';

const HomePageNew = () => {
  const navigate = useNavigate();
  const [topCareers, setTopCareers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch top careers
  useEffect(() => {
    const fetchTopCareers = async () => {
      setLoading(true);
      setError(null);

      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const response = await axios.get(`${API_BASE_URL}/careers`);
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-indigo-50/50 via-white to-white -z-10" />

        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              AI-Powered Career Guidance
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-slide-in-up">
              Find Your Perfect
              <span className="block text-gradient">Career Path</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.1s'}}>
              Get personalized career recommendations based on your skills, interests, and goals.
              Build a roadmap to your dream job with AI-powered insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <button
                onClick={() => navigate('/quiz')}
                className="btn btn-gradient btn-lg w-full sm:w-auto"
              >
                Take Free Quiz
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <button
                onClick={() => navigate('/career-path')}
                className="btn btn-secondary btn-lg w-full sm:w-auto"
              >
                Try Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">1000+</div>
                <div className="text-sm text-gray-600">Career Paths</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">50K+</div>
                <div className="text-sm text-gray-600">Users Helped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">95%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to discover your ideal career path
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto stagger-fade-in">
            {[
              {
                icon: '📝',
                title: 'Take the Quiz',
                description: 'Answer questions about your skills, interests, and experience in just 5 minutes',
                step: '01'
              },
              {
                icon: '🤖',
                title: 'AI Analysis',
                description: 'Our AI analyzes your profile and matches you with the best career options',
                step: '02'
              },
              {
                icon: '🎯',
                title: 'Get Your Roadmap',
                description: 'Receive a personalized learning path with resources and actionable steps',
                step: '03'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="card p-8 text-center hover-lift h-full">
                  <div className="absolute top-6 right-6 text-5xl font-bold text-gray-100">
                    {item.step}
                  </div>
                  <div className="text-6xl mb-6">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to plan and achieve your career goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: '🎯',
                title: 'Career Prediction',
                description: 'AI-powered career matching based on your unique profile',
                color: 'from-blue-500 to-indigo-500'
              },
              {
                icon: '📚',
                title: 'Learning Paths',
                description: 'Personalized roadmaps with courses and resources',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: '💼',
                title: 'Industry Insights',
                description: 'Real-world salary data and job market trends',
                color: 'from-green-500 to-teal-500'
              },
              {
                icon: '🎓',
                title: 'Skill Assessment',
                description: 'Identify gaps and recommended certifications',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: '📊',
                title: 'Progress Tracking',
                description: 'Monitor your learning journey and achievements',
                color: 'from-cyan-500 to-blue-500'
              },
              {
                icon: '🤝',
                title: 'Career Support',
                description: 'Job search tips and interview preparation',
                color: 'from-violet-500 to-purple-500'
              }
            ].map((feature, index) => (
              <div key={index} className="card p-6 hover-lift">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Careers */}
      <section id="careers" className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending Career Paths
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore popular careers chosen by thousands of professionals
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="btn btn-primary">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && topCareers.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {topCareers.slice(0, 6).map((career, index) => (
                <div
                  key={index}
                  className="card p-6 cursor-pointer hover-lift"
                  onClick={() => navigate('/career-path')}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex-1">
                      {career.title || career.name || career}
                    </h3>
                    <span className="text-2xl">{career.icon || '💼'}</span>
                  </div>

                  {career.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {career.description}
                    </p>
                  )}

                  {career.salary && (
                    <div className="flex items-center gap-2 text-sm mb-3">
                      <span className="text-gray-500">Avg. Salary:</span>
                      <span className="font-semibold text-green-600">{career.salary}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                    Explore this path
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && topCareers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">No careers available at the moment</p>
              <button onClick={() => navigate('/career-path')} className="btn btn-primary">
                Discover Your Path
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary -z-10" />

        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who found their dream career with our AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/quiz')}
              className="btn btn-lg w-full sm:w-auto bg-white text-indigo-600 hover:bg-indigo-50"
            >
              Start Free Quiz Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="btn btn-lg w-full sm:w-auto bg-transparent text-white border-2 border-white hover:bg-white/10"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <span className="font-bold text-xl text-white">CareerPath</span>
              </div>
              <p className="text-sm leading-relaxed max-w-md">
                AI-powered career guidance platform helping professionals discover
                and achieve their dream careers with personalized roadmaps.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2024 CareerPath. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePageNew;
