# 📋 OPÇÃO 2: Histórico Separado - Detalhamento Completo

## 🎯 Visão Geral

Criar uma nova página `/pedidos/historico` dedicada exclusivamente para busca e visualização de pedidos históricos, mantendo a página `/pedidos` atual focada na operação do dia.

---

## 🖼️ Interface Visual Detalhada

### **1. Menu Sidebar - Adicionar novo link**

```
┌─────────────────────────────┐
│  🏠 Dashboard               │
│  📦 Pedidos          ←────  │  Atual (Kanban)
│     └─ 📊 Histórico  ←────  │  NOVO (Lista/Tabela)
│  📋 Cardápio                │
│  👥 Clientes                │
│  ⚙️  Configurações          │
└─────────────────────────────┘
```

### **2. Página Histórico - Layout Completo**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Histórico de Pedidos                                                       │
│  Visualize e pesquise todos os pedidos do sistema                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🔍 BUSCA RÁPIDA                                                           │
│  ┌───────────────┬───────────────┬───────────────┬──────────────────────┐ │
│  │ 🔢 Nº Pedido  │ 👤 Cliente    │ 📱 Telefone   │    [🔍 Buscar]       │ │
│  │ ex: 40        │ ex: João      │ ex: 479999    │    [🔄 Limpar]       │ │
│  └───────────────┴───────────────┴───────────────┴──────────────────────┘ │
│                                                                             │
│  🎚️ FILTROS AVANÇADOS                                     [▼ Expandir]     │
│  ┌────────────────────────────────────────────────────────────────────────┐│
│  │ 📅 Período                                                             ││
│  │ ┌──────────────┐  até  ┌──────────────┐                              ││
│  │ │ 01/10/2025   │   →   │ 31/10/2025   │                              ││
│  │ └──────────────┘       └──────────────┘                              ││
│  │                                                                        ││
│  │ 📊 Status          🛵 Tipo Entrega      💳 Pagamento                 ││
│  │ ☑ Novo             ☑ Entrega            ☑ Dinheiro                   ││
│  │ ☑ Cozinha          ☑ Retirada           ☑ Cartão                     ││
│  │ ☑ Entrega          ☑ Todos              ☑ Pix                        ││
│  │ ☑ Concluído                             ☑ Todos                      ││
│  │                                                                        ││
│  │ 💰 Faixa de Valor                                                     ││
│  │ ┌─────────┐  até  ┌─────────┐                                        ││
│  │ │ R$ 0,00 │   →   │ R$ 500  │                                        ││
│  │ └─────────┘       └─────────┘                                        ││
│  └────────────────────────────────────────────────────────────────────────┘│
│                                                                             │
│  📊 ESTATÍSTICAS DO PERÍODO                                                │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐               │
│  │ 📦 Total    │ 💰 Receita  │ 📊 Ticket   │ 🛵 Entregas │               │
│  │ 234 pedidos │ R$ 12.450   │ R$ 53,20    │ 189 (81%)   │               │
│  └─────────────┴─────────────┴─────────────┴─────────────┘               │
│                                                                             │
│  📋 RESULTADOS (234 pedidos encontrados)        [📥 Excel] [📄 PDF]        │
│  ┌──┬───┬────────────┬──────────┬─────────┬────────┬────────┬─────┬────┐ │
│  │✓ │Nº │ Cliente    │ Telefone │ Valor   │ Data   │ Hora   │Tipo │Stat││ │
│  ├──┼───┼────────────┼──────────┼─────────┼────────┼────────┼─────┼────┤ │
│  │☐ │40 │João Silva  │47999999  │R$ 50,00 │31/10   │19:45   │🛵   │✓   ││ │
│  │☐ │39 │Maria Costa │47988888  │R$ 45,00 │31/10   │19:30   │📦   │✓   ││ │
│  │☐ │38 │Pedro Lima  │47977777  │R$ 75,00 │31/10   │19:15   │🛵   │✓   ││ │
│  │☐ │37 │Ana Santos  │47966666  │R$ 60,00 │31/10   │18:50   │🛵   │✓   ││ │
│  │☐ │36 │Carlos Bia  │47955555  │R$ 85,00 │31/10   │18:30   │📦   │✓   ││ │
│  │  │... mais 229 linhas                                                ││ │
│  └──┴───┴────────────┴──────────┴─────────┴────────┴────────┴─────┴────┘ │
│                                                                             │
│  ⏮️ Anterior | Página 1 de 12 | Próximo ⏭️         [20 por página ▼]      │
│                                                                             │
│  💡 Dica: Clique em qualquer linha para ver detalhes do pedido            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### **3. Modal de Detalhes (ao clicar em um pedido)**

