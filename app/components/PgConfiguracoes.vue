<template>
  <div v-if="carregando" class="flex items-center justify-center py-12">
    <AppLoading />
  </div>

  <div v-else class="space-y-6">
    <!-- Configurações Gerais -->
    <div class="bg-card border border-border rounded-lg p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Icon name="ph:gear" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-foreground">Configurações Gerais</h3>
          <p class="text-sm text-muted-foreground">Informações básicas da empresa</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nome da Empresa -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">Nome da Empresa *</label>
          <AppInput
            v-model="configuracoes.nome"
            placeholder="Digite o nome da empresa"
            class="w-full"
          />
        </div>

        <!-- Telefone -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">Telefone</label>
          <AppInput
            v-model="configuracoes.telefone"
            placeholder="(11) 99999-9999"
            class="w-full"
          />
        </div>

        <!-- Endereço -->
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-foreground">Endereço</label>
          <AppInput
            v-model="configuracoes.endereco"
            placeholder="Rua, número, bairro, cidade - estado"
            class="w-full"
          />
        </div>

        <!-- Logotipo URL -->
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-foreground">URL do Logotipo</label>
          <AppInput
            v-model="configuracoes.logotipo"
            placeholder="https://exemplo.com/logo.png"
            class="w-full"
          />
          <p class="text-xs text-muted-foreground">Cole a URL da imagem do seu logotipo</p>
        </div>
      </div>
    </div>

    <!-- Configurações de Funcionamento -->
    <div class="bg-card border border-border rounded-lg p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <Icon name="ph:clock" class="w-6 h-6 text-orange-600 dark:text-white" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-foreground">Horário de Funcionamento</h3>
          <p class="text-sm text-muted-foreground">Defina os horários de abertura e fechamento</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">Horário de Abertura</label>
          <input
            v-model="configuracoes.hora_abertura"
            type="time"
            class="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">Horário de Fechamento</label>
          <input
            v-model="configuracoes.hora_fechamento"
            type="time"
            class="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
      </div>
    </div>

    <!-- Botão de Ação -->
    <div class="flex justify-end pt-6 border-t border-border">
      <AppButton
        @click="salvarConfiguracoes"
        :loading="salvando"
        class="bg-blue-600 hover:bg-blue-700 text-white px-8"
      >
        <Icon name="ph:floppy-disk" class="w-4 h-4 mr-2" />
        {{ salvando ? 'Salvando...' : 'Salvar Configurações' }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EmpresaConfig } from '~/composables/useEmpresa'

// Interfaces
interface Configuracoes {
  // Gerais (campos do banco)
  nome: string
  telefone: string
  endereco: string
  logotipo: string

  // Funcionamento (campos do banco)
  hora_abertura: string
  hora_fechamento: string
}

// State
const configuracoes = ref<Configuracoes>({
  // Gerais
  nome: '',
  telefone: '',
  endereco: '',
  logotipo: '',

  // Funcionamento
  hora_abertura: '18:00',
  hora_fechamento: '23:30'
})

const salvando = ref(false)
const carregando = ref(true)
const { buscarConfiguracoes, salvarConfiguracoes: salvarEmpresa } = useEmpresa()

// Dados auxiliares
const diasSemana = [
  { value: 'segunda', label: 'Seg' },
  { value: 'terca', label: 'Ter' },
  { value: 'quarta', label: 'Qua' },
  { value: 'quinta', label: 'Qui' },
  { value: 'sexta', label: 'Sex' },
  { value: 'sabado', label: 'Sáb' },
  { value: 'domingo', label: 'Dom' }
]

// Composables
const showToast = async (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const toast = await useToastSafe()
  if (toast) {
    toast[type](message)
  } else {
    console.log(`${type.toUpperCase()}: ${message}`)
  }
}

// Methods
const carregarConfiguracoes = async () => {
  try {
    carregando.value = true
    const config = await buscarConfiguracoes()
    
    if (config) {
      configuracoes.value = {
        nome: config.nome || '',
        telefone: config.telefone || '',
        endereco: config.endereco || '',
        logotipo: config.logotipo || '',
        hora_abertura: config.hora_abertura || '18:00',
        hora_fechamento: config.hora_fechamento || '23:30'
      }
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error)
    await showToast('Erro ao carregar configurações', 'error')
  } finally {
    carregando.value = false
  }
}

const salvarConfiguracoes = async () => {
  try {
    salvando.value = true
    
    // Validações básicas
    if (!configuracoes.value.nome.trim()) {
      await showToast('Nome da empresa é obrigatório', 'error')
      return
    }

    const sucesso = await salvarEmpresa({
      nome: configuracoes.value.nome,
      telefone: configuracoes.value.telefone,
      endereco: configuracoes.value.endereco,
      logotipo: configuracoes.value.logotipo,
      hora_abertura: configuracoes.value.hora_abertura,
      hora_fechamento: configuracoes.value.hora_fechamento
    })
    
    if (sucesso) {
      await showToast('Configurações salvas com sucesso!', 'success')
    } else {
      await showToast('Erro ao salvar configurações', 'error')
    }
    
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    await showToast('Erro ao salvar configurações', 'error')
  } finally {
    salvando.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await carregarConfiguracoes()
})
</script>