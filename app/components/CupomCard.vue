<template>
  <div 
    class="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
  >
    <!-- Header do Card -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <h3 class="font-bold text-foreground text-lg">{{ cupom.codigo }}</h3>
          <span 
            :class="[
              'px-2 py-0.5 text-xs font-medium rounded-full',
              getStatusColor(cupom.status)
            ]"
          >
            {{ getStatusLabel(cupom.status) }}
          </span>
        </div>
        <p class="text-sm text-muted-foreground">{{ cupom.descricao }}</p>
      </div>
      
      <!-- Toggle Ativo/Inativo -->
      <button
        @click="$emit('toggle-status', cupom.id)"
        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
        :class="cupom.ativo ? 'bg-primary' : 'bg-border'"
        :title="cupom.ativo ? 'Desativar cupom' : 'Ativar cupom'"
      >
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          :class="cupom.ativo ? 'translate-x-6' : 'translate-x-1'"
        ></span>
      </button>
    </div>

    <!-- Informações do Desconto -->
    <div class="bg-primary/10 rounded-lg p-3 mb-3">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs text-muted-foreground mb-1">Desconto</p>
          <p class="text-2xl font-bold text-primary">
            {{ cupom.tipoDesconto === 'percentual' ? `${cupom.valorDesconto}%` : `R$ ${cupom.valorDesconto.toFixed(2)}` }}
          </p>
        </div>
        <div v-if="cupom.valorMinimoPedido" class="text-right">
          <p class="text-xs text-muted-foreground mb-1">Valor Mínimo</p>
          <p class="text-sm font-semibold text-foreground">
            R$ {{ cupom.valorMinimoPedido.toFixed(2) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Informações de Uso e Validade -->
    <div class="grid grid-cols-2 gap-3 mb-3">
      <!-- Estatísticas de Uso -->
      <div class="bg-muted/30 rounded-lg p-2">
        <div class="flex items-center gap-2 mb-1">
          <font-awesome-icon icon="ticket" class="w-3 h-3 text-muted-foreground" />
          <p class="text-xs text-muted-foreground">Usos</p>
        </div>
        <p class="text-sm font-semibold text-foreground">
          {{ cupom.quantidadeUsada }}
          <span v-if="cupom.quantidadeMaximaUsos" class="text-muted-foreground">
            / {{ cupom.quantidadeMaximaUsos }}
          </span>
          <span v-else class="text-muted-foreground">/ ∞</span>
        </p>
        <div 
          v-if="cupom.quantidadeMaximaUsos" 
          class="w-full bg-border rounded-full h-1.5 mt-1"
        >
          <div 
            class="bg-primary h-1.5 rounded-full transition-all"
            :style="{ width: `${Math.min((cupom.quantidadeUsada / cupom.quantidadeMaximaUsos) * 100, 100)}%` }"
          ></div>
        </div>
      </div>

      <!-- Validade -->
      <div class="bg-muted/30 rounded-lg p-2">
        <div class="flex items-center gap-2 mb-1">
          <font-awesome-icon icon="calendar" class="w-3 h-3 text-muted-foreground" />
          <p class="text-xs text-muted-foreground">Validade</p>
        </div>
        <p class="text-xs font-medium text-foreground">
          {{ formatDate(cupom.dataInicio) }}
        </p>
        <p class="text-xs font-medium text-foreground">
          até {{ formatDate(cupom.dataExpiracao) }}
        </p>
      </div>
    </div>

    <!-- Informações Adicionais -->
    <div class="flex items-center gap-3 text-xs text-muted-foreground mb-3">
      <div v-if="cupom.usoPorCliente" class="flex items-center gap-1">
        <font-awesome-icon icon="user" class="w-3 h-3" />
        <span>{{ cupom.usoPorCliente }}x por cliente</span>
      </div>
      <div class="flex items-center gap-1">
        <font-awesome-icon icon="clock" class="w-3 h-3" />
        <span>{{ getTempoRestante(cupom.dataExpiracao) }}</span>
      </div>
    </div>

    <!-- Ações -->
    <div class="flex items-center gap-2 pt-3 border-t border-border">
      <button
        @click="$emit('edit', cupom)"
        class="flex-1 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <font-awesome-icon icon="edit" class="w-3 h-3" />
        Editar
      </button>
      <button
        @click="$emit('duplicate', cupom)"
        class="flex-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <font-awesome-icon icon="copy" class="w-3 h-3" />
        Duplicar
      </button>
      <button
        @click="$emit('delete', cupom.id)"
        class="px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg text-sm font-medium transition-colors"
        title="Excluir cupom"
      >
        <font-awesome-icon icon="trash" class="w-3 h-3" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Cupom } from '../../shared/types/cupom.types'

interface Props {
  cupom: Cupom
}

defineProps<Props>()

defineEmits<{
  'toggle-status': [cupomId: string]
  edit: [cupom: Cupom]
  duplicate: [cupom: Cupom]
  delete: [cupomId: string]
}>()

const getStatusLabel = (status: string) => {
  const labels = {
    ativo: 'Ativo',
    inativo: 'Inativo',
    expirado: 'Expirado'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusColor = (status: string) => {
  const colors = {
    ativo: 'bg-green-100 text-green-700',
    inativo: 'bg-gray-100 text-gray-700',
    expirado: 'bg-red-100 text-red-700'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const getTempoRestante = (dataExpiracao: string) => {
  const agora = new Date()
  const expiracao = new Date(dataExpiracao)
  const diffTime = expiracao.getTime() - agora.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'Expirado'
  if (diffDays === 0) return 'Expira hoje'
  if (diffDays === 1) return 'Expira amanhã'
  if (diffDays < 7) return `${diffDays} dias restantes`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas restantes`
  return `${Math.floor(diffDays / 30)} meses restantes`
}
</script>
