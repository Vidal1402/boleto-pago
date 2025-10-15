const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Dashboard = require('../models/Dashboard');

// Gerar token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Registrar novo usuário
const register = async (req, res) => {
  try {
    const { nome_completo, email, telefone, cpf, senha } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }

    // Verificar se CPF já existe
    const existingProfile = await Profile.findOne({ cpf });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'CPF já está em uso'
      });
    }

    // Criar usuário
    const user = new User({ email, senha });
    await user.save();

    // Criar perfil
    const profile = new Profile({
      userId: user._id,
      nome_completo,
      telefone,
      cpf
    });
    await profile.save();

    // Criar dashboard automaticamente para o usuário
    const dashboard = new Dashboard({
      owner: user._id,
      data: {
        boletos: [],
        configuracoes: {
          tema: 'claro',
          notificacoes: true,
          idioma: 'pt-BR'
        },
        metas: [],
        estatisticas: {
          totalBoletos: 0,
          boletosPagos: 0,
          boletosPendentes: 0,
          valorTotal: 0
        }
      }
    });
    await dashboard.save();

    // Gerar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          profile: {
            nome_completo: profile.nome_completo,
            telefone: profile.telefone,
            cpf: profile.cpf
          }
        }
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    
    // Se for erro de duplicação do MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} já está em uso`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Login do usuário
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Buscar usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(senha);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Buscar perfil
    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      return res.status(500).json({
        success: false,
        message: 'Perfil não encontrado'
      });
    }

    // Gerar token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          profile: {
            nome_completo: profile.nome_completo,
            telefone: profile.telefone,
            cpf: profile.cpf
          }
        }
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Obter perfil do usuário autenticado
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil não encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          email: req.user.email,
          profile: {
            nome_completo: profile.nome_completo,
            telefone: profile.telefone,
            cpf: profile.cpf
          }
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
