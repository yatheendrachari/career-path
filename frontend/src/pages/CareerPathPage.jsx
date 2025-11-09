import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CareerContext } from '../context/CareerContext';

const CareerPathPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCareerPrediction } = useContext(CareerContext);

  // Form state
  const [formData, setFormData] = useState({
    education: '',
    years_experience: '',
    skills: [],
    interests: [],
    certifications: [],
    preferred_industry: ''
  });

  // Pre-fill form from quiz data
  useEffect(() => {
    if (location.state?.quizData) {
      const quizData = location.state.quizData;
      setFormData({
        education: quizData.education || '',
        years_experience: quizData.years_experience || '',
        skills: quizData.skills || [],
        interests: quizData.interests || [],
        certifications: [],
        preferred_industry: quizData.preferred_industry || ''
      });
    }
  }, [location.state]);

  // Input state for chip fields
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [certInput, setCertInput] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);

  // Education options
  const educationLevels = ['Bachelor', 'Master', 'PhD'];

  // Handle simple input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Add chip (skill, interest, certification)
  const addChip = (field, value, setter) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !formData[field].includes(trimmedValue)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], trimmedValue]
      }));
      setter('');
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  // Remove chip
  const removeChip = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  // Handle Enter key for chip inputs
  const handleKeyDown = (e, field, value, setter) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChip(field, value, setter);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.education) {
      newErrors.education = 'Education level is required';
    }

    if (!formData.years_experience) {
      newErrors.years_experience = 'Years of experience is required';
    } else if (formData.years_experience < 0) {
      newErrors.years_experience = 'Cannot be negative';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Add at least one skill';
    }

    if (formData.interests.length === 0) {
      newErrors.interests = 'Add at least one interest';
    }

    if (!formData.preferred_industry.trim()) {
      newErrors.preferred_industry = 'Preferred industry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await axios.post(`${API_BASE_URL}/predict`, {
        education: formData.education,
        years_experience: Number(formData.years_experience),
        skills: formData.skills,
        interests: formData.interests,
        certifications: formData.certifications,
        preferred_industry: formData.preferred_industry
      });

      const predictionResult = response.data;
      setResult(predictionResult);
      setCareerPrediction(predictionResult);

    } catch (error) {
      if (error.response?.data?.detail) {
        setErrors({ api: error.response.data.detail });
      } else {
        setErrors({ api: 'Failed to get prediction. Please try again.' });
      }
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to learning path
  const handleGenerateLearningPath = () => {
    navigate('/learning-path');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Path Finder</h1>
          <p className="text-gray-600">Discover your ideal career based on your profile</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* API Error */}
          {errors.api && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.api}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Education Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Level *
              </label>
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.education ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Select education level</option>
                {educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              {errors.education && <p className="text-red-600 text-sm mt-1">{errors.education}</p>}
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                name="years_experience"
                value={formData.years_experience}
                onChange={handleChange}
                min="0"
                step="0.5"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.years_experience ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 3"
                disabled={loading}
              />
              {errors.years_experience && <p className="text-red-600 text-sm mt-1">{errors.years_experience}</p>}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills *
              </label>
              <div className={`border rounded-lg p-3 ${errors.skills ? 'border-red-300' : 'border-gray-300'}`}>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeChip('skills', skill)}
                        className="hover:text-blue-900"
                        disabled={loading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'skills', skillInput, setSkillInput)}
                  className="w-full outline-none text-sm"
                  placeholder="Type a skill and press Enter"
                  disabled={loading}
                />
              </div>
              {errors.skills && <p className="text-red-600 text-sm mt-1">{errors.skills}</p>}
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests *
              </label>
              <div className={`border rounded-lg p-3 ${errors.interests ? 'border-red-300' : 'border-gray-300'}`}>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.interests.map(interest => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeChip('interests', interest)}
                        className="hover:text-green-900"
                        disabled={loading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'interests', interestInput, setInterestInput)}
                  className="w-full outline-none text-sm"
                  placeholder="Type an interest and press Enter"
                  disabled={loading}
                />
              </div>
              {errors.interests && <p className="text-red-600 text-sm mt-1">{errors.interests}</p>}
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications
              </label>
              <div className="border border-gray-300 rounded-lg p-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.certifications.map(cert => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >
                      {cert}
                      <button
                        type="button"
                        onClick={() => removeChip('certifications', cert)}
                        className="hover:text-purple-900"
                        disabled={loading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'certifications', certInput, setCertInput)}
                  className="w-full outline-none text-sm"
                  placeholder="Type a certification and press Enter"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Preferred Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Industry *
              </label>
              <input
                type="text"
                name="preferred_industry"
                value={formData.preferred_industry}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.preferred_industry ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Technology, Healthcare, Finance"
                disabled={loading}
              />
              {errors.preferred_industry && <p className="text-red-600 text-sm mt-1">{errors.preferred_industry}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Get Career Prediction'
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6 md:p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Career Path</h2>

            {/* Primary Career */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Recommended Career</h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">{result.primary_career}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Alternative Paths</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                      <p className="font-medium text-gray-800">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Learning Path Button */}
            <button
              onClick={handleGenerateLearningPath}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-black font-semibold rounded-lg transition-all hover:shadow-lg"
            >
              Generate Learning Path →
            </button>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CareerPathPage;
