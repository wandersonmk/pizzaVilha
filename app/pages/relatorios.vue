<template>
  <div class="w-full">
    <!-- Header com Indicadores (Desktop) -->
    <div class="hidden md:flex items-center justify-between mb-8">
      <div class="flex items-center">
        <i class="fas fa-chart-bar text-2xl text-blue-600 mr-3"></i>
        <div>
          <h1 class="text-xl font-semibold text-foreground">Relatórios</h1>
          <p class="text-sm text-muted-foreground">Análise e controle de pedidos</p>
        </div>
      </div>

      <!-- Indicadores Rápidos (Desktop) -->
      <div class="flex items-center space-x-6">
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ totalPedidos }}</div>
          <div class="text-xs text-muted-foreground">Total Pedidos</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">
            R$ {{ totalValor.toFixed(2).replace('.', ',') }}
          </div>
          <div class="text-xs text-muted-foreground">Valor Total</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">
            R$ {{ ticketMedio.toFixed(2).replace('.', ',') }}
          </div>
          <div class="text-xs text-muted-foreground">Ticket Médio</div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="mb-6">
      <FiltrosPedidos 
        v-model="filtros"
        @export="exportarRelatorio"
      />
    </div>

    <!-- Cards de Resumo (Mobile) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:hidden">
      <div class="bg-card rounded-lg shadow-sm border border-border p-4 text-center">
        <div class="text-lg font-bold text-green-600">{{ totalPedidos }}</div>
        <div class="text-sm text-muted-foreground">Total Pedidos</div>
      </div>
      <div class="bg-card rounded-lg shadow-sm border border-border p-4 text-center">
        <div class="text-lg font-bold text-blue-600">
          R$ {{ totalValor.toFixed(2).replace('.', ',') }}
        </div>
        <div class="text-sm text-muted-foreground">Valor Total</div>
      </div>
      <div class="bg-card rounded-lg shadow-sm border border-border p-4 text-center">
        <div class="text-lg font-bold text-purple-600">
          R$ {{ ticketMedio.toFixed(2).replace('.', ',') }}
        </div>
        <div class="text-sm text-muted-foreground">Ticket Médio</div>
      </div>
    </div>

    <!-- Tabela de Pedidos - Container com largura máxima removida -->
    <div class="mb-8">
      <TabelaPedidos 
        :pedidos="pedidosMock"
        :filtros="filtros"
      />
    </div>

    <!-- Cards de Análise -->
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Clientes -->
      <div class="bg-card rounded-lg shadow-sm border border-border">
        <div class="px-6 py-4 border-b border-border">
          <h3 class="text-lg font-semibold text-foreground">
            <i class="fas fa-users mr-2 text-green-600"></i>
            Top Clientes
          </h3>
        </div>
        <div class="p-6">
          <div v-for="(cliente, index) in topClientes" :key="cliente.nome" class="flex items-center justify-between py-2">
            <div class="flex items-center">
              <span class="flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mr-3" 
                    :class="index === 0 ? 'bg-yellow-100 text-yellow-800' : index === 1 ? 'bg-gray-100 text-gray-800' : index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'">
                {{ index + 1 }}
              </span>
              <span class="text-sm font-medium text-foreground">{{ cliente.nome }}</span>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-foreground">{{ cliente.pedidos }} pedidos</div>
              <div class="text-xs text-muted-foreground">R$ {{ cliente.valor.toFixed(2).replace('.', ',') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Análise de Pagamentos -->
      <div class="bg-card rounded-lg shadow-sm border border-border">
        <div class="px-6 py-4 border-b border-border">
          <h3 class="text-lg font-semibold text-foreground">
            <i class="fas fa-credit-card mr-2 text-blue-600"></i>
            Formas de Pagamento
          </h3>
        </div>
        <div class="p-6">
          <div v-for="pagamento in analisePagamentos" :key="pagamento.tipo" class="flex items-center justify-between py-2">
            <div class="flex items-center">
              <div class="w-4 h-4 rounded mr-3" :class="pagamento.tipo === 'dinheiro' ? 'bg-green-500' : 'bg-blue-500'"></div>
              <span class="text-sm font-medium text-foreground">{{ pagamento.label }}</span>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-foreground">{{ pagamento.pedidos }} pedidos</div>
              <div class="text-xs text-muted-foreground">{{ pagamento.percentual }}%</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Layout
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Interfaces
interface Filtros {
  dataInicio?: string
  dataFim?: string
  numeroPedido?: string
  nomeCliente?: string
  formaPagamento?: string
  tipoRetirada?: string
  valorMinimo?: string
}

interface Pedido {
  id: string
  numero_pedido: number
  nome_cliente: string
  endereco_entrega?: string
  telefone_cliente?: string
  pedido: string
  observacao?: string
  valor_total: number
  valor_entrega?: number
  forma_pagamento: 'dinheiro' | 'cartao'
  tipo_retirada: 'retirada' | 'entrega'
  troco?: number
  created_at: string
}

// State
const filtros = ref<Filtros>({})

// Mock de dados para demonstração
const pedidosMock = ref<Pedido[]>([
  {
    id: '1',
    numero_pedido: 1001,
    nome_cliente: 'João Silva',
    endereco_entrega: 'Rua das Flores, 123',
    telefone_cliente: '(11) 99999-9999',
    pedido: 'Pizza Margherita G, Coca-Cola 2L (x2)',
    observacao: 'Sem cebola na pizza',
    valor_total: 51.90,
    valor_entrega: 5.00,
    forma_pagamento: 'dinheiro',
    tipo_retirada: 'entrega',
    troco: 60.00,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    numero_pedido: 1002,
    nome_cliente: 'Maria Santos',
    telefone_cliente: '(11) 88888-8888',
    pedido: 'Hambúrguer Artesanal (x2), Batata Frita',
    valor_total: 63.80,
    forma_pagamento: 'cartao',
    tipo_retirada: 'retirada',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    numero_pedido: 1003,
    nome_cliente: 'Pedro Costa',
    endereco_entrega: 'Av. Principal, 456',
    telefone_cliente: '(11) 77777-7777',
    pedido: 'Lasanha Bolonhesa',
    valor_total: 28.90,
    forma_pagamento: 'dinheiro',
    tipo_retirada: 'entrega',
    valor_entrega: 3.50,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    numero_pedido: 1004,
    nome_cliente: 'Ana Paula',
    endereco_entrega: 'Rua Verde, 789',
    telefone_cliente: '(11) 66666-6666',
    pedido: 'Esfiha de Carne (x3), Suco de Laranja',
    valor_total: 28.50,
    valor_entrega: 4.00,
    forma_pagamento: 'cartao',
    tipo_retirada: 'entrega',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    numero_pedido: 1005,
    nome_cliente: 'João Silva',
    pedido: 'Pastel de Queijo (x2), Guaraná 1L',
    telefone_cliente: '(11) 99999-9999',
    valor_total: 17.50,
    forma_pagamento: 'dinheiro',
    tipo_retirada: 'retirada',
    troco: 20.00,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
])

// Computed
const totalPedidos = computed(() => pedidosMock.value.length)

const totalValor = computed(() => {
  return pedidosMock.value.reduce((total, pedido) => {
    return total + pedido.valor_total + (pedido.valor_entrega || 0)
  }, 0)
})

const ticketMedio = computed(() => {
  return totalPedidos.value > 0 ? totalValor.value / totalPedidos.value : 0
})

const topClientes = computed(() => {
  const clientesMap = new Map()
  
  pedidosMock.value.forEach(pedido => {
    const nome = pedido.nome_cliente
    if (clientesMap.has(nome)) {
      const cliente = clientesMap.get(nome)
      cliente.pedidos++
      cliente.valor += pedido.valor_total + (pedido.valor_entrega || 0)
    } else {
      clientesMap.set(nome, {
        nome,
        pedidos: 1,
        valor: pedido.valor_total + (pedido.valor_entrega || 0)
      })
    }
  })
  
  return Array.from(clientesMap.values())
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5)
})

const analisePagamentos = computed(() => {
  const dinheiro = pedidosMock.value.filter(p => p.forma_pagamento === 'dinheiro').length
  const cartao = pedidosMock.value.filter(p => p.forma_pagamento === 'cartao').length
  const total = pedidosMock.value.length
  
  return [
    {
      tipo: 'dinheiro',
      label: 'Dinheiro',
      pedidos: dinheiro,
      percentual: total > 0 ? Math.round((dinheiro / total) * 100) : 0
    },
    {
      tipo: 'cartao',
      label: 'Cartão',
      pedidos: cartao,
      percentual: total > 0 ? Math.round((cartao / total) * 100) : 0
    }
  ]
})

// Methods
const exportarRelatorio = (filtrosExport: Filtros) => {
  // Implementar lógica de exportação
  console.log('Exportando relatório com filtros:', filtrosExport)
  // Aqui você pode usar os composables useExcelExport ou usePDFExport
}
</script>