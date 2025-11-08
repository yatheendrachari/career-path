/**
 * DashboardCard Component - Usage Examples
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from './DashboardCard';

// ===============================
// Example 1: Career Predictions Grid
// ===============================
export const CareerPredictionsGrid = () => {
  const navigate = useNavigate();

  const careerPredictions = [
    {
      id: 1,
      title: 'Data Scientist',
      subtitle: 'AI & Machine Learning',
      confidence: 0.89,
      created_at: '2024-01-15T10:30:00Z',
      icon: '📊'
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      subtitle: 'Web Development',
      confidence: 0.85,
      created_at: '2024-01-10T14:20:00Z',
      icon: '💻'
    },
    {
      id: 3,
      title: 'UX Designer',
      subtitle: 'Design & User Experience',
      confidence: 0.78,
      created_at: '2024-01-05T09:15:00Z',
      icon: '🎨'
    }
  ];

  const handleView = (career) => {
    navigate(`/career-details/${career.id}`);
  };

  const handleDelete = (careerId) => {
    console.log('Delete career:', careerId);
    // API call to delete
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Your Career Predictions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careerPredictions.map(career => (
          <DashboardCard
            key={career.id}
            title={career.title}
            subtitle={career.subtitle}
            confidence={career.confidence}
            created_at={career.created_at}
            icon={career.icon}
            variant="career"
            onView={() => handleView(career)}
            onDelete={() => handleDelete(career.id)}
          />
        ))}
      </div>
    </div>
  );
};

// ===============================
// Example 2: Learning Paths Grid
// ===============================
export const LearningPathsGrid = () => {
  const navigate = useNavigate();

  const learningPaths = [
    {
      id: 1,
      title: 'Data Science Roadmap',
      subtitle: '5 phases • 12 months',
      created_at: '2024-01-20T11:00:00Z',
      icon: '📚'
    },
    {
      id: 2,
      title: 'Web Development Path',
      subtitle: '4 phases • 8 months',
      created_at: '2024-01-18T16:30:00Z',
      icon: '🚀'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Your Learning Paths
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningPaths.map(path => (
          <DashboardCard
            key={path.id}
            title={path.title}
            subtitle={path.subtitle}
            created_at={path.created_at}
            icon={path.icon}
            variant="learning"
            onView={() => navigate(`/learning-path/${path.id}`)}
            onDelete={() => console.log('Delete', path.id)}
          />
        ))}
      </div>
    </div>
  );
};

// ===============================
// Example 3: Dashboard Overview
// ===============================
export const DashboardOverview = () => {
  const navigate = useNavigate();

  const recentActivity = [
    {
      id: 1,
      type: 'career',
      title: 'Machine Learning Engineer',
      subtitle: 'Latest prediction',
      confidence: 0.92,
      created_at: new Date().toISOString(),
      icon: '🤖'
    },
    {
      id: 2,
      type: 'learning',
      title: 'Python Mastery Path',
      subtitle: 'In progress',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      icon: '🐍'
    },
    {
      id: 3,
      type: 'career',
      title: 'Cloud Architect',
      subtitle: 'Alternative recommendation',
      confidence: 0.81,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      icon: '☁️'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Recent Activity
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentActivity.map(item => (
          <DashboardCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            confidence={item.confidence}
            created_at={item.created_at}
            icon={item.icon}
            variant={item.type}
            onView={() => navigate(`/${item.type}/${item.id}`)}
            onDelete={() => console.log('Delete', item.id)}
          />
        ))}
      </div>
    </div>
  );
};

// ===============================
// Example 4: View-Only Cards (No Delete)
// ===============================
export const ViewOnlyCards = () => {
  const navigate = useNavigate();

  const publicCareers = [
    {
      id: 1,
      title: 'Software Engineer',
      subtitle: 'Recommended for you',
      confidence: 0.88,
      created_at: '2024-01-15T10:00:00Z',
      icon: '⚙️'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Recommended Careers
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {publicCareers.map(career => (
          <DashboardCard
            key={career.id}
            title={career.title}
            subtitle={career.subtitle}
            confidence={career.confidence}
            created_at={career.created_at}
            icon={career.icon}
            variant="career"
            onView={() => navigate(`/career/${career.id}`)}
            // No onDelete prop - delete button won't show
          />
        ))}
      </div>
    </div>
  );
};

// ===============================
// Example 5: Minimal Cards (No Confidence)
// ===============================
export const MinimalCards = () => {
  const savedItems = [
    {
      id: 1,
      title: 'Career Planning Guide',
      subtitle: 'Saved resource',
      created_at: '2024-01-10T12:00:00Z',
      icon: '📖'
    },
    {
      id: 2,
      title: 'Interview Tips',
      subtitle: 'Bookmark',
      created_at: '2024-01-08T15:30:00Z',
      icon: '💡'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Saved Resources
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedItems.map(item => (
          <DashboardCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            created_at={item.created_at}
            icon={item.icon}
            onView={() => window.open(`/resources/${item.id}`, '_blank')}
            onDelete={() => console.log('Delete', item.id)}
          />
        ))}
      </div>
    </div>
  );
};

// ===============================
// Example 6: Dark Mode Demo
// ===============================
export const DarkModeDemo = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  const sampleCard = {
    title: 'AI Research Scientist',
    subtitle: 'Deep Learning & NLP',
    confidence: 0.91,
    created_at: new Date().toISOString(),
    icon: '🧠'
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Toggle */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dark Mode Demo
            </h2>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Toggle {darkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
              {...sampleCard}
              variant="default"
              onView={() => console.log('View')}
              onDelete={() => console.log('Delete')}
            />

            <DashboardCard
              {...sampleCard}
              variant="career"
              onView={() => console.log('View')}
              onDelete={() => console.log('Delete')}
            />

            <DashboardCard
              {...sampleCard}
              variant="learning"
              title="Machine Learning Path"
              subtitle="Advanced track"
              icon="🚀"
              confidence={undefined}
              onView={() => console.log('View')}
              onDelete={() => console.log('Delete')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ===============================
// Example 7: With API Integration
// ===============================
export const APIIntegratedDashboard = () => {
  const [careers, setCareers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await fetch('/api/career-history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCareers(data.history || []);
    } catch (err) {
      console.error('Error fetching careers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/career-history/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Remove from UI
      setCareers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Your Career History
      </h2>

      {careers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No career predictions yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map(career => (
            <DashboardCard
              key={career.id}
              title={career.career_path}
              subtitle={career.industry || 'Career prediction'}
              confidence={career.confidence}
              created_at={career.created_at}
              variant="career"
              onView={() => window.location.href = `/career/${career.id}`}
              onDelete={() => handleDelete(career.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ===============================
// Example 8: Responsive Layout
// ===============================
export const ResponsiveDashboard = () => {
  const items = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: `Career Option ${i + 1}`,
    subtitle: 'Recommended path',
    confidence: 0.75 + (Math.random() * 0.2),
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    icon: ['📊', '💻', '🎨', '🔬', '📱', '☁️', '🔒', '🚀', '🤖'][i]
  }));

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        All Predictions
      </h1>

      {/* 1 col mobile, 2 col tablet, 3 col desktop, 4 col wide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {items.map(item => (
          <DashboardCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            confidence={item.confidence}
            created_at={item.created_at}
            icon={item.icon}
            variant="career"
            onView={() => console.log('View', item.id)}
            onDelete={() => console.log('Delete', item.id)}
          />
        ))}
      </div>
    </div>
  );
};
