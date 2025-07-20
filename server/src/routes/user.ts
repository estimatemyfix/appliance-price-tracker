import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';
import * as userController from '../controllers/userController';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

// GET /api/user/profile - Get user profile
router.get('/profile', asyncHandler(userController.getProfile));

// PUT /api/user/profile - Update user profile
router.put('/profile', asyncHandler(userController.updateProfile));

// GET /api/user/alerts - Get user's price alerts
router.get('/alerts', asyncHandler(userController.getAlerts));

// PUT /api/user/alerts/:id - Update price alert
router.put('/alerts/:id', asyncHandler(userController.updateAlert));

// DELETE /api/user/alerts/:id - Delete price alert
router.delete('/alerts/:id', asyncHandler(userController.deleteAlert));

// GET /api/user/dashboard - Get dashboard data
router.get('/dashboard', asyncHandler(userController.getDashboard));

export default router; 