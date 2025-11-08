import CareerHistory from '../models/CareerHistory.js';
import LearningPath from '../models/LearningPath.js';
import UserStats from '../models/UserStats.js';

/**
 * Get dashboard data for authenticated user
 */
export const getDashboard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userId = req.user._id;

    // Get user stats
    let userStats = await UserStats.findOne({ user: userId });
    if (!userStats) {
      userStats = await UserStats.create({ user: userId });
    }

    // Get career history (latest 5)
    const careerHistory = await CareerHistory.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Get learning paths (latest 5)
    const learningPaths = await LearningPath.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Format career history
    const formattedCareerHistory = careerHistory.map(item => ({
      id: item._id,
      career: item.career_path,
      confidence: item.confidence,
      alternatives: item.alternative_careers,
      date: item.createdAt,
      recommendations: item.recommendations
    }));

    // Format learning paths
    const formattedLearningPaths = learningPaths.map(path => ({
      id: path._id,
      career: path.career_path,
      progress: path.progress,
      date: path.createdAt
    }));

    // Calculate stats
    const stats = {
      total_quizzes_taken: 0, // Can be extended
      average_score: 0, // Can be extended
      topics_covered: [] // Can be extended
    };

    res.json({
      success: true,
      user_info: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        created_at: req.user.createdAt,
        profile_picture: req.user.profilePicture
      },
      career_history: formattedCareerHistory,
      learning_paths: formattedLearningPaths,
      quiz_stats: stats,
      total_assessments: userStats.total_assessments || 0,
      last_activity: userStats.last_assessment_date || null,
      stats: {
        predictions_count: userStats.total_assessments || 0,
        paths_count: userStats.total_learning_paths_generated || 0,
        completion_rate: calculateCompletionRate(learningPaths)
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

/**
 * Calculate completion rate based on learning paths
 */
const calculateCompletionRate = (learningPaths) => {
  if (!learningPaths || learningPaths.length === 0) {
    return 0;
  }

  const totalProgress = learningPaths.reduce((sum, path) => sum + (path.progress || 0), 0);
  return Math.round(totalProgress / learningPaths.length);
};

