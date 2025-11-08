/**
 * CareerForm Component - Usage Examples
 *
 * This file demonstrates different ways to use the CareerForm component
 */

import React from 'react';
import CareerForm from './CareerForm';

// ===============================
// Example 1: Standalone Usage
// ===============================
export const StandaloneCareerForm = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Career Prediction</h1>
          <CareerForm />
        </div>
      </div>
    </div>
  );
};

// ===============================
// Example 2: With Callback Handler
// ===============================
export const CareerFormWithCallback = () => {
  const handlePrediction = (prediction) => {
    console.log('Prediction received:', prediction);
    // Store in CareerContext
    // Show notification
    // Update UI
    alert(`Predicted Career: ${prediction.primary_career}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <CareerForm onPredictionSuccess={handlePrediction} />
    </div>
  );
};

// ===============================
// Example 3: Pre-filled from Quiz Data
// ===============================
export const CareerFormFromQuiz = ({ quizResults }) => {
  const initialData = {
    education: quizResults.education || 'Bachelor',
    years_experience: quizResults.experience_years || '0',
    skills: quizResults.skills || [],
    interests: quizResults.interests || [],
    certifications: [],
    preferred_industry: quizResults.preferred_industry || ''
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 font-medium">
          ✓ Your quiz answers have been pre-filled. Review and submit to get your prediction.
        </p>
      </div>
      <CareerForm initialData={initialData} />
    </div>
  );
};

// ===============================
// Example 4: Embedded in a Multi-Step Flow
// ===============================
export const MultiStepCareerPage = () => {
  const [step, setStep] = React.useState(1);
  const [prediction, setPrediction] = React.useState(null);

  const handlePrediction = (result) => {
    setPrediction(result);
    setStep(2);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className="w-20 h-1 bg-gray-200">
            <div className={`h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'} transition-all`} />
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Enter Your Information</h2>
          <CareerForm onPredictionSuccess={handlePrediction} />
        </div>
      )}

      {step === 2 && prediction && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Your Results</h2>
          <p className="text-lg mb-4">
            Recommended Career: <span className="font-bold text-blue-600">{prediction.primary_career}</span>
          </p>
          <button
            onClick={() => setStep(1)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ← Back to Form
          </button>
        </div>
      )}
    </div>
  );
};

// ===============================
// Example 5: Inside a Dashboard Card
// ===============================
export const DashboardCareerCard = () => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div
        className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">Get Career Prediction</h3>
            <p className="text-blue-100">Find your ideal career path with AI</p>
          </div>
          <svg
            className={`w-6 h-6 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Expandable Content */}
      {expanded && (
        <div className="p-6 border-t">
          <CareerForm />
        </div>
      )}
    </div>
  );
};

// ===============================
// Example 6: With Context Integration
// ===============================
import { useCareer } from '../context/CareerContext';

export const CareerFormWithContext = () => {
  const { setCareerPrediction } = useCareer();

  const handlePrediction = (prediction) => {
    // Store in CareerContext
    setCareerPrediction(prediction);

    // Show success notification
    console.log('Prediction saved to context:', prediction);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Career Path Finder</h1>
        <p className="text-gray-600 mb-6">
          Fill out your profile to get AI-powered career recommendations
        </p>
        <CareerForm onPredictionSuccess={handlePrediction} />
      </div>
    </div>
  );
};
