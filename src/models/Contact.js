import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  subject: {
    type: String,
    trim: true,
    maxLength: [200, 'Subject cannot exceed 200 characters'],
    default: 'General Inquiry'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxLength: [5000, 'Message cannot exceed 5000 characters']
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied'],
    default: 'unread'
  },
  reply: {
    type: String,
    maxLength: [5000, 'Reply cannot exceed 5000 characters']
  },
  repliedAt: {
    type: Date
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;