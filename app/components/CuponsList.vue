<template>
  <div class="space-y-6">
    <!-- Header com Filtros e Ações -->
    <div class="bg-card border border-border rounded-lg p-4">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <!-- Título e Estatísticas -->
        <div>
          <h3 class="text-lg font-semibold text-foreground mb-1">Cupons de Desconto</h3>
          <div class="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{{ cuponsAtivos.length }} ativos</span>
            <span>•</span>
            <span>{{ cuponsInativos.length }} inativos</span>
            <span>•</span>
            <span>{{ cuponsExpirados.length }} expirados</span>
          </div>
        </div>

        <!-- Botão Novo Cupom -->
        <button
          @click="$emit('novo-cupom')"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
        >
          <font-awesome-icon icon="plus" class="w-4 h-4" />
          Novo Cupom
        </button>
      </div>

      <!-- Barra de Filtros -->
      <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3 mt-4 pt-4 border-t border-border">
        <!-- Busca -->
        <div class="flex-1 relative">
          <font-awesome-icon 
            icon="search" 
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          />
          <input
            v-model="filtros.busca"
            type="text"
            placeholder="Buscar por código ou descrição..."
            class="w-full pl-10 pr-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <!-- Filtro por Status -->
        <select
          v-model="filtros.status"
          class="px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
          <option value="expirado">Expirados</option>
        </select>

        <!-- Filtro por Ativo -->
        <select
          v-model="filtroAtivo"
          class="px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Todos</option>
          <option value="true">Habilitados</option>
          <option value="false">Desabilitados</option>
        </select>

        <!-- Limpar Filtros -->
        <button
          v-if="temFiltrosAtivos"
          @click="limparFiltros"
          class="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Limpar filtros"
        >
          <font-awesome-icon icon="times" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Lista de Cupons -->
    <div v-if="cupons.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <CupomCard
        v-for="cupom in cupons"
        :key="cupom.id"
        :cupom="cupom"
        @toggle-status="$emit('toggle-status', $event)"
        @edit="$emit('editar-cupom', $event)"
        @duplicate="$emit('duplicar-cupom', $event)"
        @delete="confirmarRemocao($event)"
      />
    </div>

    <!-- Estado Vazio - Nenhum cupom cadastrado -->
    <div 
      v-else-if="!temFiltrosAtivos" 
      class="bg-card border border-border rounded-lg p-12 text-center"
    >
      <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <font-awesome-icon icon="ticket" class="w-8 h-8 text-primary" />
      </div>
      <h3 class="text-lg font-semibold text-foreground mb-2">
        Nenhum cupom cadastrado
      </h3>
      <p class="text-muted-foreground mb-6 max-w-md mx-auto">
        Comece criando cupons de desconto para atrair e fidelizar seus clientes. Você pode criar cupons com descontos percentuais ou valores fixos.
      </p>
      <button
        @click="$emit('novo-cupom')"
        class="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2 font-medium"
      >
        <font-awesome-icon icon="plus" class="w-4 h-4" />
        Criar Primeiro Cupom
      </button>
    </div>

    <!-- Estado Vazio - Nenhum resultado na busca -->
    <div 
      v-else 
      class="bg-card border border-border rounded-lg p-12 text-center"
    >
      <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <font-awesome-icon icon="search" class="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-semibold text-foreground mb-2">
        Nenhum cupom encontrado
      </h3>
      <p class="text-muted-foreground mb-6">
        Não encontramos cupons com os filtros aplicados. Tente ajustar os critérios de busca.
      </p>
      <button
        @click="limparFiltros"
        class="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
      >
        Limpar Filtros
      </button>
    </div>

    <!-- Modal de Confirmação de Remoção -->
    <div 
      v-if="cupomParaRemover"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="cancelarRemocao"
    >
      <div 
        class="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
            <font-awesome-icon icon="exclamation-triangle" class="w-6 h-6 text-destructive" />
          </div>
          <h3 class="text-lg font-semibold text-foreground">Confirmar Exclusão</h3>
        </div>
        
        <p class="text-muted-foreground mb-6">
          Tem certeza que deseja excluir o cupom <strong class="text-foreground">{{ cupomParaRemover.codigo }}</strong>? 
          Esta ação não pode ser desfeita.
        </p>
        
        <div class="flex items-center gap-3 justify-end">
          <button
            @click="cancelarRemocao"
            class="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="removerCupom"
            class="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2"
          >
            <font-awesome-icon icon="trash" class="w-4 h-4" />
            Excluir Cupom
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Cupom, CupomFilter } from '../../shared/types/cupom.types'

interface Props {
  cupons: Cupom[]
}

const props = defineProps<Props>()

defineEmits<{
  'novo-cupom': []
  'editar-cupom': [cupom: Cupom]
  'duplicar-cupom': [cupom: Cupom]
  'toggle-status': [cupomId: string]
  'remover-cupom': [cupomId: string]
}>()

// Estado dos filtros
const filtros = ref<CupomFilter>({
  busca: '',
  status: undefined,
  ativo: undefined
})

const filtroAtivo = ref<string>('')

// Computed
const cuponsAtivos = computed(() => 
  props.cupons.filter(c => c.status === 'ativo' && c.ativo)
)

const cuponsInativos = computed(() => 
  props.cupons.filter(c => c.status === 'inativo' || !c.ativo)
)

const cuponsExpirados = computed(() => 
  props.cupons.filter(c => c.status === 'expirado')
)

const temFiltrosAtivos = computed(() => 
  !!filtros.value.busca || !!filtros.value.status || !!filtroAtivo.value
)

// Estado para modal de confirmação
const cupomParaRemover = ref<{ id: string; codigo: string } | null>(null)

// Funções
const limparFiltros = () => {
  filtros.value = {
    busca: '',
    status: undefined,
    ativo: undefined
  }
  filtroAtivo.value = ''
}

const confirmarRemocao = (cupomId: string) => {
  const cupom = props.cupons.find(c => c.id === cupomId)
  if (cupom) {
    cupomParaRemover.value = { id: cupom.id, codigo: cupom.codigo }
  }
}

const cancelarRemocao = () => {
  cupomParaRemover.value = null
}

const removerCupom = () => {
  if (cupomParaRemover.value) {
    // Emitir evento para o componente pai
    // emit('remover-cupom', cupomParaRemover.value.id)
    cupomParaRemover.value = null
  }
}

// Watchers para sincronizar filtros
watch(filtroAtivo, (valor) => {
  if (valor === '') {
    filtros.value.ativo = undefined
  } else {
    filtros.value.ativo = valor === 'true'
  }
})
</script>
