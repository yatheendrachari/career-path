import mongoose from 'mongoose';

const careerHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  career_path: {
    type: String,
    required: [true, 'Career path is required']
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  alternative_careers: [{
    career: String,
    confidence: Number
  }],
  input_data: {
    education: String,
    years_experience: Number,
    skills: [String],
    interests: [String],
    certifications: [String],
    preferred_industry: String
  },
  skills_match: {
    type: Number,
    default: 0
  },
  recommendations: [String]
}, {
  timestamps: true
});

// Index for faster queries
careerHistorySchema.index({ user: 1, createdAt: -1 });

const CareerHistory = mongoose.model('CareerHistory', careerHistorySchema);

export default CareerHistory;

