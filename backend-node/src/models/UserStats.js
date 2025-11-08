import mongoose from 'mongoose';

const userStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    unique: true
  },
  total_assessments: {
    type: Number,
    default: 0
  },
  total_learning_paths_generated: {
    type: Number,
    default: 0
  },
  total_resumes_uploaded: {
    type: Number,
    default: 0
  },
  last_assessment_date: {
    type: Date,
    default: null
  },
  last_resume_upload_date: {
    type: Date,
    default: null
  },
  last_learning_path_date: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
userStatsSchema.index({ user: 1 });

const UserStats = mongoose.model('UserStats', userStatsSchema);

export default UserStats;

