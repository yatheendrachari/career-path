import React, { useState } from 'react';

const LearningPathCard = ({
  phase,
  duration,
  topics = [],
  resources = [],
  index = 0,
  showTimeline = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Gradient colors for visual variety
  const gradients = [
    'from-blue-50 to-blue-100',
    'from-purple-50 to-purple-100',
    'from-green-50 to-green-100',
    'from-orange-50 to-orange-100',
    'from-pink-50 to-pink-100'
  ];

  const borderColors = [
    'border-blue-300',
    'border-purple-300',
    'border-green-300',
    'border-orange-300',
    'border-pink-300'
  ];

  const iconColors = [
    'bg-blue-600',
    'bg-purple-600',
    'bg-green-600',
    'bg-orange-600',
    'bg-pink-600'
  ];

  const gradient = gradients[index % gradients.length];
  const borderColor = borderColors[index % borderColors.length];
  const iconColor = iconColors[index % iconColors.length];

  const hasResources = resources && resources.length > 0;
  const hasTopics = topics && topics.length > 0;

  return (
    <div className="relative">
      {/* Timeline Connector (optional) */}
      {showTimeline && (
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 -z-10" />
      )}

      {/* Main Card */}
      <div className="relative pl-14 pb-8">
        {/* Timeline Dot */}
        {showTimeline && (
          <div className={`absolute left-0 top-2 w-12 h-12 ${iconColor} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
            {index + 1}
          </div>
        )}

        {/* Card Content */}
        <div
          className={`bg-gradient-to-br ${gradient} border-2 ${borderColor} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 ${
            isExpanded ? 'shadow-lg' : 'shadow-md'
          }`}
        >
          {/* Header Section */}
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {phase}
                </h3>
                {duration && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">
                      {duration}
                    </span>
                  </div>
                )}
              </div>

              {/* Expand/Collapse Button */}
              {hasResources && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
                  aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                >
                  <svg
                    className={`w-5 h-5 text-gray-700 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>

            {/* Topics List */}
            {hasTopics && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  What you'll learn:
                </p>
                <ul className="space-y-1.5">
                  {topics.map((topic, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-800"
                    >
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm leading-relaxed">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* No Topics Fallback */}
            {!hasTopics && (
              <p className="text-sm text-gray-600 italic">
                No specific topics listed for this phase
              </p>
            )}
          </div>

          {/* Collapsible Resources Section */}
          {hasResources && (
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="border-t-2 border-gray-300/50 bg-white/30 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  <h4 className="text-sm font-bold text-gray-900">
                    Recommended Resources
                  </h4>
                </div>

                <ul className="space-y-2">
                  {resources.map((resource, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-800"
                    >
                      <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{resource}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Expand Hint (when collapsed and has resources) */}
          {!isExpanded && hasResources && (
            <div className="border-t-2 border-gray-300/50 bg-white/20 px-5 py-2">
              <button
                onClick={() => setIsExpanded(true)}
                className="text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1"
              >
                <span>View Resources</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPathCard;
