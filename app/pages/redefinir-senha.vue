<template>
  <div class="min-h-[calc(100vh-0px)] w-full flex items-center justify-center p-4">
    <div class="w-full max-w-sm mx-auto">
      <!-- Card principal -->
      <div class="rounded-xl border border-border/50 bg-secondary p-6 shadow-lg backdrop-blur-sm">
        <div class="space-y-1">
          <h2 class="text-lg font-medium text-foreground/85">Redefinir senha</h2>
          <p class="text-sm text-foreground/60">Digite sua nova senha abaixo</p>
        </div>

        <!-- Mensagem de erro inicial -->
        <div v-if="errorMsg && !success" class="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
            <p class="text-sm text-red-400">{{ errorMsg }}</p>
          </div>
        </div>

        <!-- Mensagem de sucesso -->
        <div v-if="success" class="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <p class="text-sm text-green-400">Senha redefinida com sucesso!</p>
          </div>
          <p class="text-xs text-green-400/70 mt-1">Redirecionando para o login...</p>
        </div>

        <!-- Formulário -->
        <form v-if="!success && (!errorMsg || errorMsg.includes('Erro de inicialização'))" @submit.prevent="handleSubmit" class="mt-6 space-y-3">
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

const success = ref(false)
const errorMsg = ref('')

// Simplesmente verificar se o usuário está autenticado
// O Supabase já processa o link automaticamente quando ele é clicado
if (process.client) {
  console.log('🔥 Página de redefinição carregada')
  console.log('   URL:', window.location.href)
}

// Função para obter cliente Supabase
const getSupabase = () => {
  if (process.server) return null
  
  try {
    const nuxtApp = useNuxtApp()
    return nuxtApp.$supabase || null
  } catch (error) {
    console.error('Erro ao obter Supabase:', error)
    return null
  }
}

// Verificar autenticação quando a página carregar
onMounted(async () => {
  console.log('🚀 Verificando autenticação...')
  
  try {
    // Aguardar Supabase estar pronto
    let supabase = getSupabase()
    let retries = 0
    
    while (!supabase && retries < 10) {
      await new Promise(resolve => setTimeout(resolve, 300))
      supabase = getSupabase()
      retries++
    }
    
    if (!supabase) {
      console.error('❌ Supabase não disponível')
      errorMsg.value = 'Erro ao carregar. Tente novamente.'
      return
    }
    
    // Verificar se usuário está autenticado
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Erro ao verificar sessão:', error)
      errorMsg.value = 'Erro ao verificar acesso.'
      return
    }
    
    if (session?.user) {
      console.log('✅ Usuário autenticado! Pode redefinir senha.')
      console.log('   User ID:', session.user.id)
      // Usuário está autenticado, pode redefinir senha
      // O formulário já está visível
    } else {
      console.log('❌ Usuário não autenticado')
      errorMsg.value = 'Acesso inválido. Use o link do email de recuperação.'
    }
    
  } catch (err) {
    console.error('❌ Erro:', err)
    errorMsg.value = 'Erro inesperado. Tente novamente.'
  }
})

const handleSubmit = async () => {
  if (!newPassword.value || !confirmPassword.value || !isPasswordValid.value || !isPasswordConfirmValid.value) return
  
  try {
    isLoading.value = true
    errorMsg.value = ''
    
    const client = getSupabase()
    if (!client) {
      throw new Error('Cliente Supabase não disponível')
    }
    
    console.log('Atualizando senha do usuário...')
    
    // Atualizar senha do usuário autenticado
    const { data, error } = await client.auth.updateUser({
      password: newPassword.value
    })
    
    if (error) {
      throw new Error(error.message)
    }
    
    console.log('Senha atualizada com sucesso')
    
    // Sucesso
    success.value = true
    
    // Limpar campos
    newPassword.value = ''
    confirmPassword.value = ''
    
    // Redirecionar para login após alguns segundos
    setTimeout(() => {
      navigateTo('/login')
    }, 3000)
    
  } catch (error: any) {
    console.error('Erro ao redefinir senha:', error)
    errorMsg.value = error.message || 'Erro ao redefinir senha'
  } finally {
    isLoading.value = false
  }
}
</script>