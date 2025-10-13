# 🏦 Backend Boleto Pago

Backend completo em Node.js + Express com autenticação segura e integração com MongoDB.

## 🚀 Funcionalidades

- ✅ Cadastro e login de usuários
- ✅ Autenticação JWT
- ✅ Validações de dados
- ✅ CORS configurado
- ✅ Integração com MongoDB
- ✅ Middleware de segurança

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

## 🔒 Segurança

- ✅ Senhas são hasheadas com bcrypt
- ✅ Tokens JWT com expiração de 7 dias
- ✅ Validação de dados de entrada
- ✅ CORS configurado para domínio específico
- ✅ Middleware de autenticação em rotas protegidas

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
│   └── authController.js    # Controladores de autenticação
├── middleware/
│   ├── auth.js             # Middleware de autenticação JWT
│   └── validation.js       # Validações de dados
├── models/
│   ├── User.js             # Modelo do usuário
│   └── Profile.js          # Modelo do perfil
├── routes/
│   └── auth.js             # Rotas de autenticação
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

## ⚠️ Observações Importantes

1. **Nunca exponha** a `JWT_SECRET` no frontend
2. **Configure o CORS** corretamente para produção
3. **Use HTTPS** em produção
4. **Monitore** os logs do servidor
5. **Faça backup** regular do banco de dados

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
