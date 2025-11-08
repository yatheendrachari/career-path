import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaRoute, FaBook, FaQuestionCircle, FaChartBar, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🚀</span>
          CareerPath AI
        </Link>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`navbar-menu ${showMobileMenu ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setShowMobileMenu(false)}
          >
            <FaHome /> Home
          </Link>

          {user ? (
            <>
              <Link 
                to="/career-path" 
                className={`nav-link ${isActive('/career-path') ? 'active' : ''}`}
                onClick={() => setShowMobileMenu(false)}
              >
                <FaRoute /> Career Path
              </Link>
              <Link 
                to="/learning-path" 
                className={`nav-link ${isActive('/learning-path') ? 'active' : ''}`}
                onClick={() => setShowMobileMenu(false)}
              >
                <FaBook /> Learning Path
              </Link>
              <Link 
                to="/quiz" 
                className={`nav-link ${isActive('/quiz') ? 'active' : ''}`}
                onClick={() => setShowMobileMenu(false)}
              >
                <FaQuestionCircle /> Quiz
              </Link>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={() => setShowMobileMenu(false)}
              >
                <FaChartBar /> Dashboard
              </Link>

              <div className="nav-user-section">
                <div 
                  className="user-dropdown"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <button className="user-button">
                    <FaUser />
                    <span className="user-name">{user.name}</span>
                  </button>
                  
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="dropdown-name">{user.name}</div>
                          <div className="dropdown-email">{user.email}</div>
                        </div>
                      </div>
                      <hr className="dropdown-divider" />
                      <button 
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="nav-auth-buttons">
              <Link 
                to="/login" 
                className="btn btn-outline nav-btn"
                onClick={() => setShowMobileMenu(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="btn btn-primary nav-btn"
                onClick={() => setShowMobileMenu(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
