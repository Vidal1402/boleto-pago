# 🚨 PROMPT CRÍTICO: IMPLEMENTAR AUTENTICAÇÃO REAL COM API

## ⚠️ PROBLEMA ATUAL
O frontend está permitindo login sem autenticação real. **ISSO ESTÁ ERRADO!** Cada usuário deve ser cadastrado e autenticado através da API.

## 🎯 OBJETIVO OBRIGATÓRIO
Implementar sistema de autenticação completo onde:
- ✅ **CADA usuário deve ser cadastrado** via API
- ✅ **CADA usuário deve fazer login** via API  
- ✅ **CADA usuário tem seu próprio dashboard** com dados reais
- ✅ **TODAS as requisições** devem usar a URL da API
- ✅ **NÃO pode haver login fake** ou dados mockados

## 🌐 CONFIGURAÇÃO OBRIGATÓRIA

**URL da API:** `https://toronto-tub-light-month.trycloudflare.com/api`

**Variável de ambiente:**
```env
VITE_API_URL=https://toronto-tub-light-month.trycloudflare.com/api
```

## 🔐 FLUXO DE AUTENTICAÇÃO OBRIGATÓRIO

### **1. CADASTRO (OBRIGATÓRIO)**
```javascript
// FUNÇÃO OBRIGATÓRIA - NÃO USAR DADOS FAKE
const registerUser = async (userData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome_completo: userData.nome_completo,
        email: userData.email,
        telefone: userData.telefone,
        cpf: userData.cpf,
        senha: userData.senha
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // SALVAR TOKEN E DADOS REAIS
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw error;
  }
};
```

### **2. LOGIN (OBRIGATÓRIO)**
```javascript
// FUNÇÃO OBRIGATÓRIA - NÃO USAR DADOS FAKE
const loginUser = async (email, senha) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // SALVAR TOKEN E DADOS REAIS
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};
```

### **3. BUSCAR DADOS DO USUÁRIO (OBRIGATÓRIO)**
```javascript
// FUNÇÃO OBRIGATÓRIA - BUSCAR DADOS REAIS DA API
const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token não encontrado');
    }
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
};
```

## 🚫 O QUE NÃO PODE SER FEITO

### ❌ **NÃO FAZER:**
- Login sem chamar a API
- Dados mockados ou fake
- Dashboard com dados inventados
- Pular a autenticação
- Usar dados hardcoded
- Login automático sem token

### ✅ **OBRIGATÓRIO FAZER:**
- Chamar API para cadastro
- Chamar API para login
- Chamar API para buscar perfil
- Usar token JWT real
- Validar dados reais
- Tratar erros da API

## 📱 IMPLEMENTAÇÃO OBRIGATÓRIA DOS COMPONENTES

### **1. FORMULÁRIO DE CADASTRO (OBRIGATÓRIO)**
```jsx
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    telefone: '',
    cpf: '',
    senha: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // OBRIGATÓRIO: Chamar API real
      const user = await registerUser(formData);
      
      // OBRIGATÓRIO: Redirecionar para dashboard
      navigate('/dashboard');
      
    } catch (error) {
      // OBRIGATÓRIO: Mostrar erro real da API
      alert(`Erro: ${error.message}`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Nome Completo"
        value={formData.nome_completo}
        onChange={(e) => setFormData({...formData, nome_completo: e.target.value})}
        required
      />
      <input 
        type="email" 
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input 
        type="text" 
        placeholder="Telefone (11) 99999-9999"
        value={formData.telefone}
        onChange={(e) => setFormData({...formData, telefone: e.target.value})}
        required
      />
      <input 
        type="text" 
        placeholder="CPF (11 dígitos)"
        value={formData.cpf}
        onChange={(e) => setFormData({...formData, cpf: e.target.value})}
        required
      />
      <input 
        type="password" 
        placeholder="Senha (mínimo 6 caracteres)"
        value={formData.senha}
        onChange={(e) => setFormData({...formData, senha: e.target.value})}
        required
      />
      <button type="submit">Cadastrar</button>
    </form>
  );
};
```

### **2. FORMULÁRIO DE LOGIN (OBRIGATÓRIO)**
```jsx
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // OBRIGATÓRIO: Chamar API real
      const user = await loginUser(formData.email, formData.senha);
      
      // OBRIGATÓRIO: Redirecionar para dashboard
      navigate('/dashboard');
      
    } catch (error) {
      // OBRIGATÓRIO: Mostrar erro real da API
      alert(`Erro: ${error.message}`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input 
        type="password" 
        placeholder="Senha"
        value={formData.senha}
        onChange={(e) => setFormData({...formData, senha: e.target.value})}
        required
      />
      <button type="submit">Entrar</button>
    </form>
  );
};
```

