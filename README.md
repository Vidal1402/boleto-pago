# 🏦 Backend Boleto Pago

Backend completo em Node.js + Express com autenticação segura e integração com MongoDB.

## 🚀 Funcionalidades

- ✅ Cadastro e login de usuários
- ✅ Autenticação JWT
- ✅ Validações de dados
- ✅ CORS configurado
- ✅ Integração com MongoDB
- ✅ Middleware de segurança
- ✅ Dashboard isolado por usuário
- ✅ Proteção de dados por autenticação
- ✅ Criação automática de dashboard

## 📋 Campos do Usuário

- **nome_completo**: Nome completo do usuário
- **email**: Email único para login
- **telefone**: Telefone no formato (11) 99999-9999
- **cpf**: CPF com 11 dígitos (único)
- **senha**: Senha com mínimo 6 caracteres

## 🛠️ Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp env.example .env
```

3. **Editar o arquivo `.env` com suas configurações:**
```env
MONGODB_URI=mongodb+srv://navaycompany_db_user:***@cluster0.mongodb.net/boleto_pago?retryWrites=true&w=majority
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_123456789
PORT=3000
FRONTEND_URL=https://seu-front.lovable.app
CORS_ORIGIN=https://seu-front.lovable.app
```

## 🏃‍♂️ Executar

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

## 🌐 Endpoints da API

### POST `/api/auth/register`
Cadastra um novo usuário.

**Body:**
```json
{
  "nome_completo": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "cpf": "12345678901",
  "senha": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "token": "jwt_token_aqui",
    "user": {
      "id": "user_id",
      "email": "joao@email.com",
      "profile": {
        "nome_completo": "João Silva",
        "telefone": "(11) 99999-9999",
        "cpf": "12345678901"
      }
    }
  }
}
```

### POST `/api/auth/login`
Faz login do usuário.

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "jwt_token_aqui",
    "user": {
      "id": "user_id",
      "email": "joao@email.com",
      "profile": {
        "nome_completo": "João Silva",
        "telefone": "(11) 99999-9999",
        "cpf": "12345678901"
      }
    }
  }
}
```

### GET `/api/auth/profile`
Retorna os dados do usuário autenticado.

**Headers:**
```
Authorization: Bearer jwt_token_aqui
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "joao@email.com",
      "profile": {
        "nome_completo": "João Silva",
        "telefone": "(11) 99999-9999",
        "cpf": "12345678901"
      }
    }
  }
}
```

### GET `/api/dashboard`
Retorna o dashboard do usuário autenticado. **Se não existir, cria automaticamente.**

**Headers:**
```
Authorization: Bearer jwt_token_aqui
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "dashboard_id",
    "owner": "user_id",
    "data": {
      "boletos": [],
      "configuracoes": {
        "tema": "claro",
        "notificacoes": true,
        "idioma": "pt-BR"
      },
      "metas": [],
      "estatisticas": {
        "totalBoletos": 0,
        "boletosPagos": 0,
        "boletosPendentes": 0,
        "valorTotal": 0
      }
    },
    "lastUpdated": "2025-10-13T04:30:00.000Z",
    "createdAt": "2025-10-13T04:30:00.000Z",
    "updatedAt": "2025-10-13T04:30:00.000Z"
  }
}
```

### POST `/api/dashboard`
Cria ou atualiza o dashboard do usuário autenticado.

**Headers:**
```
Authorization: Bearer jwt_token_aqui
Content-Type: application/json
```

**Body:**
```json
{
  "data": {
    "boletos": [],
    "configuracoes": {},
    "metas": []
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard criado com sucesso",
  "data": {
    "id": "dashboard_id",
    "owner": "user_id",
    "data": {
      "boletos": [],
      "configuracoes": {},
      "metas": []
    },
    "lastUpdated": "2025-10-13T04:30:00.000Z",
    "createdAt": "2025-10-13T04:30:00.000Z",
    "updatedAt": "2025-10-13T04:30:00.000Z"
  }
}
```

### DELETE `/api/dashboard`
Deleta o dashboard do usuário autenticado.

**Headers:**
```
Authorization: Bearer jwt_token_aqui
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard deletado com sucesso"
}
```

## 🔒 Segurança

- ✅ Senhas são hasheadas com bcrypt
- ✅ Tokens JWT com expiração de 7 dias
- ✅ Validação de dados de entrada
- ✅ CORS configurado para domínio específico
- ✅ Middleware de autenticação em rotas protegidas
- ✅ Isolamento completo de dados por usuário

## 🔐 Isolamento de Dashboards

### **Regra Fundamental:**
Cada usuário autenticado tem acesso **APENAS** ao seu próprio dashboard, identificado por `owner = user._id`.

