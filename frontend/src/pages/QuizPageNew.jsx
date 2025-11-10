import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CareerContext } from '../context/CareerContext';
import Navbar from '../components/NavbarNew';

const QuizPageNew = () => {
  const navigate = useNavigate();
  const { setQuizResults } = useContext(CareerContext);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    interests: [],
    skills: [],
    experience_years: '',
    education: '',
    preferred_industry: '',
    learning_preferences: []
  });

  const questions = [
    {
      id: 'interests',
      question: 'Which areas excite you the most?',
      subtitle: 'Select all that apply',
      type: 'multiple',
      options: [
        { value: 'AI & Machine Learning', emoji: '🤖', color: 'from-blue-500 to-cyan-500' },
        { value: 'Web Development', emoji: '💻', color: 'from-indigo-500 to-purple-500' },
        { value: 'Mobile Apps', emoji: '📱', color: 'from-pink-500 to-rose-500' },
        { value: 'Data Science', emoji: '📊', color: 'from-green-500 to-emerald-500' },
        { value: 'Cybersecurity', emoji: '🔒', color: 'from-red-500 to-orange-500' },
        { value: 'Cloud Computing', emoji: '☁️', color: 'from-sky-500 to-blue-500' },
        { value: 'Business & Strategy', emoji: '📈', color: 'from-yellow-500 to-orange-500' },
        { value: 'Design & UX', emoji: '🎨', color: 'from-purple-500 to-pink-500' }
      ]
    },
    {
      id: 'skills',
      question: 'Which skills do you have or want to learn?',
      subtitle: 'Select all that apply',
      type: 'multiple',
      options: [
        { value: 'Python', emoji: '🐍' },
        { value: 'JavaScript', emoji: '⚡' },
        { value: 'Data Analysis', emoji: '📉' },
        { value: 'Problem Solving', emoji: '🧩' },
        { value: 'Communication', emoji: '💬' },
        { value: 'Leadership', emoji: '👥' },
        { value: 'Creative Thinking', emoji: '💡' },
        { value: 'Technical Writing', emoji: '📝' }
      ]
    },
    {
      id: 'experience_years',
      question: 'How many years of experience do you have?',
      subtitle: 'In your field or related areas',
      type: 'single',
      options: [
        { value: '0', label: 'Just Starting Out', description: '0 years' },
        { value: '1', label: 'Entry Level', description: '1-2 years' },
        { value: '3', label: 'Mid Level', description: '3-5 years' },
        { value: '6', label: 'Senior Level', description: '6-10 years' },
        { value: '10', label: 'Expert', description: '10+ years' }
      ]
    },
    {
      id: 'education',
      question: 'What is your highest education level?',
      subtitle: 'Or what you are currently pursuing',
      type: 'single',
      options: [
        { value: 'Bachelor', label: "Bachelor's Degree", emoji: '🎓' },
        { value: 'Master', label: "Master's Degree", emoji: '📚' },
        { value: 'PhD', label: 'PhD or Doctorate', emoji: '🔬' },
        { value: 'Bootcamp', label: 'Bootcamp/Certificate', emoji: '⚡' },
        { value: 'Self-Taught', label: 'Self-Taught', emoji: '💡' }
      ]
    },
    {
      id: 'preferred_industry',
      question: 'Which industry interests you most?',
      subtitle: 'Where do you see yourself working?',
      type: 'single',
      options: [
        { value: 'Technology', label: 'Technology & Software', emoji: '💻' },
        { value: 'Finance', label: 'Finance & Banking', emoji: '💰' },
        { value: 'Healthcare', label: 'Healthcare & Biotech', emoji: '🏥' },
        { value: 'E-commerce', label: 'E-commerce & Retail', emoji: '🛒' },
        { value: 'Education', label: 'Education & EdTech', emoji: '📚' },
        { value: 'Entertainment', label: 'Media & Entertainment', emoji: '🎬' },
        { value: 'Consulting', label: 'Consulting & Services', emoji: '💼' },
        { value: 'Startup', label: 'Startup Environment', emoji: '🚀' }
      ]
    },
    {
      id: 'learning_preferences',
      question: 'How do you prefer to learn?',
      subtitle: 'Select all that apply',
      type: 'multiple',
      options: [
        { value: 'Online Courses', emoji: '🎓' },
        { value: 'Hands-on Projects', emoji: '🛠️' },
        { value: 'Books & Documentation', emoji: '📚' },
        { value: 'Video Tutorials', emoji: '🎥' },
        { value: 'Mentorship', emoji: '🤝' },
        { value: 'Bootcamps', emoji: '⚡' }
      ]
    }
  ];

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const toggleAnswer = (questionId, value) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (current.includes(value)) {
        return { ...prev, [questionId]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [questionId]: [...current, value] };
      }
    });
  };

  const selectAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isCurrentQuestionAnswered = () => {
    const question = questions[currentQuestion];
    const answer = answers[question.id];

    if (question.type === 'multiple') {
      return answer && answer.length > 0;
    } else {
      return answer && answer.length > 0;
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setQuizResults(answers);

    navigate('/career-path', {
      state: {
        quizData: {
          education: answers.education || 'Bachelor',
          years_experience: answers.experience_years || '0',
          skills: answers.skills || [],
          interests: answers.interests || [],
          preferred_industry: answers.preferred_industry || ''
        }
      }
    });
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      <div className="container-custom py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Question {currentQuestion + 1} of {totalQuestions}
                </span>
              </div>
              <span className="text-sm font-semibold text-indigo-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Question Progress Dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index < currentQuestion
                      ? 'w-8 bg-indigo-600'
                      : index === currentQuestion
                      ? 'w-12 bg-indigo-500'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Card */}
          <div className="card p-8 md:p-10 mb-6 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {currentQ.question}
            </h2>
            <p className="text-gray-600 mb-8">{currentQ.subtitle}</p>

            {/* Multiple Choice Options */}
            {currentQ.type === 'multiple' && (
              <div className="grid md:grid-cols-2 gap-3">
                {currentQ.options.map((option) => {
                  const isSelected = answers[currentQ.id]?.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => toggleAnswer(currentQ.id, option.value)}
                      className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-3xl">{option.emoji}</span>
                      <span className={`font-semibold flex-1 ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>
                        {option.value}
                      </span>
                      {isSelected && (
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Single Choice Options */}
            {currentQ.type === 'single' && (
              <div className="space-y-3">
                {currentQ.options.map((option) => {
                  const isSelected = answers[currentQ.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => selectAnswer(currentQ.id, option.value)}
                      className={`w-full p-5 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                    >
                      {option.emoji && <span className="text-3xl">{option.emoji}</span>}
                      <div className="flex-1">
                        <div className={`font-semibold mb-0.5 ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-sm text-gray-600">{option.description}</div>
                        )}
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className={`btn btn-lg ${
                currentQuestion === 0
                  ? 'opacity-40 cursor-not-allowed bg-gray-200 text-gray-400'
                  : 'btn-secondary'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered()}
              className={`flex-1 btn btn-lg ${
                isCurrentQuestionAnswered()
                  ? 'btn-gradient'
                  : 'opacity-40 cursor-not-allowed bg-gray-200 text-gray-400'
              }`}
            >
              {currentQuestion === totalQuestions - 1 ? 'Complete Quiz' : 'Next Question'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPageNew;
