import mongoose from 'mongoose';
import { hashPassword, comparePassword } from '../utils/password.js';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxLength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxLength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['member', 'choir_leader', 'pastor', 'admin'],
    default: 'member'
  },
  campus: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: {
    type: String,
    maxLength: [500, 'Bio cannot exceed 500 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpire: Date,
  refreshToken: String,
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    emailUpdates: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await comparePassword(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Get initials
userSchema.virtual('initials').get(function() {
  return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
});

// Indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ country: 1, campus: 1 });
userSchema.index({ role: 1 });

export const User = mongoose.model('User', userSchema);
export default User;