```
┌─────────────────────────────────────────────────────────┐
│  Detalhes do Pedido #40                            [✕]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  👤 CLIENTE                                             │
│  Nome: João Silva                                       │
│  Telefone: (47) 99999-9999                             │
│  Endereço: Rua das Flores, 123, Centro                 │
│                                                         │
│  📦 PEDIDO                                              │
│  • 1x Pizza Grande Calabresa - R$ 45,00                │
│  • 1x Coca-Cola 2L - R$ 5,00                           │
│                                                         │
│  📝 Observações:                                        │
│  Sem cebola, bem assada                                │
│                                                         │
│  💰 VALORES                                             │
│  Subtotal: R$ 50,00                                    │
│  Taxa de Entrega: R$ 5,00                              │
│  Total: R$ 55,00                                       │
│                                                         │
│  📊 INFORMAÇÕES                                         │
│  Tipo: Entrega 🛵                                       │
│  Pagamento: Dinheiro 💵                                 │
│  Troco para: R$ 100,00                                 │
│  Status: Concluído ✓                                   │
│  Data: 31/10/2025 às 19:45                            │
│                                                         │
│  [📄 Imprimir] [📧 Enviar por Email] [Fechar]          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Arquivos

```
app/
├─ pages/
│  └─ pedidos/
│     └─ historico.vue              ← Nova página principal
├─ components/
│  ├─ HistoricoPedidos.vue          ← Componente principal
│  ├─ HistoricoPedidosFiltros.vue   ← Filtros avançados
│  ├─ HistoricoPedidosTabela.vue    ← Tabela de resultados
│  ├─ HistoricoPedidosStats.vue     ← Estatísticas do período
│  └─ TabelaPedidos.vue              ← Já existe, reutilizar
└─ composables/
   └─ useHistoricoPedidos.ts        ← Lógica de busca e filtros
