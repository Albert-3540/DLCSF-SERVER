import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide song title']
  },
  composer: {
    type: String,
    required: [true, 'Please provide composer']
  },
  arranger: {
    type: String
  },
  genre: {
    type: String,
    enum: ['Gospel', 'Hymn', 'Contemporary', 'Classical', 'Spiritual', 'Traditional'],
    required: true
  },
  key: {
    type: String,
    enum: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  },
  tempo: {
    type: Number
  },
  timeSignature: {
    type: String,
    default: '4/4'
  },
  lyrics: {
    type: String
  },
  chords: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Advanced'],
    default: 'Medium'
  },
  parts: {
    soprano: String,
    alto: String,
    tenor: String,
    bass: String
  },
  audioUrl: {
    type: String
  },
  sheetMusicUrl: {
    type: String
  },
  tags: [{
    type: String
  }],
  categories: [{
    type: String,
    enum: ['Worship', 'Praise', 'Meditation', 'Celebration', 'Revival', 'Intercession']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  performancesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Text search index
songSchema.index({ title: 'text', composer: 'text', tags: 'text' });

const Song = mongoose.model('Song', songSchema);
export default Song;