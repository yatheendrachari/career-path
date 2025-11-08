import React, { createContext, useState, useContext } from 'react';

const CareerContext = createContext();

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};

export const CareerProvider = ({ children }) => {
  const [careerPrediction, setCareerPrediction] = useState(null);
  const [learningPath, setLearningPath] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [quizTopics, setQuizTopics] = useState([]);

  const saveCareerPrediction = (prediction) => {
    setCareerPrediction(prediction);
    // Store in sessionStorage for persistence during session
    sessionStorage.setItem('careerPrediction', JSON.stringify(prediction));
  };

  const saveLearningPath = (path) => {
    setLearningPath(path);
    sessionStorage.setItem('learningPath', JSON.stringify(path));
    
    // Extract topics for quiz
    const topics = [];
    if (path.learning_phases) {
      path.learning_phases.forEach(phase => {
        if (phase.topics) {
          topics.push(...phase.topics);
        }
      });
    }
    setQuizTopics(topics);
  };

  const clearCareerData = () => {
    setCareerPrediction(null);
    setLearningPath(null);
    setSelectedCareer(null);
    setQuizTopics([]);
    sessionStorage.removeItem('careerPrediction');
    sessionStorage.removeItem('learningPath');
  };

  // Load from sessionStorage on mount
  React.useEffect(() => {
    const storedPrediction = sessionStorage.getItem('careerPrediction');
    const storedPath = sessionStorage.getItem('learningPath');
    
    if (storedPrediction) {
      setCareerPrediction(JSON.parse(storedPrediction));
    }
    if (storedPath) {
      const path = JSON.parse(storedPath);
      setLearningPath(path);
      
      // Extract topics
      const topics = [];
      if (path.learning_phases) {
        path.learning_phases.forEach(phase => {
          if (phase.topics) {
            topics.push(...phase.topics);
          }
        });
      }
      setQuizTopics(topics);
    }
  }, []);

  const value = {
    careerPrediction,
    learningPath,
    selectedCareer,
    quizTopics,
    saveCareerPrediction,
    saveLearningPath,
    setSelectedCareer,
    clearCareerData
  };

  return (
    <CareerContext.Provider value={value}>
      {children}
    </CareerContext.Provider>
  );
};
