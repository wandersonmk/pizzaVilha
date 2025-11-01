# 📊 OPÇÃO 2: Histórico Separado - Demonstração Visual

## 🎯 Visão Geral

Criar uma página separada `/pedidos/historico` dedicada à busca e consulta de todos os pedidos (históricos e atuais), mantendo a página `/pedidos` atual como está para operação do dia.

---

## 🖼️ Mockup Visual da Interface

### **Tela Principal: Histórico de Pedidos**

```
┌────────────────────────────────────────────────────────────────────────────┐
│  SIDEBAR    │                   HISTÓRICO DE PEDIDOS                       │
│             │                                                               │
│  📊 Dashboard│  ┌─────────────────────────────────────────────────────┐   │
│  🛒 Pedidos  │  │  🔍 Buscar Pedidos                                  │   │
│  📋 Histórico│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  🍕 Cardápio │  │  │ #123 ou nome │  │ 📞 Telefone  │  │ 📅 Período │ │   │
│  👥 Clientes │  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  📈 Relatór. │  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  ⚙️  Config.  │  │  │ Status: Todos│  │ Tipo: Todos  │  │ [Buscar]  │ │   │
│             │  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│             │  │  [Limpar Filtros]  [📊 Hoje]  [📊 Esta Semana]     │   │
│             │  └─────────────────────────────────────────────────────┘   │
│             │                                                               │
│             │  ┌─────────────────────────────────────────────────────┐   │
│             │  │  📊 Resultado: 156 pedidos encontrados              │   │
│             │  │  💰 Total: R$ 7.845,00  |  📈 Ticket Médio: R$ 50,29│   │
│             │  └─────────────────────────────────────────────────────┘   │
│             │                                                               │
│             │  ┌────┬──────────┬────────┬──────────┬──────┬────────┬──┐  │
│  🌙 TEMA    │  │ #  │ Cliente  │ Pedido │ Valor    │ Pag  │ Status │  │  │
│  🚪 Sair    │  ├────┼──────────┼────────┼──────────┼──────┼────────┼──┤  │
│             │  │123 │ João S.  │ 2x Piz │ R$ 89,00 │ 💳   │ ✅ OK  │👁│  │
│             │  │122 │ Maria P. │ 1x Piz │ R$ 45,00 │ 💵   │ ✅ OK  │👁│  │
│             │  │121 │ Pedro O. │ 3x Piz │ R$ 135,0 │ 💳   │ ✅ OK  │👁│  │
│             │  │120 │ Ana C.   │ 1x Piz │ R$ 42,00 │ 💵   │ ✅ OK  │👁│  │
│             │  └────┴──────────┴────────┴──────────┴──────┴────────┴──┘  │
│             │  [◀ Anterior]  Página 1 de 8  [Próximo ▶]                  │
│             │  [📥 Exportar Excel]  [📄 Exportar PDF]                    │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Componentes Principais

### **1. Barra de Busca e Filtros**

#### **Campos de Busca:**
```
┌─────────────────────────────────────────────────┐
│ 🔍 Buscar por Número, Nome ou Telefone         │
│ [Digite aqui...]                                │
└─────────────────────────────────────────────────┘

Funcionalidade:
- Busca em tempo real (debounce 500ms)
- Busca por: número do pedido, nome do cliente, telefone
- Realça resultados encontrados
```

#### **Filtros Avançados:**
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Período:    │  │ Status:     │  │ Tipo:       │
│ ▼ Selecione │  │ ▼ Todos     │  │ ▼ Todos     │
└─────────────┘  └─────────────┘  └─────────────┘

Opções de Período:        Status:              Tipo:
- Hoje                    - Todos              - Todos
- Esta Semana             - Novo               - Entrega
- Este Mês                - Cozinha            - Retirada
- Últimos 30 dias         - Entrega            
- Últimos 90 dias         - Concluído          
- Personalizado (range)   - Cancelado          
```

#### **Atalhos Rápidos:**
```
[📊 Pedidos de Hoje]  [📊 Desta Semana]  [📊 Deste Mês]
```

---

### **2. Card de Estatísticas**

