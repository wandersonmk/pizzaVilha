<script setup lang="ts">
// Aplica middleware de autenticação
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

// Estado de carregamento
const isLoading = ref(true)
const { isLoading: authLoading } = useAuth()

// Composables que só funcionam no cliente
const pedidosData = process.client ? usePedidos() : null

// Título dinâmico da página baseado no número de pedidos novos
const pageTitle = computed(() => {
  if (!pedidosData) return 'Gerenciar Pedidos - Pizza Vila'
  
  const novosCount = pedidosData.getOrderCountByStatus('novo')
  if (novosCount > 0) {
    return `(${novosCount}) Novos Pedidos - Pizza Vila`
  }
  return 'Gerenciar Pedidos - Pizza Vila'
})

// Atualizar título da aba
useHead({
  title: pageTitle
})

// Aguarda a autenticação ser carregada e adiciona um delay mínimo para UX
onMounted(async () => {
  // Aguarda o auth loading terminar
  while (authLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  
  // Delay reduzido para carregamento mais rápido
  await new Promise(resolve => setTimeout(resolve, 300))
  
  isLoading.value = false
})
</script>

<template>
  <div>
    <!-- Loading enquanto carrega -->
    <AppLoading 
      v-if="isLoading"
      title="Carregando Pedidos" 
      description="Preparando gerenciamento de pedidos..."
    />
    
    <!-- Página de Pedidos quando carregado -->
    <PedidosManager v-else />
  </div>
</template>
