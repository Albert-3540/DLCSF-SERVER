import express from 'express';
import {
  registerChoirMember,
  getChoirMembers,
  getChoirMember,
  updateChoirMember,
  deleteChoirMember,
  getChoirStats
} from '../controllers/choirController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/members', getChoirMembers);
router.get('/members/:id', getChoirMember);
router.get('/stats', getChoirStats);

// Protected routes
router.post('/register', protect, registerChoirMember);
router.put('/members/:id', protect, updateChoirMember);
router.delete('/members/:id', protect, authorize('admin'), deleteChoirMember);

export default router;