```

---

## 🔧 Funcionalidades Detalhadas

### **1. Busca Rápida**
```typescript
// Campos de busca
- Número do Pedido: Busca exata (#40)
- Nome do Cliente: Busca parcial (João encontra João Silva)
- Telefone: Busca parcial (479 encontra 47999999999)
```

### **2. Filtros Avançados**

#### **📅 Período (Date Range)**
```
- De: 01/10/2025
- Até: 31/10/2025
- Atalhos rápidos:
  • Hoje
  • Últimos 7 dias
  • Este mês
  • Mês passado
  • Personalizado
```

#### **📊 Status (Multi-select)**
```
☑ Novo
☑ Cozinha
☑ Entrega
☑ Concluído
☑ Cancelado (se existir)
```

#### **🛵 Tipo de Entrega**
```
○ Todos
○ Apenas Entrega
○ Apenas Retirada
```

#### **💳 Forma de Pagamento**
```
☑ Dinheiro
☑ Cartão
☑ Pix
☑ Outros
```

#### **💰 Faixa de Valor**
```
Min: R$ 0,00
Max: R$ 500,00
```

### **3. Ordenação de Colunas**

Clicar no cabeçalho para ordenar:
```
• Nº Pedido: ↑ Crescente / ↓ Decrescente
• Cliente: A→Z / Z→A
• Valor: Menor→Maior / Maior→Menor
• Data: Mais antigo→Mais recente / Mais recente→Mais antigo
```

### **4. Paginação**

```typescript
// Opções de itens por página
- 20 pedidos por página (padrão)
- 50 pedidos por página
- 100 pedidos por página

// Navegação
- « Anterior
- Página 1 de 12
- Próximo »
```

### **5. Seleção em Massa**

```
☑ Selecionar todos da página
☐ Pedido #40
☐ Pedido #39
☐ Pedido #38

Ações em lote:
[📥 Exportar Selecionados]
[📧 Enviar por Email]
[🖨️ Imprimir Selecionados]
```

### **6. Exportação**

#### **Excel (.xlsx)**
```typescript
Inclui:
- Todas as colunas da tabela
- Formatação de valores (R$)
- Formatação de datas
- Total de pedidos
- Soma de valores
- Nome do arquivo: pedidos_01-10-2025_31-10-2025.xlsx
```

#### **PDF**
```typescript
Inclui:
- Cabeçalho com logo e nome da empresa
- Período do relatório
- Lista de pedidos formatada
- Estatísticas do período
- Total de páginas
- Data de geração
- Nome do arquivo: relatorio_pedidos_outubro_2025.pdf
```

---

## 💻 Código de Exemplo

### **1. Página `/pedidos/historico.vue`**

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

useHead({
  title: 'Histórico de Pedidos - Pizza Vilha'
})
</script>

<template>
  <div>
    <HistoricoPedidos />
  </div>
</template>
```

### **2. Composable `useHistoricoPedidos.ts`**

```typescript
export const useHistoricoPedidos = () => {
  const supabase = useSupabaseClient()
  
  // Estados
  const pedidos = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Filtros
  const filtros = ref({
    numeroPedido: '',
    nomeCliente: '',
    telefone: '',
    dataInicio: '',
    dataFim: '',
    status: [] as string[],
    tipoEntrega: 'todos',
    formaPagamento: [] as string[],
    valorMin: 0,
    valorMax: 1000
  })
  
  // Paginação
  const paginaAtual = ref(1)
  const itensPorPagina = ref(20)
  const totalPedidos = ref(0)
  
  // Buscar pedidos com filtros
  const buscarPedidos = async () => {
    loading.value = true
    error.value = null
    
    try {
      let query = supabase
        .from('pedidos')
        .select('*', { count: 'exact' })
      
      // Aplicar filtros
      if (filtros.value.numeroPedido) {
        query = query.eq('numero_pedido', filtros.value.numeroPedido)
      }
      
      if (filtros.value.nomeCliente) {
        query = query.ilike('nome_cliente', `%${filtros.value.nomeCliente}%`)
      }
      
      if (filtros.value.telefone) {
        query = query.ilike('telefone_cliente', `%${filtros.value.telefone}%`)
      }
      
      if (filtros.value.dataInicio) {
        query = query.gte('created_at', filtros.value.dataInicio)
      }
      
      if (filtros.value.dataFim) {
        query = query.lte('created_at', filtros.value.dataFim)
      }
      
      if (filtros.value.status.length > 0) {
        query = query.in('status', filtros.value.status)
      }
      
      if (filtros.value.tipoEntrega !== 'todos') {
        query = query.eq('tipo_retirada', filtros.value.tipoEntrega)
      }
      
      // Paginação
      const inicio = (paginaAtual.value - 1) * itensPorPagina.value
      const fim = inicio + itensPorPagina.value - 1
      
      query = query
        .range(inicio, fim)
        .order('created_at', { ascending: false })
      
      const { data, error: err, count } = await query
      
      if (err) throw err
      
      pedidos.value = data || []
      totalPedidos.value = count || 0
      
    } catch (err: any) {
      error.value = err.message
      console.error('Erro ao buscar pedidos:', err)
    } finally {
      loading.value = false
    }
  }
  
  // Estatísticas
  const estatisticas = computed(() => {
    const total = pedidos.value.length
    const receita = pedidos.value.reduce((sum, p) => sum + (p.valor_total || 0), 0)
    const ticketMedio = total > 0 ? receita / total : 0
    const entregas = pedidos.value.filter(p => p.tipo_retirada === 'entrega').length
    const percentualEntregas = total > 0 ? (entregas / total) * 100 : 0
    
    return {
      total,
      receita,
      ticketMedio,
      entregas,
      percentualEntregas
    }
  })
  
  // Exportar para Excel
  const exportarExcel = async () => {
    // Implementar exportação
    console.log('Exportando para Excel...')
  }
  
  // Exportar para PDF
  const exportarPDF = async () => {
    // Implementar exportação
    console.log('Exportando para PDF...')
  }
  
  return {
    pedidos,
    loading,
    error,
    filtros,
    paginaAtual,
    itensPorPagina,
    totalPedidos,
    estatisticas,
    buscarPedidos,
    exportarExcel,
    exportarPDF
  }
}
```

---

## 🎨 Paleta de Cores e Ícones

### **Status**
```
🔵 Novo      → Azul   (#3B82F6)
🟠 Cozinha   → Laranja (#F59E0B)
🟣 Entrega   → Roxo   (#8B5CF6)
🟢 Concluído → Verde  (#10B981)
🔴 Cancelado → Vermelho (#EF4444)
```

### **Tipo de Entrega**
```
🛵 Entrega  → Ícone de moto
📦 Retirada → Ícone de pacote
```

### **Forma de Pagamento**
```
💵 Dinheiro → Ícone de dinheiro
💳 Cartão   → Ícone de cartão
📱 Pix      → Ícone de celular
```

---

## 📊 Casos de Uso Práticos

### **1. Cliente liga perguntando sobre pedido**
```
Atendente:
1. Vai em Pedidos → Histórico
2. Digita número do telefone: "479999"
3. Encontra todos os pedidos daquele cliente
4. Clica no pedido para ver detalhes
5. Informa status ao cliente
```

### **2. Fechamento de caixa mensal**
```
Gerente:
1. Vai em Pedidos → Histórico
2. Seleciona período: 01/10 até 31/10
3. Vê estatísticas: Total R$ 12.450, 234 pedidos
4. Clica em "Exportar Excel"
5. Abre no Excel para análise
```

### **3. Verificar pedidos de entrega específicos**
```
Pizzaiolo:
1. Vai em Pedidos → Histórico
2. Filtra: Tipo = Entrega, Status = Concluído
3. Filtra: Período = Hoje
4. Vê quantas entregas foram feitas
5. Clica em "Exportar PDF" para imprimir lista
```

---

## ⏱️ Cronograma de Implementação

### **Fase 1: Estrutura Base (1h)**
- [ ] Criar página `/pedidos/historico.vue`
- [ ] Criar composable `useHistoricoPedidos.ts`
- [ ] Adicionar link no sidebar
- [ ] Estrutura básica do componente

### **Fase 2: Busca e Filtros (1h)**
- [ ] Campos de busca rápida
- [ ] Filtros avançados expansíveis
- [ ] Date picker para período
- [ ] Multi-select para status
- [ ] Integração com Supabase

### **Fase 3: Tabela e Paginação (45min)**
- [ ] Reutilizar `TabelaPedidos`
- [ ] Adicionar paginação
- [ ] Ordenação por colunas
- [ ] Loading states
- [ ] Empty states

### **Fase 4: Estatísticas e Extras (45min)**
- [ ] Card de estatísticas
- [ ] Exportação Excel (básica)
- [ ] Exportação PDF (básica)
- [ ] Modal de detalhes
- [ ] Testes finais

---

## 🚀 Está pronto para implementar?

**Resumo:**
- ✅ Interface completa e profissional
- ✅ Busca rápida por nº, nome ou telefone
- ✅ Filtros avançados (data, status, tipo, pagamento, valor)
- ✅ Estatísticas do período
- ✅ Paginação eficiente
- ✅ Exportação Excel e PDF
- ✅ Modal de detalhes
- ✅ ~3 horas de implementação

**Quer que eu implemente agora?** 🎯
