import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/config/database';
import { ApiError } from '@/middleware/errorHandler';
import { CreateUserRequest, LoginRequest, User } from '@/types';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, first_name, last_name }: CreateUserRequest = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  try {
    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new ApiError(409, 'User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const insertResult = await query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, created_at',
      [email, hashedPassword, first_name, last_name]
    );

    const user = insertResult.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, is_premium: false },
      process.env.JWT_SECRET || 'default-secret-key-for-development',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          created_at: user.created_at
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to register user');
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: LoginRequest = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  try {
    // Find user
    const userResult = await query(
      'SELECT id, email, password_hash, first_name, last_name, is_premium FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const user: User = userResult.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, is_premium: user.is_premium },
      process.env.JWT_SECRET || 'default-secret-key-for-development',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          is_premium: user.is_premium
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to login');
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  // Placeholder implementation
  res.json({
    success: true,
    message: 'Password reset functionality not yet implemented'
  });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  // Placeholder implementation
  res.json({
    success: true,
    message: 'Password reset functionality not yet implemented'
  });
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  // Placeholder implementation
  res.json({
    success: true,
    message: 'Email verification functionality not yet implemented'
  });
}; 