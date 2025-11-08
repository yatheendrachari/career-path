import mongoose from 'mongoose';

const learningPathSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  career_path: {
    type: String,
    required: [true, 'Career path is required']
  },
  learning_path_data: {
    overview: String,
    learning_phases: [{
      phase: String,
      duration: String,
      topics: [String]
    }],
    skills_to_acquire: [String],
    certifications: [String],
    job_search_tips: [String],
    salary_insights: {
      entry: String,
      mid: String,
      senior: String
    }
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed_phases: [String],
  input_data: {
    career_path: String,
    current_skills: [String],
    experience_level: String,
    time_commitment: String,
    learning_style: String
  }
}, {
  timestamps: true
});

// Index for faster queries
learningPathSchema.index({ user: 1, createdAt: -1 });

const LearningPath = mongoose.model('LearningPath', learningPathSchema);

export default LearningPath;

