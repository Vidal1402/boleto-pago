const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Verificar se o token existe no header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido'
      });
    }

    // Extrair o token
    const token = authHeader.substring(7); // Remove "Bearer "

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar o usuário no banco
    const user = await User.findById(decoded.userId).select('-senha');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido - usuário não encontrado'
      });
    }

    // Adicionar o usuário ao request
    req.user = user;
    next();

  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = authMiddleware;
