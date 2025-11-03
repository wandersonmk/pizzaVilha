<template>
  <div class="space-y-4">
    <!-- Botão Retirada no Balcão -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        @click="toggleRetirada"
        :class="[
          'flex-1 px-4 py-3 rounded-lg font-medium transition-all border-2',
          retiradaBalcao 
            ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400' 
            : 'bg-muted border-border hover:border-primary text-foreground'
        ]"
      >
        🏪 {{ retiradaBalcao ? '✅ RETIRADA NO BALCÃO' : 'Clique para RETIRADA NO BALCÃO' }}
      </button>
    </div>

    <!-- Campos de endereço (aparecem apenas se NÃO for retirada) -->
    <div v-if="!retiradaBalcao" class="space-y-4">
      <!-- Endereço completo (manual) -->
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          Endereço Completo (Rua, Bairro, Cidade) *
        </label>
        <textarea
          v-model="enderecoManual"
          @input="atualizarEndereco"
          rows="2"
          placeholder="Ex: Rua das Flores, Centro, Itaberaba-BA"
          class="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground resize-none"
          required
        ></textarea>
      </div>

      <!-- Número e Tipo de Imóvel -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Número -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Número *
          </label>
          <input
            v-model="numero"
            @input="atualizarEndereco"
            type="text"
            placeholder="Ex: 123"
            class="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            required
          />
        </div>

        <!-- Tipo de Imóvel -->
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            Tipo de Imóvel *
          </label>
          <select
            v-model="tipoImovel"
            @change="atualizarEndereco"
            class="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            required
          >
            <option value="">Selecione...</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
          </select>
        </div>
      </div>

      <!-- Complemento (obrigatório se for apartamento) -->
      <div v-if="tipoImovel === 'apartamento'">
        <label class="block text-sm font-medium text-foreground mb-2">
          Complemento (Apartamento, Bloco, etc.) *
        </label>
        <input
          v-model="complemento"
          @input="atualizarEndereco"
          type="text"
          placeholder="Ex: Apt 302, Bloco B"
          class="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
          required
        />
      </div>

      <!-- Complemento opcional para casa -->
      <div v-if="tipoImovel === 'casa'">
        <label class="block text-sm font-medium text-foreground mb-2">
          Complemento (opcional)
        </label>
        <input
          v-model="complemento"
          @input="atualizarEndereco"
          type="text"
          placeholder="Ex: Fundos, Próximo ao mercado..."
          class="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
        />
      </div>

      <!-- Preview do endereço -->
      <div v-if="enderecoManual && numero" class="p-4 bg-muted rounded-lg">
        <div class="text-sm font-medium text-foreground mb-1">Endereço Final:</div>
        <div class="text-foreground">{{ enderecoCompleto }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'update:endereco': [value: string]
  'update:tipo-entrega': [value: string]
}>()

// Estados
const retiradaBalcao = ref(false)
const enderecoManual = ref('')
const numero = ref('')
const tipoImovel = ref('')
const complemento = ref('')

const enderecoCompleto = computed(() => {
  if (retiradaBalcao.value) return ''
  
  if (!enderecoManual.value || !numero.value) return ''
  
  // Formatar complemento com prefixo se for apartamento
  let complementoFormatado = ''
  if (complemento.value) {
    if (tipoImovel.value === 'apartamento') {
      // Adicionar "Apt" se ainda não tiver
      complementoFormatado = complemento.value.toLowerCase().includes('apt') || 
                            complemento.value.toLowerCase().includes('apto') ||
                            complemento.value.toLowerCase().includes('apartamento')
        ? complemento.value
        : `Apt ${complemento.value}`
    } else {
      complementoFormatado = complemento.value
    }
  }
  
  const partes = [
    enderecoManual.value,
    `nº ${numero.value}`,
    complementoFormatado,
  ].filter(Boolean)
  
  return partes.join(', ')
})

const atualizarEndereco = () => {
  emit('update:endereco', enderecoCompleto.value)
  // Emitir tipo de entrega automaticamente
  if (retiradaBalcao.value) {
    emit('update:tipo-entrega', 'retirada')
  } else if (enderecoManual.value && numero.value) {
    emit('update:tipo-entrega', 'entrega')
  } else {
    emit('update:tipo-entrega', '')
  }
}

const toggleRetirada = () => {
  retiradaBalcao.value = !retiradaBalcao.value
  
  if (retiradaBalcao.value) {
    // Limpar campos e marcar como retirada
    enderecoManual.value = ''
    numero.value = ''
    tipoImovel.value = ''
    complemento.value = ''
    emit('update:endereco', '')
    emit('update:tipo-entrega', 'retirada')
  } else {
    emit('update:tipo-entrega', '')
  }
}

// Watchers
watch([enderecoManual, numero, tipoImovel, complemento], () => {
  if (!retiradaBalcao.value) {
    atualizarEndereco()
  }
})
</script>
