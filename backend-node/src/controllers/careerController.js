import CareerHistory from '../models/CareerHistory.js';
import UserStats from '../models/UserStats.js';
import { predictCareer, getCareers } from '../services/mlService.js';

/**
 * Get list of available careers
 */
export const getCareersList = async (req, res) => {
  try {
    const result = await getCareers();
    
    if (result.success) {
      res.json(result.data);
    } else {
      res.status(500).json({
        success: false,
        message: result.error || 'Failed to fetch careers'
      });
    }
  } catch (error) {
    console.error('Get careers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching careers',
      error: error.message
    });
  }
};

/**
 * Predict career based on user input
 */
export const predictCareerPath = async (req, res) => {
  try {
    const { education, years_experience, skills, interests, certifications, preferred_industry } = req.body;

    // Validation
    if (!education || years_experience === undefined || !skills || !interests) {
      return res.status(400).json({
        success: false,
        message: 'Please provide education, years_experience, skills, and interests'
      });
    }

    // Prepare input data for ML service
    const inputData = {
      education,
      years_experience: parseInt(years_experience),
      skills: Array.isArray(skills) ? skills : [skills],
      interests: Array.isArray(interests) ? interests : [interests],
      certifications: certifications || [],
      preferred_industry: preferred_industry || ''
    };

    // Call ML service
    const result = await predictCareer(inputData);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error || 'Failed to get prediction'
      });
    }

    const prediction = result.data;

    // Save to database if user is authenticated
    if (req.user) {
      const careerHistory = await CareerHistory.create({
        user: req.user._id,
        career_path: prediction.primary_career,
        confidence: prediction.confidence,
        alternative_careers: prediction.alternative_careers || [],
        input_data: inputData,
        skills_match: prediction.skills_match || 0,
        recommendations: prediction.recommendations || []
      });

      // Update user stats
      await UserStats.findOneAndUpdate(
        { user: req.user._id },
        {
          $inc: { total_assessments: 1 },
          $set: { last_assessment_date: new Date() }
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      success: true,
      ...prediction
    });
  } catch (error) {
    console.error('Predict career error:', error);
    res.status(500).json({
      success: false,
      message: 'Error predicting career',
      error: error.message
    });
  }
};

/**
 * Get career history for authenticated user
 */
export const getCareerHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const careerHistory = await CareerHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const formattedHistory = careerHistory.map(item => ({
      id: item._id,
      career_path: item.career_path,
      confidence: item.confidence,
      alternative_careers: item.alternative_careers,
      recommendations: item.recommendations,
      created_at: item.createdAt,
      input_data: item.input_data
    }));

    res.json({
      success: true,
      history: formattedHistory
    });
  } catch (error) {
    console.error('Get career history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching career history',
      error: error.message
    });
  }
};

/**
 * Delete a career history entry
 */
export const deleteCareerHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { id } = req.params;

    const careerHistory = await CareerHistory.findOne({
      _id: id,
      user: req.user._id
    });

    if (!careerHistory) {
      return res.status(404).json({
        success: false,
        message: 'Career history not found'
      });
    }

    await CareerHistory.deleteOne({ _id: id });

    res.json({
      success: true,
      message: 'Career history deleted successfully'
    });
  } catch (error) {
    console.error('Delete career history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting career history',
      error: error.message
    });
  }
};

