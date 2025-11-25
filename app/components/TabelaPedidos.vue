<template>
  <div class="bg-card rounded-lg shadow-sm border border-border">
    <!-- Header da Tabela -->
    <div class="px-6 py-4 border-b border-border">
      <h3 class="text-lg font-semibold text-foreground">
        Relatório de Pedidos
      </h3>
      <p class="text-sm text-muted-foreground mt-1">
        {{ pedidosFiltrados.length }} pedidos encontrados
      </p>
    </div>

    <!-- Tabela Responsiva com Scroll Vertical e Horizontal apenas em mobile -->
    <div class="overflow-y-auto max-h-96 overflow-x-auto lg:overflow-x-visible">
      <table class="w-full divide-y divide-border min-w-full lg:min-w-0">
        <!-- Cabeçalho -->
        <thead class="bg-muted">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Nº Pedido
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Cliente
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Telefone
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pedido
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Valor Total
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pagamento
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tipo
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Data
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>

        <!-- Corpo da Tabela -->
        <tbody class="bg-card divide-y divide-border">
          <tr 
            v-for="pedido in pedidosFiltrados" 
            :key="pedido.id"
            @click="abrirDetalhesPedido(pedido)"
            class="hover:bg-muted/50 transition-colors duration-150 cursor-pointer"
          >
            <!-- Número do Pedido -->
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
              #{{ pedido.numero_pedido }}
            </td>

            <!-- Cliente -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-foreground">{{ pedido.nome_cliente }}</div>
              <div v-if="pedido.endereco_entrega" class="text-sm text-muted-foreground truncate max-w-xs">
                {{ pedido.endereco_entrega }}
              </div>
            </td>

            <!-- Telefone -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
              {{ pedido.telefone_cliente || '-' }}
            </td>

            <!-- Pedido -->
            <td class="px-6 py-4">
              <div class="text-sm text-foreground max-w-xs truncate" :title="pedido.pedido">
                {{ pedido.pedido }}
              </div>
              <div v-if="pedido.observacao" class="text-sm text-muted-foreground max-w-xs truncate" :title="pedido.observacao">
                Obs: {{ pedido.observacao }}
              </div>
            </td>

            <!-- Valor Total -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
              <div class="font-medium">
                R$ {{ (Number(pedido.valor_total || 0) + Number(pedido.valor_entrega || 0)).toFixed(2).replace('.', ',') }}
              </div>
            </td>

            <!-- Forma de Pagamento -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getPaymentBadgeClass(pedido.forma_pagamento)">
                {{ getPaymentLabel(pedido.forma_pagamento) }}
              </span>
              <div v-if="pedido.troco && pedido.troco > 0" class="text-xs text-gray-500 mt-1">
                Troco: R$ {{ Number(pedido.troco).toFixed(2).replace('.', ',') }}
              </div>
            </td>

            <!-- Tipo de Retirada -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getDeliveryBadgeClass(pedido.tipo_retirada)">
                {{ getDeliveryLabel(pedido.tipo_retirada) }}
              </span>
            </td>

            <!-- Data -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
              {{ formatDate(pedido.created_at) }}
            </td>

            <!-- Status (simulado baseado na data) -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusBadgeClass(getStatus(pedido.created_at))">
                {{ getStatusLabel(getStatus(pedido.created_at)) }}
              </span>
            </td>
          </tr>

          <!-- Estado vazio -->
          <tr v-if="pedidosFiltrados.length === 0">
            <td colspan="9" class="px-6 py-12 text-center">
              <div class="text-muted-foreground">
                <i class="fas fa-receipt text-4xl mb-4"></i>
                <p class="text-lg font-medium">Nenhum pedido encontrado</p>
                <p class="text-sm">Tente ajustar os filtros ou verificar se há pedidos cadastrados</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer com paginação (futuro) -->
    <div class="px-6 py-3 bg-muted border-t border-border">
      <div class="flex items-center justify-between">
        <div class="text-sm text-muted-foreground">
          Exibindo {{ pedidosFiltrados.length }} de {{ pedidos.length }} pedidos
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes do Pedido -->
    <PedidoModal 
      v-if="pedidoSelecionado"
      :pedido="pedidoSelecionado"
      :is-open="isModalOpen"
      @close="fecharModal"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Estado do modal
const isModalOpen = ref(false)
const pedidoSelecionado = ref<Pedido | null>(null)

// Props
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

interface Props {
  pedidos: Pedido[]
  filtros?: {
    dataInicio?: string
    dataFim?: string
    numeroPedido?: string
    nomeCliente?: string
    formaPagamento?: string
    tipoRetirada?: string
    valorMinimo?: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  pedidos: () => [],
  filtros: () => ({})
})