### **Como Funciona:**
1. **Autenticação Obrigatória:** Todas as rotas `/api/dashboard` requerem token JWT válido
2. **Filtro Automático:** O backend extrai `req.user.id` do token e filtra dados por `owner: req.user.id`
3. **Isolamento Total:** Nenhum usuário pode visualizar ou manipular dashboards de outros usuários
4. **Proteção Contra Manipulação:** Mesmo alterando IDs manualmente no request, o filtro por `owner` prevalece

### **Implementação Técnica:**
```javascript
// Todas as queries de dashboard filtram por owner
const dashboard = await Dashboard.findOne({ owner: req.user.id });

// Criação/atualização força o owner correto
dashboard = await Dashboard.create({ 
  owner: req.user.id,  // Sempre usa o ID do usuário autenticado
  data 
});
```

### **Segurança Garantida:**
- ✅ **Token JWT obrigatório** para todas as operações
- ✅ **Frontend não envia userId** - extraído automaticamente do token
- ✅ **Tentativas de acesso não autorizado** retornam 403 Forbidden
- ✅ **Dados completamente isolados** por usuário
- ✅ **Impossível acessar dados de outros usuários**

### **Criação Automática de Dashboard:**
- ✅ **Dashboard criado automaticamente** no cadastro de cada usuário
- ✅ **Estrutura padrão** com boletos, configurações, metas e estatísticas
- ✅ **Configurações iniciais** definidas automaticamente
- ✅ **Criação sob demanda** se usuário antigo não tiver dashboard

### **Estrutura Padrão do Dashboard:**
```json
{
  "boletos": [],
  "configuracoes": {
    "tema": "claro",
    "notificacoes": true,
    "idioma": "pt-BR"
  },
  "metas": [],
  "estatisticas": {
    "totalBoletos": 0,
    "boletosPagos": 0,
    "boletosPendentes": 0,
    "valorTotal": 0
  }
}
```

### **Aviso Importante:**
🚫 **NÃO ALTERAR O FRONTEND** 🚫  
O frontend já consome os endpoints corretos.  
Nenhuma mudança deve ser feita nas rotas ou contratos de resposta.

## 🌍 Integração com Cloudflare Tunnel

Após rodar o backend localmente:

```bash
cloudflared tunnel --url http://localhost:3000
```

Use o link gerado (`https://xyz.trycloudflare.com`) como `VITE_API_URL` no Lovable:

```env
VITE_API_URL=https://xyz.trycloudflare.com/api
```

## 📁 Estrutura do Projeto

```
├── config/
│   └── database.js          # Configuração do MongoDB
├── controllers/
│   ├── authController.js    # Controladores de autenticação
│   └── dashboardController.js # Controladores de dashboard
├── middleware/
│   ├── auth.js             # Middleware de autenticação JWT
│   └── validation.js       # Validações de dados
├── models/
│   ├── User.js             # Modelo do usuário
│   ├── Profile.js          # Modelo do perfil
│   └── Dashboard.js        # Modelo do dashboard
├── routes/
│   ├── auth.js             # Rotas de autenticação
│   └── dashboard.js        # Rotas de dashboard
├── server.js               # Arquivo principal do servidor
├── package.json            # Dependências e scripts
└── env.example             # Exemplo de variáveis de ambiente
```

## 🧪 Testando a API

Você pode testar os endpoints usando:

- **Postman**
- **Insomnia**
- **curl**
- **Frontend do Lovable**

### Exemplo com curl:

**Registro:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "cpf": "12345678901",
    "senha": "123456"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "123456"
  }'
```

**Perfil (com token):**
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Dashboard (com token):**
```bash
curl -X GET http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Criar/Atualizar Dashboard (com token):**
```bash
curl -X POST http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "boletos": [],
      "configuracoes": {},
      "metas": []
    }
  }'
```

## ⚠️ Observações Importantes

1. **Nunca exponha** a `JWT_SECRET` no frontend
2. **Configure o CORS** corretamente para produção
3. **Use HTTPS** em produção
4. **Monitore** os logs do servidor
5. **Faça backup** regular do banco de dados
6. **Dashboard criado automaticamente** para cada usuário cadastrado
7. **Estrutura padrão** configurada automaticamente
8. **Isolamento total** por usuário garantido

## 🐛 Troubleshooting

### Erro de conexão com MongoDB:
- Verifique se a string de conexão está correta
- Confirme se o usuário tem permissões no banco
- Teste a conectividade de rede

### Erro de CORS:
- Verifique se a URL do frontend está correta no `.env`
- Confirme se o domínio está na lista de origens permitidas

### Token inválido:
- Verifique se o token está sendo enviado corretamente
- Confirme se o `JWT_SECRET` está configurado
- Verifique se o token não expirou
