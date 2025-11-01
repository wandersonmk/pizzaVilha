<template>
  <div 
    v-if="isVisible"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto"
    @click="fechar"
  >
    <div 
      class="bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4 my-8"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-foreground">
          {{ modoEdicao ? 'Editar Cupom' : 'Novo Cupom de Desconto' }}
        </h3>
        <button
          @click="fechar"
          class="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <font-awesome-icon icon="times" class="w-4 h-4" />
        </button>
      </div>
      
      <form @submit.prevent="salvar" class="space-y-4">
        <!-- Código do Cupom -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Código do Cupom <span class="text-destructive">*</span>
          </label>
          <input
            ref="inputCodigo"
            v-model="formulario.codigo"
            type="text"
            class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
            placeholder="Ex: PIZZA10, BEMVINDO, PROMO2025"
            :class="{ 'border-destructive': erros.codigo }"
            @input="formulario.codigo = formulario.codigo.toUpperCase()"
          />
          <p v-if="erros.codigo" class="text-sm text-destructive mt-1">{{ erros.codigo }}</p>
          <p class="text-xs text-muted-foreground mt-1">Use letras e números sem espaços</p>
        </div>

        <!-- Descrição -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Descrição <span class="text-destructive">*</span>
          </label>
          <textarea
            v-model="formulario.descricao"
            rows="2"
            class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ex: Desconto de 10% para novos clientes"
            :class="{ 'border-destructive': erros.descricao }"
          />
          <p v-if="erros.descricao" class="text-sm text-destructive mt-1">{{ erros.descricao }}</p>
        </div>

        <!-- Tipo e Valor do Desconto -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Tipo de Desconto <span class="text-destructive">*</span>
            </label>
            <select
              v-model="formulario.tipoDesconto"
              class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="percentual">Percentual (%)</option>
              <option value="valor_fixo">Valor Fixo (R$)</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Valor do Desconto <span class="text-destructive">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {{ formulario.tipoDesconto === 'percentual' ? '%' : 'R$' }}
              </span>
              <input
                v-model.number="formulario.valorDesconto"
                type="number"
                step="0.01"
                min="0"
                :max="formulario.tipoDesconto === 'percentual' ? 100 : undefined"
                class="w-full pl-10 pr-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                :placeholder="formulario.tipoDesconto === 'percentual' ? '0-100' : '0.00'"
                :class="{ 'border-destructive': erros.valorDesconto }"
              />
            </div>
            <p v-if="erros.valorDesconto" class="text-sm text-destructive mt-1">{{ erros.valorDesconto }}</p>
          </div>
        </div>

        <!-- Valor Mínimo do Pedido -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Valor Mínimo do Pedido (opcional)
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
            <input
              v-model.number="formulario.valorMinimoPedido"
              type="number"
              step="0.01"
              min="0"
              class="w-full pl-10 pr-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <p class="text-xs text-muted-foreground mt-1">Deixe vazio para sem valor mínimo</p>
        </div>

        <!-- Datas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Data de Início <span class="text-destructive">*</span>
            </label>
            <input
              v-model="formulario.dataInicio"
              type="datetime-local"
              class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-destructive': erros.dataInicio }"
            />
            <p v-if="erros.dataInicio" class="text-sm text-destructive mt-1">{{ erros.dataInicio }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Data de Expiração <span class="text-destructive">*</span>
            </label>
            <input
              v-model="formulario.dataExpiracao"
              type="datetime-local"
              class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-destructive': erros.dataExpiracao }"
            />
            <p v-if="erros.dataExpiracao" class="text-sm text-destructive mt-1">{{ erros.dataExpiracao }}</p>
          </div>
        </div>

        <!-- Limites de Uso -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Quantidade Máxima de Usos (opcional)
            </label>
            <input
              v-model.number="formulario.quantidadeMaximaUsos"
              type="number"
              min="1"
              class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ilimitado"
            />
            <p class="text-xs text-muted-foreground mt-1">Deixe vazio para ilimitado</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Usos por Cliente (opcional)
            </label>
            <input
              v-model.number="formulario.usoPorCliente"
              type="number"
              min="1"
              class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ilimitado"
            />
            <p class="text-xs text-muted-foreground mt-1">Vezes que cada cliente pode usar</p>
          </div>
        </div>

        <!-- Status Ativo -->
        <div class="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
          <div>
            <label class="text-sm font-medium text-foreground">Status do Cupom</label>
            <p class="text-xs text-muted-foreground">Cupons ativos podem ser usados pelos clientes</p>
          </div>
          <button
            type="button"
            @click="formulario.ativo = !formulario.ativo"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            :class="formulario.ativo ? 'bg-primary' : 'bg-border'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="formulario.ativo ? 'translate-x-6' : 'translate-x-1'"
            ></span>
          </button>
        </div>

        <!-- Botões -->
        <div class="flex items-center gap-3 justify-end pt-4 border-t border-border">
          <button
            type="button"
            @click="fechar"
            class="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="!formularioValido"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <font-awesome-icon :icon="modoEdicao ? 'save' : 'plus'" class="w-4 h-4" />
            {{ modoEdicao ? 'Salvar Alterações' : 'Criar Cupom' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Cupom, CupomFormData } from '../../shared/types/cupom.types'

interface Props {
  isVisible: boolean
  cupom?: Cupom | null
}

interface Emits {
  close: []
  save: [cupomData: CupomFormData]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Referência para o input de código
const inputCodigo = ref<HTMLInputElement>()

// Modo edição
const modoEdicao = computed(() => !!props.cupom)

// Estado do formulário
const formulario = ref<CupomFormData>({
  codigo: '',
  descricao: '',
  tipoDesconto: 'percentual',
  valorDesconto: 0,
  valorMinimoPedido: undefined,
  dataInicio: '',
  dataExpiracao: '',
  quantidadeMaximaUsos: undefined,
  usoPorCliente: undefined,
  ativo: true
})

// Estado de erros
const erros = ref({
  codigo: '',
  descricao: '',
  valorDesconto: '',
  dataInicio: '',
  dataExpiracao: ''
})

// Computed para validação do formulário
const formularioValido = computed(() => {
  return (
    formulario.value.codigo.trim().length >= 3 &&
    formulario.value.descricao.trim().length >= 5 &&
    formulario.value.valorDesconto > 0 &&
    formulario.value.dataInicio &&
    formulario.value.dataExpiracao &&
    new Date(formulario.value.dataExpiracao) > new Date(formulario.value.dataInicio)
  )
})

// Função para validar campos
const validarFormulario = () => {
  // Reset erros
  erros.value = {
    codigo: '',
    descricao: '',
    valorDesconto: '',
    dataInicio: '',
    dataExpiracao: ''
  }
  
  let valido = true
  
  // Validar código
  if (!formulario.value.codigo.trim()) {
    erros.value.codigo = 'Código é obrigatório'
    valido = false
  } else if (formulario.value.codigo.trim().length < 3) {
    erros.value.codigo = 'Código deve ter pelo menos 3 caracteres'
    valido = false
  } else if (!/^[A-Z0-9]+$/.test(formulario.value.codigo)) {
    erros.value.codigo = 'Use apenas letras maiúsculas e números'
    valido = false
  }
  
  // Validar descrição
  if (!formulario.value.descricao.trim()) {
    erros.value.descricao = 'Descrição é obrigatória'
    valido = false
  } else if (formulario.value.descricao.trim().length < 5) {
    erros.value.descricao = 'Descrição deve ter pelo menos 5 caracteres'
    valido = false
  }
  
  // Validar valor do desconto
  if (formulario.value.valorDesconto <= 0) {
    erros.value.valorDesconto = 'Valor do desconto deve ser maior que zero'
    valido = false
  } else if (formulario.value.tipoDesconto === 'percentual' && formulario.value.valorDesconto > 100) {
    erros.value.valorDesconto = 'Percentual não pode ser maior que 100%'
    valido = false
  }
  
  // Validar datas
  if (!formulario.value.dataInicio) {
    erros.value.dataInicio = 'Data de início é obrigatória'
    valido = false
  }
  
  if (!formulario.value.dataExpiracao) {
    erros.value.dataExpiracao = 'Data de expiração é obrigatória'
    valido = false
  }
  
  if (formulario.value.dataInicio && formulario.value.dataExpiracao) {
    const inicio = new Date(formulario.value.dataInicio)
    const expiracao = new Date(formulario.value.dataExpiracao)
    
    if (expiracao <= inicio) {
      erros.value.dataExpiracao = 'Data de expiração deve ser posterior à data de início'
      valido = false
    }
  }
  
  return valido
}

// Função para resetar formulário
const resetarFormulario = () => {
  formulario.value = {
    codigo: '',
    descricao: '',
    tipoDesconto: 'percentual',
    valorDesconto: 0,
    valorMinimoPedido: undefined,
    dataInicio: '',
    dataExpiracao: '',
    quantidadeMaximaUsos: undefined,
    usoPorCliente: undefined,
    ativo: true
  }
  erros.value = {
    codigo: '',
    descricao: '',
    valorDesconto: '',
    dataInicio: '',
    dataExpiracao: ''
  }
}

// Função para carregar dados do cupom em edição
const carregarCupom = (cupom: Cupom) => {
  formulario.value = {
    codigo: cupom.codigo,
    descricao: cupom.descricao,
    tipoDesconto: cupom.tipoDesconto,
    valorDesconto: cupom.valorDesconto,
    valorMinimoPedido: cupom.valorMinimoPedido,
    dataInicio: cupom.dataInicio.slice(0, 16), // formato datetime-local
    dataExpiracao: cupom.dataExpiracao.slice(0, 16),
    quantidadeMaximaUsos: cupom.quantidadeMaximaUsos,
    usoPorCliente: cupom.usoPorCliente,
    ativo: cupom.ativo
  }
}

// Função para fechar modal
const fechar = () => {
  resetarFormulario()
  emit('close')
}

// Função para salvar cupom
const salvar = () => {
  if (!validarFormulario()) {
    return
  }
  
  emit('save', { ...formulario.value })
  resetarFormulario()
}

// Focar no input quando o modal abrir
watch(() => props.isVisible, (visible) => {
  if (visible) {
    nextTick(() => {
      if (props.cupom) {
        carregarCupom(props.cupom)
      }
      inputCodigo.value?.focus()
    })
  } else {
    resetarFormulario()
  }
})
</script>
