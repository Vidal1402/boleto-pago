const mongoose = require('mongoose');
require('dotenv').config();

const testQuick = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
    
    const User = require('./models/User');
    const Profile = require('./models/Profile');
    const Dashboard = require('./models/Dashboard');
    
    // Verificar usuários existentes
    const users = await User.find({});
    console.log(`👥 Usuários encontrados: ${users.length}`);
    
    // Verificar dashboards existentes
    const dashboards = await Dashboard.find({});
    console.log(`📊 Dashboards encontrados: ${dashboards.length}`);
    
    if (users.length > 0 && dashboards.length === 0) {
      console.log('⚠️  Usuários existem mas não têm dashboards');
      console.log('💡 Dashboards serão criados automaticamente no próximo acesso');
    } else if (users.length === dashboards.length) {
      console.log('✅ Todos os usuários têm dashboards!');
    } else {
      console.log('ℹ️  Alguns usuários podem não ter dashboards ainda');
    }
    
    // Mostrar estrutura de um dashboard se existir
    if (dashboards.length > 0) {
      const dashboard = dashboards[0];
      console.log('\n📋 Estrutura do dashboard:');
      console.log(`   ID: ${dashboard._id}`);
      console.log(`   Owner: ${dashboard.owner}`);
      console.log(`   Dados: ${JSON.stringify(dashboard.data, null, 2)}`);
    }
    
    await mongoose.disconnect();
    console.log('\n🔌 Conexão encerrada');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
};

testQuick();

