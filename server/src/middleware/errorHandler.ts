import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@/types';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Default error
  let statusCode = 500;
  let message = 'Internal server error';

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Validation errors (from Joi)
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
  }
  
  // Database errors
  else if (error.message?.includes('duplicate key')) {
    statusCode = 409;
    message = 'Resource already exists';
  } else if (error.message?.includes('foreign key')) {
    statusCode = 400;
    message = 'Invalid reference to related resource';
  }
  
  // Custom API errors
  else if (error.name === 'ApiError') {
    statusCode = (error as any).statusCode || 500;
    message = error.message;
  }

  const response: ApiResponse = {
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  };

  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response: ApiResponse = {
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  };
  res.status(404).json(response);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Custom API Error class
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
} 