import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CareerContext } from '../context/CareerContext';

const QuizPage = () => {
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

  // Quiz questions
  const questions = [
    {
      id: 'interests',
      question: 'Which areas excite you the most?',
      subtitle: 'Select all that apply',
      type: 'multiple',
      options: [
        { value: 'AI & Machine Learning', emoji: '🤖' },
        { value: 'Web Development', emoji: '💻' },
        { value: 'Mobile Apps', emoji: '📱' },
        { value: 'Data Science', emoji: '📊' },
        { value: 'Cybersecurity', emoji: '🔒' },
        { value: 'Cloud Computing', emoji: '☁️' },
        { value: 'Business & Strategy', emoji: '📈' },
        { value: 'Design & UX', emoji: '🎨' }
      ]
    },
    {
      id: 'skills',
      question: 'Which skills do you enjoy or want to learn?',
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
        { value: '0', label: 'Just Starting Out (0 years)' },
        { value: '1', label: '1-2 years' },
        { value: '3', label: '3-5 years' },
        { value: '6', label: '6-10 years' },
        { value: '10', label: '10+ years' }
      ]
    },
    {
      id: 'education',
      question: 'What is your highest education level?',
      subtitle: 'Or what you are currently pursuing',
      type: 'single',
      options: [
        { value: 'Bachelor', label: 'Bachelor\'s Degree' },
        { value: 'Master', label: 'Master\'s Degree' },
        { value: 'PhD', label: 'PhD or Doctorate' },
        { value: 'Bootcamp', label: 'Bootcamp/Certificate' },
        { value: 'Self-Taught', label: 'Self-Taught' }
      ]
    },
    {
      id: 'preferred_industry',
      question: 'Which industry interests you most?',
      subtitle: 'Where do you see yourself working?',
      type: 'single',
      options: [
        { value: 'Technology', label: 'Technology & Software' },
        { value: 'Finance', label: 'Finance & Banking' },
        { value: 'Healthcare', label: 'Healthcare & Biotech' },
        { value: 'E-commerce', label: 'E-commerce & Retail' },
        { value: 'Education', label: 'Education & EdTech' },
        { value: 'Entertainment', label: 'Media & Entertainment' },
        { value: 'Consulting', label: 'Consulting & Services' },
        { value: 'Startup', label: 'Startup Environment' }
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

  // Handle multiple choice answers
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

  // Handle single choice answers
  const selectAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const question = questions[currentQuestion];
    const answer = answers[question.id];

    if (question.type === 'multiple') {
      return answer && answer.length > 0;
    } else {
      return answer && answer.length > 0;
    }
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  // Navigate to previous question
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  // Complete quiz and navigate
  const handleComplete = () => {
    // Store quiz results in context
    setQuizResults(answers);

    // Navigate to career path page with pre-filled data
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Discovery Quiz</h1>
          <p className="text-gray-600">Answer a few questions to find your ideal career path</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 animate-slideIn">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentQ.question}
          </h2>
          <p className="text-gray-600 mb-6">{currentQ.subtitle}</p>

          {/* Multiple Choice Options */}
          {currentQ.type === 'multiple' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQ.options.map((option) => {
                const isSelected = answers[currentQ.id]?.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleAnswer(currentQ.id, option.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                      {option.value}
                    </span>
                    {isSelected && (
                      <span className="ml-auto text-blue-600">✓</span>
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
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <span className="ml-2 text-blue-600">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentQuestion === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            ← Back
          </button>

          <button
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered()}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              isCurrentQuestionAnswered()
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQuestion === totalQuestions - 1 ? 'Complete Quiz →' : 'Next →'}
          </button>
        </div>

        {/* Skip Quiz Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/career-path')}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Skip quiz and fill manually
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QuizPage;
