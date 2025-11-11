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
      <div class="p-6">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex gap-3">
            <font-awesome-icon icon="exclamation-triangle" class="text-red-600 dark:text-red-500 text-xl mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-base font-semibold text-red-900 dark:text-red-200 mb-2">
                Tem certeza que deseja cancelar este pedido?
              </p>
              <p class="text-sm text-red-800 dark:text-red-300">
                O pedido será <strong>permanentemente excluído</strong> do sistema e não poderá ser recuperado.
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
  confirm: []
}>()

const salvando = ref(false)

// Limpar ao abrir/fechar
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    salvando.value = false
  }
})

const confirmarCancelamento = () => {
  salvando.value = true
  // Emitir confirmação
  emit('confirm')
}
</script>
