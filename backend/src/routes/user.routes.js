import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
} from '../controllers/user.controller.js';
import authHandler from '../middlewares/auth-handler.middleware.js';

const router = Router();

//* Renombrar las rutas siguiendo el contrato de datos,
//* lo mismo en las peticiones del frontend, el cliente muestra
//* información en español, pero la api maneja todos los nombres
//* en inglés.
router.post('/registro', registerUser);
router.post('/login', loginUser);
router.get('/perfil', authHandler, getProfile);

export default router;