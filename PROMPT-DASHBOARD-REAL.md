# 🚨 CORREÇÃO URGENTE - Dashboard Real com Backend

## ❌ PROBLEMA ATUAL
O frontend está mostrando dados fictícios (Maria, R$ 2.847,50) em vez de consumir os dados reais do backend. O usuário cadastrou "Luis Guilherme" mas aparece "Maria" no dashboard.

## ✅ SOLUÇÃO NECESSÁRIA
**SUBSTITUIR TODOS OS DADOS FICTÍCIOS pelos dados reais da API do backend.**

---

## 🔗 ENDPOINTS DO BACKEND

### Base URL da API:
```
https://arbitrary-provinces-garlic-starter.trycloudflare.com
```

### 1. GET Dashboard do Usuário
```http
GET /api/dashboard
Authorization: Bearer {token}
```

**Resposta esperada:**
```json
{
  "success": true,
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
  }
}
```

### 2. GET Perfil do Usuário
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

**Resposta esperada:**
```json
{
  "success": true,
  "user": {
    "_id": "userId",
    "email": "vidalete3000@gmail.com",
    "createdAt": "2025-01-14T05:43:00.000Z",
    "updatedAt": "2025-01-14T05:43:00.000Z"
  },
  "profile": {
    "nome_completo": "Luis Guilherme Vidal",
    "telefone": "(21) 78978-7414",
    "cpf": "12345678999",
    "createdAt": "2025-01-14T05:43:00.000Z",
    "updatedAt": "2025-01-14T05:43:00.000Z"
  }
}
```

---

## 🔧 IMPLEMENTAÇÃO OBRIGATÓRIA

### 1. REMOVER DADOS FICTÍCIOS
**SUBSTITUIR:**
- "Olá, Maria! 👋" → "Olá, {nome_completo}!"
- "R$ 2.847,50" → "R$ {valorTotal}"
- "8 boletos pendentes" → "{boletosPendentes} boletos pendentes"
- "47 boletos pagos" → "{boletosPagos} boletos pagos"
- "12 indicações" → Dados reais ou 0
- "38% desconto" → Dados reais ou 0

### 2. CRIAR HOOKS/SERVICES

#### Hook para Dashboard:
```javascript
// hooks/useDashboard.js
import { useState, useEffect } from 'react';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('https://arbitrary-provinces-garlic-starter.trycloudflare.com/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erro ao buscar dashboard');
      
      const data = await response.json();
      setDashboardData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { dashboardData, loading, error, refetch: fetchDashboard };
};
```

#### Hook para Perfil:
```javascript
// hooks/useProfile.js
import { useState, useEffect } from 'react';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('https://arbitrary-provinces-garlic-starter.trycloudflare.com/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Erro ao buscar perfil');
      
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, refetch: fetchProfile };
};
```

### 3. ATUALIZAR COMPONENTE DASHBOARD

```javascript
// Dashboard.jsx
import { useDashboard } from './hooks/useDashboard';
import { useProfile } from './hooks/useProfile';

export default function Dashboard() {
  const { dashboardData, loading: dashboardLoading } = useDashboard();
  const { profile, loading: profileLoading } = useProfile();

  if (dashboardLoading || profileLoading) {
    return <div>Carregando...</div>;
  }

  const nomeUsuario = profile?.profile?.nome_completo || 'Usuário';
  const valorTotal = dashboardData?.estatisticas?.valorTotal || 0;
  const boletosPendentes = dashboardData?.estatisticas?.boletosPendentes || 0;
  const boletosPagos = dashboardData?.estatisticas?.boletosPagos || 0;

  return (
    <div>
      {/* SUBSTITUIR "Olá, Maria!" por: */}
      <h1>Olá, {nomeUsuario}! 👋</h1>
      
      {/* SUBSTITUIR "R$ 2.847,50" por: */}
      <div>R$ {valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
      
      {/* SUBSTITUIR "8 boletos pendentes" por: */}
      <div>{boletosPendentes} boletos pendentes</div>
      
      {/* SUBSTITUIR "47 boletos pagos" por: */}
      <div>{boletosPagos} boletos pagos</div>
    </div>
  );
}
```

### 4. ATUALIZAR SIDEBAR

```javascript
// Sidebar.jsx
import { useProfile } from './hooks/useProfile';

export default function Sidebar() {
  const { profile } = useProfile();
  
  const nomeCompleto = profile?.profile?.nome_completo || 'Usuário';
  const email = profile?.user?.email || 'email@exemplo.com';
  
  // PRIMEIRA LETRA DO NOME para o avatar
  const inicial = nomeCompleto.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="sidebar">
      {/* SUBSTITUIR "Luís Guilherme Vidal" por: */}
      <div className="user-name">{nomeCompleto}</div>
      
      {/* SUBSTITUIR "vidalete3000@gmail.com" por: */}
      <div className="user-email">{email}</div>
      
      {/* SUBSTITUIR avatar "eu" por: */}
      <div className="avatar">{inicial}</div>
    </div>
  );
}
```

---

## 🎯 CHECKLIST OBRIGATÓRIO

- [ ] **REMOVER** todos os dados fictícios ("Maria", "R$ 2.847,50", etc.)
- [ ] **IMPLEMENTAR** hooks useDashboard e useProfile
- [ ] **CONSUMIR** endpoint GET /api/dashboard com token de autorização
- [ ] **CONSUMIR** endpoint GET /api/auth/profile com token de autorização
- [ ] **SUBSTITUIR** nome "Maria" por dados reais do perfil
- [ ] **SUBSTITUIR** valores fictícios por dados reais do dashboard
- [ ] **IMPLEMENTAR** loading states durante carregamento
- [ ] **IMPLEMENTAR** tratamento de erros
- [ ] **TESTAR** com usuário real cadastrado

---

## 🔑 PONTOS CRÍTICOS

1. **TOKEN DE AUTORIZAÇÃO**: Sempre incluir `Authorization: Bearer {token}` nos headers
2. **URL CORRETA**: Usar `https://arbitrary-provinces-garlic-starter.trycloudflare.com`
3. **DADOS REAIS**: NUNCA mais usar dados fictícios
4. **LOADING STATES**: Mostrar "Carregando..." enquanto busca dados
5. **TRATAMENTO DE ERRO**: Mostrar mensagem se API falhar

---

## ⚠️ IMPORTANTE

**O backend está funcionando perfeitamente!** O problema é que o frontend não está consumindo os endpoints corretos. Após implementar essas correções, o dashboard mostrará os dados reais do usuário logado.

**TESTE FINAL**: Após as correções, o dashboard deve mostrar:
- Nome real do usuário cadastrado
- Valores reais (inicialmente zeros)
- Dados específicos do usuário logado
