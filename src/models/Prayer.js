import mongoose from 'mongoose';

const prayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  request: {
    type: String,
    required: [true, 'Prayer request is required'],
  },
  isAnswered: {
    type: Boolean,
    default: false,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  prayedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  prayedCount: {
    type: Number,
    default: 0,
  },
  answeredDate: Date,
}, {
  timestamps: true,
});

const Prayer = mongoose.model('Prayer', prayerSchema);
export default Prayer;