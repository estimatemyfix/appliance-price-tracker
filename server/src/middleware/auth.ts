import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '@/config/database';
import { ApiError } from '@/middleware/errorHandler';
import { User, JwtPayload } from '@/types';

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new ApiError(401, 'Access token required');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new ApiError(500, 'JWT secret not configured');
    }

    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    // Get user from database
    const userResult = await query(
      'SELECT * FROM users WHERE id = $1 AND email = $2',
      [decoded.userId, decoded.email]
    );

    if (userResult.rows.length === 0) {
      throw new ApiError(401, 'Invalid token - user not found');
    }

    const user: User = userResult.rows[0];

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, 'Invalid token');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Token expired');
    } else {
      console.error('Auth middleware error:', error);
      throw new ApiError(500, 'Authentication failed');
    }
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      // If token provided, authenticate
      await authenticateToken(req, res, next);
    } else {
      // If no token, continue without authentication
      next();
    }
  } catch (error) {
    // For optional auth, continue even if token is invalid
    next();
  }
};

export const requirePremium = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  if (!req.user.is_premium) {
    throw new ApiError(403, 'Premium subscription required');
  }

  next();
}; 