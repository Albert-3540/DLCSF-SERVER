import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserRole
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', authorize('admin'), getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.put('/:id/role', authorize('admin'), updateUserRole);

export default router;