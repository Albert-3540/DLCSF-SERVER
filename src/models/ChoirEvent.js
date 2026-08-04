import mongoose from 'mongoose';

const choirEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title']
  },
  description: {
    type: String,
    required: [true, 'Please provide event description']
  },
  type: {
    type: String,
    enum: ['Rehearsal', 'Performance', 'Concert', 'Competition', 'Special Service', 'Workshop'],
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide event date']
  },
  time: {
    type: String,
    required: [true, 'Please provide event time']
  },
  venue: {
    type: String,
    required: [true, 'Please provide venue']
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String
  },
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Choir'
  }],
  repertoire: [{
    songTitle: String,
    composer: String,
    arrangement: String,
    key: String
  }],
  requirements: {
    dressCode: String,
    preparation: String,
    specialNotes: String
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  maxParticipants: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for queries
choirEventSchema.index({ date: 1, status: 1 });
choirEventSchema.index({ type: 1 });

const ChoirEvent = mongoose.model('ChoirEvent', choirEventSchema);
export default ChoirEvent;