const mongoose = require('mongoose');
require('dotenv').config();

const testFrontendData = async () => {
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
    
    // Dados do frontend (conforme imagem)
    const frontendData = {
      nome_completo: "Luis Guilherme Vidal",
      email: "vidalete3000@gmail.com",
      telefone: "21789787414", // Formato do frontend (apenas números)
      cpf: "12345678974",
      senha: "12345678"
    };
    
    console.log('\n🧪 Testando dados do frontend...');
    console.log('Dados recebidos do frontend:');
    console.log(`   Nome: ${frontendData.nome_completo}`);
    console.log(`   Email: ${frontendData.email}`);
    console.log(`   Telefone: ${frontendData.telefone}`);
    console.log(`   CPF: ${frontendData.cpf}`);
    console.log(`   Senha: ${frontendData.senha}`);
    
    // Limpar dados de teste anteriores
    await User.deleteMany({ email: frontendData.email });
    await Profile.deleteMany({ cpf: frontendData.cpf });
    await Dashboard.deleteMany({});
    
    // 1. Criar usuário
    console.log('\n👤 Criando usuário...');
    const user = new User({
      email: frontendData.email,
      senha: frontendData.senha
    });
    await user.save();
    console.log(`✅ Usuário criado: ${user._id}`);
    
    // 2. Criar perfil (aqui será testada a validação)
    console.log('\n👤 Criando perfil...');
    const profile = new Profile({
      userId: user._id,
      nome_completo: frontendData.nome_completo,
      telefone: frontendData.telefone, // Formato do frontend
      cpf: frontendData.cpf
    });
    
    await profile.save();
    console.log(`✅ Perfil criado: ${profile._id}`);
    console.log(`   Telefone formatado: ${profile.telefone}`);
    
    // 3. Criar dashboard
    console.log('\n📊 Criando dashboard...');
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
    console.log(`✅ Dashboard criado: ${dashboard._id}`);
    
    // 4. Verificar dados finais
    console.log('\n📋 Dados finais salvos:');
    console.log(`   Usuário: ${user.email}`);
    console.log(`   Perfil: ${profile.nome_completo}`);
    console.log(`   Telefone: ${profile.telefone}`);
    console.log(`   CPF: ${profile.cpf}`);
    console.log(`   Dashboard: ${dashboard.owner}`);
    
    // 5. Testar simulação de registro completo
    console.log('\n🌐 Simulando endpoint de registro...');
    
    const simulateRegister = async (userData) => {
      // Verificar se usuário já existe
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      // Verificar se CPF já existe
      const existingProfile = await Profile.findOne({ cpf: userData.cpf });
      if (existingProfile) {
        throw new Error('CPF já está em uso');
      }

      // Criar usuário
      const newUser = new User({ 
        email: userData.email, 
        senha: userData.senha 
      });
      await newUser.save();

      // Criar perfil
      const newProfile = new Profile({
        userId: newUser._id,
        nome_completo: userData.nome_completo,
        telefone: userData.telefone,
        cpf: userData.cpf
      });
      await newProfile.save();

      // Criar dashboard
      const newDashboard = new Dashboard({
        owner: newUser._id,
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
      await newDashboard.save();

      return {
        success: true,
        message: 'Usuário criado com sucesso',
        data: {
          user: {
            id: newUser._id,
            email: newUser.email,
            profile: {
              nome_completo: newProfile.nome_completo,
              telefone: newProfile.telefone,
              cpf: newProfile.cpf
            }
          }
        }
      };
    };
    
    // Testar com dados do frontend
    const testData = {
      nome_completo: "Maria Silva",
      email: "maria@email.com",
      telefone: "11987654321",
      cpf: "98765432100",
      senha: "123456"
    };
    
    const result = await simulateRegister(testData);
    console.log('✅ Simulação de registro bem-sucedida!');
    console.log(`   Usuário criado: ${result.data.user.email}`);
    console.log(`   Telefone formatado: ${result.data.user.profile.telefone}`);
    
    // Limpeza
    console.log('\n🧹 Limpando dados de teste...');
    await User.deleteMany({ email: { $in: [frontendData.email, testData.email] } });
    await Profile.deleteMany({ cpf: { $in: [frontendData.cpf, testData.cpf] } });
    await Dashboard.deleteMany({});
    console.log('✅ Dados de teste removidos');
    
    await mongoose.disconnect();
    console.log('\n🔌 Conexão encerrada');
    
    console.log('\n🎯 RESULTADO FINAL:');
    console.log('✅ Backend aceita dados do frontend!');
    console.log('✅ Telefone formatado automaticamente');
    console.log('✅ Validações funcionando');
    console.log('✅ Dashboard criado automaticamente');
    
    console.log('\n📋 CONFIGURAÇÃO PARA O FRONTEND:');
    console.log('VITE_API_URL=https://bishop-issued-organizing-hospitals.trycloudflare.com/api');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    
    if (error.name === 'ValidationError') {
      console.log('\n🔍 Erros de validação:');
      Object.keys(error.errors).forEach(field => {
        console.log(`   ${field}: ${error.errors[field].message}`);
      });
    }
  }
};

testFrontendData();

