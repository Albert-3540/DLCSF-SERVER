import mongoose from 'mongoose';

const choirMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  voicePart: {
    type: String,
    enum: ['Soprano', 'Alto', 'Tenor', 'Bass', 'Soloist', 'Instrumentalist'],
    required: [true, 'Voice part is required'],
  },
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
    default: 'Intermediate',
  },
  musicalSkills: [{
    type: String,
    enum: ['Vocal', 'Piano', 'Guitar', 'Drums', 'Bass Guitar', 'Keyboard', 'Other'],
  }],
  campus: {
    type: String,
    required: [true, 'Campus is required'],
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isLeader: {
    type: Boolean,
    default: false,
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
  testimony: {
    type: String,
  },
}, {
  timestamps: true,
});

const ChoirMember = mongoose.model('ChoirMember', choirMemberSchema);
export default ChoirMember;