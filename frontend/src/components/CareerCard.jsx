// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const CareerCard = ({
//   name,
//   description,
//   avg_salary,
//   growth_rate,
//   icon = '💼',
//   onClick
// }) => {
//   const navigate = useNavigate();

//   const handleViewDetails = (e) => {
//     e.stopPropagation();

//     // Call custom onClick if provided
//     if (onClick) {
//       onClick();
//       return;
//     }

//     // Default navigation
//     const careerSlug = name.toLowerCase().replace(/\s+/g, '-');
//     navigate(`/career-info/${careerSlug}`);
//   };

//   const handleCardClick = () => {
//     if (onClick) {
//       onClick();
//     }
//   };

//   return (
//     <div
//       onClick={handleCardClick}
//       className={`bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:scale-[1.03] hover:-translate-y-1 ${
//         onClick ? 'cursor-pointer' : ''
//       }`}
//     >
//       {/* Header with Icon */}
//       <div className="bg-linear-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
//         <div className="flex items-start justify-between">
//           <div className="flex items-center gap-3 flex-1 min-w-0">
//             <span className="text-4xl flex-shrink-0">{icon}</span>
//             <div className="min-w-0">
//               <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
//                 {name}
//               </h3>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-6">
//         {/* Description */}
//         {description && (
//           <p className="text-gray-700 text-sm leading-relaxed mb-6 line-clamp-3">
//             {description}
//           </p>
//         )}

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           {/* Salary */}
//           {avg_salary && (
//             <div className="bg-green-50 rounded-lg p-3 border border-green-200">
//               <div className="flex items-center gap-2 mb-1">
//                 <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
//                 </svg>
//                 <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
//                   Avg. Salary
//                 </span>
//               </div>
//               <p className="text-base font-bold text-green-900">
//                 {avg_salary}
//               </p>
//             </div>
//           )}

//           {/* Growth Rate */}
//           {growth_rate && (
//             <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
//               <div className="flex items-center gap-2 mb-1">
//                 <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
//                 </svg>
//                 <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
//                   Growth
//                 </span>
//               </div>
//               <p className="text-base font-bold text-blue-900">
//                 {growth_rate}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* View Details Button */}
//         <button
//           onClick={handleViewDetails}
//           className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
//         >
//           View Details
//           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CareerCard;



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
    <div className="min-h-screen bg-linear-to-br from-purple-200 via-blue-200 to-cyan-200 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Career Discovery Quiz</h1>
          <p className="text-gray-800 font-semibold text-lg">Answer a few questions to find your ideal career path</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-2xl p-4 shadow-xl border-3 border-indigo-400">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-bold text-gray-900">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span className="text-base font-bold text-indigo-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-4 border-2 border-gray-400">
            <div
              className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 h-4 rounded-full transition-all duration-500 shadow-md"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 animate-slideIn border-4 border-purple-400">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {currentQ.question}
          </h2>
          <p className="text-gray-800 mb-6 text-lg font-semibold">{currentQ.subtitle}</p>

          {/* Multiple Choice Options */}
          {currentQ.type === 'multiple' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((option) => {
                const isSelected = answers[currentQ.id]?.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleAnswer(currentQ.id, option.value)}
                    className={`p-4 rounded-xl border-3 transition-all text-left flex items-center gap-3 font-semibold shadow-lg ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-100 shadow-xl scale-105'
                        : 'border-gray-400 bg-white hover:border-indigo-400 hover:bg-indigo-50 hover:scale-102'
                    }`}
                  >
                    <span className="text-3xl">{option.emoji}</span>
                    <span className={`${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                      {option.value}
                    </span>
                    {isSelected && (
                      <span className="ml-auto text-indigo-700 text-xl">✓</span>
                    )}
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
                    className={`w-full p-4 rounded-xl border-3 transition-all text-left font-semibold shadow-lg ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-100 shadow-xl scale-105'
                        : 'border-gray-400 bg-white hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    <span className={`${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <span className="ml-2 text-indigo-700 text-xl">✓</span>
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
            className={`px-8 py-4 rounded-xl font-bold transition-all text-lg shadow-xl ${
              currentQuestion === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-3 border-gray-400'
                : 'bg-white text-gray-900 hover:bg-gray-100 border-3 border-gray-400 hover:shadow-2xl'
            }`}
          >
            ← Back
          </button>

          <button
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered()}
            className={`flex-1 px-8 py-4 rounded-xl font-bold transition-all text-lg shadow-xl ${
              isCurrentQuestionAnswered()
                ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:shadow-2xl hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed border-3 border-gray-400'
            }`}
          >
            {currentQuestion === totalQuestions - 1 ? 'Complete Quiz →' : 'Next →'}
          </button>
        </div>

        {/* Skip Quiz Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/career-path')}
            className="text-gray-900 hover:text-indigo-700 text-base underline font-bold"
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