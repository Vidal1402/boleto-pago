const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

// GET /api/dashboard - Buscar dashboard do usuário autenticado
router.get('/', authMiddleware, dashboardController.getDashboard);

// POST /api/dashboard - Criar ou atualizar dashboard do usuário autenticado
router.post('/', authMiddleware, dashboardController.createOrUpdateDashboard);

// DELETE /api/dashboard - Deletar dashboard do usuário autenticado
router.delete('/', authMiddleware, dashboardController.deleteDashboard);

module.exports = router;

