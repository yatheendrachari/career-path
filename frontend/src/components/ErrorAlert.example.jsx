/**
 * ErrorAlert Component - Usage Examples
 */

import React, { useState } from 'react';
import ErrorAlert from './ErrorAlert';

// ===============================
// Example 1: Basic Error Alert
// ===============================
export const BasicErrorAlert = () => {
  const [showError, setShowError] = useState(true);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <button
        onClick={() => setShowError(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Show Error
      </button>

      {showError && (
        <ErrorAlert
          message="Failed to connect to server. Please check your internet connection."
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
};

// ===============================
// Example 2: All Alert Types
// ===============================
export const AllAlertTypes = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <ErrorAlert
        type="error"
        message="Error: Failed to save your changes. Please try again."
        onClose={() => console.log('Error dismissed')}
      />

      <ErrorAlert
        type="warning"
        message="Warning: Your session will expire in 5 minutes."
        onClose={() => console.log('Warning dismissed')}
      />

      <ErrorAlert
        type="success"
        message="Success! Your career prediction has been saved."
        onClose={() => console.log('Success dismissed')}
      />

      <ErrorAlert
        type="info"
        message="Info: New learning resources have been added to your roadmap."
        onClose={() => console.log('Info dismissed')}
      />
    </div>
  );
};

// ===============================
// Example 3: Auto-dismiss (No Close Button)
// ===============================
export const AutoDismissAlert = () => {
  const [showAlert, setShowAlert] = useState(false);

  const triggerAlert = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5300); // Slightly longer than timeout
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <button
        onClick={triggerAlert}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Trigger Auto-dismiss Alert
      </button>

      {showAlert && (
        <ErrorAlert
          message="This alert will disappear in 5 seconds..."
          autoDismiss={true}
          timeout={5000}
          // No onClose - alert auto-dismisses without close button
        />
      )}
    </div>
  );
};

// ===============================
// Example 4: Form Error Handling
// ===============================
export const FormWithErrorAlert = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Simulate API error
    setError('Invalid credentials. Please try again.');
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Login Form</h2>

      {error && (
        <div className="mb-4">
          <ErrorAlert
            message={error}
            onClose={() => setError('')}
            autoDismiss={true}
            timeout={5000}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

// ===============================
// Example 5: API Error Display
// ===============================
export const APIErrorExample = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/careers');
      if (!response.ok) {
        throw new Error('Failed to fetch careers');
      }
      const data = await response.json();
      console.log('Data:', data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">API Data Fetching</h2>

      {error && (
        <div className="mb-4">
          <ErrorAlert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        </div>
      )}

      <button
        onClick={fetchData}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
    </div>
  );
};

// ===============================
// Example 6: Multiple Alerts Stack
// ===============================
export const MultipleAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (type) => {
    const messages = {
      error: 'An error occurred while processing your request',
      warning: 'Please review your input before submitting',
      success: 'Operation completed successfully',
      info: 'Here is some helpful information'
    };

    const newAlert = {
      id: Date.now(),
      type,
      message: messages[type]
    };

    setAlerts(prev => [...prev, newAlert]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Multiple Alerts</h2>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => addAlert('error')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Add Error
        </button>
        <button
          onClick={() => addAlert('warning')}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg"
        >
          Add Warning
        </button>
        <button
          onClick={() => addAlert('success')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Add Success
        </button>
        <button
          onClick={() => addAlert('info')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add Info
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map(alert => (
          <ErrorAlert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => removeAlert(alert.id)}
            autoDismiss={true}
            timeout={5000}
          />
        ))}
      </div>
    </div>
  );
};

// ===============================
// Example 7: Persistent Alert (No Auto-dismiss)
// ===============================
export const PersistentAlert = () => {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Persistent Alert</h2>

      {showAlert && (
        <ErrorAlert
          type="warning"
          message="Important: Your account requires verification. Please check your email."
          onClose={() => setShowAlert(false)}
          autoDismiss={false}  // Won't auto-dismiss
        />
      )}

      <div className="mt-6">
        <p className="text-gray-600">
          This alert will remain until manually dismissed by the user.
        </p>
      </div>
    </div>
  );
};

// ===============================
// Example 8: Custom Timeout
// ===============================
export const CustomTimeoutAlert = () => {
  const [show10s, setShow10s] = useState(false);
  const [show3s, setShow3s] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Custom Timeout Alerts</h2>

      <button
        onClick={() => setShow10s(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
      >
        Show 10s Alert
      </button>

      <button
        onClick={() => setShow3s(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Show 3s Alert
      </button>

      {show10s && (
        <ErrorAlert
          type="info"
          message="This alert will dismiss after 10 seconds"
          onClose={() => setShow10s(false)}
          autoDismiss={true}
          timeout={10000}
        />
      )}

      {show3s && (
        <ErrorAlert
          type="success"
          message="This alert will dismiss after 3 seconds"
          onClose={() => setShow3s(false)}
          autoDismiss={true}
          timeout={3000}
        />
      )}
    </div>
  );
};

// ===============================
// Example 9: Global Alert Container
// ===============================
export const GlobalAlertContainer = () => {
  // This would typically be in your App.js or a context provider
  const [globalAlerts, setGlobalAlerts] = useState([]);

  const showGlobalAlert = (type, message) => {
    const alert = {
      id: Date.now(),
      type,
      message
    };
    setGlobalAlerts(prev => [...prev, alert]);
  };

  const removeGlobalAlert = (id) => {
    setGlobalAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Alert Container (Top of screen) */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 space-y-3">
        {globalAlerts.map(alert => (
          <ErrorAlert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => removeGlobalAlert(alert.id)}
            autoDismiss={true}
            timeout={5000}
          />
        ))}
      </div>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto p-6 pt-24">
        <h1 className="text-3xl font-bold mb-6">Global Alert System</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="mb-4">Click buttons to trigger global alerts:</p>

          <div className="flex gap-2">
            <button
              onClick={() => showGlobalAlert('error', 'Global error alert')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Error
            </button>
            <button
              onClick={() => showGlobalAlert('warning', 'Global warning alert')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg"
            >
              Warning
            </button>
            <button
              onClick={() => showGlobalAlert('success', 'Global success alert')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Success
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
