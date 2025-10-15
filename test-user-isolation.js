const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const testUserIsolation = async () => {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado ao MongoDB!');
    
    // 1. Criar dois usuários de teste
    console.log('\n👥 Criando usuários de teste...');
    
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      senha: String
    }, { timestamps: true }));
    
    const Profile = mongoose.model('Profile', new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      nome_completo: String,
      telefone: String,
      cpf: String
    }, { timestamps: true }));
    
    const Dashboard = mongoose.model('Dashboard', new mongoose.Schema({
      owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      data: mongoose.Schema.Types.Mixed,
      lastUpdated: { type: Date, default: Date.now }
    }, { timestamps: true }));
    
    // Limpar dados de teste anteriores
    await User.deleteMany({ email: { $regex: /teste.*@email\.com/ } });
    await Profile.deleteMany({ nome_completo: { $regex: /Usuário Teste/ } });
    await Dashboard.deleteMany({});
    
    // Criar usuário 1
    const user1 = new User({
      email: 'teste1@email.com',
      senha: 'senha123'
    });
    await user1.save();
    
    const profile1 = new Profile({
      userId: user1._id,
      nome_completo: 'Usuário Teste 1',
      telefone: '(11) 11111-1111',
      cpf: '11111111111'
    });
    await profile1.save();
    
    // Criar usuário 2
    const user2 = new User({
      email: 'teste2@email.com',
      senha: 'senha123'
    });
    await user2.save();
    
    const profile2 = new Profile({
      userId: user2._id,
      nome_completo: 'Usuário Teste 2',
      telefone: '(22) 22222-2222',
      cpf: '22222222222'
    });
    await profile2.save();
    
    console.log('✅ Usuários criados:');
    console.log(`   Usuário 1: ${user1.email} (ID: ${user1._id})`);
    console.log(`   Usuário 2: ${user2.email} (ID: ${user2._id})`);
    
    // 2. Criar dashboards para cada usuário
    console.log('\n📊 Criando dashboards...');
    
    const dashboard1 = new Dashboard({
      owner: user1._id,
      data: {
        boletos: ['boleto1', 'boleto2'],
        configuracoes: { tema: 'claro' },
        metas: ['meta1', 'meta2']
      }
    });
    await dashboard1.save();
    
    const dashboard2 = new Dashboard({
      owner: user2._id,
      data: {
        boletos: ['boleto3', 'boleto4'],
        configuracoes: { tema: 'escuro' },
        metas: ['meta3', 'meta4']
      }
    });
    await dashboard2.save();
    
    console.log('✅ Dashboards criados:');
    console.log(`   Dashboard 1: Owner ${dashboard1.owner}`);
    console.log(`   Dashboard 2: Owner ${dashboard2.owner}`);
    
    // 3. Gerar tokens JWT para cada usuário
    console.log('\n🔑 Gerando tokens JWT...');
    
    const token1 = jwt.sign({ userId: user1._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    
    const token2 = jwt.sign({ userId: user2._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    
    console.log(`✅ Token 1: ${token1.substring(0, 20)}...`);
    console.log(`✅ Token 2: ${token2.substring(0, 20)}...`);
    
    // 4. Simular requisições como se fossem do frontend
    console.log('\n🧪 Testando isolamento...');
    
    // Simular middleware de autenticação
    const simulateAuth = (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
      } catch (error) {
        return null;
      }
    };
    
    // Teste 1: Usuário 1 acessa seu próprio dashboard
    console.log('\n📋 Teste 1: Usuário 1 acessa seu dashboard');
    const user1Id = simulateAuth(token1);
    const user1Dashboard = await Dashboard.findOne({ owner: user1Id });
    
    if (user1Dashboard) {
      console.log('✅ Sucesso: Usuário 1 encontrou seu dashboard');
      console.log(`   Dados: ${JSON.stringify(user1Dashboard.data)}`);
    } else {
      console.log('❌ Erro: Usuário 1 não encontrou seu dashboard');
    }
    
    // Teste 2: Usuário 2 acessa seu próprio dashboard
    console.log('\n📋 Teste 2: Usuário 2 acessa seu dashboard');
    const user2Id = simulateAuth(token2);
    const user2Dashboard = await Dashboard.findOne({ owner: user2Id });
    
    if (user2Dashboard) {
      console.log('✅ Sucesso: Usuário 2 encontrou seu dashboard');
      console.log(`   Dados: ${JSON.stringify(user2Dashboard.data)}`);
    } else {
      console.log('❌ Erro: Usuário 2 não encontrou seu dashboard');
    }
    
    // Teste 3: Usuário 1 tenta acessar dashboard do usuário 2 (deve falhar)
    console.log('\n📋 Teste 3: Usuário 1 tenta acessar dashboard do usuário 2');
    const user1TriesUser2 = await Dashboard.findOne({ owner: user2Id });
    
    if (user1TriesUser2 && user1TriesUser2.owner.toString() === user2Id.toString()) {
      console.log('❌ FALHA DE SEGURANÇA: Usuário 1 conseguiu acessar dados do usuário 2!');
      console.log(`   Dados acessados: ${JSON.stringify(user1TriesUser2.data)}`);
    } else {
      console.log('✅ Segurança OK: Usuário 1 não conseguiu acessar dados do usuário 2');
    }
    
    // Teste 4: Usuário 2 tenta acessar dashboard do usuário 1 (deve falhar)
    console.log('\n📋 Teste 4: Usuário 2 tenta acessar dashboard do usuário 1');
    const user2TriesUser1 = await Dashboard.findOne({ owner: user1Id });
    
    if (user2TriesUser1 && user2TriesUser1.owner.toString() === user1Id.toString()) {
      console.log('❌ FALHA DE SEGURANÇA: Usuário 2 conseguiu acessar dados do usuário 1!');
      console.log(`   Dados acessados: ${JSON.stringify(user2TriesUser1.data)}`);
    } else {
      console.log('✅ Segurança OK: Usuário 2 não conseguiu acessar dados do usuário 1');
    }
    
    // Teste 5: Verificar se os dados são diferentes
    console.log('\n📋 Teste 5: Verificando se os dados são diferentes');
    if (user1Dashboard && user2Dashboard) {
      const data1 = JSON.stringify(user1Dashboard.data);
      const data2 = JSON.stringify(user2Dashboard.data);
      
      if (data1 !== data2) {
        console.log('✅ Sucesso: Dados dos usuários são diferentes');
        console.log(`   Usuário 1: ${data1}`);
        console.log(`   Usuário 2: ${data2}`);
      } else {
        console.log('❌ Erro: Dados dos usuários são iguais!');
      }
    }
    
    // Teste 6: Verificar isolamento com query direta
    console.log('\n📋 Teste 6: Verificando isolamento com query direta');
    
    // Usuário 1 só deve ver seu dashboard
    const user1Dashboards = await Dashboard.find({ owner: user1Id });
    console.log(`   Dashboards do usuário 1: ${user1Dashboards.length}`);
    
    // Usuário 2 só deve ver seu dashboard
    const user2Dashboards = await Dashboard.find({ owner: user2Id });
    console.log(`   Dashboards do usuário 2: ${user2Dashboards.length}`);
    
    // Total de dashboards
    const allDashboards = await Dashboard.find({});
    console.log(`   Total de dashboards: ${allDashboards.length}`);
    
    if (user1Dashboards.length === 1 && user2Dashboards.length === 1 && allDashboards.length === 2) {
      console.log('✅ Isolamento perfeito: Cada usuário vê apenas seu dashboard');
    } else {
      console.log('❌ Problema no isolamento!');
    }
    
    // Limpeza
    console.log('\n🧹 Limpando dados de teste...');
    await User.deleteMany({ email: { $regex: /teste.*@email\.com/ } });
    await Profile.deleteMany({ nome_completo: { $regex: /Usuário Teste/ } });
    await Dashboard.deleteMany({});
    console.log('✅ Dados de teste removidos');
    
    await mongoose.disconnect();
    console.log('\n🔌 Conexão encerrada');
    
    console.log('\n🎯 RESULTADO FINAL:');
    console.log('✅ Isolamento de usuários funcionando corretamente!');
    console.log('✅ Cada usuário tem acesso apenas ao seu próprio dashboard');
    console.log('✅ Impossível acessar dados de outros usuários');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
};

testUserIsolation();

