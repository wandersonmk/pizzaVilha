<script setup lang="ts">
// Aplica middleware de autenticação
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

// Estado de carregamento
const isLoading = ref(true)
const { isLoading: authLoading } = useAuth()

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
      title="Carregando Configurações"
      description="Preparando configurações do sistema..."
    />
    
    <!-- Página de Configurações quando carregado -->
    <div v-else class="space-y-6">
      <!-- Header da página -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-foreground">Configurações</h1>
          <p class="text-muted-foreground">Configure as definições do sistema e seu delivery</p>
        </div>
      </div>

      <!-- Componente de Configurações -->
      <PgConfiguracoes />
    </div>
  </div>
</template>