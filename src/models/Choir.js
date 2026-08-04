import mongoose from 'mongoose';

const choirSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'Please provide first name']
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name']
  },
  email: {
    type: String,
    required: [true, 'Please provide email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide phone number']
  },
  voicePart: {
    type: String,
    enum: ['Soprano', 'Alto', 'Tenor', 'Bass', 'Soloist', 'Instrumentalist'],
    required: [true, 'Please select voice part']
  },
  campus: {
    type: String,
    required: [true, 'Please provide campus']
  },
  state: {
    type: String,
    required: [true, 'Please provide state']
  },
  country: {
    type: String,
    required: [true, 'Please provide country']
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
  attendance: [{
    date: Date,
    present: Boolean,
    rehearsal: String
  }],
  performances: [{
    eventName: String,
    date: Date,
    location: String,
    role: String
  }],
  rehearsalSchedule: {
    day: String,
    time: String,
    venue: String
  },
  profileImage: {
    type: String,
    default: 'default-choir-avatar.png'
  }
}, {
  timestamps: true
});

// Index for faster queries
choirSchema.index({ campus: 1, voicePart: 1 });
choirSchema.index({ isActive: 1, isLeader: 1 });

const Choir = mongoose.model('Choir', choirSchema);
export default Choir;