// Computed para pedidos filtrados
const pedidosFiltrados = computed(() => {
  let resultado = [...props.pedidos]

  // Filtro por data - usando comparação de strings YYYY-MM-DD
  if (props.filtros?.dataInicio || props.filtros?.dataFim) {
    resultado = resultado.filter(pedido => {
      // Converter data do pedido para formato YYYY-MM-DD
      const dataPedido = new Date(pedido.created_at)
      const dataPedidoStr = dataPedido.getFullYear() + '-' + 
                           String(dataPedido.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(dataPedido.getDate()).padStart(2, '0')
      
      let incluir = true
      
      // Verificar data início
      if (props.filtros?.dataInicio) {
        const dataInicioStr = props.filtros.dataInicio // Já vem no formato YYYY-MM-DD
        incluir = incluir && dataPedidoStr >= dataInicioStr
      }
      
      // Verificar data fim
      if (props.filtros?.dataFim) {
        const dataFimStr = props.filtros.dataFim // Já vem no formato YYYY-MM-DD
        incluir = incluir && dataPedidoStr <= dataFimStr
      }
      
      return incluir
    })
  }

  // Filtro por número do pedido
  if (props.filtros?.numeroPedido) {
    resultado = resultado.filter(pedido => 
      pedido.numero_pedido.toString().includes(props.filtros!.numeroPedido!)
    )
  }

  // Filtro por nome do cliente
  if (props.filtros?.nomeCliente) {
    resultado = resultado.filter(pedido => 
      pedido.nome_cliente.toLowerCase().includes(props.filtros!.nomeCliente!.toLowerCase())
    )
  }

  // Filtro por forma de pagamento
  if (props.filtros?.formaPagamento) {
    resultado = resultado.filter(pedido => 
      pedido.forma_pagamento === props.filtros!.formaPagamento!
    )
  }

  // Filtro por tipo de retirada
  if (props.filtros?.tipoRetirada) {
    resultado = resultado.filter(pedido => 
      pedido.tipo_retirada === props.filtros!.tipoRetirada!
    )
  }

  // Filtro por valor mínimo
  if (props.filtros?.valorMinimo) {
    const valorMin = parseFloat(props.filtros.valorMinimo)
    if (!isNaN(valorMin)) {
      resultado = resultado.filter(pedido => 
        pedido.valor_total >= valorMin
      )
    }
  }

  // Ordenar por data mais recente
  return resultado.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

// Funções auxiliares
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPaymentLabel = (payment: string) => {
  const labels: Record<string, string> = {
    dinheiro: 'Dinheiro',
    cartao: 'Cartão',
    credito: 'Crédito',
    debito: 'Débito',
    pix: 'PIX'
  }
  return labels[payment] || payment
}

const getPaymentBadgeClass = (payment: string) => {
  const classes: Record<string, string> = {
    dinheiro: 'bg-green-100 text-green-800',
    cartao: 'bg-blue-100 text-blue-800',
    credito: 'bg-indigo-100 text-indigo-800',
    debito: 'bg-cyan-100 text-cyan-800',
    pix: 'bg-purple-100 text-purple-800'
  }
  return classes[payment] || 'bg-gray-100 text-gray-800'
}

const getDeliveryLabel = (type: string) => {
  const labels: Record<string, string> = {
    entrega: 'Entrega',
    retirada: 'Retirada'
  }
  return labels[type] || type
}

const getDeliveryBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    entrega: 'bg-purple-100 text-purple-800',
    retirada: 'bg-orange-100 text-orange-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

// Simular status baseado na data (mais recente = novo, mais antigo = concluído)
const getStatus = (dateString: string) => {
  const now = new Date()
  const pedidoDate = new Date(dateString)
  const diffHours = (now.getTime() - pedidoDate.getTime()) / (1000 * 60 * 60)

  if (diffHours < 1) return 'novo'
  if (diffHours < 2) return 'preparando'
  if (diffHours < 3) return 'pronto'
  return 'concluido'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    novo: 'Novo',
    preparando: 'Preparando',
    pronto: 'Pronto',
    concluido: 'Concluído'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    novo: 'bg-yellow-100 text-yellow-800',
    preparando: 'bg-blue-100 text-blue-800',
    pronto: 'bg-orange-100 text-orange-800',
    concluido: 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Funções do modal
const abrirDetalhesPedido = (pedido: Pedido) => {
  // Converter pedido do banco para o formato do PedidoModal
  const pedidoConvertido = converterPedidoParaModal(pedido)
  pedidoSelecionado.value = pedidoConvertido as any
  isModalOpen.value = true
}

const fecharModal = () => {
  isModalOpen.value = false
  setTimeout(() => {
    pedidoSelecionado.value = null
  }, 300)
}

// Converter pedido do banco para formato do modal
const converterPedidoParaModal = (pedido: Pedido) => {
  console.log('Debug - Pedido original:', pedido)
  console.log('Debug - Campo pedido:', pedido.pedido)
  
  const subtotal = parseFloat(pedido.valor_total as any || '0')
  
  // Parse dos itens do pedido
  let items = []
  try {
    if (typeof pedido.pedido === 'string') {
      // Detectar formato: se tem "x" seguido de " - R$", é formato estruturado
      const isFormatoEstruturado = pedido.pedido.match(/\d+x\s+.+?\s+-\s+R\$\s+\d+/)
      
      let linhas: string[] = []
      if (isFormatoEstruturado) {
        // Formato estruturado: separar por vírgula
        linhas = pedido.pedido.split(',').filter(l => l.trim())
      } else {
        // Formato texto livre: separar por quebra de linha
        linhas = pedido.pedido.split('\n').filter(l => l.trim())
      }
      
      console.log('Debug - Linhas encontradas:', linhas)
      
      items = linhas.map((linha, index) => {
        linha = linha.trim()
        console.log(`Debug - Processando linha ${index}:`, linha)
        
        // Formato estruturado: "2x Pizza Grande - R$ 60.00"
        const formatoComX = linha.match(/^(\d+)x\s+(.+?)\s*-\s*R\$\s*(\d+(?:[.,]\d{2})?)/)
        if (formatoComX) {
          const quantidade = parseInt(formatoComX[1], 10)
          const nome = formatoComX[2].trim()
          const precoTotal = parseFloat(formatoComX[3].replace(',', '.'))
          const precoUnitario = precoTotal / quantidade
          
          console.log(`Debug - Formato estruturado: quantidade=${quantidade}, nome="${nome}", preço unitário=${precoUnitario}`)
          
          return {
            nome: nome,
            quantidade: quantidade,
            preco: precoUnitario,
            observacao: undefined
          }
        }
        
        // Formato texto livre: "2 pizzas grandes..." ou "1 Coca-Cola..."
        const quantMatch = linha.match(/^(\d+)\s+(.+)/)
        let quantidade = 1
        let nomeItem = linha.trim()
        
        if (quantMatch) {
          quantidade = parseInt(quantMatch[1], 10)
          nomeItem = quantMatch[2].trim()
        }
        
        // Tentar capturar preço se houver
        const precoMatch = linha.match(/(?::|-)?\s*R\$\s*(\d+(?:[.,]\d{2})?)/)
        let preco = 0
        
        if (precoMatch && precoMatch[1]) {
          const precoStr = precoMatch[1].replace(',', '.')
          const precoTotal = parseFloat(precoStr)
          preco = precoTotal / quantidade
          
          // Remover a parte do preço do nome
          nomeItem = nomeItem.replace(/(?::|-)?\s*R\$\s*\d+(?:[.,]\d{2})?/, '').trim()
        } else {
          // Sem preço individual: dividir subtotal proporcionalmente
          preco = subtotal / linhas.reduce((sum, l) => {
            const qMatch = l.match(/^(\d+)\s+/)
            return sum + (qMatch ? parseInt(qMatch[1], 10) : 1)
          }, 0)
        }
        
        console.log(`Debug - Formato texto livre: quantidade=${quantidade}, nome="${nomeItem}", preço=${preco}`)
        
        return {
          nome: nomeItem,
          quantidade: quantidade,
          preco: preco,
          observacao: undefined
        }
      })
    }
  } catch (e) {
    console.error('Erro ao converter itens:', e)
    items = [{
      nome: pedido.pedido || 'Erro ao carregar itens',
      quantidade: 1,
      preco: subtotal
    }]
  }

  // Se não conseguiu extrair itens, criar um item genérico
  if (items.length === 0) {
    items = [{
      nome: pedido.pedido || 'Pedido sem detalhes',
      quantidade: 1,
      preco: subtotal
    }]
  }

  console.log('Debug - Items processados:', items)

  const resultado = {
    id: pedido.id,
    numero: pedido.numero_pedido,
    cliente: pedido.nome_cliente,
    telefone: pedido.telefone_cliente || '',
    endereco: pedido.endereco_entrega || '',
    items: items,
    total: parseFloat(pedido.valor_total as any || '0') + parseFloat(pedido.valor_entrega as any || '0'),
    formaPagamento: pedido.forma_pagamento,
    tipoEntrega: pedido.tipo_retirada,
    status: 'concluido', // Pedidos em relatórios são considerados concluídos
    observacao: pedido.observacao,
    troco: pedido.troco,
    dataHora: new Date(pedido.created_at),
    valorEntrega: parseFloat(pedido.valor_entrega as any || '0')
  }
  
  console.log('Debug - Resultado final:', resultado)
  return resultado
}
</script>

<style scoped>
/* Estilização da scrollbar para tema escuro */
.overflow-auto {
  scrollbar-width: thin;
  scrollbar-color: #374151 #1f2937;
}

.overflow-auto::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 4px;
  border: 1px solid #1f2937;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}

.overflow-auto::-webkit-scrollbar-corner {
  background: #1f2937;
}

/* Para Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #374151 #1f2937;
}
</style>