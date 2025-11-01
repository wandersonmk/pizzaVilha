<template>
  <div class="w-full">
    <!-- Cards de Métricas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Card Total de Pedidos -->
      <div class="relative bg-gradient-to-br from-card via-green-950/10 to-card text-card-foreground rounded-lg border border-green-800/20 shadow-sm hover:shadow-md hover:shadow-green-500/10 transition-all duration-300 p-6 group overflow-hidden">
        <!-- Efeito de brilho sutil -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400 mb-1">Total de Pedidos</p>
            <p class="text-3xl font-bold text-foreground">{{ totalPedidos }}</p>
            <p class="text-xs text-green-600 mt-1">registrados</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Card Valor Total -->
      <div class="relative bg-gradient-to-br from-card via-blue-950/10 to-card text-card-foreground rounded-lg border border-blue-800/20 shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 p-6 group overflow-hidden">
        <!-- Efeito de brilho sutil -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400 mb-1">Valor Total</p>
            <p class="text-3xl font-bold text-foreground">R$ {{ totalValor.toFixed(2).replace('.', ',') }}</p>
            <p class="text-xs text-blue-600 mt-1">faturado</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Card Ticket Médio -->
      <div class="relative bg-gradient-to-br from-card via-purple-950/10 to-card text-card-foreground rounded-lg border border-purple-800/20 shadow-sm hover:shadow-md hover:shadow-purple-500/10 transition-all duration-300 p-6 group overflow-hidden">
        <!-- Efeito de brilho sutil -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400 mb-1">Ticket Médio</p>
            <p class="text-3xl font-bold text-foreground">R$ {{ ticketMedio.toFixed(2).replace('.', ',') }}</p>
            <p class="text-xs text-purple-600 mt-1">por pedido</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="mb-6">
      <FiltrosPedidos v-model="filtros">
        <template #acoes>
          <div class="flex gap-2">
            <button
              @click="exportarPDF"
              :disabled="isExportingPDF || isExportingExcel"
              class="group relative flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-md shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Exportar relatório em PDF"
            >
              <i v-if="!isExportingPDF" class="fas fa-file-pdf"></i>
              <i v-else class="fas fa-spinner fa-spin"></i>
              <span class="font-medium text-sm">{{ isExportingPDF ? 'Gerando...' : 'PDF' }}</span>
            </button>

            <button
              @click="exportarExcel"
              :disabled="isExportingPDF || isExportingExcel"
              class="group relative flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Exportar relatório em Excel"
            >
              <i v-if="!isExportingExcel" class="fas fa-file-excel"></i>
              <i v-else class="fas fa-spinner fa-spin"></i>
              <span class="font-medium text-sm">{{ isExportingExcel ? 'Gerando...' : 'Excel' }}</span>
            </button>
          </div>
        </template>
      </FiltrosPedidos>
    </div>

    <!-- Tabela de Pedidos - Container com largura máxima removida -->
    <div class="mb-8">
      <TabelaPedidos 
        :pedidos="pedidos"
        :filtros="filtros"
      />
    </div>

    <!-- Cards de AnÃ¡lise -->
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

      <!-- AnÃ¡lise de Pagamentos -->
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
import type { EstatisticasRelatorio } from '~/composables/useRelatorios'

// Layout
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

// Definir título da página
useHead({
  title: 'Relatórios'
})

// Interfaces
interface Filtros {
  dataInicio?: string
  dataFim?: string
  numeroPedido?: string
  nomeCliente?: string
  formaPagamento?: string
  tipoRetirada?: string
}

// State
const filtros = ref<Filtros>({})
const isExportingPDF = ref(false)
const isExportingExcel = ref(false)

// Composables
const { estatisticas, pedidosDetalhados, isLoading, buscarEstatisticas } = useRelatorios()
const { exportarRelatoriosPDF } = usePDFExport()
const { exportarRelatoriosExcel } = useExcelExport()
const { showToast } = useToastSafe()

// Computed
const totalPedidos = computed(() => estatisticas.value?.totalPedidos || 0)
const totalValor = computed(() => estatisticas.value?.totalValor || 0)
const ticketMedio = computed(() => estatisticas.value?.ticketMedio || 0)
const topClientes = computed(() => estatisticas.value?.topClientes || [])
const analisePagamentos = computed(() => estatisticas.value?.analisePagamentos || [])
const pedidos = computed(() => pedidosDetalhados.value || [])

// Methods
const carregarDados = async () => {
  await buscarEstatisticas()
}

// Função para exportar em PDF
const exportarPDF = async () => {
  try {
    if (!pedidos.value || pedidos.value.length === 0) {
      showToast('Nenhum pedido para exportar', 'warning')
      return
    }

    isExportingPDF.value = true
    const resultado = await exportarRelatoriosPDF(pedidos.value, estatisticas.value)
    
    if (resultado.success) {
      showToast(`PDF gerado com sucesso! ${resultado.totalPedidos} pedidos exportados.`, 'success')
    }
  } catch (error) {
    console.error('Erro ao exportar PDF:', error)
    showToast('Erro ao gerar PDF. Tente novamente.', 'error')
  } finally {
    isExportingPDF.value = false
  }
}

// Função para exportar em Excel
const exportarExcel = async () => {
  try {
    if (!pedidos.value || pedidos.value.length === 0) {
      showToast('Nenhum pedido para exportar', 'warning')
      return
    }

    isExportingExcel.value = true
    const resultado = await exportarRelatoriosExcel(pedidos.value, estatisticas.value)
    
    if (resultado.success) {
      showToast(`Excel gerado com sucesso! ${resultado.totalPedidos} pedidos exportados.`, 'success')
    }
  } catch (error) {
    console.error('Erro ao exportar Excel:', error)
    showToast('Erro ao gerar Excel. Tente novamente.', 'error')
  } finally {
    isExportingExcel.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await carregarDados()
})
</script>
