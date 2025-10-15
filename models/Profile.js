
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
    validate: {
      validator: function(v) {
        // Aceita tanto formato (11) 99999-9999 quanto apenas números
        return /^(\(\d{2}\)\s\d{4,5}-\d{4}|\d{10,11})$/.test(v);
      },
      message: 'Telefone deve ter formato (11) 99999-9999 ou apenas números (10-11 dígitos)'
    }
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

// Middleware para formatar CPF e telefone
profileSchema.pre('save', function(next) {
  if (this.cpf) {
    this.cpf = this.cpf.replace(/\D/g, '');
  }
  
  if (this.telefone) {
    // Se telefone tem apenas números, formatar automaticamente
    const numeros = this.telefone.replace(/\D/g, '');
    if (numeros.length === 11) {
      this.telefone = `(${numeros.substring(0,2)}) ${numeros.substring(2,7)}-${numeros.substring(7)}`;
    } else if (numeros.length === 10) {
      this.telefone = `(${numeros.substring(0,2)}) ${numeros.substring(2,6)}-${numeros.substring(6)}`;
    }
  }
  
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