### **3. DASHBOARD COM DADOS REAIS (OBRIGATÓRIO)**
```jsx
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // OBRIGATÓRIO: Buscar dados reais da API
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        // OBRIGATÓRIO: Se erro, redirecionar para login
        console.error('Erro ao carregar dados:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  const handleLogout = () => {
    // OBRIGATÓRIO: Limpar dados reais
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!user) {
    return <div>Erro ao carregar dados do usuário</div>;
  }
  
  return (
    <div>
      <h1>Dashboard - {user.profile.nome_completo}</h1>
      
      {/* OBRIGATÓRIO: Mostrar dados reais da API */}
      <div>
        <h2>Dados Pessoais</h2>
        <p><strong>Nome:</strong> {user.profile.nome_completo}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Telefone:</strong> {user.profile.telefone}</p>
        <p><strong>CPF:</strong> {user.profile.cpf}</p>
        <p><strong>ID:</strong> {user.id}</p>
      </div>
      
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
};
```

## 🔒 PROTEÇÃO DE ROTAS (OBRIGATÓRIO)

```jsx
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      try {
        // OBRIGATÓRIO: Validar token com API
        await getUserProfile();
        setIsAuthenticated(true);
      } catch (error) {
        // OBRIGATÓRIO: Token inválido, limpar dados
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  if (loading) {
    return <div>Verificando autenticação...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

## 🚨 VALIDAÇÕES OBRIGATÓRIAS

### **Email:**
- Formato válido obrigatório
- Deve ser único (API retorna erro se duplicado)

### **Telefone:**
- Formato: `(11) 99999-9999`
- Regex: `/^\(\d{2}\)\s\d{4,5}-\d{4}$/`

### **CPF:**
- Exatamente 11 dígitos
- Deve ser único (API retorna erro se duplicado)

### **Senha:**
- Mínimo 6 caracteres

### **Nome:**
- Mínimo 2 caracteres
- Máximo 100 caracteres

## 🧪 TESTES OBRIGATÓRIOS

### **1. Teste de Cadastro:**
- Cadastrar usuário com dados válidos
- Verificar se retorna token
- Verificar se redireciona para dashboard

### **2. Teste de Login:**
- Fazer login com usuário cadastrado
- Verificar se retorna token
- Verificar se redireciona para dashboard

### **3. Teste de Dashboard:**
- Verificar se mostra dados reais
- Verificar se dados vêm da API
- Verificar se logout funciona

### **4. Teste de Proteção:**
- Tentar acessar dashboard sem login
- Verificar se redireciona para login
- Verificar se token inválido redireciona

## 📋 CHECKLIST OBRIGATÓRIO

- [ ] **Configurar VITE_API_URL** no .env
- [ ] **Implementar função de cadastro** que chama API
- [ ] **Implementar função de login** que chama API
- [ ] **Implementar função de perfil** que chama API
- [ ] **Criar formulário de cadastro** funcional
- [ ] **Criar formulário de login** funcional
- [ ] **Criar dashboard** com dados reais da API
- [ ] **Implementar proteção de rotas**
- [ ] **Implementar logout** que limpa dados
- [ ] **Tratar erros** da API
- [ ] **Validar dados** antes de enviar
- [ ] **Testar fluxo completo**

## 🎯 RESULTADO OBRIGATÓRIO

Após implementação, o sistema deve funcionar assim:

1. ✅ **Usuário acessa a aplicação**
2. ✅ **É redirecionado para login/cadastro**
3. ✅ **Cadastra-se via API** (dados salvos no MongoDB)
4. ✅ **Faz login via API** (recebe token JWT)
5. ✅ **Acessa dashboard** com dados reais da API
6. ✅ **Cada usuário vê apenas seus dados**
7. ✅ **Logout limpa dados** e redireciona

## ⚠️ LEMBRETE CRÍTICO

**NÃO PODE HAVER:**
- Login fake ou automático
- Dados mockados ou inventados
- Dashboard com dados hardcoded
- Pular chamadas para API
- Usar dados que não vêm do backend

**DEVE HAVER:**
- Autenticação real via API
- Dados reais do MongoDB
- Token JWT válido
- Proteção de rotas
- Tratamento de erros

---

**IMPORTANTE:** Implemente exatamente como especificado. Cada usuário deve ser único e autenticado através da API real!
