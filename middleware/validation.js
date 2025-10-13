const { body, validationResult } = require('express-validator');

// Validações para registro
const registerValidation = [
  body('nome_completo')
    .notEmpty()
    .withMessage('Nome completo é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('telefone')
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Formato de telefone inválido. Use: (11) 99999-9999'),
  
  body('cpf')
    .matches(/^\d{11}$/)
    .withMessage('CPF deve ter exatamente 11 dígitos'),
  
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
];

// Validações para login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

// Middleware para verificar erros de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  handleValidationErrors
};
