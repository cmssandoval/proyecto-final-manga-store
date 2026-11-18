import { Router } from 'express';
import mangaRoutes from './manga.routes.js';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import cartRoutes from './cart.routes.js';
import ordersRoutes from './orders.routes.js';
import presalesRoutes from './cart.routes.js';

const router = Router();

router.use('/mangas', mangaRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', ordersRoutes);
router.use('/presales', presalesRoutes);

export default router;
