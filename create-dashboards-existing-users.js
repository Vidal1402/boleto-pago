const mongoose = require('mongoose');
require('dotenv').config();

const createDashboardsForExistingUsers = async () => {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado ao MongoDB!');
    
    // Importar modelos
    const User = require('./models/User');
    const Profile = require('./models/Profile');
    const Dashboard = require('./models/Dashboard');
    
    // Buscar usuários que não têm dashboard
    const users = await User.find({});
    console.log(`\n👥 Usuários encontrados: ${users.length}`);
    
    const dashboards = await Dashboard.find({});
    console.log(`📊 Dashboards existentes: ${dashboards.length}`);
    
    let createdCount = 0;
    
    for (const user of users) {
      // Verificar se usuário já tem dashboard
      const existingDashboard = await Dashboard.findOne({ owner: user._id });
      
      if (!existingDashboard) {
        console.log(`\n📊 Criando dashboard para usuário: ${user.email}`);
        
        // Buscar perfil do usuário
        const profile = await Profile.findOne({ userId: user._id });
        
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
        createdCount++;
        
        console.log(`✅ Dashboard criado para ${profile ? profile.nome_completo : user.email}`);
        console.log(`   ID: ${dashboard._id}`);
        console.log(`   Owner: ${dashboard.owner}`);
      } else {
        console.log(`ℹ️  Usuário ${user.email} já possui dashboard`);
      }
    }
    
    console.log(`\n🎯 RESULTADO:`);
    console.log(`✅ Dashboards criados: ${createdCount}`);
    console.log(`📊 Total de dashboards: ${await Dashboard.countDocuments()}`);
    console.log(`👥 Total de usuários: ${users.length}`);
    
    if (createdCount > 0) {
      console.log('\n🎉 Todos os usuários agora têm dashboards!');
    } else {
      console.log('\n✅ Todos os usuários já tinham dashboards!');
    }
    
    await mongoose.disconnect();
    console.log('\n🔌 Conexão encerrada');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
};

createDashboardsForExistingUsers();

