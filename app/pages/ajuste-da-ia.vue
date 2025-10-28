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
      title="Carregando Ajuste da IA"
      description="Preparando configurações de inteligência artificial..."
    />
    
    <!-- Página de Ajuste da IA quando carregado -->
    <div v-else class="space-y-6">
      <!-- Header da página -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-foreground">Ajuste da IA</h1>
          <p class="text-muted-foreground">Configure prompts e instruções para a inteligência artificial</p>
        </div>
      </div>

      <!-- Componente de Ajuste de IA -->
      <AjustedeIA />
    </div>
  </div>
</template>
