import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import * as authController from '@/controllers/authController';

const router = Router();

// POST /api/auth/register - Register new user
router.post('/register', asyncHandler(authController.register));

// POST /api/auth/login - Login user
router.post('/login', asyncHandler(authController.login));

// POST /api/auth/forgot-password - Send password reset email
router.post('/forgot-password', asyncHandler(authController.forgotPassword));

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', asyncHandler(authController.resetPassword));

// POST /api/auth/verify-email - Verify email address
router.post('/verify-email', asyncHandler(authController.verifyEmail));

export default router; 