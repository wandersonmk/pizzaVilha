<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-6xl mx-auto p-6 space-y-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-4">
          <div class="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
            <Icon name="ph:pizza" class="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 class="text-4xl font-bold text-foreground mb-3">Central de Ajuda</h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Aprenda a usar todas as funcionalidades do sistema de forma rápida e eficiente
        </p>
        
        <!-- Botão WhatsApp -->
        <a 
          href="https://wa.me/5575991198502?text=Preciso%20de%20ajuda%20para%20o%20aplicativo%20Pizza%20Vilha"
          target="_blank"
          class="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
        >
          <Icon name="ph:whatsapp-logo" class="w-6 h-6" />
          Falar com Suporte no WhatsApp
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

useHead({
  title: 'Ajuda - Sistema de Gestão'
})
</script>
