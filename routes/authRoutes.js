// authRoutes.js
import express from 'express';
import { registerAdmin, register, login } from '../controllers/authController.js';

const router = express.Router();

// Rutas de autenticación
router.post('/registerAdmin', registerAdmin); // Registro de administrador
router.post('/register', register); // Registro de usuario
router.post('/login', login); // Inicio de sesión

export default router;
