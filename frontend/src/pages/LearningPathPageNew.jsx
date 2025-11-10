import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/NavbarNew';

const LearningPathPageNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const careerData = location.state?.careerData;
  const formData = location.state?.formData;

  const [learningPathData, setLearningPathData] = useState({
    career_path: careerData?.primary_career || '',
    current_skills: formData?.skills?.join(', ') || '',
    experience_level: formData?.years_experience >= 5 ? 'advanced' : formData?.years_experience >= 2 ? 'intermediate' : 'beginner',
    time_commitment: '',
    learning_style: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLearningPathData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!learningPathData.career_path.trim()) newErrors.career_path = 'Career path is required';
    if (!learningPathData.time_commitment) newErrors.time_commitment = 'Time commitment is required';
    if (!learningPathData.learning_style) newErrors.learning_style = 'Learning style is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(`${API_BASE_URL}/generate-path`, learningPathData);
      setResult(response.data);
    } catch (error) {
      console.error('Learning path error:', error);
      setErrors({ api: error.response?.data?.message || 'Failed to generate learning path. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setLearningPathData({
      career_path: '',
      current_skills: '',
      experience_level: 'beginner',
      time_commitment: '',
      learning_style: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      <div className="container-wide py-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Learning Path Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get a personalized roadmap with resources, milestones, and actionable steps to achieve your career goals
            </p>
          </div>

          {!result ? (
            /* Form Section */
            <div className="card p-8 md:p-10">
              {errors.api && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{errors.api}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Career Path */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Career Path <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="career_path"
                    value={learningPathData.career_path}
                    onChange={handleChange}
                    className={`input ${errors.career_path ? 'input-error' : ''}`}
                    placeholder="e.g., Software Engineer, Data Scientist"
                    disabled={loading}
                  />
                  {errors.career_path && (
                    <p className="text-red-600 text-sm mt-1">{errors.career_path}</p>
                  )}
                </div>

                {/* Current Skills */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Current Skills <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="current_skills"
                    value={learningPathData.current_skills}
                    onChange={handleChange}
                    className="input resize-none"
                    placeholder="e.g., Python, JavaScript, Data Analysis"
                    rows={3}
                    disabled={loading}
                  />
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Experience Level
                  </label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {['beginner', 'intermediate', 'advanced'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setLearningPathData(prev => ({ ...prev, experience_level: level }))}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          learningPathData.experience_level === level
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                        disabled={loading}
                      >
                        <div className={`font-semibold capitalize ${
                          learningPathData.experience_level === level ? 'text-indigo-900' : 'text-gray-700'
                        }`}>
                          {level}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Commitment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Time Commitment (hours/week) <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="time_commitment"
                    value={learningPathData.time_commitment}
                    onChange={handleChange}
                    className={`input ${errors.time_commitment ? 'input-error' : ''}`}
                    disabled={loading}
                  >
                    <option value="">Select time commitment</option>
                    <option value="5">5 hours/week (Casual)</option>
                    <option value="10">10 hours/week (Part-time)</option>
                    <option value="20">20 hours/week (Serious)</option>
                    <option value="40">40+ hours/week (Full-time)</option>
                  </select>
                  {errors.time_commitment && (
                    <p className="text-red-600 text-sm mt-1">{errors.time_commitment}</p>
                  )}
                </div>

                {/* Learning Style */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Preferred Learning Style <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="learning_style"
                    value={learningPathData.learning_style}
                    onChange={handleChange}
                    className={`input ${errors.learning_style ? 'input-error' : ''}`}
                    disabled={loading}
                  >
                    <option value="">Select learning style</option>
                    <option value="visual">Visual (Videos, Diagrams)</option>
                    <option value="hands-on">Hands-on (Projects, Practice)</option>
                    <option value="reading">Reading (Books, Documentation)</option>
                    <option value="interactive">Interactive (Courses, Tutorials)</option>
                  </select>
                  {errors.learning_style && (
                    <p className="text-red-600 text-sm mt-1">{errors.learning_style}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn w-full btn-lg ${loading ? 'opacity-60 cursor-not-allowed' : 'btn-gradient'}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Generating Your Roadmap...
                    </span>
                  ) : (
                    <>
                      Generate Learning Path
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Result Section */
            <div className="space-y-8">
              {/* Header */}
              <div className="card p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{result.career_path}</h3>
                    <p className="text-gray-700">{result.overview}</p>
                  </div>
                </div>
              </div>

              {/* Learning Phases Timeline */}
              {result.learning_phases && result.learning_phases.length > 0 && (
                <div className="card p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🗺️</span>
                    Learning Roadmap
                  </h3>

                  <div className="space-y-6">
                    {result.learning_phases.map((phase, index) => (
                      <div key={index} className="relative">
                        {/* Timeline Line */}
                        {index !== result.learning_phases.length - 1 && (
                          <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500" />
                        )}

                        <div className="flex gap-6">
                          {/* Phase Number */}
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold text-lg">{index + 1}</span>
                            </div>
                          </div>

                          {/* Phase Content */}
                          <div className="flex-1 pb-6">
                            <div className="bg-gray-50 rounded-xl p-6 hover-lift">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="text-lg font-bold text-gray-900">{phase.phase}</h4>
                                <span className="badge badge-primary">{phase.duration}</span>
                              </div>

                              {phase.topics && phase.topics.length > 0 && (
                                <div className="space-y-2">
                                  {phase.topics.map((topic, topicIndex) => (
                                    <div key={topicIndex} className="flex items-start gap-2">
                                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      <span className="text-gray-700 text-sm">{topic}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills to Acquire */}
              {result.skills_to_acquire && result.skills_to_acquire.length > 0 && (
                <div className="card p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Skills to Acquire
                  </h3>

                  <div className="grid md:grid-cols-2 gap-3">
                    {result.skills_to_acquire.map((skill, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-indigo-600 font-bold text-sm">{index + 1}</span>
                        </div>
                        <span className="text-gray-900 font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {result.certifications && result.certifications.length > 0 && (
                <div className="card p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    Recommended Certifications
                  </h3>

                  <div className="space-y-3">
                    {result.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <span className="text-gray-900 font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Search Tips */}
              {result.job_search_tips && result.job_search_tips.length > 0 && (
                <div className="card p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="text-2xl">💼</span>
                    Job Search Tips
                  </h3>

                  <div className="space-y-3">
                    {result.job_search_tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Salary Insights */}
              {result.salary_insights && (
                <div className="card p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    Salary Insights
                  </h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5 text-center">
                      <div className="text-sm text-gray-600 mb-1">Entry Level</div>
                      <div className="text-xl font-bold text-gray-900">{result.salary_insights.entry}</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-center">
                      <div className="text-sm text-gray-600 mb-1">Mid Level</div>
                      <div className="text-xl font-bold text-gray-900">{result.salary_insights.mid}</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-5 text-center">
                      <div className="text-sm text-gray-600 mb-1">Senior Level</div>
                      <div className="text-xl font-bold text-gray-900">{result.salary_insights.senior}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-gradient btn-lg flex-1"
                >
                  Save to Dashboard
                </button>
                <button
                  onClick={handleReset}
                  className="btn btn-secondary btn-lg"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPathPageNew;
