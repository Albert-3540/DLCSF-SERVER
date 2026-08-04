import express from 'express';
import {
  // Member functions
  registerChoirMember,
  getChoirMembers,
  getChoirMember,
  updateChoirMember,
  deleteChoirMember,
  recordAttendance,
  
  // Event functions
  createChoirEvent,
  getChoirEvents,
  getChoirEvent,
  updateChoirEvent,
  deleteChoirEvent,
  addEventParticipant,
  removeEventParticipant,
  
  // Song functions
  addSong,
  getSongs,
  getSong,
  updateSong,
  deleteSong,
  
  // Statistics
  getChoirStats
} from '../controllers/choirController.js';

import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// ===== Public routes =====
router.get('/members', getChoirMembers);
router.get('/members/:id', getChoirMember);
router.get('/events', getChoirEvents);
router.get('/events/:id', getChoirEvent);
router.get('/songs', getSongs);
router.get('/songs/:id', getSong);
router.get('/stats', getChoirStats);

// ===== Protected routes =====
router.use(protect); // All routes below require authentication

// Member routes
router.post('/register', registerChoirMember);
router.put('/members/:id', updateChoirMember);
router.delete('/members/:id', authorize('admin', 'pastor'), deleteChoirMember);
router.post('/attendance', recordAttendance);

// Event routes
router.post('/events', authorize('admin', 'pastor', 'choir-leader'), createChoirEvent);
router.put('/events/:id', authorize('admin', 'pastor', 'choir-leader'), updateChoirEvent);
router.delete('/events/:id', authorize('admin', 'pastor'), deleteChoirEvent);
router.post('/events/:id/participants', addEventParticipant);
router.delete('/events/:id/participants/:memberId', removeEventParticipant);

// Song routes
router.post('/songs', authorize('admin', 'pastor', 'choir-leader'), addSong);
router.put('/songs/:id', authorize('admin', 'pastor', 'choir-leader'), updateSong);
router.delete('/songs/:id', authorize('admin', 'pastor'), deleteSong);

export default router;