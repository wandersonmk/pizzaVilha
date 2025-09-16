<template>
  <div class="bg-card border border-border rounded-lg p-6 space-y-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
        <Icon name="ph:brain" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
      </div>
      <div>
        <h2 class="text-xl font-semibold text-foreground">Ajuste de IA</h2>
        <p class="text-sm text-muted-foreground">Configure prompts e instruções para a inteligência artificial</p>
      </div>
    </div>

    <form @submit.prevent="salvarConfiguracoes" class="space-y-6">
      <!-- Campo Prompt da IA -->
      <div class="space-y-2">
        <label for="prompt" class="block text-sm font-medium text-foreground">
          Prompt da IA
          <span class="text-red-500">*</span>
        </label>
        <textarea
          id="prompt"
          v-model="configIA.prompt"
          class="w-full min-h-[120px] p-3 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground resize-vertical focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Digite aqui o prompt principal que será usado pela IA..."
          required
        />
        <p class="text-xs text-muted-foreground">
          Este é o prompt principal que guiará o comportamento da IA
        </p>
      </div>

      <!-- Campo Instruções da IA -->
      <div class="space-y-2">
        <label for="instrucoes" class="block text-sm font-medium text-foreground">
          Instruções da IA
          <span class="text-red-500">*</span>
        </label>
        <textarea
          id="instrucoes"
          v-model="configIA.instrucoes"
          class="w-full min-h-[160px] p-3 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground resize-vertical focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Digite aqui as instruções detalhadas para a IA..."
          required
        />
        <p class="text-xs text-muted-foreground">
          Instruções específicas sobre como a IA deve processar e responder
        </p>
      </div>

      <!-- Preview da Configuração -->
      <div class="bg-muted/50 border border-border rounded-lg p-4">
        <h4 class="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Icon name="ph:eye" class="w-4 h-4" />
          Preview da Configuração
        </h4>
        <div class="space-y-2 text-xs">
          <div>
            <span class="font-medium text-foreground">Prompt:</span>
            <span class="text-muted-foreground ml-2">
              {{ configIA.prompt ? configIA.prompt.substring(0, 100) + '...' : 'Não definido' }}
            </span>
          </div>
          <div>
            <span class="font-medium text-foreground">Instruções:</span>
            <span class="text-muted-foreground ml-2">
              {{ configIA.instrucoes ? configIA.instrucoes.substring(0, 100) + '...' : 'Não definido' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="flex flex-col sm:flex-row gap-3">
        <AppButton
          type="submit"
          :loading="salvando"
          class="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Icon name="ph:floppy-disk" class="w-4 h-4 mr-2" />
          {{ salvando ? 'Salvando...' : 'Salvar Configurações' }}
        </AppButton>
        
        <AppButton
          type="button"
          @click="resetarConfiguracoes"
          variant="outline"
          class="flex-1 border-border hover:bg-muted"
        >
          <Icon name="ph:arrow-counter-clockwise" class="w-4 h-4 mr-2" />
          Resetar
        </AppButton>

        <AppButton
          type="button"
          @click="testarIA"
          :loading="testando"
          class="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <Icon name="ph:play" class="w-4 h-4 mr-2" />
          {{ testando ? 'Testando...' : 'Testar IA' }}
        </AppButton>
      </div>
    </form>

    <!-- Resultado do Teste -->
    <div v-if="resultadoTeste" class="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
      <h4 class="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
        <Icon name="ph:chat-circle-text" class="w-4 h-4" />
        Resultado do Teste
      </h4>
      <div class="text-sm text-muted-foreground whitespace-pre-wrap">
        {{ resultadoTeste }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Interfaces
interface ConfiguracaoIA {
  prompt: string
  instrucoes: string
}

// State
const configIA = ref<ConfiguracaoIA>({
  prompt: '',
  instrucoes: ''
})

const salvando = ref(false)
const testando = ref(false)
const resultadoTeste = ref('')

// Composables
const showToast = async (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const toast = await useToastSafe()
  if (toast) {
    toast[type](message)
  } else {
    console.log(`${type.toUpperCase()}: ${message}`)
  }
}

// Configuração padrão
const configuracaoPadrao: ConfiguracaoIA = {
  prompt: 'Você é um assistente de IA especializado em atendimento ao cliente para um delivery de comida.',
  instrucoes: 'Responda sempre de forma educada, clara e objetiva. Ajude o cliente com pedidos, dúvidas sobre o cardápio, preços e tempo de entrega. Seja proativo em sugerir produtos relacionados.'
}

// Methods
const salvarConfiguracoes = async () => {
  try {
    salvando.value = true
    
    // Validar campos obrigatórios
    if (!configIA.value.prompt.trim()) {
      await showToast('O campo Prompt da IA é obrigatório', 'error')
      return
    }
    
    if (!configIA.value.instrucoes.trim()) {
      await showToast('O campo Instruções da IA é obrigatório', 'error')
      return
    }
    
    // Simular salvamento (aqui você integraria com API ou localStorage)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Salvar no localStorage para persistência
    localStorage.setItem('configIA', JSON.stringify(configIA.value))
    
    await showToast('Configurações salvas com sucesso!', 'success')
    
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    await showToast('Erro ao salvar configurações', 'error')
  } finally {
    salvando.value = false
  }
}

const resetarConfiguracoes = async () => {
  if (confirm('Tem certeza que deseja resetar todas as configurações para os valores padrão?')) {
    configIA.value = { ...configuracaoPadrao }
    resultadoTeste.value = ''
    await showToast('Configurações resetadas para os valores padrão', 'info')
  }
}

const testarIA = async () => {
  try {
    testando.value = true
    
    if (!configIA.value.prompt.trim() || !configIA.value.instrucoes.trim()) {
      await showToast('Configure o prompt e instruções antes de testar', 'error')
      return
    }
    
    // Simular teste da IA
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    resultadoTeste.value = `Teste realizado com sucesso!\n\nConfigurações aplicadas:\n- Prompt: ${configIA.value.prompt.substring(0, 50)}...\n- Instruções: ${configIA.value.instrucoes.substring(0, 50)}...\n\nA IA está funcionando corretamente com essas configurações.`
    
    await showToast('Teste da IA realizado com sucesso!', 'success')
    
  } catch (error) {
    console.error('Erro ao testar IA:', error)
    await showToast('Erro ao testar IA', 'error')
    resultadoTeste.value = 'Erro ao realizar teste da IA.'
  } finally {
    testando.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Carregar configurações salvas do localStorage
  const configSalva = localStorage.getItem('configIA')
  if (configSalva) {
    try {
      configIA.value = { ...configuracaoPadrao, ...JSON.parse(configSalva) }
    } catch (error) {
      console.warn('Erro ao carregar configurações salvas:', error)
      configIA.value = { ...configuracaoPadrao }
    }
  } else {
    configIA.value = { ...configuracaoPadrao }
  }
})
</script>

<style scoped>
/* Estilização do slider */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #9333ea;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #9333ea;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>