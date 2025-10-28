<script setup lang="ts">
// Interface do Cliente
interface Cliente {
  id: string
  nome: string
  telefone: string
  qtdPedidos: number
  ultimoPedido?: string
}

// Dados mock dos clientes
const clientes = ref<Cliente[]>([
  {
    id: '1',
    nome: 'João Silva',
    telefone: '(11) 99999-1234',
    qtdPedidos: 15,
    ultimoPedido: '2024-03-10'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    telefone: '(11) 98888-5678',
    qtdPedidos: 8,
    ultimoPedido: '2024-03-09'
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    telefone: '(11) 97777-9876',
    qtdPedidos: 23,
    ultimoPedido: '2024-03-11'
  },
  {
    id: '4',
    nome: 'Ana Costa',
    telefone: '(11) 96666-4321',
    qtdPedidos: 12,
    ultimoPedido: '2024-03-08'
  },
  {
    id: '5',
    nome: 'Carlos Ferreira',
    telefone: '(11) 95555-8765',
    qtdPedidos: 7,
    ultimoPedido: '2024-03-07'
  },
  {
    id: '6',
    nome: 'Lucia Mendes',
    telefone: '(11) 94444-2468',
    qtdPedidos: 19,
    ultimoPedido: '2024-03-12'
  }
])

// Estados dos filtros
const filtroNome = ref('')
const filtroTelefone = ref('')

// Computed para clientes filtrados
const clientesFiltrados = computed(() => {
  let resultado = clientes.value

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

// Funções de ação (sem implementação de banco de dados)
const chamarWhatsApp = (cliente: Cliente) => {
  // TODO: Implementar integração com WhatsApp
  console.log('Chamar no WhatsApp:', cliente.nome, cliente.telefone)
  
  // Exemplo de como seria a integração (comentado para não executar)
  // const numeroLimpo = cliente.telefone.replace(/\D/g, '')
  // const mensagem = encodeURIComponent(`Olá ${cliente.nome}! Como você está?`)
  // window.open(`https://wa.me/55${numeroLimpo}?text=${mensagem}`, '_blank')
}

const excluirCliente = (cliente: Cliente) => {
  // TODO: Implementar exclusão no banco de dados
  console.log('Excluir cliente:', cliente.nome)
  
  // Confirmação simples (pode ser substituída por modal no futuro)
  const confirmacao = confirm(`Tem certeza que deseja excluir o cliente ${cliente.nome}?`)
  
  if (confirmacao) {
    // Remove da lista local apenas (simulação)
    const index = clientes.value.findIndex(c => c.id === cliente.id)
    if (index > -1) {
      clientes.value.splice(index, 1)
      console.log(`Cliente ${cliente.nome} removido da interface`)
    }
  }
}

// Função para formatar data
const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR')
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
    
    // Se há filtros aplicados, exporta apenas os filtrados
    const dadosParaExportar = (filtroNome.value || filtroTelefone.value) 
      ? clientesFiltrados.value 
      : null

    const resultado = await exportarClientesPDF(clientes.value, dadosParaExportar)
    
    if (resultado.success) {
      // Feedback visual de sucesso
      console.log(`PDF exportado: ${resultado.filename} com ${resultado.totalClientes} clientes`)
      
      // Log silencioso sem alerta do sistema
      console.info(`✅ PDF exportado com sucesso! Arquivo: ${resultado.filename} | Clientes: ${resultado.totalClientes}`)
    }
  } catch (error) {
    console.error('Erro ao exportar PDF:', error)
    // Apenas log de erro, sem alerta
    console.error('❌ Erro ao exportar PDF. Verifique o console para mais detalhes.')
  } finally {
    exportandoPDF.value = false
  }
}

// Função para exportar clientes em Excel
const exportarExcel = async () => {
  try {
    exportandoExcel.value = true
    
    // Se há filtros aplicados, exporta apenas os filtrados
    const dadosParaExportar = (filtroNome.value || filtroTelefone.value) 
      ? clientesFiltrados.value 
      : null

    const resultado = await exportarClientesExcel(clientes.value, dadosParaExportar)
    
    if (resultado.success) {
      // Feedback visual de sucesso
      console.log(`Excel exportado: ${resultado.filename} com ${resultado.totalClientes} clientes`)
      
      // Log silencioso sem alerta do sistema
      console.info(`✅ Excel exportado com sucesso! Arquivo: ${resultado.filename} | Clientes: ${resultado.totalClientes}`)
    }
  } catch (error) {
    console.error('Erro ao exportar Excel:', error)
    // Apenas log de erro, sem alerta
    console.error('❌ Erro ao exportar Excel. Verifique o console para mais detalhes.')
  } finally {
    exportandoExcel.value = false
  }
}
</script>

<template>
  <div class="bg-card border border-border rounded-lg overflow-hidden">
    <!-- Header da tabela -->
    <div class="bg-muted/20 border-b border-border px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-foreground">Lista de Clientes</h2>
          <p class="text-sm text-muted-foreground">
            Gerenciar clientes cadastrados ({{ clientesFiltrados.length }} de {{ clientes.length }} clientes)
          </p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Botão Exportar PDF -->
          <button
            @click="exportarPDF"
            :disabled="exportandoPDF"
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
            :disabled="exportandoExcel"
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
      <table class="w-full">
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
              Último Pedido
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>

        <!-- Corpo da tabela -->
        <tbody class="divide-y divide-border">
          <tr 
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
                  class="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  title="Chamar no WhatsApp"
                >
                  <font-awesome-icon icon="phone" class="w-4 h-4" />
                </button>

                <!-- Botão Excluir -->
                <button
                  @click="excluirCliente(cliente)"
                  class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir cliente"
                >
                  <font-awesome-icon icon="trash" class="w-4 h-4" />
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
          <span v-if="filtroNome || filtroTelefone">
            Mostrando {{ clientesFiltrados.length }} de {{ clientes.length }} cliente{{ clientes.length !== 1 ? 's' : '' }}
          </span>
          <span v-else>
            Mostrando {{ clientes.length }} cliente{{ clientes.length !== 1 ? 's' : '' }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <font-awesome-icon icon="info-circle" class="text-xs" />
          <span>Dados fictícios para demonstração</span>
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