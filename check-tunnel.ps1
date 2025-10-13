# 🔧 Script para Verificar Status do Tunnel

echo "🔍 Verificando status do Cloudflare Tunnel..."
echo ""

# Verificar se o servidor está rodando
echo "📡 Verificando servidor local..."
netstat -ano | findstr :777
if ($?) {
    echo "✅ Servidor rodando na porta 777"
} else {
    echo "❌ Servidor não está rodando na porta 777"
    echo "Execute: npm run dev"
    exit 1
}

echo ""
echo "🌐 Verificando tunnel..."
echo ""

# Verificar processos do cloudflared
$cloudflaredProcesses = Get-Process -Name "cloudflared" -ErrorAction SilentlyContinue
if ($cloudflaredProcesses) {
    echo "✅ Cloudflared está rodando"
    echo "📊 Processos encontrados: $($cloudflaredProcesses.Count)"
} else {
    echo "❌ Cloudflared não está rodando"
    echo "Execute: cloudflared tunnel --url http://localhost:777"
    exit 1
}

echo ""
echo "🧪 Testando conectividade..."
echo ""

# Testar local
try {
    $localResponse = Invoke-WebRequest -Uri "http://localhost:777/api/health" -UseBasicParsing
    if ($localResponse.StatusCode -eq 200) {
        echo "✅ Servidor local respondendo"
    }
} catch {
    echo "❌ Erro ao conectar com servidor local: $($_.Exception.Message)"
}

echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Verifique a URL do tunnel no terminal onde executou cloudflared"
echo "2. A URL será algo como: https://xyz.trycloudflare.com"
echo "3. Atualize a variável VITE_API_URL no frontend"
echo "4. Teste a nova URL no Postman"
echo ""
echo "🔗 Exemplo de configuração:"
echo "VITE_API_URL=https://nova-url.trycloudflare.com/api"
