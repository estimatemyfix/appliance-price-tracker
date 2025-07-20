import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { authenticateToken } from '@/middleware/auth';
import * as adminController from '@/controllers/adminController';

const router = Router();

// All admin routes require authentication
// TODO: Add admin role check middleware
router.use(authenticateToken);

// GET /api/admin/retailers - Get all retailers
router.get('/retailers', asyncHandler(adminController.getRetailers));

// POST /api/admin/retailers - Add new retailer
router.post('/retailers', asyncHandler(adminController.addRetailer));

// PUT /api/admin/retailers/:id - Update retailer
router.put('/retailers/:id', asyncHandler(adminController.updateRetailer));

// GET /api/admin/scraping/status - Get scraping status
router.get('/scraping/status', asyncHandler(adminController.getScrapingStatus));

// POST /api/admin/scraping/trigger - Manually trigger scraping
router.post('/scraping/trigger', asyncHandler(adminController.triggerScraping));

// GET /api/admin/dashboard - Get admin dashboard stats
router.get('/dashboard', asyncHandler(adminController.getDashboard));

export default router; 