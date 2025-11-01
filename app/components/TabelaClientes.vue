<script setup lang="ts">
import type { Cliente } from '~/composables/useClientes'

// Composable para buscar clientes
const { clientes: clientesData, isLoading: carregandoClientes, buscarClientes } = useClientes()

// Estados dos filtros
const filtroNome = ref('')
const filtroTelefone = ref('')

// Computed para clientes filtrados
const clientesFiltrados = computed(() => {
  let resultado = clientesData.value

  // Filtrar por nome
  if (filtroNome.value.trim()) {
    resultado = resultado.filter(cliente => 
      cliente.nome.toLowerCase().includes(filtroNome.value.toLowerCase())
    )
  }

  // Filtrar por telefone
  if (filtroTelefone.value.trim()) {
    resultado = resultado.filter(cliente => 
      cliente.telefone.includes(filtroTelefone.value)
    )
  }

  return resultado
})

// Função para limpar filtros
const limparFiltros = () => {
  filtroNome.value = ''
  filtroTelefone.value = ''
}

// Funções de ação
const chamarWhatsApp = (cliente: Cliente) => {
  const numeroLimpo = cliente.telefone.replace(/\D/g, '')
  const mensagem = encodeURIComponent(`Olá ${cliente.nome}! Tudo bem?`)
  window.open(`https://wa.me/55${numeroLimpo}?text=${mensagem}`, '_blank')
}

// Função para formatar data
const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Função para formatar valor
const formatarValor = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

// Composables para exportação
const { exportarClientesPDF } = usePDFExport()
const { exportarClientesExcel } = useExcelExport()

// Estado para controle do loading das exportações
const exportandoPDF = ref(false)
const exportandoExcel = ref(false)

// Função para exportar clientes em PDF
const exportarPDF = async () => {
  try {
    exportandoPDF.value = true
    
    const dadosParaExportar = (filtroNome.value || filtroTelefone.value) 
      ? clientesFiltrados.value 
      : null

    const resultado = await exportarClientesPDF(clientesData.value, dadosParaExportar)
    
    if (resultado.success) {
      console.info(`✅ PDF exportado com sucesso! Arquivo: ${resultado.filename} | Clientes: ${resultado.totalClientes}`)
    }
  } catch (error) {
    console.error('Erro ao exportar PDF:', error)
  } finally {
    exportandoPDF.value = false
  }
}

// Função para exportar clientes em Excel
const exportarExcel = async () => {
  try {
    exportandoExcel.value = true
    
    const dadosParaExportar = (filtroNome.value || filtroTelefone.value) 
      ? clientesFiltrados.value 
      : null

    const resultado = await exportarClientesExcel(clientesData.value, dadosParaExportar)
    
    if (resultado.success) {
      console.info(`✅ Excel exportado com sucesso! Arquivo: ${resultado.filename} | Clientes: ${resultado.totalClientes}`)
    }
  } catch (error) {
    console.error('Erro ao exportar Excel:', error)
  } finally {
    exportandoExcel.value = false
  }
}

// Carregar clientes ao montar o componente
onMounted(async () => {
  await buscarClientes()
})
</script>

