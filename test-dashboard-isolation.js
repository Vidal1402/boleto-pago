const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const testDashboardIsolation = async () => {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado ao MongoDB!');
    
    // Buscar usuários existentes
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(`\n👥 Usuários encontrados: ${users.length}`);
    
    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado. Cadastre um usuário primeiro.');
      return;
    }
    
    // Testar isolamento com o primeiro usuário
    const testUser = users[0];
    console.log(`\n🧪 Testando isolamento para usuário: ${testUser.email}`);
    
    // Gerar token para o usuário
    const token = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    
    console.log(`🔑 Token gerado: ${token.substring(0, 20)}...`);
    
    // Verificar dashboards existentes
    const dashboards = await mongoose.connection.db.collection('dashboards').find({}).toArray();
    console.log(`\n📊 Dashboards encontrados: ${dashboards.length}`);
    
    dashboards.forEach((dashboard, index) => {
      console.log(`\n${index + 1}. Dashboard:`);
      console.log(`   ID: ${dashboard._id}`);
      console.log(`   Owner: ${dashboard.owner}`);
      console.log(`   Data: ${JSON.stringify(dashboard.data)}`);
      console.log(`   Criado em: ${dashboard.createdAt}`);
    });
    
    // Testar isolamento
    console.log(`\n🔒 Testando isolamento para usuário ${testUser._id}:`);
    
    const userDashboards = await mongoose.connection.db.collection('dashboards').find({ 
      owner: testUser._id 
    }).toArray();
    
    console.log(`✅ Dashboards do usuário: ${userDashboards.length}`);
    
    if (userDashboards.length > 0) {
      console.log('📊 Dados do dashboard do usuário:');
      userDashboards.forEach((dashboard, index) => {
        console.log(`   ${index + 1}. ID: ${dashboard._id}`);
        console.log(`      Data: ${JSON.stringify(dashboard.data)}`);
      });
    } else {
      console.log('ℹ️  Usuário ainda não possui dashboard');
    }
    
    // Verificar se há dashboards de outros usuários
    const otherDashboards = await mongoose.connection.db.collection('dashboards').find({ 
      owner: { $ne: testUser._id }
    }).toArray();
    
    console.log(`\n🔐 Dashboards de outros usuários: ${otherDashboards.length}`);
    
    if (otherDashboards.length > 0) {
      console.log('⚠️  ATENÇÃO: Existem dashboards de outros usuários!');
      otherDashboards.forEach((dashboard, index) => {
        console.log(`   ${index + 1}. Owner: ${dashboard.owner}`);
        console.log(`      Data: ${JSON.stringify(dashboard.data)}`);
      });
    } else {
      console.log('✅ Isolamento funcionando: Nenhum dashboard de outros usuários encontrado');
    }
    
    await mongoose.disconnect();
    console.log('\n🔌 Conexão encerrada');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
};

testDashboardIsolation();

