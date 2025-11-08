import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CareerContext } from '../context/CareerContext';

const LearningPathPage = () => {
  const navigate = useNavigate();
  const { careerPrediction, setLearningPath } = useContext(CareerContext);

  // Form state
  const [formData, setFormData] = useState({
    career_path: careerPrediction?.primary_career || '',
    current_skills: careerPrediction?.user_skills || [],
    experience_level: 'beginner',
    time_commitment: '',
    learning_style: 'online'
  });

  // Chip input for skills
  const [skillInput, setSkillInput] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [roadmap, setRoadmap] = useState(null);
  const [saved, setSaved] = useState(false);

  // Experience levels and learning styles
  const experienceLevels = ['beginner', 'intermediate', 'advanced'];
  const learningStyles = [
    { value: 'online', label: 'Online Courses' },
    { value: 'bootcamp', label: 'Bootcamp' },
    { value: 'mixed', label: 'Mixed Learning' }
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Add skill chip
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !formData.current_skills.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        current_skills: [...prev.current_skills, trimmed]
      }));
      setSkillInput('');
    }
  };

  // Remove skill chip
  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      current_skills: prev.current_skills.filter(s => s !== skill)
    }));
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.career_path.trim()) {
      newErrors.career_path = 'Career path is required';
    }

    if (formData.current_skills.length === 0) {
      newErrors.current_skills = 'Add at least one skill';
    }

    if (!formData.time_commitment.trim()) {
      newErrors.time_commitment = 'Time commitment is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate learning path
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setSaved(false);

    try {
      const response = await axios.post('http://localhost:8000/generate-path', {
        career_path: formData.career_path,
        current_skills: formData.current_skills,
        experience_level: formData.experience_level,
        time_commitment: formData.time_commitment,
        learning_style: formData.learning_style
      });

      setRoadmap(response.data);

    } catch (error) {
      if (error.response?.data?.detail) {
        setErrors({ api: error.response.data.detail });
      } else {
        setErrors({ api: 'Failed to generate learning path. Please try again.' });
      }
      console.error('Generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save to dashboard
  const handleSave = () => {
    setLearningPath(roadmap);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Reset form
  const handleGenerateAgain = () => {
    setRoadmap(null);
    setSaved(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Path Generator</h1>
          <p className="text-gray-600">Get a personalized roadmap to your dream career</p>
        </div>

        {/* Form Card */}
        {!roadmap && (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            {errors.api && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.api}
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Career Path */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Career *
                </label>
                <input
                  type="text"
                  name="career_path"
                  value={formData.career_path}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.career_path ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Data Scientist, Full Stack Developer"
                  disabled={loading}
                />
                {errors.career_path && <p className="text-red-600 text-sm mt-1">{errors.career_path}</p>}
              </div>

              {/* Current Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Skills *
                </label>
                <div className={`border rounded-lg p-3 ${errors.current_skills ? 'border-red-300' : 'border-gray-300'}`}>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.current_skills.map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
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
                    onKeyDown={handleKeyDown}
                    className="w-full outline-none text-sm"
                    placeholder="Type a skill and press Enter"
                    disabled={loading}
                  />
                </div>
                {errors.current_skills && <p className="text-red-600 text-sm mt-1">{errors.current_skills}</p>}
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {experienceLevels.map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, experience_level: level }))}
                      className={`py-2 px-4 rounded-lg font-medium transition-all ${
                        formData.experience_level === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      disabled={loading}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Commitment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Commitment *
                </label>
                <input
                  type="text"
                  name="time_commitment"
                  value={formData.time_commitment}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.time_commitment ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 10 hours/week, 3 months full-time"
                  disabled={loading}
                />
                {errors.time_commitment && <p className="text-red-600 text-sm mt-1">{errors.time_commitment}</p>}
              </div>

              {/* Learning Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Style *
                </label>
                <select
                  name="learning_style"
                  value={formData.learning_style}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {learningStyles.map(style => (
                    <option key={style.value} value={style.value}>{style.label}</option>
                  ))}
                </select>
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
                    Generating Your Path...
                  </span>
                ) : (
                  'Generate Learning Path'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Roadmap Display */}
        {roadmap && (
          <div className="space-y-6 animate-fadeIn">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                className="flex-1 min-w-[200px] py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
              >
                {saved ? '✓ Saved to Dashboard' : 'Save to Dashboard'}
              </button>
              <button
                onClick={handleGenerateAgain}
                className="py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
              >
                Generate Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
              >
                Go to Dashboard
              </button>
            </div>

            {/* Overview */}
            {roadmap.overview && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Overview</h2>
                <p className="text-gray-700 leading-relaxed">{roadmap.overview}</p>
              </div>
            )}

            {/* Learning Phases Timeline */}
            {roadmap.learning_phases && roadmap.learning_phases.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Timeline</h2>
                <div className="space-y-6">
                  {roadmap.learning_phases.map((phase, index) => (
                    <div key={index} className="relative pl-8 pb-8 border-l-2 border-blue-300 last:border-transparent last:pb-0">
                      {/* Timeline dot */}
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-white" />

                      <div className="bg-gray-50 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-900">{phase.phase}</h3>
                          {phase.duration && (
                            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                              {phase.duration}
                            </span>
                          )}
                        </div>

                        {phase.topics && phase.topics.length > 0 && (
                          <ul className="space-y-2">
                            {phase.topics.map((topic, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills to Acquire */}
            {roadmap.skills_to_acquire && roadmap.skills_to_acquire.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills to Acquire</h2>
                <div className="flex flex-wrap gap-2">
                  {roadmap.skills_to_acquire.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {roadmap.certifications && roadmap.certifications.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Certifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roadmap.certifications.map((cert, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <p className="text-gray-800 font-medium">{cert}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Job Search Tips */}
            {roadmap.job_search_tips && roadmap.job_search_tips.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Search Tips</h2>
                <ul className="space-y-3">
                  {roadmap.job_search_tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 pt-0.5">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Salary Insights */}
            {roadmap.salary_insights && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Salary Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {roadmap.salary_insights.entry && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Entry Level</p>
                      <p className="text-2xl font-bold text-gray-900">{roadmap.salary_insights.entry}</p>
                    </div>
                  )}
                  {roadmap.salary_insights.mid && (
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Mid Level</p>
                      <p className="text-2xl font-bold text-blue-900">{roadmap.salary_insights.mid}</p>
                    </div>
                  )}
                  {roadmap.salary_insights.senior && (
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Senior Level</p>
                      <p className="text-2xl font-bold text-green-900">{roadmap.salary_insights.senior}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
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

export default LearningPathPage;
