# 🌍 Guia Completo: Cloudflare Tunnel

## 📋 Pré-requisitos

1. ✅ Servidor Node.js funcionando localmente na porta 777
2. ✅ Arquivo `.env` configurado corretamente
3. ✅ Cloudflare Tunnel instalado

## 🚀 Passo 1: Instalar Cloudflare Tunnel

### Windows (PowerShell como Administrador):
```powershell
# Baixar cloudflared
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"

# Mover para pasta do sistema
Move-Item cloudflared.exe C:\Windows\System32\
```

### Ou usando Chocolatey:
```powershell
choco install cloudflared
```

### Ou usando Scoop:
```powershell
scoop install cloudflared
```

## 🔧 Passo 2: Verificar Instalação
```bash
cloudflared --version
```

## 🌐 Passo 3: Executar o Tunnel

### Método Simples (Temporário):
```bash
cloudflared tunnel --url http://localhost:777
```

### Método Avançado (Persistente):
```bash
# 1. Fazer login no Cloudflare
cloudflared tunnel login

# 2. Criar um tunnel
cloudflared tunnel create boleto-pago-backend

# 3. Configurar o tunnel
cloudflared tunnel route dns boleto-pago-backend api.boleto-pago.com

# 4. Executar o tunnel
cloudflared tunnel run boleto-pago-backend
```

## 📝 Passo 4: Configurar Frontend

Após executar o tunnel, você receberá uma URL como:
```
https://xyz.trycloudflare.com
```

### No seu frontend (Lovable), configure:
```env
VITE_API_URL=https://xyz.trycloudflare.com/api
```

## 🧪 Passo 5: Testar

### 1. Teste local:
```bash
curl http://localhost:777/api/health
```

### 2. Teste via tunnel:
```bash
curl https://xyz.trycloudflare.com/api/health
```

### 3. Teste no Postman:
- **URL Base:** `https://xyz.trycloudflare.com/api`
- **Endpoints:** `/auth/register`, `/auth/login`, `/auth/profile`

## 🔒 Passo 6: Configurações de Segurança

### Atualizar CORS no backend:
```env
CORS_ORIGIN=https://boleto-pago-azul.lovable.app
```

### Verificar se o tunnel está funcionando:
```bash
# Verificar status
cloudflared tunnel list

# Ver logs
cloudflared tunnel info boleto-pago-backend
```

## 📋 Scripts Úteis

### Criar script de inicialização (start.bat):
```batch
@echo off
echo Iniciando servidor Node.js...
start "Servidor" cmd /k "npm run dev"

echo Aguardando servidor iniciar...
timeout /t 5

echo Iniciando Cloudflare Tunnel...
start "Tunnel" cmd /k "cloudflared tunnel --url http://localhost:777"

echo Ambos os serviços iniciados!
pause
```

### Criar script de parada (stop.bat):
```batch
@echo off
echo Parando serviços...
taskkill /f /im node.exe
taskkill /f /im cloudflared.exe
echo Serviços parados!
pause
```

## 🐛 Troubleshooting

### Problema: "cloudflared not found"
**Solução:** Instale o cloudflared ou use o caminho completo

### Problema: "Tunnel connection failed"
**Solução:** 
1. Verifique se o servidor está rodando na porta 777
2. Verifique se não há firewall bloqueando
3. Teste: `curl http://localhost:777/api/health`

### Problema: "CORS error no frontend"
**Solução:**
1. Verifique se `CORS_ORIGIN` está correto no `.env`
2. Reinicie o servidor após mudanças no `.env`

### Problema: "MongoDB connection failed"
**Solução:**
1. Verifique se o arquivo `.env` existe e está correto
2. Teste a conexão: `node test-mongodb.js`

## 🎯 Fluxo Completo de Deploy

1. **Desenvolvimento Local:**
   ```bash
   npm run dev
   # Servidor roda em http://localhost:777
   ```

2. **Tunnel Temporário:**
   ```bash
   cloudflared tunnel --url http://localhost:777
   # Recebe URL: https://xyz.trycloudflare.com
   ```

3. **Configurar Frontend:**
   ```env
   VITE_API_URL=https://xyz.trycloudflare.com/api
   ```

4. **Testar Integração:**
   - Frontend faz requisições para `https://xyz.trycloudflare.com/api`
   - Backend processa e retorna dados
   - CORS permite requisições do Lovable

## ⚡ Dicas Importantes

- ✅ **Sempre teste localmente primeiro**
- ✅ **Mantenha o servidor rodando enquanto usa o tunnel**
- ✅ **Use HTTPS no frontend (Lovable já usa)**
- ✅ **Monitore os logs do tunnel**
- ✅ **Para produção, considere um domínio próprio**

## 🔄 Comandos Rápidos

```bash
# Iniciar tudo
npm run dev & cloudflared tunnel --url http://localhost:777

# Parar tudo
Ctrl+C (duas vezes)

# Verificar status
curl https://xyz.trycloudflare.com/api/health
```
