# 📋 CONFIGURAÇÃO MANUAL DO .env

Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```
# Variáveis de ambiente para o backend

# MongoDB
MONGODB_URI=mongodb+srv://navaycompany_db_user:CiOzvmPuS6F1CoG4@boleto-pago.s3ka4rf.mongodb.net/?retryWrites=true&w=majority&appName=boleto-pago

# JWT
JWT_SECRET=a73be41832ebe29d2d623a393895b9b1ea21fb91bcad89be1b54a19ef3fd6721abe9a2d75dfda4c07e8f3c1e975b6bc57f163812f8ff8804d89894f70ec6bfdc

# Servidor
PORT=777

# Frontend (URL do Lovable)
FRONTEND_URL=https://boleto-pago-azul.lovable.app/

# Configurações CORS
CORS_ORIGIN=https://boleto-pago-azul.lovable.app
```

## 🧪 JSONs PARA TESTE NO POSTMAN:

### 1. REGISTRO DE USUÁRIO
**POST** `http://localhost:777/api/auth/register`
```json
{
  "nome_completo": "João Silva Santos",
  "email": "joao.silva@email.com",
  "telefone": "(11) 99999-9999",
  "cpf": "12345678901",
  "senha": "123456"
}
```

### 2. LOGIN DE USUÁRIO
**POST** `http://localhost:777/api/auth/login`
```json
{
  "email": "joao.silva@email.com",
  "senha": "123456"
}
```

### 3. BUSCAR PERFIL (PROTEGIDO)
**GET** `http://localhost:777/api/auth/profile`
**Headers:** `Authorization: Bearer SEU_TOKEN_AQUI`

### 4. HEALTH CHECK
**GET** `http://localhost:777/api/health`

## 🚀 PARA EXECUTAR:
1. Crie o arquivo `.env` com o conteúdo acima
2. Execute: `npm run dev`
3. Teste no Postman com os JSONs fornecidos
