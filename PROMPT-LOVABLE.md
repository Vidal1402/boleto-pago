# 🏦 Prompt Completo para Integração com Backend - Lovable

## 📋 CONTEXTO DO PROJETO - Primeiramente deixo claro que não é para mexer em absolutamente nada visual da plataforma, só na integração com o back no cadastro e login

Criei um backend completo em Node.js + Express com autenticação JWT e MongoDB. O backend está rodando via Cloudflare Tunnel e precisa ser integrado com o frontend.

## 🌐 CONFIGURAÇÃO DA API

**URL Base da API:** `https://toronto-tub-light-month.trycloudflare.com/api`

**Configuração no Frontend:**
```env
VITE_API_URL=https://toronto-tub-light-month.trycloudflare.com/api
```

## 🔐 ENDPOINTS DA API

### 1. **REGISTRO DE USUÁRIO**
- **Método:** `POST`
- **URL:** `${VITE_API_URL}/auth/register`
- **Headers:** `Content-Type: application/json`

**Body (JSON):**
```json
{
  "nome_completo": "João Silva Santos",
  "email": "joao.silva@email.com",
  "telefone": "(11) 99999-9999",
  "cpf": "12345678901",
  "senha": "123456"
}
```

**Response (Sucesso - 201):**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "joao.silva@email.com",
      "profile": {
        "nome_completo": "João Silva Santos",
        "telefone": "(11) 99999-9999",
        "cpf": "12345678901"
      }
    }
  }
}
```

### 2. **LOGIN DE USUÁRIO**
- **Método:** `POST`
- **URL:** `${VITE_API_URL}/auth/login`
- **Headers:** `Content-Type: application/json`

**Body (JSON):**
```json
{
  "email": "joao.silva@email.com",
  "senha": "123456"
}
```

**Response (Sucesso - 200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "joao.silva@email.com",
      "profile": {
        "nome_completo": "João Silva Santos",
        "telefone": "(11) 99999-9999",
        "cpf": "12345678901"
      }
    }
  }
}
```

### 3. **BUSCAR PERFIL (PROTEGIDO)**
- **Método:** `GET`
- **URL:** `${VITE_API_URL}/auth/profile`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer ${token}`

**Response (Sucesso - 200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "email": "joao.silva@email.com",
      "profile": {
        "nome_completo": "João Silva Santos",
        "telefone": "(11) 99999-9999",
        "cpf": "12345678901"
      }
    }
  }
}
```

### 4. **HEALTH CHECK**
- **Método:** `GET`
- **URL:** `${VITE_API_URL}/health`

**Response (Sucesso - 200):**
```json
{
  "success": true,
  "message": "Servidor funcionando!",
  "timestamp": "2025-10-12T21:35:00.000Z"
}
```

## ⚠️ VALIDAÇÕES IMPORTANTES

### **Email:**
- Deve ser um email válido
- Deve ser único (não pode repetir)
- Exemplo válido: `joao.silva@email.com`

### **Telefone:**
- Formato obrigatório: `(11) 99999-9999`
- Exemplo válido: `(11) 98765-4321`
- Regex: `/^\(\d{2}\)\s\d{4,5}-\d{4}$/`

### **CPF:**
- Deve ter exatamente 11 dígitos
- Deve ser único (não pode repetir)
- Exemplo válido: `12345678901`
- Regex: `/^\d{11}$/`

### **Senha:**
- Mínimo 6 caracteres
- Exemplo válido: `123456`

### **Nome Completo:**
- Mínimo 2 caracteres
- Máximo 100 caracteres
- Exemplo válido: `João Silva Santos`

## 🔒 AUTENTICAÇÃO JWT

### **Como Funciona:**
1. Usuário faz login/registro
2. Backend retorna um token JWT
3. Frontend armazena o token (localStorage/sessionStorage)
4. Para requisições protegidas, enviar token no header: `Authorization: Bearer ${token}`
5. Token expira em 7 dias

