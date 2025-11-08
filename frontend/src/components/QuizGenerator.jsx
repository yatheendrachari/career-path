import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizGenerator = ({ onComplete }) => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState('forward');

  // Quiz questions
  const questions = [
    {
      id: 'interests',
      question: 'Which areas interest you the most?',
      subtitle: 'Select all that apply',
      type: 'multiple',
      options: [
        { value: 'Artificial Intelligence', emoji: '🤖', description: 'Machine learning, neural networks, AI systems' },
        { value: 'Web Development', emoji: '💻', description: 'Building websites and web applications' },
        { value: 'Data Science', emoji: '📊', description: 'Analytics, visualization, insights' },
        { value: 'Cybersecurity', emoji: '🔒', description: 'Protecting systems and data' },
        { value: 'Mobile Development', emoji: '📱', description: 'iOS and Android apps' },
        { value: 'Cloud Computing', emoji: '☁️', description: 'AWS, Azure, distributed systems' },
        { value: 'Business Strategy', emoji: '📈', description: 'Planning, management, growth' },
        { value: 'Creative Design', emoji: '🎨', description: 'UI/UX, graphics, user experience' }
      ]
    },
    {
      id: 'technical_skills',
      question: 'Which technical skills do you have or want to learn?',
      subtitle: 'Select all that apply',
      type: 'multiple',
      options: [
        { value: 'Python', emoji: '🐍', description: 'Programming language' },
        { value: 'JavaScript', emoji: '⚡', description: 'Web development' },
        { value: 'SQL', emoji: '🗄️', description: 'Database queries' },
        { value: 'Java', emoji: '☕', description: 'Enterprise applications' },
        { value: 'React', emoji: '⚛️', description: 'Frontend framework' },
        { value: 'Docker', emoji: '🐳', description: 'Containerization' },
        { value: 'Git', emoji: '📦', description: 'Version control' },
        { value: 'AWS', emoji: '☁️', description: 'Cloud services' }
      ]
    },
    {
      id: 'soft_skills',
      question: 'Which soft skills describe you best?',
      subtitle: 'Select all that apply',
      type: 'multiple',
      options: [
        { value: 'Leadership', emoji: '👥', description: 'Leading teams and projects' },
        { value: 'Communication', emoji: '💬', description: 'Clear and effective expression' },
        { value: 'Problem Solving', emoji: '🧩', description: 'Analytical thinking' },
        { value: 'Creativity', emoji: '💡', description: 'Innovative ideas' },
        { value: 'Teamwork', emoji: '🤝', description: 'Collaboration' },
        { value: 'Time Management', emoji: '⏰', description: 'Organization and planning' },
        { value: 'Adaptability', emoji: '🔄', description: 'Flexibility in change' },
        { value: 'Critical Thinking', emoji: '🎯', description: 'Logical analysis' }
      ]
    },
    {
      id: 'experience_level',
      question: 'What is your current experience level?',
      subtitle: 'Choose one',
      type: 'single',
      options: [
        { value: 'beginner', label: 'Beginner (0-1 years)', description: 'Just starting my career journey' },
        { value: 'intermediate', label: 'Intermediate (2-4 years)', description: 'Some hands-on experience' },
        { value: 'advanced', label: 'Advanced (5-7 years)', description: 'Solid professional experience' },
        { value: 'expert', label: 'Expert (8+ years)', description: 'Extensive industry experience' }
      ]
    },
    {
      id: 'work_preferences',
      question: 'What type of work environment appeals to you?',
      subtitle: 'Select all that apply',
      type: 'multiple',
      options: [
        { value: 'Startup Culture', emoji: '🚀', description: 'Fast-paced, innovative' },
        { value: 'Corporate Environment', emoji: '🏢', description: 'Structured, stable' },
        { value: 'Remote Work', emoji: '🏠', description: 'Work from anywhere' },
        { value: 'Freelancing', emoji: '💼', description: 'Independent projects' },
        { value: 'Research Focused', emoji: '🔬', description: 'Academic, experimental' },
        { value: 'Client Facing', emoji: '👔', description: 'Direct customer interaction' },
        { value: 'Team Collaboration', emoji: '🤝', description: 'Working with others' },
        { value: 'Individual Work', emoji: '🎯', description: 'Independent tasks' }
      ]
    }
  ];

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const currentQ = questions[currentQuestion];

  // Toggle answer for multiple choice
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

  // Select answer for single choice
  const selectAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    const answer = answers[currentQ.id];
    if (currentQ.type === 'multiple') {
      return answer && answer.length > 0;
    } else {
      return answer && answer.length > 0;
    }
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setDirection('forward');
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 50);
    } else {
      handleComplete();
    }
  };

  // Navigate to previous question
  const handleBack = () => {
    if (currentQuestion > 0) {
      setDirection('backward');
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1);
      }, 50);
    }
  };

  // Complete quiz and compile data
  const handleComplete = () => {
    // Compile all answers into structured data
    const compiledData = {
      interests: answers.interests || [],
      skills: [
        ...(answers.technical_skills || []),
        ...(answers.soft_skills || [])
      ],
      experience_level: answers.experience_level || 'beginner',
      work_preferences: answers.work_preferences || [],
      // Map experience level to years
      years_experience: mapExperienceToYears(answers.experience_level)
    };

    // Call callback if provided
    if (onComplete) {
      onComplete(compiledData);
    }

    // Navigate to career path with data
    navigate('/career-path', {
      state: {
        quizData: {
          education: 'Bachelor', // Default
          years_experience: compiledData.years_experience,
          skills: compiledData.skills,
          interests: compiledData.interests,
          preferred_industry: 'Technology' // Default
        }
      }
    });
  };

  // Map experience level to years
  const mapExperienceToYears = (level) => {
    const mapping = {
      beginner: 0,
      intermediate: 3,
      advanced: 6,
      expert: 10
    };
    return mapping[level] || 0;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        key={currentQuestion}
        className={`bg-white rounded-xl shadow-lg p-8 mb-6 transition-all duration-300 ${
          direction === 'forward' ? 'animate-slideInRight' : 'animate-slideInLeft'
        }`}
      >
        {/* Question Header */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {currentQ.question}
          </h2>
          <p className="text-gray-600">{currentQ.subtitle}</p>
        </div>

        {/* Multiple Choice Options */}
        {currentQ.type === 'multiple' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.options.map((option) => {
              const isSelected = answers[currentQ.id]?.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => toggleAnswer(currentQ.id, option.value)}
                  className={`p-5 rounded-xl border-2 transition-all text-left transform hover:scale-[1.02] active:scale-[0.98] ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">{option.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold mb-1 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                        {option.value}
                      </p>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Single Choice Options */}
        {currentQ.type === 'single' && (
          <div className="space-y-4">
            {currentQ.options.map((option) => {
              const isSelected = answers[currentQ.id] === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => selectAnswer(currentQ.id, option.value)}
                  className={`w-full p-5 rounded-xl border-2 transition-all text-left transform hover:scale-[1.01] active:scale-[0.99] ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold text-lg mb-1 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                        {option.label}
                      </p>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Selection Count for Multiple Choice */}
        {currentQ.type === 'multiple' && answers[currentQ.id]?.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            {answers[currentQ.id].length} {answers[currentQ.id].length === 1 ? 'item' : 'items'} selected
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleBack}
          disabled={currentQuestion === 0}
          className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            currentQuestion === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700 hover:shadow-md transform hover:scale-[1.02]'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!isCurrentQuestionAnswered()}
          className={`flex-1 px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            isCurrentQuestionAnswered()
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl transform hover:scale-[1.02]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQuestion === totalQuestions - 1 ? (
            <>
              Complete Quiz
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </>
          ) : (
            <>
              Next
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QuizGenerator;
