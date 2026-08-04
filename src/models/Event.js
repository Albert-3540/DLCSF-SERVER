import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  type: {
    type: String,
    enum: ['worship', 'prayer', 'fellowship', 'conference', 'choir', 'other'],
    required: true,
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
  },
  location: {
    address: String,
    city: String,
    country: String,
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  maxAttendees: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);
export default Event;