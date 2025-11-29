<script setup lang="ts">
// App raiz - sem lógica de sessão aqui para evitar loops
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
