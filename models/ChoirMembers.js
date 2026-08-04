import mongoose from 'mongoose';

const choirMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  voicePart: {
    type: String,
    enum: ['Soprano', 'Alto', 'Tenor', 'Bass', 'Soloist', 'Instrumentalist'],
    required: [true, 'Please select your voice part']
  },
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
    default: 'Intermediate'
  },
  musicalSkills: [{
    type: String,
    enum: ['Vocal', 'Piano', 'Guitar', 'Drums', 'Bass Guitar', 'Keyboard', 'Other']
  }],
  availability: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    timePreference: {
      type: String,
      enum: ['Morning', 'Afternoon', 'Evening', 'Any']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isLeader: {
    type: Boolean,
    default: false
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  testimony: {
    type: String,
    maxLength: [1000, 'Testimony cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes
choirMemberSchema.index({ user: 1 });
choirMemberSchema.index({ voicePart: 1, isActive: 1 });

export const ChoirMember = mongoose.model('ChoirMember', choirMemberSchema);
export default ChoirMember;