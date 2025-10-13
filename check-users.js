const mongoose = require('mongoose');
require('dotenv').config();

const testUsers = async () => {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado ao MongoDB!');
    
    // Buscar usuários
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(`\n👥 Total de usuários: ${users.length}`);
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Usuário:`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Criado em: ${user.createdAt}`);
    });
    
    // Buscar perfis
    const profiles = await mongoose.connection.db.collection('profiles').find({}).toArray();
    console.log(`\n👤 Total de perfis: ${profiles.length}`);
    
    profiles.forEach((profile, index) => {
      console.log(`\n${index + 1}. Perfil:`);
      console.log(`   ID: ${profile._id}`);
      console.log(`   Nome: ${profile.nome_completo}`);
      console.log(`   Email: ${profile.email || 'N/A'}`);
      console.log(`   Telefone: ${profile.telefone}`);
      console.log(`   CPF: ${profile.cpf}`);
      console.log(`   Criado em: ${profile.createdAt}`);
    });
    
    await mongoose.disconnect();
    console.log('\n🔌 Conexão encerrada');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
};

testUsers();
