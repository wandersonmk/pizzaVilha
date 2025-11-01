<template>
  <div class="max-w-7xl mx-auto">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Cards de métricas -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Card Pedidos Hoje -->
        <div class="relative bg-gradient-to-br from-card via-blue-950/10 to-card text-card-foreground rounded-lg border border-blue-800/20 shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 p-6 group overflow-hidden">
          <!-- Efeito de brilho sutil -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Pedidos Hoje</p>
              <p class="text-2xl font-bold text-foreground">{{ metrics.clientesHoje }}</p>
              <p class="text-xs text-blue-600 mt-1">até agora</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H5m2 8a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Card Pedidos na Semana -->
        <div class="relative bg-gradient-to-br from-card via-emerald-950/10 to-card text-card-foreground rounded-lg border border-emerald-800/20 shadow-sm hover:shadow-md hover:shadow-emerald-500/10 transition-all duration-300 p-6 group overflow-hidden">
          <!-- Efeito de brilho sutil -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Pedidos na Semana</p>
              <p class="text-2xl font-bold text-foreground">{{ metrics.clientesNovos }}</p>
              <p class="text-xs text-emerald-600 mt-1">nos últimos 7 dias</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Card Clientes Novos -->
        <div class="relative bg-gradient-to-br from-card via-amber-950/10 to-card text-card-foreground rounded-lg border border-amber-800/20 shadow-sm hover:shadow-md hover:shadow-amber-500/10 transition-all duration-300 p-6 group overflow-hidden">
          <!-- Efeito de brilho sutil -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Clientes Novos</p>
              <p class="text-2xl font-bold text-foreground">{{ metrics.clientesVencendo }}</p>
              <p class="text-xs text-green-600 mt-1">este mês</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Card Total de Clientes -->
        <div class="relative bg-gradient-to-br from-card via-purple-950/10 to-card text-card-foreground rounded-lg border border-purple-800/20 shadow-sm hover:shadow-md hover:shadow-purple-500/10 transition-all duration-300 p-6 group overflow-hidden">
          <!-- Efeito de brilho sutil -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Total de Clientes</p>
              <p class="text-2xl font-bold text-foreground">{{ metrics.faturamento.toLocaleString('pt-BR') }}</p>
              <p class="text-xs text-purple-600 mt-1">cadastrados</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

    <!-- Gráficos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Gráfico de Performance Circular -->
      <CircularProgress />

      <!-- Gráfico de Vendas Mensais -->
      <div class="bg-card text-card-foreground rounded-lg border border-border shadow-sm p-6">
        <h3 class="text-lg font-semibold text-foreground mb-4">Vendas dos Últimos Meses</h3>
        <div class="relative h-64">
          <canvas ref="lineChartRef"></canvas>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// Buscar estatísticas reais
const { stats, fetchStats, isLoading } = useDashboardStats()

// Buscar dados ao montar componente
onMounted(async () => {
  await fetchStats()
  nextTick(() => {
    createLineChart()
  })
})

// Refs para os canvas dos gráficos
const lineChartRef = ref<HTMLCanvasElement | null>(null)

// Computed properties para métricas com dados reais
const metrics = computed(() => ({
  clientesHoje: stats.value.pedidosHoje,
  clientesNovos: stats.value.pedidosSemana,
  clientesVencendo: stats.value.pedidosMes,
  faturamento: stats.value.totalClientes
}))

// Configuração do gráfico de linha
const createLineChart = () => {
  if (!lineChartRef.value) return

  const ctx = lineChartRef.value.getContext('2d')
  if (!ctx) return

  // Usar dados reais das vendas mensais
  const labels = stats.value.vendasMensais.map(v => v.mes)
  const data = stats.value.vendasMensais.map(v => v.receita)

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Vendas (R$)',
        data: data,
        borderColor: '#10B981', // Verde vibrante para crescimento
        backgroundColor: 'rgba(16, 185, 129, 0.1)', // Verde com transparência
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#059669',
        pointHoverBorderColor: '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#F3F4F6',
            font: {
              size: 12,
              weight: 500
            }
          }
        },
        tooltip: {
          backgroundColor: '#1F2937',
          titleColor: '#F3F4F6',
          bodyColor: '#F3F4F6',
          borderColor: '#374151',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return 'Vendas: R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#9CA3AF',
            font: {
              size: 11
            }
          },
          grid: {
            color: '#374151'
          }
        },
        y: {
          ticks: {
            color: '#9CA3AF',
            font: {
              size: 11
            },
            callback: function(value) {
              return 'R$ ' + (Number(value) / 1000).toFixed(1) + 'k'
            }
          },
          grid: {
            color: '#374151'
          }
        }
      }
    }
  })
}
</script>

