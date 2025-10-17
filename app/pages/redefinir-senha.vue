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

// ⚡ CAPTURAR TOKENS IMEDIATAMENTE DO HASH (antes de sumir)
let capturedTokens: any = {}

if (process.client) {
  console.log('🔥 DEBUG INICIAL:')
  console.log('   URL completa:', window.location.href)
  console.log('   Hash:', window.location.hash)
  console.log('   Search (query):', window.location.search)
  
  if (window.location.hash) {
    console.log('🔥 CAPTURANDO TOKENS DO HASH:', window.location.hash)
    const hash = window.location.hash.substring(1) // Remove o #
    const params = new URLSearchParams(hash)
    
    capturedTokens = {
      access_token: params.get('access_token'),
      refresh_token: params.get('refresh_token'),
      type: params.get('type'),
      expires_at: params.get('expires_at')
    }
    
    console.log('🎯 TOKENS CAPTURADOS:', { 
      hasAccessToken: !!capturedTokens.access_token, 
      hasRefreshToken: !!capturedTokens.refresh_token, 
      type: capturedTokens.type,
      rawTokens: capturedTokens
    })
  } else {
    console.log('❌ NENHUM HASH ENCONTRADO NA URL!')
  }
  
  // Limpar hash da URL para evitar problemas (mas manter os tokens em memória)
  if (window.history.replaceState) {
    window.history.replaceState(null, '', window.location.pathname)
    console.log('🧹 Hash limpo da URL, tokens salvos em memória')
  }
}

// Função para obter cliente Supabase de forma segura
const getSupabase = () => {
  if (process.server) return null
  
  try {
    // Tentar múltiplas formas de obter o cliente
    const nuxtApp = useNuxtApp()
    if (nuxtApp.$supabase) {
      return nuxtApp.$supabase
    }
    
    // Fallback para useSupabaseClient se disponível
    if (typeof useSupabaseClient === 'function') {
      return useSupabaseClient()
    }
    
    return null
  } catch (error) {
    console.error('Erro ao obter Supabase client:', error)
    return null
  }
}

// Função para extrair tokens da URL (query string ou hash fragment)
const getTokensFromUrl = () => {
  const route = useRoute()
  
  // Tentar primeiro da query string (?param=value)
  let { access_token, refresh_token, type, expires_at } = route.query
  
  // Se não encontrou na query, tentar no hash fragment (#param=value)
  if (!access_token && process.client && window.location.hash) {
    const hash = window.location.hash.substring(1) // Remove o #
    const params = new URLSearchParams(hash)
    
    access_token = params.get('access_token')
    refresh_token = params.get('refresh_token')
    type = params.get('type')
    expires_at = params.get('expires_at')
    
    console.log('Tokens extraídos do hash:', { access_token: !!access_token, refresh_token: !!refresh_token, type })
  }
  
  return { access_token, refresh_token, type, expires_at }
}

// Verificar se há tokens de recuperação na URL
onMounted(async () => {
  // Usar tokens capturados imediatamente ou tentar da URL normal
  const { access_token, refresh_token, type } = capturedTokens.access_token ? capturedTokens : getTokensFromUrl()
  
  console.log('🚀 onMounted - Processando tokens:', { 
    hasAccessToken: !!access_token, 
    hasRefreshToken: !!refresh_token, 
    type,
    source: capturedTokens.access_token ? 'memória' : 'URL'
  })
  
  if (type === 'recovery' && access_token && refresh_token) {
    // Aguardar inicialização do Supabase com tentativas
    let client = null
    let attempts = 0
    const maxAttempts = 10
    
    while (!client && attempts < maxAttempts) {
      client = getSupabase()
      if (!client) {
        console.log(`Aguardando Supabase... tentativa ${attempts + 1}`)
        await new Promise(resolve => setTimeout(resolve, 300))
        attempts++
      }
    }
    
    if (!client) {
      errorMsg.value = 'Erro de inicialização. Recarregue a página.'
      console.error('Cliente Supabase não disponível após', maxAttempts, 'tentativas')
      return
    }
    
    try {
      console.log('Definindo sessão com tokens...')
      const { data, error } = await client.auth.setSession({
        access_token: access_token as string,
        refresh_token: refresh_token as string
      })
      
      if (error) {
        errorMsg.value = 'Link de recuperação inválido ou expirado'
        console.error('Erro ao definir sessão:', error)
      } else {
        console.log('Sessão definida com sucesso:', !!data.session)
        // Limpar erro se houver sucesso
        errorMsg.value = ''
      }
    } catch (error) {
      errorMsg.value = 'Erro ao processar link de recuperação'
      console.error('Erro:', error)
    }
  } else if (!access_token && !type) {
    // Não há tokens, usuário acessou diretamente
    errorMsg.value = 'Acesso inválido. Use o link do email de recuperação.'
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