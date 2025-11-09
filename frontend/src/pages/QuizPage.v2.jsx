import React from 'react';
import QuizGenerator from '../components/QuizGenerator';

const QuizPage = () => {
  const handleQuizComplete = (compiledData) => {
    console.log('Quiz completed with data:', compiledData);
    // Data is automatically sent to CareerPathPage via navigation state
    // You can also store in CareerContext here if needed
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-500 via-white to-blue-300 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Career Discovery Quiz
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Answer a few questions to help us understand your skills, interests, and career preferences.
            This will help us provide personalized career recommendations.
          </p>
        </div>

        {/* Quiz Component */}
        <QuizGenerator onComplete={handleQuizComplete} />

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Your responses will be used to generate personalized career predictions.</p>
          <p className="mt-1">All data is kept private and secure.</p>
        </div>
      </div>

      {/* Fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QuizPage;
