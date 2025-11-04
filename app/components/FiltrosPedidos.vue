<template>
  <div class="bg-card rounded-lg shadow-sm border border-border mb-6">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-border">
      <h3 class="text-lg font-semibold text-foreground">
        <i class="fas fa-filter mr-2 text-blue-600"></i>
        Filtros de Pesquisa
      </h3>
    </div>

    <!-- Formulário de Filtros -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Filtro por Data Início -->
        <div>
          <label for="dataInicio" class="block text-sm font-medium text-foreground mb-2">
            Data Início
          </label>
          <AppInput
            id="dataInicio"
            v-model="filtrosLocal.dataInicio"
            type="date"
            placeholder="Selecione a data inicial"
            @input="aplicarFiltros"
          />
        </div>

        <!-- Filtro por Data Fim -->
        <div>
          <label for="dataFim" class="block text-sm font-medium text-foreground mb-2">
            Data Fim
          </label>
          <AppInput
            id="dataFim"
            v-model="filtrosLocal.dataFim"
            type="date"
            placeholder="Selecione a data final"
            @input="aplicarFiltros"
          />
        </div>

        <!-- Filtro por Número do Pedido -->
        <div>
          <label for="numeroPedido" class="block text-sm font-medium text-foreground mb-2">
            Nº do Pedido
          </label>
          <AppInput
            id="numeroPedido"
            v-model="filtrosLocal.numeroPedido"
            type="text"
            placeholder="Ex: 1001"
            @input="aplicarFiltros"
          >
            <template #icon>
              <i class="fas fa-hashtag text-muted-foreground"></i>
            </template>
          </AppInput>
        </div>

        <!-- Filtro por Nome do Cliente -->
        <div>
          <label for="nomeCliente" class="block text-sm font-medium text-foreground mb-2">
            Nome do Cliente
          </label>
          <AppInput
            id="nomeCliente"
            v-model="filtrosLocal.nomeCliente"
            type="text"
            placeholder="Digite o nome do cliente"
            @input="aplicarFiltros"
          >
            <template #icon>
              <i class="fas fa-user text-muted-foreground"></i>
            </template>
          </AppInput>
        </div>
      </div>

      <!-- Filtros Adicionais com Botões -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <!-- Filtro por Forma de Pagamento -->
        <div>
          <label for="formaPagamento" class="block text-sm font-medium text-foreground mb-2">
            Forma de Pagamento
          </label>
          <select
            id="formaPagamento"
            v-model="filtrosLocal.formaPagamento"
            @change="aplicarFiltros"
            class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-background text-foreground"
          >
            <option value="">Todas</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao">Cartão</option>
            <option value="pix">PIX</option>
          </select>
        </div>

        <!-- Filtro por Tipo de Retirada -->
        <div>
          <label for="tipoRetirada" class="block text-sm font-medium text-foreground mb-2">
            Tipo de Retirada
          </label>
          <select
            id="tipoRetirada"
            v-model="filtrosLocal.tipoRetirada"
            @change="aplicarFiltros"
            class="w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-background text-foreground"
          >
            <option value="">Todos</option>
            <option value="entrega">Entrega</option>
            <option value="retirada">Retirada</option>
          </select>
        </div>

        <!-- Slot para Botões de Ação -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Exportar Dados
          </label>
          <slot name="acoes">
            <!-- Botões customizados virão aqui -->
          </slot>
        </div>
      </div>

      <!-- Ações -->
      <div class="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
        <!-- Resumo dos Filtros Ativos -->
        <div class="flex flex-wrap gap-2">
          <span v-if="temFiltrosAtivos" class="text-sm text-muted-foreground">
            {{ contarFiltrosAtivos }} filtro(s) ativo(s):
          </span>
          
          <span 
            v-if="filtrosLocal.dataInicio"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            Data: {{ formatDateForDisplay(filtrosLocal.dataInicio) }}+
            <button @click="removerFiltro('dataInicio')" class="ml-1 hover:text-blue-600">
              <i class="fas fa-times"></i>
            </button>
          </span>

          <span 
            v-if="filtrosLocal.numeroPedido"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
          >
            Pedido: #{{ filtrosLocal.numeroPedido }}
            <button @click="removerFiltro('numeroPedido')" class="ml-1 hover:text-green-600">
              <i class="fas fa-times"></i>
            </button>
          </span>

          <span 
            v-if="filtrosLocal.nomeCliente"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
          >
            Cliente: {{ filtrosLocal.nomeCliente }}
            <button @click="removerFiltro('nomeCliente')" class="ml-1 hover:text-purple-600">
              <i class="fas fa-times"></i>
            </button>
          </span>

          <span 
            v-if="filtrosLocal.formaPagamento"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
          >
            {{ filtrosLocal.formaPagamento === 'dinheiro' ? 'Dinheiro' : filtrosLocal.formaPagamento === 'cartao' ? 'Cartão' : 'PIX' }}
            <button @click="removerFiltro('formaPagamento')" class="ml-1 hover:text-yellow-600">
              <i class="fas fa-times"></i>
            </button>
          </span>

          <span 
            v-if="filtrosLocal.tipoRetirada"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
          >
            {{ filtrosLocal.tipoRetirada === 'entrega' ? 'Entrega' : 'Retirada' }}
            <button @click="removerFiltro('tipoRetirada')" class="ml-1 hover:text-orange-600">
              <i class="fas fa-times"></i>
            </button>
          </span>
        </div>

        <!-- Botões de Ação -->
        <div class="flex gap-2">
          <AppButton
            v-if="temFiltrosAtivos"
            variant="outline"
            size="sm"
            @click="limparFiltros"
          >
            <i class="fas fa-eraser mr-2"></i>
            Limpar Filtros
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Interfaces
interface Filtros {
  dataInicio?: string
  dataFim?: string
  numeroPedido?: string
  nomeCliente?: string
  formaPagamento?: string
  tipoRetirada?: string
}

// Props
interface Props {
  modelValue?: Filtros
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({})
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: Filtros]
}>()

// State
const filtrosLocal = ref<Filtros>({ ...props.modelValue })

// Computed
const temFiltrosAtivos = computed(() => {
  return Object.values(filtrosLocal.value).some(value => value && value.trim() !== '')
})

const contarFiltrosAtivos = computed(() => {
  return Object.values(filtrosLocal.value).filter(value => value && value.trim() !== '').length
})

// Watchers
watch(() => props.modelValue, (newValue) => {
  filtrosLocal.value = { ...newValue }
}, { deep: true })

// Methods
const aplicarFiltros = () => {
  emit('update:modelValue', { ...filtrosLocal.value })
}

const removerFiltro = (filtro: keyof Filtros) => {
  filtrosLocal.value[filtro] = ''
  aplicarFiltros()
}

const limparFiltros = () => {
  filtrosLocal.value = {}
  aplicarFiltros()
}

const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Validação de datas
watch([() => filtrosLocal.value.dataInicio, () => filtrosLocal.value.dataFim], ([inicio, fim]) => {
  if (inicio && fim && new Date(inicio) > new Date(fim)) {
    // Se data início for maior que data fim, ajusta a data fim
    filtrosLocal.value.dataFim = inicio
    aplicarFiltros()
  }
})
</script>