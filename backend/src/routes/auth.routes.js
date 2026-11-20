import { Router } from 'express';
import {
    registerUser,
    loginUser,
} from '../controllers/auth.controller.js';
import asyncHandler from '../middlewares/async-handler.middleware.js';

const router = Router();

router.post('/login', asyncHandler(loginUser));
router.post('/register', asyncHandler(registerUser));

export default router;