```
┌──────────────────────────────────────────────────────────┐
│  📊 Resumo do Período Selecionado                        │
├──────────────────────────────────────────────────────────┤
│  📦 Total de Pedidos: 156                                │
│  💰 Valor Total: R$ 7.845,00                             │
│  📈 Ticket Médio: R$ 50,29                               │
│  ✅ Concluídos: 150  |  ❌ Cancelados: 6                 │
└──────────────────────────────────────────────────────────┘
```

---

### **3. Tabela de Resultados**

#### **Colunas:**
```
┌────┬──────────────┬─────────────────┬──────────┬──────────┬──────────┬────────┬────────┐
│ #  │ Cliente      │ Pedido          │ Valor    │ Pagamento│ Tipo     │ Status │ Ações  │
├────┼──────────────┼─────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
│123 │ João Silva   │ 2x Pizza Grande │ R$ 89,00 │ Cartão   │ Entrega  │ ✅ OK  │ 👁 🖨️  │
│    │ 47999887766  │ Calabresa       │ + R$ 5,00│          │          │        │        │
│    │ Rua A, 123   │ 1x Coca 2L      │          │ Troco 100│          │ 12/10  │        │
├────┼──────────────┼─────────────────┼──────────┼──────────┼──────────┼────────┼────────┤
```

#### **Recursos da Tabela:**
- ✅ Ordenação clicável por coluna
- ✅ Hover destaca linha
- ✅ Cores por status (verde=ok, amarelo=andamento, vermelho=cancelado)
- ✅ Ícone de ações: 👁️ Ver detalhes, 🖨️ Imprimir
- ✅ Informações expandidas (endereço, observações)

---

### **4. Paginação**

```
┌─────────────────────────────────────────────────────────┐
│  [◀ Anterior]  [1] [2] [3] ... [8]  [Próximo ▶]        │
│  Mostrando 1-20 de 156 pedidos                          │
└─────────────────────────────────────────────────────────┘
```

**Opções:**
- 20, 50 ou 100 pedidos por página
- Navegação por número de página
- Ir para página específica

---

### **5. Exportação**

