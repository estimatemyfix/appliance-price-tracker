import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import * as blogController from '../controllers/blogController';

const router = Router();

// GET /api/blog - Get published blog posts
router.get('/', asyncHandler(blogController.getPosts));

// GET /api/blog/:slug - Get single blog post
router.get('/:slug', asyncHandler(blogController.getPostBySlug));

export default router; 