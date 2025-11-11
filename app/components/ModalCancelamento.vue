<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-card border border-border rounded-lg max-w-md w-full shadow-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-border bg-red-50 dark:bg-red-900/20">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <font-awesome-icon icon="ban" class="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-foreground">Cancelar Pedido #{{ pedidoNumero }}</h2>
            <p class="text-xs text-muted-foreground">Esta ação não pode ser desfeita</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
        >
          <font-awesome-icon icon="times" class="w-4 h-4" />
        </button>
      </div>

      <!-- Conteúdo -->
      <div class="p-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Motivo do cancelamento <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="motivo"
            placeholder="Ex: Cliente desistiu da compra, erro no pedido, não respondeu..."
            class="w-full rounded-md text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 border border-input focus-visible:ring-red-500 px-3 py-2 min-h-[100px] resize-none"
            :class="{ 'border-red-500': erro }"
            maxlength="500"
          />
          <div class="flex justify-between items-center mt-1">
            <p v-if="erro" class="text-xs text-red-500">{{ erro }}</p>
            <p class="text-xs text-muted-foreground ml-auto">{{ motivo.length }}/500</p>
          </div>
        </div>

        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <div class="flex gap-2">
            <font-awesome-icon icon="exclamation-triangle" class="text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-sm font-medium text-yellow-900 dark:text-yellow-200">Atenção!</p>
              <p class="text-xs text-yellow-800 dark:text-yellow-300 mt-1">
                O pedido será permanentemente excluído do sistema e não poderá ser recuperado.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-border bg-muted/20 flex gap-2">
        <button
          @click="$emit('close')"
          class="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-colors"
        >
          Voltar
        </button>
        <button
          @click="confirmarCancelamento"
          :disabled="salvando"
          class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <font-awesome-icon v-if="salvando" icon="spinner" class="w-4 h-4 animate-spin" />
          <span>{{ salvando ? 'Cancelando...' : 'Confirmar Cancelamento' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  isOpen: boolean
  pedidoId: string
  pedidoNumero: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  confirm: [motivo: string]
}>()

const motivo = ref('')
const erro = ref('')
const salvando = ref(false)

// Limpar ao abrir/fechar
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    motivo.value = ''
    erro.value = ''
    salvando.value = false
  }
})

const confirmarCancelamento = () => {
  // Validar
  if (!motivo.value.trim()) {
    erro.value = 'Por favor, informe o motivo do cancelamento'
    return
  }

  if (motivo.value.trim().length < 10) {
    erro.value = 'O motivo deve ter pelo menos 10 caracteres'
    return
  }

  erro.value = ''
  salvando.value = true

  // Emitir confirmação
  emit('confirm', motivo.value.trim())
}
</script>