### **Armazenamento do Token:**
```javascript
// Após login/registro bem-sucedido
localStorage.setItem('token', response.data.token);

// Para requisições protegidas
const token = localStorage.getItem('token');
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 🚨 TRATAMENTO DE ERROS

### **Erro de Validação (400):**
```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    },
    {
      "field": "cpf",
      "message": "CPF deve ter exatamente 11 dígitos"
    }
  ]
}
```

### **Erro de Autenticação (401):**
```json
{
  "success": false,
  "message": "Credenciais inválidas"
}
```

### **Erro de Token Inválido (401):**
```json
{
  "success": false,
  "message": "Token inválido"
}
```

### **Erro de Email/CPF Duplicado (400):**
```json
{
  "success": false,
  "message": "Email já está em uso"
}
```

## 🎯 IMPLEMENTAÇÃO SUGERIDA

### **1. Configurar Axios/Fetch:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Interceptor para adicionar token automaticamente
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### **2. Função de Login:**
```javascript
const login = async (email, senha) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha })
    });
    
    const data = await response.json();
    
    if (data.success) {
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

### **3. Função de Registro:**
```javascript
const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Erro no registro:', error);
    throw error;
  }
};
```

### **4. Função de Logout:**
```javascript
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirecionar para login
};
```

## 📱 COMPONENTES SUGERIDOS

### **1. Formulário de Login:**
- Campo: `email` (type="email")
- Campo: `senha` (type="password")
- Botão: "Entrar"
- Link: "Não tem conta? Cadastre-se"

### **2. Formulário de Registro:**
- Campo: `nome_completo` (type="text")
- Campo: `email` (type="email")
- Campo: `telefone` (type="text", placeholder="(11) 99999-9999")
- Campo: `cpf` (type="text", placeholder="12345678901")
- Campo: `senha` (type="password")
- Botão: "Cadastrar"

### **3. Dashboard/Perfil:**
- Exibir dados do usuário logado
- Botão: "Sair"
- Usar dados de `localStorage.getItem('user')`

## 🔧 CONFIGURAÇÕES TÉCNICAS

### **CORS:**
- Backend configurado para aceitar requisições de: `https://boleto-pago-azul.lovable.app`
- Não há problemas de CORS

### **Headers Obrigatórios:**
- `Content-Type: application/json` (para POST/PUT)
- `Authorization: Bearer ${token}` (para rotas protegidas)

### **Timeout:**
- Recomendado: 30 segundos
- Backend responde rapidamente

## 🧪 TESTES RECOMENDADOS

1. **Teste de Conectividade:** Chamar `/health` primeiro
2. **Teste de Registro:** Criar usuário com dados válidos
3. **Teste de Login:** Fazer login com usuário criado
4. **Teste de Perfil:** Buscar dados do usuário logado
5. **Teste de Validações:** Tentar registrar com dados inválidos
6. **Teste de Token:** Verificar se token expira corretamente

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Configurar `VITE_API_URL` no `.env`
- [ ] Implementar função de login
- [ ] Implementar função de registro
- [ ] Implementar função de logout
- [ ] Criar formulário de login
- [ ] Criar formulário de registro
- [ ] Implementar proteção de rotas
- [ ] Adicionar tratamento de erros
- [ ] Implementar armazenamento de token
- [ ] Testar integração completa

## 🎯 RESULTADO ESPERADO

Após implementação, o usuário deve conseguir:
1. ✅ Cadastrar-se com dados válidos
2. ✅ Fazer login com email/senha
3. ✅ Ver seus dados no perfil
4. ✅ Fazer logout
5. ✅ Receber mensagens de erro claras
6. ✅ Ter sessão persistente (token salvo)

---

**IMPORTANTE:** Use exatamente os nomes dos campos e estruturas JSON mostradas acima. O backend está funcionando e testado!
