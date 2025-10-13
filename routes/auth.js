const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { registerValidation, loginValidation, handleValidationErrors } = require('../middleware/validation');

// POST /api/auth/register - Cadastrar novo usuário
router.post('/register', registerValidation, handleValidationErrors, authController.register);

// POST /api/auth/login - Fazer login
router.post('/login', loginValidation, handleValidationErrors, authController.login);

// GET /api/auth/profile - Obter perfil do usuário autenticado
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
