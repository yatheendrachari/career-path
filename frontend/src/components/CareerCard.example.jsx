/**
 * CareerCard Component - Usage Examples
 */

import React from 'react';
import CareerCard from './CareerCard';

// ===============================
// Example 1: Basic Usage
// ===============================
export const BasicCareerCard = () => {
  return (
    <div className="max-w-sm p-6">
      <CareerCard
        name="Data Scientist"
        description="Analyze complex data to help companies make better decisions. Work with ML models, statistics, and data visualization."
        avg_salary="$120K - $180K"
        growth_rate="+22%"
        icon="📊"
      />
    </div>
  );
};

// ===============================
// Example 2: Grid Layout (HomePage)
// ===============================
export const HomePageCareerGrid = () => {
  const topCareers = [
    {
      name: 'Data Scientist',
      description: 'Analyze complex data to help companies make better decisions using ML and statistics.',
      avg_salary: '$120K - $180K',
      growth_rate: '+22%',
      icon: '📊'
    },
    {
      name: 'Software Engineer',
      description: 'Design, develop, and maintain software applications and systems.',
      avg_salary: '$110K - $165K',
      growth_rate: '+21%',
      icon: '💻'
    },
    {
      name: 'UX Designer',
      description: 'Create intuitive and engaging user experiences for digital products.',
      avg_salary: '$85K - $130K',
      growth_rate: '+18%',
      icon: '🎨'
    },
    {
      name: 'Cloud Architect',
      description: 'Design and implement cloud infrastructure and migration strategies.',
      avg_salary: '$130K - $195K',
      growth_rate: '+25%',
      icon: '☁️'
    },
    {
      name: 'Product Manager',
      description: 'Lead product strategy, roadmap, and feature definition for products.',
      avg_salary: '$115K - $170K',
      growth_rate: '+19%',
      icon: '📱'
    },
    {
      name: 'Cybersecurity Analyst',
      description: 'Protect organizations from cyber threats and security breaches.',
      avg_salary: '$95K - $145K',
      growth_rate: '+31%',
      icon: '🔒'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 text-center">
          Top Career Paths
        </h1>
        <p className="text-gray-600 text-center mb-10">
          Explore trending careers with high growth potential
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topCareers.map((career, index) => (
            <CareerCard
              key={index}
              name={career.name}
              description={career.description}
              avg_salary={career.avg_salary}
              growth_rate={career.growth_rate}
              icon={career.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ===============================
// Example 3: Dashboard View
// ===============================
export const DashboardCareerCards = () => {
  const savedCareers = [
    {
      name: 'Machine Learning Engineer',
      description: 'Build and deploy ML models at scale',
      avg_salary: '$135K - $200K',
      growth_rate: '+28%',
      icon: '🤖'
    },
    {
      name: 'DevOps Engineer',
      description: 'Streamline development and operations processes',
      avg_salary: '$105K - $155K',
      growth_rate: '+20%',
      icon: '⚙️'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Saved Careers
        </h2>
        <p className="text-gray-600">
          Careers you've shown interest in
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedCareers.map((career, index) => (
          <CareerCard
            key={index}
            name={career.name}
            description={career.description}
            avg_salary={career.avg_salary}
            growth_rate={career.growth_rate}
            icon={career.icon}
          />
        ))}
      </div>
    </div>
  );
};

// ===============================
// Example 4: With Custom onClick
// ===============================
export const CareerCardWithCustomAction = () => {
  const handleCareerClick = () => {
    alert('Career card clicked! You can handle custom logic here.');
    // Store in favorites, show modal, etc.
  };

  return (
    <div className="max-w-sm p-6">
      <CareerCard
        name="Full Stack Developer"
        description="Build complete web applications from frontend to backend."
        avg_salary="$100K - $150K"
        growth_rate: "+20%"
        icon="🚀"
        onClick={handleCareerClick}
      />
    </div>
  );
};

// ===============================
// Example 5: Minimal Card (Optional Fields)
// ===============================
export const MinimalCareerCard = () => {
  return (
    <div className="max-w-sm p-6">
      <CareerCard
        name="Business Analyst"
        description="Bridge the gap between business and technology teams."
        // No salary or growth rate provided
      />
    </div>
  );
};

// ===============================
// Example 6: With API Data
// ===============================
export const CareerCardFromAPI = () => {
  const [careers, setCareers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate API call
    fetch('/api/careers')
      .then(res => res.json())
      .then(data => {
        setCareers(data.careers);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching careers:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-80 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {careers.map((career, index) => (
        <CareerCard
          key={index}
          name={career.title || career.name}
          description={career.description}
          avg_salary={career.salary || career.avg_salary}
          growth_rate={career.growth || career.growth_rate}
          icon={career.icon || '💼'}
        />
      ))}
    </div>
  );
};

// ===============================
// Example 7: Responsive Grid with Different Breakpoints
// ===============================
export const ResponsiveCareerGrid = () => {
  const careers = [
    { name: 'AI Researcher', description: 'Advance AI technologies', avg_salary: '$150K+', growth_rate: '+35%', icon: '🧠' },
    { name: 'Mobile Developer', description: 'Build native mobile apps', avg_salary: '$105K - $160K', growth_rate: '+19%', icon: '📱' },
    { name: 'Blockchain Developer', description: 'Create decentralized applications', avg_salary: '$125K - $185K', growth_rate: '+26%', icon: '⛓️' },
    { name: 'Data Engineer', description: 'Build data pipelines and infrastructure', avg_salary: '$115K - $175K', growth_rate: '+24%', icon: '🔧' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 1 column on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {careers.map((career, index) => (
          <CareerCard key={index} {...career} />
        ))}
      </div>
    </div>
  );
};

// ===============================
// Example 8: With Search/Filter
// ===============================
export const FilterableCareerCards = () => {
  const allCareers = [
    { name: 'Frontend Developer', description: 'Build user interfaces', avg_salary: '$90K - $140K', growth_rate: '+18%', icon: '🎨', category: 'Tech' },
    { name: 'Backend Developer', description: 'Build server-side logic', avg_salary: '$95K - $145K', growth_rate: '+19%', icon: '⚙️', category: 'Tech' },
    { name: 'Marketing Manager', description: 'Lead marketing campaigns', avg_salary: '$85K - $130K', growth_rate: '+15%', icon: '📣', category: 'Business' },
    { name: 'Financial Analyst', description: 'Analyze financial data', avg_salary: '$75K - $120K', growth_rate: '+12%', icon: '💰', category: 'Finance' }
  ];

  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('All');

  const filteredCareers = allCareers.filter(career => {
    const matchesSearch = career.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || career.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Filters */}
      <div className="mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Search careers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All</option>
          <option>Tech</option>
          <option>Business</option>
          <option>Finance</option>
        </select>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.map((career, index) => (
          <CareerCard
            key={index}
            name={career.name}
            description={career.description}
            avg_salary={career.avg_salary}
            growth_rate={career.growth_rate}
            icon={career.icon}
          />
        ))}
      </div>

      {filteredCareers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No careers found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

// ===============================
// Example 9: With Favorite/Save Feature
// ===============================
export const CareerCardWithFavorite = () => {
  const [favorites, setFavorites] = React.useState([]);

  const careers = [
    { id: 1, name: 'Data Scientist', description: 'Analyze data', avg_salary: '$120K+', growth_rate: '+22%', icon: '📊' },
    { id: 2, name: 'UX Designer', description: 'Design experiences', avg_salary: '$90K+', growth_rate: '+18%', icon: '🎨' }
  ];

  const toggleFavorite = (careerId) => {
    setFavorites(prev =>
      prev.includes(careerId)
        ? prev.filter(id => id !== careerId)
        : [...prev, careerId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careers.map(career => (
          <div key={career.id} className="relative">
            {/* Favorite Button Overlay */}
            <button
              onClick={() => toggleFavorite(career.id)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              <span className="text-2xl">
                {favorites.includes(career.id) ? '❤️' : '🤍'}
              </span>
            </button>

            <CareerCard
              name={career.name}
              description={career.description}
              avg_salary={career.avg_salary}
              growth_rate={career.growth_rate}
              icon={career.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
