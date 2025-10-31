# 🔔 Sistema de Notificações de Atualizações

## 📖 Visão Geral

O sistema de notificações exibe as melhorias e atualizações do aplicativo de forma resumida para os usuários, similar a um changelog interativo.

## 🎯 Funcionalidades

- ✅ Badge de notificação com indicador de atualizações não lidas
- ✅ Painel dropdown com lista de atualizações
- ✅ 4 tipos de atualizações com cores e ícones distintos
- ✅ Marcação automática como lida ao abrir o painel
- ✅ Persistência do estado de leitura no localStorage
- ✅ Timestamps relativos (há 2h, ontem, etc.)
- ✅ Versão do aplicativo no footer

## 📂 Arquivos

- **`/app/components/UpdatesNotification.vue`** - Componente visual do painel
- **`/shared/constants/updates.ts`** - Arquivo centralizado com lista de atualizações
- **`/app/components/AppHeader.vue`** - Header com o ícone de notificação

## ➕ Como Adicionar uma Nova Atualização

### 1. Edite o arquivo `/shared/constants/updates.ts`

```typescript
export const APP_UPDATES: AppUpdate[] = [
  // ⚠️ Adicione a nova atualização NO INÍCIO do array (mais recente primeiro)
  {
    id: '4', // ID único sequencial
    type: 'feature', // Tipo: 'feature', 'fix', 'improvement', 'security'
    title: 'Título curto e descritivo', // Máximo 60 caracteres
    description: 'Descrição clara do que foi alterado ou adicionado.', // Máximo 150 caracteres
    date: new Date('2025-11-01T10:30:00') // Data e hora da atualização
  },
  // ... atualizações anteriores
]
```

### 2. Atualize a versão (opcional)

Se for uma atualização maior, atualize a versão:

```typescript
export const APP_VERSION = '1.3.0'
```

## 🏷️ Tipos de Atualizações

| Tipo | Descrição | Cor | Ícone |
|------|-----------|-----|-------|
| **`feature`** | Novas funcionalidades | Verde | ⚡ Raio |
| **`fix`** | Correções de bugs | Azul | 🔧 Engrenagem |
| **`improvement`** | Melhorias em funcionalidades existentes | Roxo | 📈 Gráfico |
| **`security`** | Atualizações de segurança | Vermelho | 🛡️ Escudo |

## 💡 Boas Práticas

### Títulos
- ✅ **BOM:** "Correção no filtro de pedidos concluídos"
- ❌ **RUIM:** "Arrumei um bug"

### Descrições
- ✅ **BOM:** "Pedidos concluídos agora desaparecem corretamente após 5 horas da criação."
- ❌ **RUIM:** "Mudei o código do filtro."

### Dicas
- Seja específico sobre o que mudou
- Use linguagem orientada ao usuário, não técnica
- Foque no benefício para o usuário
- Mantenha títulos curtos (máx. 60 caracteres)
- Mantenha descrições concisas (máx. 150 caracteres)

## 🎨 Exemplo Completo

```typescript
{
  id: '5',
  type: 'feature',
  title: 'Exportação de relatórios em PDF',
  description: 'Agora você pode exportar todos os relatórios diretamente em formato PDF com um clique.',
  date: new Date('2025-11-01T15:00:00')
}
```

## 🔄 Estado de Leitura

O sistema automaticamente:
- Marca atualizações como lidas após 1 segundo de visualização no painel
- Salva o estado no localStorage do navegador
- Exibe badge vermelho apenas para atualizações não lidas
- Destaca visualmente atualizações não lidas no painel

## 🎯 Diretrizes de Versionamento

Use [Semantic Versioning](https://semver.org/):

- **MAJOR (1.0.0)** - Mudanças incompatíveis na API
- **MINOR (1.1.0)** - Novas funcionalidades compatíveis
- **PATCH (1.1.1)** - Correções de bugs

### Exemplos:
- Nova página/funcionalidade grande → `1.2.0` → `1.3.0`
- Correção de bug → `1.2.0` → `1.2.1`
- Melhoria pequena → `1.2.0` → `1.2.1`
- Refatoração grande → `1.2.0` → `2.0.0`

## 📝 Template Rápido

Copie e cole este template ao adicionar uma nova atualização:

```typescript
{
  id: 'PRÓXIMO_ID',
  type: 'ESCOLHER_TIPO', // feature | fix | improvement | security
  title: 'SEU_TÍTULO_AQUI',
  description: 'SUA_DESCRIÇÃO_AQUI',
  date: new Date('AAAA-MM-DDTHH:MM:SS')
}
```

---

**Nota:** Este sistema é totalmente client-side e não requer banco de dados. As atualizações são carregadas do arquivo TypeScript e o estado de leitura é persistido no localStorage do navegador.
