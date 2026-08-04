import express from 'express';
import {
  submitContact,
  getContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  getContactStats
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// ============================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================

// @route   POST /api/contact
// @desc    Submit a contact message
// @access  Public
router.post('/', submitContact);

// ============================================================
// PROTECTED ROUTES (Authentication required)
// ============================================================

// All routes below require authentication
router.use(protect);

// @route   GET /api/contact
// @desc    Get all contact messages (Admin only)
// @access  Admin
router.get('/', authorize('admin'), getContacts);

// @route   GET /api/contact/stats
// @desc    Get contact statistics (Admin only)
// @access  Admin
router.get('/stats', authorize('admin'), getContactStats);

// @route   GET /api/contact/:id
// @desc    Get a single contact message (Admin only)
// @access  Admin
router.get('/:id', authorize('admin'), getContact);

// @route   PUT /api/contact/:id
// @desc    Update contact message status (Admin only)
// @access  Admin
router.put('/:id', authorize('admin'), updateContactStatus);

// @route   DELETE /api/contact/:id
// @desc    Delete a contact message (Admin only)
// @access  Admin
router.delete('/:id', authorize('admin'), deleteContact);

export default router;