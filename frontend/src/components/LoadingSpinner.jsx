import React from 'react';

const LoadingSpinner = ({
  message = 'Loading...',
  size = 'medium',
  overlay = false,
  fullScreen = false
}) => {
  // Size variants
  const sizes = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-3',
    large: 'w-16 h-16 border-4'
  };

  const spinnerSize = sizes[size] || sizes.medium;

  // Spinner element
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${spinnerSize} border-blue-600 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  // Full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  // Overlay (transparent background)
  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
        {spinner}
      </div>
    );
  }

  // Inline (default)
  return (
    <div className="flex items-center justify-center py-8">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
