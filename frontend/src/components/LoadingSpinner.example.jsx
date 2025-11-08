/**
 * LoadingSpinner Component - Usage Examples
 */

import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

// ===============================
// Example 1: Inline Loading (Default)
// ===============================
export const InlineLoading = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Data Loading</h2>

      <LoadingSpinner message="Fetching careers..." />
    </div>
  );
};

// ===============================
// Example 2: All Size Variants
// ===============================
export const SizeVariants = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold">Size Variants</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Small</h3>
        <LoadingSpinner size="small" message="Loading..." />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Medium (Default)</h3>
        <LoadingSpinner size="medium" message="Processing request..." />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Large</h3>
        <LoadingSpinner size="large" message="Generating your roadmap..." />
      </div>
    </div>
  );
};

// ===============================
// Example 3: Overlay Loading
// ===============================
export const OverlayLoading = () => {
  const [loading, setLoading] = useState(false);

  const handleLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8 relative min-h-[300px]">
        <h2 className="text-2xl font-bold mb-4">Content Card</h2>
        <p className="text-gray-600 mb-6">
          Click the button below to show an overlay loading spinner.
          The content beneath will be blurred.
        </p>

        <button
          onClick={handleLoad}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Load Data
        </button>

        {loading && (
          <LoadingSpinner
            overlay={true}
            message="Loading data..."
          />
        )}
      </div>
    </div>
  );
};

// ===============================
// Example 4: Full Screen Loading
// ===============================
export const FullScreenLoading = () => {
  const [loading, setLoading] = useState(false);

  const handleLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-4">Full Screen Loader</h2>
        <p className="text-gray-600 mb-6">
          This will show a full-screen loading overlay that covers the entire viewport.
        </p>

        <button
          onClick={handleLoad}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Show Full Screen Loader
        </button>
      </div>

      {loading && (
        <LoadingSpinner
          fullScreen={true}
          message="Processing your request..."
          size="large"
        />
      )}
    </div>
  );
};

// ===============================
// Example 5: Conditional Rendering (Common Pattern)
// ===============================
export const ConditionalRendering = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setData({ careers: ['Data Scientist', 'Developer', 'Designer'] });
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching careers..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Careers</h2>
        <ul className="space-y-2">
          {data.careers.map((career, i) => (
            <li key={i} className="text-gray-700">{career}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ===============================
// Example 6: Form Submission
// ===============================
export const FormSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Career Prediction Form</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Skills</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Python, JavaScript..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Years of Experience</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {loading && (
          <div className="mt-6">
            <LoadingSpinner
              size="small"
              message="Analyzing your profile..."
            />
          </div>
        )}

        {success && !loading && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-800 font-semibold">✓ Prediction complete!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ===============================
// Example 7: Data Table Loading
// ===============================
export const DataTableLoading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Career Predictions</h2>
        </div>

        <div className="min-h-[300px] relative">
          {loading ? (
            <LoadingSpinner message="Loading predictions..." />
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Career</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">Data Scientist</td>
                  <td className="px-6 py-4">89%</td>
                  <td className="px-6 py-4">Today</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Software Engineer</td>
                  <td className="px-6 py-4">85%</td>
                  <td className="px-6 py-4">Yesterday</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// ===============================
// Example 8: Multiple Loaders
// ===============================
export const MultipleLoaders = () => {
  const [careerLoading, setCareerLoading] = useState(false);
  const [pathLoading, setPathLoading] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Career Card */}
        <div className="bg-white rounded-lg shadow-md p-6 relative min-h-[200px]">
          <h3 className="text-lg font-bold mb-4">Career Predictions</h3>
          <button
            onClick={() => {
              setCareerLoading(true);
              setTimeout(() => setCareerLoading(false), 2000);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Load Careers
          </button>

          {careerLoading && (
            <LoadingSpinner
              overlay={true}
              size="small"
              message="Loading careers..."
            />
          )}
        </div>

        {/* Learning Path Card */}
        <div className="bg-white rounded-lg shadow-md p-6 relative min-h-[200px]">
          <h3 className="text-lg font-bold mb-4">Learning Paths</h3>
          <button
            onClick={() => {
              setPathLoading(true);
              setTimeout(() => setPathLoading(false), 2000);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Load Paths
          </button>

          {pathLoading && (
            <LoadingSpinner
              overlay={true}
              size="small"
              message="Loading paths..."
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ===============================
// Example 9: Without Message
// ===============================
export const NoMessage = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-12">
        <LoadingSpinner />
      </div>
    </div>
  );
};

// ===============================
// Example 10: Page Load Pattern
// ===============================
export const PageLoadPattern = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [content, setContent] = useState(null);

  useEffect(() => {
    // Simulate page data loading
    setTimeout(() => {
      setContent({ title: 'Welcome to Dashboard', data: ['Item 1', 'Item 2'] });
      setPageLoading(false);
    }, 2000);
  }, []);

  if (pageLoading) {
    return (
      <LoadingSpinner
        fullScreen={true}
        message="Loading dashboard..."
        size="large"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
        <ul className="space-y-2">
          {content.data.map((item, i) => (
            <li key={i} className="text-gray-700">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
