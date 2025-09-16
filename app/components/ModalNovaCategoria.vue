<template>
  <div 
    v-if="isVisible"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click="fechar"
  >
    <div 
      class="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-foreground">Nova Categoria</h3>
        <button
          @click="fechar"
          class="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <font-awesome-icon icon="times" class="w-4 h-4" />
        </button>
      </div>
      
      <form @submit.prevent="salvar" class="space-y-4">
        <!-- Nome da Categoria -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Nome da Categoria <span class="text-destructive">*</span>
          </label>
          <input
            ref="inputNome"
            v-model="formulario.nome"
            type="text"
            class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ex: Pizzas, Hambúrguers, Bebidas..."
            :class="{ 'border-destructive': erros.nome }"
          />
          <p v-if="erros.nome" class="text-sm text-destructive mt-1">{{ erros.nome }}</p>
        </div>

        <!-- Status -->
        <div class="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
          <div>
            <label class="text-sm font-medium text-foreground">Status da Categoria</label>
            <p class="text-xs text-muted-foreground">Categorias ativas aparecem no cardápio</p>
          </div>
          <button
            type="button"
            @click="formulario.ativa = !formulario.ativa"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            :class="formulario.ativa ? 'bg-primary' : 'bg-border'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="formulario.ativa ? 'translate-x-6' : 'translate-x-1'"
            ></span>
          </button>
        </div>

        <!-- Botões -->
        <div class="flex items-center gap-3 justify-end pt-4">
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
            class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <font-awesome-icon icon="plus" class="w-4 h-4 mr-2" />
            Criar Categoria
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Categoria } from '../../shared/types/cardapio.types'

interface Props {
  isVisible: boolean
}

interface Emits {
  close: []
  save: [categoria: Omit<Categoria, 'id'>]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Referência para o input de nome
const inputNome = ref<HTMLInputElement>()

// Estado do formulário
const formulario = ref({
  nome: '',
  ativa: true
})

// Estado de erros
const erros = ref({
  nome: ''
})

// Computed para validação do formulário
const formularioValido = computed(() => {
  return formulario.value.nome.trim().length >= 2
})

// Função para validar campos
const validarFormulario = () => {
  erros.value.nome = ''
  
  if (!formulario.value.nome.trim()) {
    erros.value.nome = 'Nome da categoria é obrigatório'
    return false
  }
  
  if (formulario.value.nome.trim().length < 2) {
    erros.value.nome = 'Nome deve ter pelo menos 2 caracteres'
    return false
  }
  
  return true
}

// Função para resetar formulário
const resetarFormulario = () => {
  formulario.value = {
    nome: '',
    ativa: true
  }
  erros.value = {
    nome: ''
  }
}

// Função para fechar modal
const fechar = () => {
  resetarFormulario()
  emit('close')
}

// Função para salvar categoria
const salvar = () => {
  if (!validarFormulario()) {
    return
  }
  
  const novaCategoria: Omit<Categoria, 'id'> = {
    nome: formulario.value.nome.trim(),
    ativa: formulario.value.ativa,
    ordem: 0 // Será ajustado pelo composable
  }
  
  emit('save', novaCategoria)
  resetarFormulario()
}

// Focar no input quando o modal abrir
watch(() => props.isVisible, (visible) => {
  if (visible) {
    nextTick(() => {
      inputNome.value?.focus()
    })
  }
})
</script>
