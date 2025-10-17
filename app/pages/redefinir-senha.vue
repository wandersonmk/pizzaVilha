<template>
  <div class="min-h-[calc(100vh-0px)] w-full flex items-center justify-center p-4">
    <div class="w-full max-w-sm mx-auto">
      <!-- Card principal -->
      <div class="rounded-xl border border-border/50 bg-secondary p-6 shadow-lg backdrop-blur-sm">
        <div class="space-y-1">
          <h2 class="text-lg font-medium text-foreground/85">Redefinir senha</h2>
          <p class="text-sm text-foreground/60">Digite sua nova senha abaixo</p>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-6 space-y-3">
          <div>
            <AppInput
              v-model="newPassword"
              type="password"
              placeholder="Nova senha"
              autocomplete="new-password"
              required
              :valid="!!newPassword && isPasswordValid"
            />
            <div v-if="passwordError" class="text-xs text-red-500 mt-1 px-1">
              {{ passwordError }}
            </div>
          </div>

          <div>
            <AppInput
              v-model="confirmPassword"
              type="password"
              placeholder="Confirmar nova senha"
              autocomplete="new-password"
              required
              :valid="!!confirmPassword && isPasswordConfirmValid"
            />
            <div v-if="confirmPasswordError" class="text-xs text-red-500 mt-1 px-1">
              {{ confirmPasswordError }}
            </div>
          </div>

          <AppButton 
            type="submit" 
            block 
            :disabled="isLoading || !newPassword || !confirmPassword || !isPasswordValid || !isPasswordConfirmValid"
          >
            <span v-if="isLoading">Salvando...</span>
            <span v-else>Salvar nova senha</span>
          </AppButton>
        </form>

        <div class="mt-4 text-center">
          <NuxtLink 
            to="/login" 
            class="text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            Voltar para o login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

// Validações em tempo real
const isPasswordValid = computed(() => {
  return newPassword.value.length === 0 || newPassword.value.length >= 6
})

const isPasswordConfirmValid = computed(() => {
  return confirmPassword.value.length === 0 || 
         (confirmPassword.value === newPassword.value && newPassword.value.length >= 6)
})

const passwordError = computed(() => {
  if (newPassword.value.length > 0 && newPassword.value.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres'
  }
  return null
})

const confirmPasswordError = computed(() => {
  if (confirmPassword.value.length > 0 && confirmPassword.value !== newPassword.value) {
    return 'As senhas não coincidem'
  }
  return null
})

const handleSubmit = async () => {
  // Funcionalidade será implementada posteriormente
  console.log('Nova senha definida')
}
</script>