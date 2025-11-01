<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Cards de métricas -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total de Produtos -->
      <div class="bg-card border border-border rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Total de Produtos</p>
            <p class="text-2xl font-bold text-foreground">{{ produtos.length }}</p>
            <p class="text-xs text-green-600 mt-1">{{ produtos.filter((p: any) => p.ativo).length }} ativos</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <font-awesome-icon icon="utensils" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <!-- Total de Categorias -->
      <div class="bg-card border border-border rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Categorias</p>
            <p class="text-2xl font-bold text-foreground">{{ categorias.length }}</p>
            <p class="text-xs text-green-600 mt-1">bem organizadas</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <font-awesome-icon icon="layer-group" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <!-- Preço Médio -->
      <div class="bg-card border border-border rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Preço Médio</p>
            <p class="text-2xl font-bold text-foreground">R$ {{ precoMedio }}</p>
            <p class="text-xs text-yellow-600 mt-1">valor competitivo</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <font-awesome-icon icon="dollar-sign" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Visualização do Cardápio em Lista -->
    <div class="bg-card border border-border rounded-lg">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-semibold text-foreground">Categorias e Produtos</h2>
            <p class="text-sm text-muted-foreground">Clique em uma categoria para ver seus produtos</p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="mostrarModalCategoria = true"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <font-awesome-icon icon="plus" class="w-4 h-4 mr-2" />
              Nova Categoria
            </button>
          </div>
        </div>
        
        <!-- Componente de lista de categorias -->
        <CategoriasListView :categorias="categorias" :produtos="produtos" />
      </div>
    </div>

    <!-- Modal para Nova Categoria -->
    <ModalNovaCategoria 
      :is-visible="mostrarModalCategoria"
      @close="mostrarModalCategoria = false"
      @save="handleSalvarCategoria"
    />
  </div>
</template>

<script setup lang="ts">
import type { Categoria } from '../../shared/types/cardapio.types'

// Composables
const { categorias, produtos, adicionarCategoria, carregarCardapio } = useCardapio()

// Estado da interface
const mostrarModalCategoria = ref(false)

// Carregar dados ao montar o componente
onMounted(async () => {
  await carregarCardapio()
})

// Computed
const precoMedio = computed(() => {
  if (produtos.value.length === 0) return '0,00'
  
  const soma = produtos.value.reduce((acc: number, produto: any) => {
    // Se for pizza com tamanhos, usar preço médio dos tamanhos
    if (produto.tipo === 'pizza' && produto.tamanhos && Array.isArray(produto.tamanhos)) {
      const precosTamanhos = produto.tamanhos.map((t: any) => Number(t.preco))
      const mediaTamanhos = precosTamanhos.reduce((sum: number, p: number) => sum + p, 0) / precosTamanhos.length
      return acc + mediaTamanhos
    }
    // Se for produto comum, usar preço direto
    return acc + Number(produto.preco)
  }, 0)
  
  const media = soma / produtos.value.length
  return media.toFixed(2).replace('.', ',')
})

// Handlers dos modals
const handleSalvarCategoria = (categoria: Omit<Categoria, 'id'>) => {
  adicionarCategoria(categoria)
  mostrarModalCategoria.value = false
}
</script>
