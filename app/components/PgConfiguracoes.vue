<template>
  <div class="space-y-6">
    <!-- Configurações Gerais -->
    <div class="bg-card border border-border rounded-lg p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Icon name="ph:gear" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-foreground">Configurações Gerais</h3>
          <p class="text-sm text-muted-foreground">Configurações básicas do sistema</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nome da Empresa -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">Nome da Empresa</label>
          <AppInput
            v-model="configuracoes.nomeEmpresa"
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

        <!-- Email -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">Email</label>
          <AppInput
            v-model="configuracoes.email"
            type="email"
            placeholder="contato@empresa.com"
            class="w-full"
          />
        </div>

        <!-- Endereço -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">Endereço</label>
          <AppInput
            v-model="configuracoes.endereco"
            placeholder="Rua, número, bairro"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- Configurações de Delivery -->
    <div class="bg-card border border-border rounded-lg p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
          <Icon name="ph:motorcycle" class="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-foreground">Configurações de Delivery</h3>
          <p class="text-sm text-muted-foreground">Configurações relacionadas à entrega</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Taxa de Entrega -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">Taxa de Entrega (R$)</label>
          <input
            v-model.number="configuracoes.taxaEntrega"
            type="number"
            min="0"
            step="0.50"
            placeholder="5.00"
            class="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Tempo Médio de Entrega -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">Tempo Médio de Entrega (min)</label>
          <input
            v-model.number="configuracoes.tempoEntrega"
            type="number"
            min="15"
            max="120"
            placeholder="45"
            class="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Valor Mínimo para Entrega -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">Valor Mínimo para Entrega (R$)</label>
          <input
            v-model.number="configuracoes.valorMinimoEntrega"
            type="number"
            min="0"
            step="0.50"
            placeholder="20.00"
            class="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Raio de Entrega -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">Raio de Entrega (km)</label>
          <input
            v-model.number="configuracoes.raioEntrega"
            type="number"
            min="1"
            max="50"
            placeholder="10"
            class="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Configurações de Funcionamento -->
    <div class="bg-card border border-border rounded-lg p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <Icon name="ph:clock" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-foreground">Configurações de Funcionamento</h3>
          <p class="text-sm text-muted-foreground">Horários e dias de funcionamento</p>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Horários de Funcionamento -->
        <div>
          <h4 class="text-sm font-medium text-foreground mb-4">Horários de Funcionamento</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-foreground">Abertura</label>
              <AppInput
                v-model="configuracoes.horarioAbertura"
                type="time"
                class="w-full"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-foreground">Fechamento</label>
              <AppInput
                v-model="configuracoes.horarioFechamento"
                type="time"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Dias da Semana -->
        <div>
          <h4 class="text-sm font-medium text-foreground mb-4">Dias de Funcionamento</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <label
              v-for="dia in diasSemana"
              :key="dia.value"
              class="flex items-center gap-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              :class="{ 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800': configuracoes.diasFuncionamento.includes(dia.value) }"
            >
              <input
                v-model="configuracoes.diasFuncionamento"
                :value="dia.value"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-background border-border rounded focus:ring-blue-500"
              />
              <span class="text-sm text-foreground">{{ dia.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Configurações de Pagamento -->
    <div class="bg-card border border-border rounded-lg p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <Icon name="ph:credit-card" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-foreground">Configurações de Pagamento</h3>
          <p class="text-sm text-muted-foreground">Formas de pagamento aceitas</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Aceita Dinheiro -->
          <label class="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              v-model="configuracoes.aceitaDinheiro"
              type="checkbox"
              class="w-5 h-5 text-green-600 bg-background border-border rounded focus:ring-green-500"
            />
            <div>
              <div class="text-sm font-medium text-foreground">Dinheiro</div>
              <div class="text-xs text-muted-foreground">Aceitar pagamento em dinheiro</div>
            </div>
          </label>

          <!-- Aceita Cartão -->
          <label class="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              v-model="configuracoes.aceitaCartao"
              type="checkbox"
              class="w-5 h-5 text-blue-600 bg-background border-border rounded focus:ring-blue-500"
            />
            <div>
              <div class="text-sm font-medium text-foreground">Cartão</div>
              <div class="text-xs text-muted-foreground">Aceitar pagamento com cartão</div>
            </div>
          </label>

          <!-- Aceita PIX -->
          <label class="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              v-model="configuracoes.aceitaPix"
              type="checkbox"
              class="w-5 h-5 text-orange-600 bg-background border-border rounded focus:ring-orange-500"
            />
            <div>
              <div class="text-sm font-medium text-foreground">PIX</div>
              <div class="text-xs text-muted-foreground">Aceitar pagamento via PIX</div>
            </div>
          </label>

          <!-- Aceita Vale Alimentação -->
          <label class="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              v-model="configuracoes.aceitaValeAlimentacao"
              type="checkbox"
              class="w-5 h-5 text-purple-600 bg-background border-border rounded focus:ring-purple-500"
            />
            <div>
              <div class="text-sm font-medium text-foreground">Vale Alimentação</div>
              <div class="text-xs text-muted-foreground">Aceitar vale refeição/alimentação</div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Configurações de Notificações -->
    <div class="bg-card border border-border rounded-lg p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
          <Icon name="ph:bell" class="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-foreground">Configurações de Notificações</h3>
          <p class="text-sm text-muted-foreground">Configurar alertas e notificações</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Notificação de Novos Pedidos -->
          <label class="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              v-model="configuracoes.notificarNovoPedido"
              type="checkbox"
              class="w-5 h-5 text-green-600 bg-background border-border rounded focus:ring-green-500"
            />
            <div>
              <div class="text-sm font-medium text-foreground">Novos Pedidos</div>
              <div class="text-xs text-muted-foreground">Notificar quando houver novos pedidos</div>
            </div>
          </label>

          <!-- Notificação de Pedidos Atrasados -->
          <label class="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              v-model="configuracoes.notificarPedidoAtrasado"
              type="checkbox"
              class="w-5 h-5 text-red-600 bg-background border-border rounded focus:ring-red-500"
            />
            <div>
              <div class="text-sm font-medium text-foreground">Pedidos Atrasados</div>
              <div class="text-xs text-muted-foreground">Notificar pedidos que passaram do prazo</div>
            </div>
          </label>

          <!-- Notificação de Baixo Estoque -->
          <label class="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              v-model="configuracoes.notificarBaixoEstoque"
              type="checkbox"
              class="w-5 h-5 text-yellow-600 bg-background border-border rounded focus:ring-yellow-500"
            />
            <div>
              <div class="text-sm font-medium text-foreground">Baixo Estoque</div>
              <div class="text-xs text-muted-foreground">Notificar quando produtos estiverem acabando</div>
            </div>
          </label>

          <!-- Som das Notificações -->
          <label class="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              v-model="configuracoes.somNotificacao"
              type="checkbox"
              class="w-5 h-5 text-blue-600 bg-background border-border rounded focus:ring-blue-500"
            />
            <div>
              <div class="text-sm font-medium text-foreground">Som das Notificações</div>
              <div class="text-xs text-muted-foreground">Reproduzir som ao receber notificações</div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Botões de Ação -->
    <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
      <AppButton
        @click="salvarConfiguracoes"
        :loading="salvando"
        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Icon name="ph:floppy-disk" class="w-4 h-4 mr-2" />
        {{ salvando ? 'Salvando...' : 'Salvar Configurações' }}
      </AppButton>
      
      <AppButton
        @click="resetarConfiguracoes"
        variant="outline"
        class="flex-1 border-border hover:bg-muted"
      >
        <Icon name="ph:arrow-counter-clockwise" class="w-4 h-4 mr-2" />
        Resetar
      </AppButton>

      <AppButton
        @click="exportarConfiguracoes"
        variant="outline"
        class="flex-1 border-border hover:bg-muted"
      >
        <Icon name="ph:download" class="w-4 h-4 mr-2" />
        Exportar
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// Interfaces
interface Configuracoes {
  // Gerais
  nomeEmpresa: string
  telefone: string
  email: string
  endereco: string

  // Delivery
  taxaEntrega: number
  tempoEntrega: number
  valorMinimoEntrega: number
  raioEntrega: number

  // Funcionamento
  horarioAbertura: string
  horarioFechamento: string
  diasFuncionamento: string[]

  // Pagamento
  aceitaDinheiro: boolean
  aceitaCartao: boolean
  aceitaPix: boolean
  aceitaValeAlimentacao: boolean

  // Notificações
  notificarNovoPedido: boolean
  notificarPedidoAtrasado: boolean
  notificarBaixoEstoque: boolean
  somNotificacao: boolean
}

// State
const configuracoes = ref<Configuracoes>({
  // Gerais
  nomeEmpresa: '',
  telefone: '',
  email: '',
  endereco: '',

  // Delivery
  taxaEntrega: 5.00,
  tempoEntrega: 45,
  valorMinimoEntrega: 20.00,
  raioEntrega: 10,

  // Funcionamento
  horarioAbertura: '18:00',
  horarioFechamento: '23:30',
  diasFuncionamento: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'],

  // Pagamento
  aceitaDinheiro: true,
  aceitaCartao: true,
  aceitaPix: true,
  aceitaValeAlimentacao: false,

  // Notificações
  notificarNovoPedido: true,
  notificarPedidoAtrasado: true,
  notificarBaixoEstoque: true,
  somNotificacao: true
})

const salvando = ref(false)

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
const salvarConfiguracoes = async () => {
  try {
    salvando.value = true
    
    // Validações básicas
    if (!configuracoes.value.nomeEmpresa.trim()) {
      await showToast('Nome da empresa é obrigatório', 'error')
      return
    }

    if (configuracoes.value.diasFuncionamento.length === 0) {
      await showToast('Selecione pelo menos um dia de funcionamento', 'error')
      return
    }

    if (!configuracoes.value.aceitaDinheiro && !configuracoes.value.aceitaCartao && !configuracoes.value.aceitaPix && !configuracoes.value.aceitaValeAlimentacao) {
      await showToast('Selecione pelo menos uma forma de pagamento', 'error')
      return
    }
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Salvar no localStorage
    localStorage.setItem('configuracoes', JSON.stringify(configuracoes.value))
    
    await showToast('Configurações salvas com sucesso!', 'success')
    
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    await showToast('Erro ao salvar configurações', 'error')
  } finally {
    salvando.value = false
  }
}

const resetarConfiguracoes = async () => {
  if (confirm('Tem certeza que deseja resetar todas as configurações?')) {
    configuracoes.value = {
      nomeEmpresa: '',
      telefone: '',
      email: '',
      endereco: '',
      taxaEntrega: 5.00,
      tempoEntrega: 45,
      valorMinimoEntrega: 20.00,
      raioEntrega: 10,
      horarioAbertura: '18:00',
      horarioFechamento: '23:30',
      diasFuncionamento: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'],
      aceitaDinheiro: true,
      aceitaCartao: true,
      aceitaPix: true,
      aceitaValeAlimentacao: false,
      notificarNovoPedido: true,
      notificarPedidoAtrasado: true,
      notificarBaixoEstoque: true,
      somNotificacao: true
    }
    
    await showToast('Configurações resetadas com sucesso!', 'info')
  }
}

const exportarConfiguracoes = () => {
  const dataStr = JSON.stringify(configuracoes.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'configuracoes-delivery.json'
  link.click()
  URL.revokeObjectURL(url)
}

// Lifecycle
onMounted(() => {
  // Carregar configurações salvas
  const configSalvas = localStorage.getItem('configuracoes')
  if (configSalvas) {
    try {
      configuracoes.value = { ...configuracoes.value, ...JSON.parse(configSalvas) }
    } catch (error) {
      console.warn('Erro ao carregar configurações salvas:', error)
    }
  }
})
</script>