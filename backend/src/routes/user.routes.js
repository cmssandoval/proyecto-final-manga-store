import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
} from '../controllers/user.controller.js';
import { authHandler } from '../middlewares/auth-handler.middleware.js';
import asyncHandler from '../middlewares/async-handler.middleware.js';

const router = Router();

router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.get('/me', authHandler, asyncHandler(getProfile));

export default router;