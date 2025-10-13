const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  nome_completo: {
    type: String,
    required: [true, 'Nome completo é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    trim: true,
    match: [/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato de telefone inválido. Use: (11) 99999-9999']
  },
  cpf: {
    type: String,
    required: [true, 'CPF é obrigatório'],
    unique: true,
    trim: true,
    match: [/^\d{11}$/, 'CPF deve ter exatamente 11 dígitos']
  }
}, {
  timestamps: true
});

// Middleware para formatar CPF (remover pontos e traços)
profileSchema.pre('save', function(next) {
  if (this.cpf) {
    this.cpf = this.cpf.replace(/\D/g, '');
  }
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
