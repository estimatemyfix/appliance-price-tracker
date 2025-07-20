import { Router } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { authenticateToken } from '@/middleware/auth';
import * as productController from '@/controllers/productController';

const router = Router();

// GET /api/products/search - Search for products
router.get('/search', asyncHandler(productController.searchProducts));

// GET /api/products/categories - Get all categories
router.get('/categories', asyncHandler(productController.getCategories));

// GET /api/products/:id - Get product details with price history
router.get('/:id', asyncHandler(productController.getProductById));

// POST /api/products/track - Track a product price (requires auth)
router.post('/track', authenticateToken, asyncHandler(productController.trackProduct));

// GET /api/products/:id/recommendations - Get AI recommendations for a product
router.get('/:id/recommendations', asyncHandler(productController.getRecommendations));

// GET /api/products/:id/price-history - Get detailed price history
router.get('/:id/price-history', asyncHandler(productController.getPriceHistory));

export default router; 