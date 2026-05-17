import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

const signToken = (id: string, role: string) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string,
  } as jwt.SignOptions);

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) throw new AppError('Email already registered', 409);
    const user = await User.create({ name, email, password, role: role || 'sales' });
    const token = signToken(user._id.toString(), user.role);
    res.status(201).json({
      success: true,
      message: 'Account created',
      data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (e) { next(e); }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) throw new AppError('Invalid credentials', 401);
    const token = signToken(user._id.toString(), user.role);
    res.status(200).json({
      success: true,
      message: 'Welcome back',
      data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (e) { next(e); }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) throw new AppError('User not found', 404);
    res.status(200).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { next(e); }
};