```
┌─────────────────────────────────────────────────────────┐
│  [📥 Exportar Excel]  [📄 Exportar PDF]                 │
└─────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- Exporta apenas resultados da busca atual
- Excel: Ideal para análises no computador
- PDF: Ideal para impressão e arquivamento

---

## 🔄 Fluxo de Uso

### **Cenário 1: Cliente liga perguntando sobre pedido**
```
1. Usuário abre /pedidos/historico
2. Digita número do telefone ou nome do cliente
3. Sistema busca e exibe resultados
4. Usuário clica em 👁️ para ver detalhes
5. Confirma informações com o cliente
```

### **Cenário 2: Relatório mensal**
```
1. Usuário seleciona período "Este Mês"
2. Sistema carrega todos pedidos do mês
3. Visualiza estatísticas no card resumo
4. Clica em [📥 Exportar Excel]
5. Analisa dados no Excel (gráficos, etc.)
```

### **Cenário 3: Busca rápida de pedido específico**
```
1. Usuário digita #123 no campo de busca
2. Sistema filtra e exibe apenas pedido #123
3. Usuário clica em 🖨️ para reimprimir
```

---

## 🗂️ Estrutura de Arquivos

```
app/
├── pages/
│   └── pedidos/
│       └── historico.vue           ← Nova página
├── components/
│   ├── HistoricoPedidos.vue       ← Componente principal
│   ├── PedidosSearchBar.vue       ← Barra de busca e filtros
│   ├── PedidosTable.vue           ← Tabela reutilizável
│   ├── PedidoDetailsModal.vue     ← Modal de detalhes (já existe)
│   └── ExportButtons.vue          ← Botões de exportação
├── composables/
│   ├── usePedidosHistory.ts       ← Lógica de busca e filtros
│   └── useExport.ts               ← Lógica de exportação
```

---

## 💻 Tecnologias Utilizadas

- **Busca:** Supabase query com `.ilike()` para busca parcial
- **Paginação:** Supabase `.range(from, to)`
- **Exportação Excel:** Biblioteca `xlsx`
- **Exportação PDF:** Biblioteca `jspdf` + `jspdf-autotable`
- **Debounce:** `lodash.debounce` ou implementação própria
- **Date Picker:** Componente nativo ou `vue-datepicker`

---

## 🎯 Diferenças com Página Atual

### **`/pedidos` (ATUAL - Operação do Dia)**
```
Foco: Agilidade e visualização rápida
Layout: Kanban visual com cards
Dados: Apenas pedidos ativos (últimas 5h de concluídos)
Atualização: Real-time (notificações de novos pedidos)
Uso: Durante operação da pizzaria
```

### **`/pedidos/historico` (NOVO - Consultas e Relatórios)**
```
Foco: Busca detalhada e análise
Layout: Tabela completa com filtros
Dados: TODOS os pedidos (sem limite de tempo)
Atualização: Manual (botão refresh)
Uso: Consultas, relatórios, análises
```

---

## 📱 Responsividade

### **Desktop (> 1024px)**
- Tabela completa com todas as colunas
- Filtros lado a lado
- Paginação horizontal

### **Tablet (768px - 1024px)**
- Tabela com scroll horizontal
- Filtros em 2 linhas
- Cards expandíveis opcionais

### **Mobile (< 768px)**
- Cards ao invés de tabela
- Filtros em accordion
- Busca em destaque
- Ações como bottom sheet

---

## ⚡ Performance

### **Otimizações:**
1. **Paginação:** Carrega apenas 20-50 pedidos por vez
2. **Debounce:** Busca só após 500ms de pausa na digitação
3. **Cache:** Armazena última busca para navegação rápida
4. **Lazy Loading:** Carrega detalhes só quando necessário
5. **Virtual Scroll:** Para listas muito grandes (futuro)

---

## 🧪 Estados da Interface

### **Loading:**
```
┌─────────────────────────────────────┐
│  ⏳ Carregando pedidos...           │
│  [Spinner animado]                  │
└─────────────────────────────────────┘
```

### **Empty (Sem resultados):**
```
┌─────────────────────────────────────┐
│  🔍 Nenhum pedido encontrado        │
│  Tente ajustar os filtros           │
│  [Limpar Filtros]                   │
└─────────────────────────────────────┘
```

### **Error:**
```
┌─────────────────────────────────────┐
│  ⚠️ Erro ao carregar pedidos        │
│  Verifique sua conexão              │
│  [Tentar Novamente]                 │
└─────────────────────────────────────┘
```

---

## 🎁 Funcionalidades Extras (Futuro)

### **Fase 2 (Opcional):**
- [ ] Gráfico de vendas por período
- [ ] Comparação com mês anterior
- [ ] Top 10 clientes
- [ ] Produtos mais vendidos
- [ ] Horários de pico
- [ ] Mapa de entregas (se tiver endereços)
- [ ] Tempo médio de preparo/entrega

---

## 📋 Resumo do que será implementado

### **✅ O que SERÁ criado:**
1. Página `/pedidos/historico`
2. Barra de busca com múltiplos critérios
3. Filtros avançados (período, status, tipo)
4. Tabela completa com todos os pedidos
5. Paginação eficiente
6. Estatísticas do período
7. Exportação Excel e PDF
8. Modal de detalhes do pedido
9. Responsividade completa
10. Estados de loading/error/empty

### **✅ O que NÃO SERÁ alterado:**
- Página `/pedidos` atual (Kanban)
- Sistema de notificações real-time
- Funcionalidades operacionais do dia
- Fluxo de trabalho atual

---

## ⏱️ Tempo de Implementação Estimado

```
📝 Estrutura base (página + componentes): 1h
🔍 Sistema de busca e filtros:           1h  
📊 Tabela e paginação:                   45min
📥 Exportação Excel/PDF:                 45min
🧪 Testes e ajustes:                     30min
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:                                   ~4h
```

---

## 🚀 Próximos Passos

Se você aprovar esta solução, vou:

1. ✅ Criar a página `/pedidos/historico`
2. ✅ Implementar busca e filtros
3. ✅ Criar tabela com paginação
4. ✅ Adicionar exportação
5. ✅ Testar responsividade
6. ✅ Subir no GitHub

**Quer que eu implemente a OPÇÃO 2?** 🎯
