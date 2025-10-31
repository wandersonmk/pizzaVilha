<template>
  <!-- Container dos toasts fixado no canto superior direito -->
  <Teleport to="body">
    <div 
      v-if="notifications.length > 0"
      class="fixed top-4 right-4 z-50 space-y-2"
    >
      <TransitionGroup 
        name="toast"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="toast-item bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm"
          :class="{
            'border-blue-300 bg-blue-50': notification.type === 'info',
            'border-green-300 bg-green-50': notification.type === 'success',
            'border-yellow-300 bg-yellow-50': notification.type === 'warning',
            'border-red-300 bg-red-50': notification.type === 'error'
          }"
        >
          <div class="flex items-start">
            <!-- Ícone -->
            <div class="flex-shrink-0">
              <span 
                class="text-lg"
                :class="{
                  'text-blue-600': notification.type === 'info',
                  'text-green-600': notification.type === 'success',
                  'text-yellow-600': notification.type === 'warning',
                  'text-red-600': notification.type === 'error'
                }"
              >
                {{ notification.icon || '📋' }}
              </span>
            </div>
            
            <!-- Conteúdo -->
            <div class="ml-3 flex-1">
              <p 
                class="text-sm font-medium"
                :class="{
                  'text-blue-900': notification.type === 'info',
                  'text-green-900': notification.type === 'success',
                  'text-yellow-900': notification.type === 'warning',
                  'text-red-900': notification.type === 'error'
                }"
              >
                {{ notification.title }}
              </p>
              <p 
                class="mt-1 text-sm"
                :class="{
                  'text-blue-700': notification.type === 'info',
                  'text-green-700': notification.type === 'success',
                  'text-yellow-700': notification.type === 'warning',
                  'text-red-700': notification.type === 'error'
                }"
              >
                {{ notification.message }}
              </p>
            </div>
            
            <!-- Botão fechar -->
            <button
              @click="removeToast(notification.id)"
              class="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span class="sr-only">Fechar</span>
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { notifications, removeToast } = useToastNotification()
</script>

<style scoped>
/* Animações dos toasts */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-item {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>