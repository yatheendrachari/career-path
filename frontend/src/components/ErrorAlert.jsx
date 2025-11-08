import React, { useState, useEffect } from 'react';

const ErrorAlert = ({
  message,
  onClose,
  autoDismiss = true,
  timeout = 5000,
  type = 'error'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (autoDismiss && timeout > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, timeout]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300); // Match animation duration
  };

  if (!isVisible) {
    return null;
  }

  // Type-based styling
  const styles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      button: 'hover:bg-red-100 text-red-700 hover:text-red-900'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600',
      button: 'hover:bg-yellow-100 text-yellow-700 hover:text-yellow-900'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
      button: 'hover:bg-green-100 text-green-700 hover:text-green-900'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      button: 'hover:bg-blue-100 text-blue-700 hover:text-blue-900'
    }
  };

  const currentStyle = styles[type] || styles.error;

  // Icon based on type
  const icons = {
    error: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <div
      className={`${currentStyle.bg} border ${currentStyle.border} rounded-lg shadow-lg overflow-hidden ${
        isExiting ? 'animate-slideOut' : 'animate-slideDown'
      }`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-start p-4">
        {/* Icon */}
        <div className={`flex-shrink-0 ${currentStyle.icon}`}>
          {icons[type] || icons.error}
        </div>

        {/* Message */}
        <div className={`ml-3 flex-1 ${currentStyle.text}`}>
          <p className="text-sm font-medium leading-relaxed">
            {message}
          </p>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={handleClose}
            className={`ml-4 flex-shrink-0 inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${currentStyle.button}`}
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress Bar (Auto-dismiss indicator) */}
      {autoDismiss && timeout > 0 && (
        <div className="h-1 bg-gray-200">
          <div
            className={`h-full ${
              type === 'error' ? 'bg-red-500' :
              type === 'warning' ? 'bg-yellow-500' :
              type === 'success' ? 'bg-green-500' :
              'bg-blue-500'
            } animate-shrink`}
            style={{ animationDuration: `${timeout}ms` }}
          />
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-1rem);
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-slideOut {
          animation: slideOut 0.3s ease-out;
        }

        .animate-shrink {
          animation: shrink linear forwards;
        }
      `}</style>
    </div>
  );
};

export default ErrorAlert;