<template>
  <div class="bg-card border border-border rounded-lg overflow-hidden">
    <!-- Header da tabela -->
    <div class="bg-muted/20 border-b border-border px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-foreground">Lista de Clientes</h2>
          <p class="text-sm text-muted-foreground">
            <span v-if="carregandoClientes">Carregando...</span>
            <span v-else>Gerenciar clientes cadastrados ({{ clientesFiltrados.length }} de {{ clientesData.length }} clientes)</span>
          </p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Botão Exportar PDF -->
          <button
            @click="exportarPDF"
            :disabled="exportandoPDF || carregandoClientes"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm font-medium"
            :title="(filtroNome || filtroTelefone) ? 'Exportar clientes filtrados em PDF' : 'Exportar todos os clientes em PDF'"
          >
            <font-awesome-icon 
              :icon="exportandoPDF ? 'spinner' : 'file-pdf'" 
              :class="exportandoPDF ? 'animate-spin' : ''"
              class="w-4 h-4" 
            />
            <span v-if="exportandoPDF">Exportando...</span>
            <span v-else>Exportar PDF</span>
          </button>

          <!-- Botão Exportar Excel -->
          <button
            @click="exportarExcel"
            :disabled="exportandoExcel || carregandoClientes"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm font-medium"
            :title="(filtroNome || filtroTelefone) ? 'Exportar clientes filtrados em Excel' : 'Exportar todos os clientes em Excel'"
          >
            <font-awesome-icon 
              :icon="exportandoExcel ? 'spinner' : 'file-excel'" 
              :class="exportandoExcel ? 'animate-spin' : ''"
              class="w-4 h-4" 
            />
            <span v-if="exportandoExcel">Exportando...</span>
            <span v-else>Exportar Excel</span>
          </button>
          
          <font-awesome-icon icon="users" class="text-muted-foreground" />
        </div>
      </div>
    </div>

    <!-- Seção de Filtros -->
    <div class="bg-muted/10 border-b border-border px-6 py-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <font-awesome-icon 
              icon="search" 
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" 
            />
            <input
              v-model="filtroNome"
              type="text"
              placeholder="Buscar por nome..."
              class="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>
        
        <div class="flex-1">
          <div class="relative">
            <font-awesome-icon 
              icon="phone" 
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" 
            />
            <input
              v-model="filtroTelefone"
              type="text"
              placeholder="Buscar por telefone..."
              class="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="limparFiltros"
            v-if="filtroNome || filtroTelefone"
            class="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/10 transition-colors flex items-center gap-2"
          >
            <font-awesome-icon icon="times" class="w-3 h-3" />
            Limpar
          </button>
        </div>
      </div>

      <!-- Resultados da busca -->
      <div v-if="filtroNome || filtroTelefone" class="mt-3 text-sm text-muted-foreground">
        <span v-if="clientesFiltrados.length > 0">
          {{ clientesFiltrados.length }} cliente{{ clientesFiltrados.length !== 1 ? 's' : '' }} encontrado{{ clientesFiltrados.length !== 1 ? 's' : '' }}
        </span>
        <span v-else class="text-orange-600">
          Nenhum cliente encontrado com os filtros aplicados
        </span>
      </div>
    </div>

    <!-- Tabela de clientes -->
    <div class="overflow-x-auto">
      <!-- Estado de carregamento -->
      <div v-if="carregandoClientes" class="flex items-center justify-center py-12">
        <div class="text-center">
          <font-awesome-icon icon="spinner" class="w-8 h-8 text-primary animate-spin mb-3" />
          <p class="text-sm text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>

      <!-- Mensagem quando não há clientes -->
      <div v-else-if="clientesData.length === 0" class="flex flex-col items-center justify-center py-12">
        <font-awesome-icon icon="users" class="w-12 h-12 text-muted-foreground mb-3" />
        <p class="text-foreground font-medium mb-1">Nenhum cliente encontrado</p>
        <p class="text-sm text-muted-foreground">Os clientes aparecerão aqui quando houver pedidos registrados</p>
      </div>

      <!-- Tabela com dados -->
      <table v-else class="w-full">
        <!-- Header da tabela -->
        <thead class="bg-muted/10">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Cliente
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Telefone
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Qtd. Pedidos
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Valor Total
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Último Pedido
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>

        <!-- Corpo da tabela -->
        <tbody class="divide-y divide-border">
          <!-- Mensagem quando filtro não retorna resultados -->
          <tr v-if="clientesFiltrados.length === 0">
            <td colspan="6" class="px-6 py-8 text-center">
              <font-awesome-icon icon="search" class="w-8 h-8 text-muted-foreground mb-2" />
              <p class="text-muted-foreground">Nenhum cliente encontrado com os filtros aplicados</p>
            </td>
          </tr>

          <tr 
            v-else
            v-for="cliente in clientesFiltrados" 
            :key="cliente.id"
            class="hover:bg-muted/5 transition-colors"
          >
            <!-- Nome do cliente -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span class="text-sm font-medium text-primary">
                      {{ cliente.nome.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-foreground">{{ cliente.nome }}</div>
                </div>
              </div>
            </td>

            <!-- Telefone -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <font-awesome-icon icon="phone" class="text-muted-foreground mr-2 text-sm" />
                <span class="text-sm text-foreground">{{ cliente.telefone }}</span>
              </div>
            </td>

            <!-- Quantidade de pedidos -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span class="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {{ cliente.qtdPedidos }} pedidos
                </span>
              </div>
            </td>

            <!-- Valor total -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-green-600">
                {{ formatarValor(cliente.valorTotal) }}
              </div>
            </td>

            <!-- Último pedido -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-foreground" v-if="cliente.ultimoPedido">
                {{ formatarData(cliente.ultimoPedido) }}
              </div>
              <div class="text-sm text-muted-foreground" v-else>
                Nenhum pedido
              </div>
            </td>

            <!-- Ações -->
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end gap-2">
                <!-- Botão WhatsApp -->
                <button
                  @click="chamarWhatsApp(cliente)"
                  class="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  title="Chamar no WhatsApp"
                >
                  <font-awesome-icon icon="phone" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer da tabela -->
    <div class="bg-muted/10 border-t border-border px-6 py-3">
      <div class="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          <span v-if="carregandoClientes">Carregando...</span>
          <span v-else-if="filtroNome || filtroTelefone">
            Mostrando {{ clientesFiltrados.length }} de {{ clientesData.length }} cliente{{ clientesData.length !== 1 ? 's' : '' }}
          </span>
          <span v-else>
            Mostrando {{ clientesData.length }} cliente{{ clientesData.length !== 1 ? 's' : '' }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <font-awesome-icon icon="info-circle" class="text-xs" />
          <span>Dados do banco de dados</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilização adicional para tabela responsiva */
@media (max-width: 768px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
  
  table {
    min-width: 600px;
  }
}
</style>