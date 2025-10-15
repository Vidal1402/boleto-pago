const Dashboard = require('../models/Dashboard');

// GET /api/dashboard - Buscar dashboard do usuário autenticado
const getDashboard = async (req, res) => {
  try {
    // ISOLAMENTO: Apenas dados do usuário autenticado
    let dashboard = await Dashboard.findOne({ owner: req.user.id });
    
    // Se não existir dashboard, criar automaticamente
    if (!dashboard) {
      dashboard = await Dashboard.create({
        owner: req.user.id,
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
    }

    res.json({
      success: true,
      data: {
        id: dashboard._id,
        owner: dashboard.owner,
        data: dashboard.data,
        lastUpdated: dashboard.lastUpdated,
        createdAt: dashboard.createdAt,
        updatedAt: dashboard.updatedAt
      }
    });

  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// POST /api/dashboard - Criar ou atualizar dashboard do usuário autenticado
const createOrUpdateDashboard = async (req, res) => {
  try {
    const { data } = req.body;

    // ISOLAMENTO: Forçar owner como req.user.id (não aceitar do body)
    let dashboard = await Dashboard.findOne({ owner: req.user.id });
    
    if (dashboard) {
      // Atualizar dashboard existente
      dashboard.data = data;
      await dashboard.save();
    } else {
      // Criar novo dashboard
      dashboard = await Dashboard.create({ 
        owner: req.user.id, 
        data 
      });
    }

    res.status(200).json({
      success: true,
      message: dashboard.updatedAt > dashboard.createdAt ? 'Dashboard atualizado com sucesso' : 'Dashboard criado com sucesso',
      data: {
        id: dashboard._id,
        owner: dashboard.owner,
        data: dashboard.data,
        lastUpdated: dashboard.lastUpdated,
        createdAt: dashboard.createdAt,
        updatedAt: dashboard.updatedAt
      }
    });

  } catch (error) {
    console.error('Erro ao criar/atualizar dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// DELETE /api/dashboard - Deletar dashboard do usuário autenticado
const deleteDashboard = async (req, res) => {
  try {
    // ISOLAMENTO: Apenas deletar dashboard do usuário autenticado
    const dashboard = await Dashboard.findOneAndDelete({ owner: req.user.id });
    
    if (!dashboard) {
      return res.status(404).json({
        success: false,
        message: 'Dashboard não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Dashboard deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  getDashboard,
  createOrUpdateDashboard,
  deleteDashboard
};
