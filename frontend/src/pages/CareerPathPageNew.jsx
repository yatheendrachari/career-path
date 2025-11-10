import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/NavbarNew';

const CareerPathPageNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const quizData = location.state?.quizData;

  const [formData, setFormData] = useState({
    education: quizData?.education || '',
    years_experience: quizData?.years_experience || '',
    skills: quizData?.skills || [],
    interests: quizData?.interests || [],
    certifications: [],
    preferred_industry: quizData?.preferred_industry || ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [certInput, setCertInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  const educationLevels = ['Bachelor', 'Master', 'PhD'];
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addChip = (field, value, setter) => {
    const trimmed = value.trim();
    if (trimmed && !formData[field].includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], trimmed]
      }));
      setter('');
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const removeChip = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const handleKeyDown = (e, field, value, setter) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChip(field, value, setter);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.education) newErrors.education = 'Education level is required';
    if (!formData.years_experience && formData.years_experience !== 0) {
      newErrors.years_experience = 'Years of experience is required';
    }
    if (formData.skills.length === 0) newErrors.skills = 'Add at least one skill';
    if (formData.interests.length === 0) newErrors.interests = 'Add at least one interest';
    if (!formData.preferred_industry.trim()) {
      newErrors.preferred_industry = 'Preferred industry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, {
        education: formData.education,
        years_experience: Number(formData.years_experience),
        skills: formData.skills,
        interests: formData.interests,
        certifications: formData.certifications,
        preferred_industry: formData.preferred_industry
      });

      setResult(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
      setErrors({ api: error.response?.data?.detail || 'Failed to get prediction. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
      education: '',
      years_experience: '',
      skills: [],
      interests: [],
      certifications: [],
      preferred_industry: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      <div className="container-wide py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Career Path Prediction
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Answer a few questions and let our AI analyze your profile to recommend the best career paths for you
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
                {/* Education */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Education Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className={`input ${errors.education ? 'input-error' : ''}`}
                    disabled={loading}
                  >
                    <option value="">Select your education level</option>
                    {educationLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {errors.education && (
                    <p className="text-red-600 text-sm mt-1">{errors.education}</p>
                  )}
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="years_experience"
                    value={formData.years_experience}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    className={`input ${errors.years_experience ? 'input-error' : ''}`}
                    placeholder="e.g., 3"
                    disabled={loading}
                  />
                  {errors.years_experience && (
                    <p className="text-red-600 text-sm mt-1">{errors.years_experience}</p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Skills <span className="text-red-500">*</span>
                  </label>
                  <div className={`border rounded-lg p-3 bg-white ${
                    errors.skills ? 'border-red-300' : 'border-gray-300'
                  } focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all`}>
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.skills.map(skill => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm font-medium"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeChip('skills', skill)}
                              className="hover:text-indigo-900 text-lg leading-none"
                              disabled={loading}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'skills', skillInput, setSkillInput)}
                      className="w-full outline-none text-sm"
                      placeholder="Type a skill and press Enter (e.g., Python, Communication)"
                      disabled={loading}
                    />
                  </div>
                  {errors.skills && (
                    <p className="text-red-600 text-sm mt-1">{errors.skills}</p>
                  )}
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Interests <span className="text-red-500">*</span>
                  </label>
                  <div className={`border rounded-lg p-3 bg-white ${
                    errors.interests ? 'border-red-300' : 'border-gray-300'
                  } focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all`}>
                    {formData.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.interests.map(interest => (
                          <span
                            key={interest}
                            className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium"
                          >
                            {interest}
                            <button
                              type="button"
                              onClick={() => removeChip('interests', interest)}
                              className="hover:text-green-900 text-lg leading-none"
                              disabled={loading}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'interests', interestInput, setInterestInput)}
                      className="w-full outline-none text-sm"
                      placeholder="Type an interest and press Enter (e.g., AI, Data Analysis)"
                      disabled={loading}
                    />
                  </div>
                  {errors.interests && (
                    <p className="text-red-600 text-sm mt-1">{errors.interests}</p>
                  )}
                </div>

                {/* Certifications (Optional) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Certifications <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                    {formData.certifications.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.certifications.map(cert => (
                          <span
                            key={cert}
                            className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm font-medium"
                          >
                            {cert}
                            <button
                              type="button"
                              onClick={() => removeChip('certifications', cert)}
                              className="hover:text-purple-900 text-lg leading-none"
                              disabled={loading}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <input
                      type="text"
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'certifications', certInput, setCertInput)}
                      className="w-full outline-none text-sm"
                      placeholder="Type a certification and press Enter (e.g., AWS Certified)"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Preferred Industry */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Preferred Industry <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="preferred_industry"
                    value={formData.preferred_industry}
                    onChange={handleChange}
                    className={`input ${errors.preferred_industry ? 'input-error' : ''}`}
                    placeholder="e.g., Technology, Healthcare, Finance"
                    disabled={loading}
                  />
                  {errors.preferred_industry && (
                    <p className="text-red-600 text-sm mt-1">{errors.preferred_industry}</p>
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
                      Analyzing Your Profile...
                    </span>
                  ) : (
                    <>
                      Get Career Prediction
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
            <div className="space-y-6">
              {/* Success Header */}
              <div className="card p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Prediction Complete!</h3>
                    <p className="text-gray-700">Based on your profile, we've identified your ideal career path.</p>
                  </div>
                </div>
              </div>

              {/* Primary Career */}
              <div className="card p-8">
                <h4 className="text-sm font-semibold text-gray-600 mb-4">Recommended Career</h4>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {result.primary_career}
                  </h3>

                  {/* Confidence */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Match Score:</span>
                    <div className="flex-1 bg-white rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 transition-all duration-1000"
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-indigo-600">
                      {(result.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Alternative Careers */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Alternative Paths</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {result.recommendations.map((rec, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                          <p className="font-semibold text-gray-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/learning-path', {
                    state: { careerData: result, formData: formData }
                  })}
                  className="btn btn-gradient btn-lg flex-1"
                >
                  Generate Learning Path →
                </button>
                <button
                  onClick={handleReset}
                  className="btn btn-secondary btn-lg"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerPathPageNew;
