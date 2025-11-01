<script setup lang="ts">
import type { Cupom, CupomFormData } from '~/shared/types/cupom.types'

// Aplica middleware de autenticação
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})

// Composables
const { isLoading: authLoading } = useAuth()
const { 
  cupons, 
  loading: cuponsLoading, 
  carregarCupons,
  criarCupom,
  atualizarCupom,
  toggleStatus: toggleStatusCupom,
  removerCupom: removerCupomDb,
  duplicarCupom: duplicarCupomDb
} = useCupons()

// Estado de carregamento geral
const isLoading = ref(true)

// Estado do modal
const modalVisible = ref(false)
const cupomEmEdicao = ref<Cupom | null>(null)

// Funções do modal
const abrirModalNovoCupom = () => {
  cupomEmEdicao.value = null
  modalVisible.value = true
}

const abrirModalEdicao = (cupom: Cupom) => {
  cupomEmEdicao.value = cupom
  modalVisible.value = true
}

const fecharModal = () => {
  modalVisible.value = false
  cupomEmEdicao.value = null
}

// Funções de CRUD com dados reais
const salvarCupom = async (cupomData: CupomFormData) => {
  let sucesso = false
  
  if (cupomEmEdicao.value) {
    // Editar cupom existente
    sucesso = await atualizarCupom(cupomEmEdicao.value.id, cupomData)
  } else {
    // Criar novo cupom
    sucesso = await criarCupom(cupomData)
  }
  
  if (sucesso) {
    fecharModal()
  }
}

const duplicarCupom = async (cupom: Cupom) => {
  await duplicarCupomDb(cupom)
}

const toggleStatus = async (cupomId: string) => {
  await toggleStatusCupom(cupomId)
}

const removerCupom = async (cupomId: string) => {
  await removerCupomDb(cupomId)
}

// Carregar dados ao montar
onMounted(async () => {
  // Aguarda o auth loading terminar
  while (authLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  
  // Carregar cupons do banco
  await carregarCupons()
  
  isLoading.value = false
})
</script>

<template>
  <div>
    <!-- Loading enquanto carrega -->
    <AppLoading 
      v-if="isLoading" 
      title="Carregando Cupons"
      description="Preparando gerenciador de cupons de desconto..."
    />
    
    <!-- Página de Cupons quando carregado -->
    <div v-else class="space-y-6">
      <!-- Header da página -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-foreground">Cupons de Desconto</h1>
          <p class="text-muted-foreground">Crie e gerencie cupons promocionais para seus clientes</p>
        </div>
      </div>

      <!-- Lista de Cupons -->
      <CuponsList 
        :cupons="cupons"
        @novo-cupom="abrirModalNovoCupom"
        @editar-cupom="abrirModalEdicao"
        @duplicar-cupom="duplicarCupom"
        @toggle-status="toggleStatus"
        @remover-cupom="removerCupom"
      />

      <!-- Modal de Novo/Editar Cupom -->
      <ModalNovoCupom
        :is-visible="modalVisible"
        :cupom="cupomEmEdicao"
        @close="fecharModal"
        @save="salvarCupom"
      />
    </div>
  </div>
</template>
