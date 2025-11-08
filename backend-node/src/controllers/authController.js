import User from '../models/User.js';
import UserStats from '../models/UserStats.js';
import { generateToken } from '../utils/jwt.js';
import { checkDBConnection } from '../config/database.js';

/**
 * Register a new user
 */
export const signup = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (!checkDBConnection()) {
      return res.status(503).json({
        success: false,
        message: 'Database is not available. Please ensure MongoDB is running.',
        error: 'MongoDB connection required'
      });
    }

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email.toLowerCase() });
    } catch (dbError) {
      return res.status(503).json({
        success: false,
        message: 'Database is not available. Please ensure MongoDB is running.',
        error: 'MongoDB connection required'
      });
    }
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    let user;
    try {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password
      });
    } catch (dbError) {
      return res.status(503).json({
        success: false,
        message: 'Database is not available. Please ensure MongoDB is running.',
        error: 'MongoDB connection required'
      });
    }

    // Create user stats
    try {
      await UserStats.create({
        user: user._id
      });
    } catch (dbError) {
      // If stats creation fails, still return success (user was created)
      console.error('Failed to create user stats:', dbError.message);
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      access_token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Check if it's a MongoDB connection error
    if (error.name === 'MongoServerError' || error.message.includes('MongoServerError') || error.message.includes('connection')) {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please ensure MongoDB is running.',
        error: 'MongoDB connection failed'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (!checkDBConnection()) {
      return res.status(503).json({
        success: false,
        message: 'Database is not available. Please ensure MongoDB is running.',
        error: 'MongoDB connection required'
      });
    }

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      access_token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

/**
 * Get current user profile
 */
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

