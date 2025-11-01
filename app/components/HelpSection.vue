<template>
  <div class="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
    <div class="flex items-start gap-4">
      <!-- Ícone -->
      <div class="flex-shrink-0">
        <div :class="iconBgClass" class="p-3 rounded-lg">
          <Icon :name="icon" class="w-6 h-6" :class="iconColorClass" />
        </div>
      </div>

      <!-- Conteúdo -->
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-foreground mb-2">{{ title }}</h3>
        <p class="text-sm text-muted-foreground mb-4">{{ description }}</p>

        <!-- Lista de passos -->
        <ol v-if="steps.length > 0" class="space-y-2">
          <li 
            v-for="(step, index) in steps" 
            :key="index"
            class="flex gap-3 text-sm"
          >
            <span class="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-medium text-xs">
              {{ index + 1 }}
            </span>
            <span class="text-foreground/90 leading-relaxed">{{ step }}</span>
          </li>
        </ol>

        <!-- Dica adicional -->
        <div v-if="tip" class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div class="flex items-start gap-2">
            <Icon name="ph:lightbulb" class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p class="text-xs text-blue-900 dark:text-blue-100">
              <strong>Dica:</strong> {{ tip }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  iconBgClass?: string
  iconColorClass?: string
  title: string
  description: string
  steps: string[]
  tip?: string
}

withDefaults(defineProps<Props>(), {
  iconBgClass: 'bg-blue-100 dark:bg-blue-900',
  iconColorClass: 'text-blue-600 dark:text-blue-400'
})
</script>
