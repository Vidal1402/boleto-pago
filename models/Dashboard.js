const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Cada usuário tem apenas um dashboard
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware para atualizar lastUpdated antes de salvar
dashboardSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Índice para melhor performance nas consultas por owner
dashboardSchema.index({ owner: 1 });

module.exports = mongoose.model('Dashboard', dashboardSchema);

