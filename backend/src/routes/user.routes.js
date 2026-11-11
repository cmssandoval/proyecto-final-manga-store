import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
} from '../controllers/user.controller.js';
import authHandler from '../middlewares/auth-handler.middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authHandler, getProfile);

export default router;