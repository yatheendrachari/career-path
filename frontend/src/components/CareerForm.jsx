import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CareerForm = ({ onPredictionSuccess, initialData = {} }) => {
  const navigate = useNavigate();

  // Form state with optional initial data
  const [formData, setFormData] = useState({
    education: initialData.education || '',
    years_experience: initialData.years_experience || '',
    skills: initialData.skills || [],
    interests: initialData.interests || [],
    certifications: initialData.certifications || [],
    preferred_industry: initialData.preferred_industry || ''
  });

  // Chip input states
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [certInput, setCertInput] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Education options
  const educationLevels = ['Bachelor', 'Master', 'PhD'];

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Handle simple input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Add chip to array field
  const addChip = (field, value, setter) => {
    const trimmed = value.trim();
    if (trimmed && !formData[field].includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], trimmed]
      }));
      setter('');

      // Clear error for this field
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  // Remove chip from array field
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

    if (!formData.years_experience && formData.years_experience !== 0) {
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setShowSuccess(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, {
        education: formData.education,
        years_experience: Number(formData.years_experience),
        skills: formData.skills,
        interests: formData.interests,
        certifications: formData.certifications,
        preferred_industry: formData.preferred_industry
      });

      const prediction = response.data;
      setResult(prediction);
      setShowSuccess(true);

      // Call callback if provided
      if (onPredictionSuccess) {
        onPredictionSuccess(prediction);
      }

    } catch (error) {
      console.error('Prediction error:', error);

      if (error.response?.data?.detail) {
        setErrors({ api: error.response.data.detail });
      } else {
        setErrors({ api: 'Failed to get prediction. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Navigate to learning path
  const handleGenerateLearningPath = () => {
    navigate('/learning-path', {
      state: {
        careerData: result,
        formData: formData
      }
    });
  };

  // Reset form
  const handleReset = () => {
    setResult(null);
    setShowSuccess(false);
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
    <div className="space-y-6">
      {/* API Error Alert */}
      {errors.api && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-slideDown">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{errors.api}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Education Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Education Level *
          </label>
          <select
            name="education"
            value={formData.education}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.education ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">Select education level</option>
            {educationLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {errors.education && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <span>⚠</span> {errors.education}
            </p>
          )}
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
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.years_experience ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., 3"
            disabled={loading}
          />
          {errors.years_experience && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <span>⚠</span> {errors.years_experience}
            </p>
          )}
        </div>

        {/* Skills - Chip Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills *
          </label>
          <div className={`border rounded-lg p-3 bg-white transition-all ${
            errors.skills ? 'border-red-300' : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500'
          }`}>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeChip('skills', skill)}
                      className="hover:text-blue-900 font-bold text-lg leading-none"
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
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <span>⚠</span> {errors.skills}
            </p>
          )}
        </div>

        {/* Interests - Chip Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests *
          </label>
          <div className={`border rounded-lg p-3 bg-white transition-all ${
            errors.interests ? 'border-red-300' : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500'
          }`}>
            {formData.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.interests.map(interest => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeChip('interests', interest)}
                      className="hover:text-green-900 font-bold text-lg leading-none"
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
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <span>⚠</span> {errors.interests}
            </p>
          )}
        </div>

        {/* Certifications - Chip Input (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certifications <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <div className="border border-gray-300 rounded-lg p-3 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            {formData.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.certifications.map(cert => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeChip('certifications', cert)}
                      className="hover:text-purple-900 font-bold text-lg leading-none"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Industry *
          </label>
          <input
            type="text"
            name="preferred_industry"
            value={formData.preferred_industry}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.preferred_industry ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., Technology, Healthcare, Finance"
            disabled={loading}
          />
          {errors.preferred_industry && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <span>⚠</span> {errors.preferred_industry}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing Your Profile...
            </span>
          ) : (
            'Get Career Prediction'
          )}
        </button>
      </form>

      {/* Success Result Card */}
      {result && showSuccess && (
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-green-200 animate-slideUp">
          {/* Success Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Career Prediction Complete!</h3>
              <p className="text-sm text-gray-600">Here's your personalized career recommendation</p>
            </div>
          </div>

          {/* Primary Career */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Recommended Career</h4>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <p className="text-2xl font-bold text-gray-900 mb-3">{result.primary_career}</p>

              {/* Confidence Bar */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 whitespace-nowrap">Confidence:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Alternative Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Alternative Paths</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors bg-gray-50"
                  >
                    <p className="font-medium text-gray-800">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGenerateLearningPath}
              className="flex-1 min-w-[200px] py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              Generate Learning Path →
            </button>
            <button
              onClick={handleReset}
              className="py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CareerForm;
