const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔄 Tentando conectar ao MongoDB...');
    console.log('📡 URI:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB conectado com sucesso!');
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Testar uma operação simples
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Collections encontradas: ${collections.length}`);
    
    await mongoose.disconnect();
    console.log('🔌 Conexão encerrada');
    
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:');
    console.error('📝 Tipo:', error.name);
    console.error('💬 Mensagem:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n🔧 Possíveis soluções:');
      console.log('1. Verifique se o usuário e senha estão corretos');
      console.log('2. Confirme se o usuário tem permissões no banco');
      console.log('3. Verifique se o IP está autorizado no MongoDB Atlas');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 Possíveis soluções:');
      console.log('1. Verifique se o nome do cluster está correto');
      console.log('2. Confirme se a string de conexão está completa');
    }
  }
};

testConnection();
