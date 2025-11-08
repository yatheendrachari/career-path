import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


  // Setup axios interceptor for 401 errors (token expiry)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && token) {
          console.log('Token expired or invalid - logging out');
          logout();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token]);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Error parsing stored user:', err);
        }
      }

      // Verify token is still valid
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Verify token validity
  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${tokenToVerify || token}`
        }
      });

      setUser(response.data);
      setIsAuthenticated(true);

      // Update localStorage with fresh user data
      localStorage.setItem('user', JSON.stringify(response.data));

    } catch (error) {
      console.error('Token verification failed:', error);
      // Token is invalid, clear auth state
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { access_token, user: userData } = response.data;

      // Store token and user
      setToken(access_token);
      setUser(userData);
      setIsAuthenticated(true);

      // Persist to localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return { success: true, user: userData };

    } catch (error) {
      console.error('Login error:', error);

      const errorMessage = error.response?.data?.detail
        || error.response?.data?.message
        || 'Login failed. Please check your credentials.';

      return { success: false, error: errorMessage };
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        name,
        email,
        password
      });

      const { access_token, user: userData } = response.data;

      // Store token and user
      setToken(access_token);
      setUser(userData);
      setIsAuthenticated(true);

      // Persist to localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return { success: true, user: userData };

    } catch (error) {
      console.error('Signup error:', error);

      const errorMessage = error.response?.data?.detail
        || error.response?.data?.message
        || 'Signup failed. Please try again.';

      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update user profile
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  // Refresh user data from server
  const refreshUser = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));

      return { success: true, user: response.data };

    } catch (error) {
      console.error('Failed to refresh user:', error);
      return { success: false, error: 'Failed to refresh user data' };
    }
  };

  // Context value
  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    verifyToken,
    updateUser,
    refreshUser,
    API_BASE_URL
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
