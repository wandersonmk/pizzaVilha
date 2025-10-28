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
  },
  // Pedidos de 1 dia atrás
  {
    id: '6',
    numero_pedido: 1006,
    nome_cliente: 'Carlos Lima',
    endereco_entrega: 'Rua dos Pássaros, 321',
    telefone_cliente: '(11) 55555-5555',
    pedido: 'Pizza Calabresa M, Refrigerante Lata',
    valor_total: 34.90,
    valor_entrega: 4.50,
    forma_pagamento: 'cartao',
    tipo_retirada: 'entrega',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '7',
    numero_pedido: 1007,
    nome_cliente: 'Fernanda Souza',
    telefone_cliente: '(11) 44444-4444',
    pedido: 'Açaí 500ml com morango',
    valor_total: 15.90,
    forma_pagamento: 'dinheiro',
    tipo_retirada: 'retirada',
    troco: 20.00,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString()
  },
  // Pedidos de 3 dias atrás
  {
    id: '8',
    numero_pedido: 1008,
    nome_cliente: 'Ricardo Pereira',
    endereco_entrega: 'Av. Central, 987',
    telefone_cliente: '(11) 33333-3333',
    pedido: 'X-Tudo, Batata Frita G, Coca-Cola 2L',
    valor_total: 47.80,
    valor_entrega: 6.00,
    forma_pagamento: 'cartao',
    tipo_retirada: 'entrega',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '9',
    numero_pedido: 1009,
    nome_cliente: 'Juliana Martins',
    telefone_cliente: '(11) 22222-2222',
    pedido: 'Salada Caesar, Suco Natural',
    valor_total: 23.50,
    forma_pagamento: 'dinheiro',
    tipo_retirada: 'retirada',
    troco: 25.00,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString()
  },
  // Pedidos de 4 dias atrás (12/09/2025)
  {
    id: '24',
    numero_pedido: 1024,
    nome_cliente: 'Marcos Silva',
    endereco_entrega: 'Rua do Comércio, 456',
    telefone_cliente: '(11) 99998-7777',
    pedido: 'Pizza Pepperoni M, Coca-Cola Lata',
    valor_total: 36.90,
    valor_entrega: 4.50,
    forma_pagamento: 'cartao',
    tipo_retirada: 'entrega',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '25',
    numero_pedido: 1025,
    nome_cliente: 'Sofia Lima',
    telefone_cliente: '(11) 88887-6666',
    pedido: 'Hambúrguer Vegetariano, Batata Doce',
    valor_total: 42.50,
    forma_pagamento: 'dinheiro',
    tipo_retirada: 'retirada',
    troco: 50.00,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString()
  },
  // Pedidos de 5 dias atrás (11/09/2025)
  {
    id: '10',
    numero_pedido: 1010,
    nome_cliente: 'Roberto Silva',
    endereco_entrega: 'Rua das Palmeiras, 654',
    telefone_cliente: '(11) 11111-1111',
    pedido: 'Pizza Portuguesa G, Guaraná 2L',
    valor_total: 59.90,
    valor_entrega: 5.50,
    forma_pagamento: 'cartao',
    tipo_retirada: 'entrega',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '11',
    numero_pedido: 1011,
    nome_cliente: 'Carla Santos',
    telefone_cliente: '(11) 99998-8888',
    pedido: 'Sanduíche Natural, Água',
    valor_total: 12.90,
    forma_pagamento: 'dinheiro',
    tipo_retirada: 'retirada',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 - 1 * 60 * 60 * 1000).toISOString()
  },
  // Pedidos de 6 dias atrás (10/09/2025)
  {
    id: '26',
    numero_pedido: 1026,
    nome_cliente: 'Daniel Oliveira',
    endereco_entrega: 'Av. Brasil, 789',
    telefone_cliente: '(11) 77776-5555',
    pedido: 'Pizza Margherita G, Refrigerante 2L',
    valor_total: 48.90,
    valor_entrega: 5.00,
    forma_pagamento: 'cartao',
    tipo_retirada: 'entrega',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '27',
    numero_pedido: 1027,
    nome_cliente: 'Beatriz Costa',
    telefone_cliente: '(11) 66665-4444',
    pedido: 'Wrap de Frango, Suco de Maracujá',
    valor_total: 24.80,
    forma_pagamento: 'dinheiro',
    tipo_retirada: 'retirada',
    troco: 30.00,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString()
  },
  // Pedidos de 7 dias atrás (1 semana)
  {
    id: '12',
    numero_pedido: 1012,
    nome_cliente: 'Eduardo Costa',
    endereco_entrega: 'Rua do Sol, 147',
    telefone_cliente: '(11) 77776-6666',
    pedido: 'Pizza Quatro Queijos M, Coca-Cola Lata',
    observacao: 'Massa fina',
    valor_total: 38.90,
    valor_entrega: 4.00,
    forma_pagamento: 'cartao',
    tipo_retirada: 'entrega',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '13',
    numero_pedido: 1013,
    nome_cliente: 'Patrícia Lima',
    telefone_cliente: '(11) 55554-4444',
    pedido: 'Misto Quente (x2), Café',
    valor_total: 16.80,
    forma_pagamento: 'dinheiro',
    tipo_retirada: 'retirada',
    troco: 20.00,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000).toISOString()
  },
  // Pedidos de 10 dias atrás
  {
    id: '14',
    numero_pedido: 1014,
    nome_cliente: 'Marcos Oliveira',
    endereco_entrega: 'Av. das Nações, 852',
    telefone_cliente: '(11) 33332-2222',
    pedido: 'Hambúrguer Bacon, Batata Rústica, Milkshake',
    valor_total: 54.70,
    valor_entrega: 7.00,
    forma_pagamento: 'cartao',
    tipo_retirada: 'entrega',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '15',
    numero_pedido: 1015,
    nome_cliente: 'Luciana Ferreira',
    telefone_cliente: '(11) 99997-7777',
    pedido: 'Wrap de Frango, Suco de Uva',
    valor_total: 21.40,
    forma_pagamento: 'dinheiro',
    tipo_retirada: 'retirada',
    troco: 25.00,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString()
  },
  // Pedidos de 15 dias atrás
  {
    id: '16',
    numero_pedido: 1016,
    nome_cliente: 'Antonio Ribeiro',
    endereco_entrega: 'Rua da Esperança, 741',
    telefone_cliente: '(11) 88887-7777',
    pedido: 'Pizza Frango com Catupiry G, Guaraná Lata (x2)',
    valor_total: 45.80,
    valor_entrega: 5.00,
    forma_pagamento: 'cartao',
    tipo_retirada: 'entrega',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '17',
    numero_pedido: 1017,
    nome_cliente: 'Renata Almeida',
    telefone_cliente: '(11) 66665-5555',
    pedido: 'Coxinha (x4), Refrigerante',
    valor_total: 18.60,
    forma_pagamento: 'dinheiro',
    tipo_retirada: 'retirada',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000).toISOString()
  },
  // Pedidos de 20 dias atrás
  {
    id: '18',
    numero_pedido: 1018,
    nome_cliente: 'Gabriel Santos',
    endereco_entrega: 'Rua Nova, 159',
    telefone_cliente: '(11) 44443-3333',
    pedido: 'Pizza Vegetariana M, Água com Gás',
    observacao: 'Sem azeitona',
    valor_total: 32.90,
    valor_entrega: 3.50,
    forma_pagamento: 'cartao',
    tipo_retirada: 'entrega',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '19',
    numero_pedido: 1019,
    nome_cliente: 'Isabela Costa',
    telefone_cliente: '(11) 22221-1111',
    pedido: 'Pão de Açúcar, Café Expresso',
    valor_total: 8.90,
    forma_pagamento: 'dinheiro',
    tipo_retirada: 'retirada',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000 - 1 * 60 * 60 * 1000).toISOString()
  },
  // Pedidos de 25 dias atrás
  {
    id: '20',
    numero_pedido: 1020,
    nome_cliente: 'Thiago Moreira',
    endereco_entrega: 'Av. Paulista, 963',
    telefone_cliente: '(11) 99996-6666',
    pedido: 'Pizza Suprema G, Coca-Cola 2L, Sorvete',
    valor_total: 68.70,
    valor_entrega: 8.00,
    forma_pagamento: 'cartao',
    tipo_retirada: 'entrega',
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '21',
    numero_pedido: 1021,
    nome_cliente: 'Amanda Silva',
    telefone_cliente: '(11) 77775-5555',
    pedido: 'Tapioca de Queijo, Suco de Laranja',
    valor_total: 14.50,
    forma_pagamento: 'dinheiro',
    tipo_retirada: 'retirada',
    troco: 15.00,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString()
  },
  // Pedidos de 30 dias atrás (1 mês)
  {
    id: '22',
    numero_pedido: 1022,
    nome_cliente: 'Leonardo Dias',
    endereco_entrega: 'Rua dos Anjos, 258',
    telefone_cliente: '(11) 55554-4444',
    pedido: 'Pizza Napolitana M, Guaraná 2L',
    observacao: 'Massa grossa',
    valor_total: 42.90,
    valor_entrega: 4.50,
    forma_pagamento: 'cartao',
    tipo_retirada: 'entrega',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '23',
    numero_pedido: 1023,
    nome_cliente: 'Vanessa Rocha',
    telefone_cliente: '(11) 33332-2222',
    pedido: 'Vitamina de Banana, Pão Integral',
    valor_total: 11.80,
    forma_pagamento: 'dinheiro',
    tipo_retirada: 'retirada',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 - 1 * 60 * 60 * 1000).toISOString()
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