<script setup lang="ts">
import { onMounted } from 'vue'

// Inicializar gerenciamento de sessão
if (process.client) {
  onMounted(() => {
    const { initSessionManager } = useSessionManager()
    initSessionManager()
  })
}
</script>

<template>
  <div id="app" class="min-h-screen bg-background text-foreground">
    <!-- Accessibility -->
    <NuxtRouteAnnouncer />
    
    <!-- Layout wrapper -->
    <NuxtLayout>
      <!-- Page content -->
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
