/**
 * LearningPathCard Component - Usage Examples
 */

import React from 'react';
import LearningPathCard from './LearningPathCard';

// ===============================
// Example 1: Basic Usage
// ===============================
export const BasicLearningPath = () => {
  const phase = {
    phase: 'Foundation Phase',
    duration: '2-3 months',
    topics: [
      'Python fundamentals and syntax',
      'Data structures and algorithms',
      'Object-oriented programming concepts',
      'Version control with Git'
    ],
    resources: [
      'Python for Everybody (Coursera)',
      'Automate the Boring Stuff with Python',
      'LeetCode Easy Problems'
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <LearningPathCard
        phase={phase.phase}
        duration={phase.duration}
        topics={phase.topics}
        resources={phase.resources}
        index={0}
      />
    </div>
  );
};

// ===============================
// Example 2: Complete Roadmap (Multiple Cards)
// ===============================
export const CompleteLearningRoadmap = () => {
  const learningPhases = [
    {
      phase: 'Foundation Phase',
      duration: '2-3 months',
      topics: [
        'Python fundamentals and syntax',
        'Data structures and algorithms',
        'Object-oriented programming',
        'Git and version control'
      ],
      resources: [
        'Python for Everybody (Coursera)',
        'Automate the Boring Stuff with Python',
        'Git Documentation'
      ]
    },
    {
      phase: 'Core Skills Development',
      duration: '3-4 months',
      topics: [
        'Web frameworks (Django/Flask)',
        'Database design and SQL',
        'RESTful API development',
        'Testing and debugging'
      ],
      resources: [
        'Django Official Tutorial',
        'Flask Mega Tutorial',
        'PostgreSQL Documentation',
        'pytest Documentation'
      ]
    },
    {
      phase: 'Advanced Topics',
      duration: '4-6 months',
      topics: [
        'Machine Learning basics',
        'Cloud deployment (AWS/Azure)',
        'Containerization with Docker',
        'CI/CD pipelines'
      ],
      resources: [
        'Machine Learning Crash Course (Google)',
        'AWS Certified Developer',
        'Docker Mastery (Udemy)'
      ]
    },
    {
      phase: 'Specialization',
      duration: '3-4 months',
      topics: [
        'Deep Learning frameworks',
        'Microservices architecture',
        'System design principles',
        'Performance optimization'
      ],
      resources: [
        'Deep Learning Specialization (Coursera)',
        'System Design Interview',
        'High Performance Python'
      ]
    },
    {
      phase: 'Job Preparation',
      duration: '1-2 months',
      topics: [
        'Portfolio project development',
        'Interview preparation',
        'Resume optimization',
        'Networking and job search'
      ],
      resources: [
        'Cracking the Coding Interview',
        'LeetCode Premium',
        'LinkedIn Learning'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Your Learning Roadmap
      </h1>

      <div className="space-y-0">
        {learningPhases.map((phase, index) => (
          <LearningPathCard
            key={index}
            phase={phase.phase}
            duration={phase.duration}
            topics={phase.topics}
            resources={phase.resources}
            index={index}
            showTimeline={true}
          />
        ))}
      </div>
    </div>
  );
};

// ===============================
// Example 3: Without Timeline (Dashboard View)
// ===============================
export const DashboardPhaseCard = () => {
  const currentPhase = {
    phase: 'Core Skills Development',
    duration: '3-4 months',
    topics: [
      'Web frameworks (Django/Flask)',
      'Database design and SQL',
      'RESTful API development'
    ],
    resources: [
      'Django Official Tutorial',
      'Flask Mega Tutorial',
      'PostgreSQL Documentation'
    ]
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Current Phase</h2>
        <p className="text-gray-600">You're making great progress!</p>
      </div>

      <LearningPathCard
        phase={currentPhase.phase}
        duration={currentPhase.duration}
        topics={currentPhase.topics}
        resources={currentPhase.resources}
        index={1}
        showTimeline={false}
      />
    </div>
  );
};

// ===============================
// Example 4: Minimal Phase (No Resources)
// ===============================
export const MinimalPhaseCard = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <LearningPathCard
        phase="Exploratory Phase"
        duration="1-2 weeks"
        topics={[
          'Research career options',
          'Identify skill gaps',
          'Set learning goals'
        ]}
        resources={[]}  // Empty resources
        index={0}
        showTimeline={false}
      />
    </div>
  );
};

// ===============================
// Example 5: Empty Topics (Graceful Handling)
// ===============================
export const EmptyTopicsCard = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <LearningPathCard
        phase="Planning Phase"
        duration="Ongoing"
        topics={[]}  // Empty topics
        resources={['Career Planning Guide', 'Skills Assessment Tool']}
        index={0}
      />
    </div>
  );
};

// ===============================
// Example 6: In LearningPathPage
// ===============================
export const LearningPathPageExample = () => {
  const roadmapData = {
    overview: 'Your personalized roadmap to becoming a Data Scientist',
    learning_phases: [
      {
        phase: 'Mathematics & Statistics',
        duration: '2-3 months',
        topics: ['Linear Algebra', 'Calculus', 'Probability', 'Statistics'],
        resources: ['Khan Academy', 'StatQuest YouTube', '3Blue1Brown']
      },
      {
        phase: 'Programming Fundamentals',
        duration: '2-3 months',
        topics: ['Python', 'NumPy', 'Pandas', 'Data Visualization'],
        resources: ['Python Data Science Handbook', 'Kaggle Learn']
      },
      {
        phase: 'Machine Learning',
        duration: '4-5 months',
        topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation'],
        resources: ['Andrew Ng ML Course', 'Scikit-learn Docs']
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Your Learning Path</h1>
          <p className="text-blue-100">{roadmapData.overview}</p>
        </div>

        {/* Learning Phases */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Learning Timeline
          </h2>

          <div className="space-y-0">
            {roadmapData.learning_phases.map((phase, index) => (
              <LearningPathCard
                key={index}
                phase={phase.phase}
                duration={phase.duration}
                topics={phase.topics}
                resources={phase.resources}
                index={index}
                showTimeline={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===============================
// Example 7: Dynamic Data from API
// ===============================
export const DynamicLearningPath = () => {
  const [phases, setPhases] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPhases([
        {
          phase: 'Foundation',
          duration: '2 months',
          topics: ['Basics', 'Fundamentals'],
          resources: ['Course 1', 'Book 1']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading your learning path...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {phases.map((phase, index) => (
        <LearningPathCard
          key={index}
          phase={phase.phase}
          duration={phase.duration}
          topics={phase.topics}
          resources={phase.resources}
          index={index}
        />
      ))}
    </div>
  );
};

// ===============================
// Example 8: With Progress Tracking
// ===============================
export const PhaseWithProgress = () => {
  const [completed, setCompleted] = React.useState(false);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Current Phase</h2>
        <button
          onClick={() => setCompleted(!completed)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            completed
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {completed ? '✓ Completed' : 'Mark Complete'}
        </button>
      </div>

      <div className={completed ? 'opacity-50' : ''}>
        <LearningPathCard
          phase="Web Development Basics"
          duration="2 months"
          topics={['HTML/CSS', 'JavaScript', 'React Basics']}
          resources={['FreeCodeCamp', 'MDN Docs', 'React Tutorial']}
          index={0}
          showTimeline={false}
        />
      </div>
    </div>
  );
};
