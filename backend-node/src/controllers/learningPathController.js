import LearningPath from '../models/LearningPath.js';
import UserStats from '../models/UserStats.js';
import { generateLearningPath } from '../services/mlService.js';
import { generateLearningPathWithAI } from '../services/openaiService.js';

/**
 * Generate learning path using OpenAI with fallback
 */
export const generatePath = async (req, res) => {
  try {
    const { career_path, current_skills, experience_level, time_commitment, learning_style } = req.body;

    // Validation
    if (!career_path || !current_skills || !experience_level || !time_commitment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide career_path, current_skills, experience_level, and time_commitment'
      });
    }

    // Prepare input data
    const inputData = {
      career_path,
      current_skills: Array.isArray(current_skills) ? current_skills : [current_skills],
      experience_level,
      time_commitment,
      learning_style: learning_style || 'online'
    };

    console.log('Attempting to generate learning path with OpenAI...');

    // Try to generate learning path with OpenAI first
    let result = await generateLearningPathWithAI(inputData);

    // If OpenAI fails or is not configured, fall back to local generation
    if (!result.success || result.useFallback) {
      console.log('Using fallback learning path generation...');
      result = await generateLearningPath(inputData);
    }

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error || 'Failed to generate learning path'
      });
    }

    res.json({
      success: true,
      ...result.data
    });
  } catch (error) {
    console.error('Generate learning path error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating learning path',
      error: error.message
    });
  }
};

/**
 * Save learning path to database
 */
export const saveLearningPath = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { career_path, learning_path_data, input_data } = req.body;

    if (!career_path || !learning_path_data) {
      return res.status(400).json({
        success: false,
        message: 'Please provide career_path and learning_path_data'
      });
    }

    const learningPath = await LearningPath.create({
      user: req.user._id,
      career_path,
      learning_path_data,
      input_data: input_data || {},
      progress: 0,
      completed_phases: []
    });

    // Update user stats
    await UserStats.findOneAndUpdate(
      { user: req.user._id },
      {
        $inc: { total_learning_paths_generated: 1 },
        $set: { last_learning_path_date: new Date() }
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Learning path saved successfully',
      path_id: learningPath._id,
      learning_path: {
        id: learningPath._id,
        career_path: learningPath.career_path,
        progress: learningPath.progress,
        created_at: learningPath.createdAt
      }
    });
  } catch (error) {
    console.error('Save learning path error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving learning path',
      error: error.message
    });
  }
};

/**
 * Get learning path history for authenticated user
 */
export const getLearningPathHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const learningPaths = await LearningPath.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const formattedPaths = learningPaths.map(path => ({
      id: path._id,
      career_path: path.career_path,
      progress: path.progress,
      completed_phases: path.completed_phases,
      learning_phases: path.learning_path_data?.learning_phases || [],
      overview: path.learning_path_data?.overview,
      created_at: path.createdAt
    }));

    res.json({
      success: true,
      paths: formattedPaths
    });
  } catch (error) {
    console.error('Get learning path history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching learning path history',
      error: error.message
    });
  }
};

/**
 * Delete a learning path
 */
export const deleteLearningPath = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { id } = req.params;

    const learningPath = await LearningPath.findOne({
      _id: id,
      user: req.user._id
    });

    if (!learningPath) {
      return res.status(404).json({
        success: false,
        message: 'Learning path not found'
      });
    }

    await LearningPath.deleteOne({ _id: id });

    res.json({
      success: true,
      message: 'Learning path deleted successfully'
    });
  } catch (error) {
    console.error('Delete learning path error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting learning path',
      error: error.message
    });
  }
};

