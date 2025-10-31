<template>
  <div class="relative">
    <!-- Botão de notificação -->
    <button
      @click="togglePanel"
      class="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
      
      <!-- Badge de novas atualizações -->
      <span
        v-if="hasUnreadUpdates"
        class="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse"
      ></span>
    </button>

    <!-- Painel de atualizações -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isPanelOpen"
        class="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-lg shadow-lg z-50"
      >
        <!-- Header do painel -->
        <div class="flex items-center justify-between p-4 border-b border-border">
          <h3 class="text-lg font-semibold text-foreground">Atualizações</h3>
          <button
            @click="markAllAsRead"
            class="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Marcar todas como lidas
          </button>
        </div>

        <!-- Lista de atualizações -->
        <div class="max-h-96 overflow-y-auto">
          <div
            v-for="update in updates"
            :key="update.id"
            class="p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
            :class="{ 'bg-muted/50': !update.read }"
          >
            <div class="flex items-start space-x-3">
              <!-- Ícone do tipo de atualização -->
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                :class="getTypeClass(update.type)"
              >
                <component :is="getTypeIcon(update.type)" class="w-4 h-4" />
              </div>

              <!-- Conteúdo da atualização -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <span
                    class="text-xs font-medium px-2 py-0.5 rounded-full"
                    :class="getTypeBadgeClass(update.type)"
                  >
                    {{ getTypeLabel(update.type) }}
                  </span>
                  <span class="text-xs text-muted-foreground">{{ formatDate(update.date) }}</span>
                </div>
                <p class="text-sm text-foreground font-medium mb-1">{{ update.title }}</p>
                <p class="text-xs text-muted-foreground">{{ update.description }}</p>
              </div>

              <!-- Indicador de não lido -->
              <div v-if="!update.read" class="flex-shrink-0">
                <div class="w-2 h-2 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>

          <!-- Mensagem quando não há atualizações -->
          <div v-if="updates.length === 0" class="p-8 text-center">
            <svg class="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-sm text-muted-foreground">Nenhuma atualização no momento</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 border-t border-border bg-muted/30">
          <p class="text-xs text-center text-muted-foreground">
            Versão {{ appVersion }}
          </p>
        </div>
      </div>
    </Transition>

    <!-- Overlay para fechar o painel -->
    <div
      v-if="isPanelOpen"
      @click="togglePanel"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { APP_UPDATES, APP_VERSION, type UpdateType } from '~/constants/updates'

interface Update {
  id: string
  type: UpdateType
  title: string
  description: string
  date: Date
  read: boolean
}

// Estado
const isPanelOpen = ref(false)
const appVersion = APP_VERSION

// Carregar atualizações do arquivo centralizado e adicionar status de leitura
const updates = ref<Update[]>(
  APP_UPDATES.map(update => ({
    ...update,
    read: false
  }))
)

// Persistir estado de leitura no localStorage
const STORAGE_KEY = 'app-updates-read'

onMounted(() => {
  const readIds = localStorage.getItem(STORAGE_KEY)
  if (readIds) {
    const readIdsArray = JSON.parse(readIds)
    updates.value.forEach(update => {
      if (readIdsArray.includes(update.id)) {
        update.read = true
      }
    })
  }
})

const saveReadState = () => {
  const readIds = updates.value.filter(u => u.read).map(u => u.id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds))
}

// Computed
const hasUnreadUpdates = computed(() => updates.value.some(u => !u.read))

// Métodos
const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value
  
  // Marcar atualizações como lidas ao abrir o painel
  if (isPanelOpen.value) {
    setTimeout(() => {
      updates.value.forEach(update => {
        update.read = true
      })
      saveReadState()
    }, 1000)
  }
}

const markAllAsRead = () => {
  updates.value.forEach(update => {
    update.read = true
  })
  saveReadState()
}

const getTypeLabel = (type: UpdateType): string => {
  const labels: Record<UpdateType, string> = {
    feature: 'Novo',
    fix: 'Correção',
    improvement: 'Melhoria',
    security: 'Segurança'
  }
  return labels[type]
}

const getTypeClass = (type: UpdateType): string => {
  const classes: Record<UpdateType, string> = {
    feature: 'bg-green-500/10 text-green-500',
    fix: 'bg-blue-500/10 text-blue-500',
    improvement: 'bg-purple-500/10 text-purple-500',
    security: 'bg-red-500/10 text-red-500'
  }
  return classes[type]
}

const getTypeBadgeClass = (type: UpdateType): string => {
  const classes: Record<UpdateType, string> = {
    feature: 'bg-green-500/10 text-green-600 dark:text-green-400',
    fix: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    improvement: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    security: 'bg-red-500/10 text-red-600 dark:text-red-400'
  }
  return classes[type]
}

const getTypeIcon = (type: UpdateType) => {
  const icons: Record<UpdateType, any> = {
    feature: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 10V3L4 14h7v7l9-11h-7z' })
    ]),
    fix: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
    ]),
    improvement: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' })
    ]),
    security: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })
    ])
  }
  return icons[type]
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Agora'
  if (minutes < 60) return `${minutes}m atrás`
  if (hours < 24) return `${hours}h atrás`
  if (days === 1) return 'Ontem'
  if (days < 7) return `${days}d atrás`
  
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}
</script>
