import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 60000); // Clean up every minute

export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const key = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  // Initialize or get existing entry
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
  }
  
  store[key].count++;
  
  // Set rate limit headers
  const remaining = Math.max(0, MAX_REQUESTS - store[key].count);
  const resetTime = Math.ceil((store[key].resetTime - now) / 1000);
  
  res.set({
    'X-RateLimit-Limit': MAX_REQUESTS.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetTime.toString(),
  });
  
  // Check if limit exceeded
  if (store[key].count > MAX_REQUESTS) {
    res.status(429).json({
      success: false,
      error: 'Too many requests',
      retryAfter: resetTime,
    });
    return;
  }
  
  next();
}; 