<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 class="text-xl font-bold text-foreground">Pedido #{{ pedido?.numero }}</h2>
          <p class="text-muted-foreground">{{ pedido?.dataHora.toLocaleString('pt-BR') }}</p>
        </div>
        <div class="flex items-center gap-2">
          <span :class="[
            'px-3 py-1 text-sm font-medium rounded-full',
            getStatusColor(pedido?.status || '')
          ]">
            {{ getStatusLabel(pedido?.status || '') }}
          </span>
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <font-awesome-icon icon="times" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Conteúdo -->
      <div class="overflow-y-auto max-h-[calc(90vh-200px)]">
        <div class="p-6 space-y-6">
          <!-- Informações do Cliente -->
          <div class="bg-muted/30 rounded-lg p-4">
            <h3 class="font-semibold text-foreground mb-3">Informações do Cliente</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-muted-foreground">Nome</label>
                <p class="text-foreground">{{ pedido?.cliente }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground">Telefone</label>
                <p class="text-foreground">{{ pedido?.telefone }}</p>
              </div>
              <div v-if="pedido?.endereco" class="md:col-span-2">
                <label class="text-sm font-medium text-muted-foreground">Endereço</label>
                <p class="text-foreground">{{ pedido?.endereco }}</p>
              </div>
            </div>
          </div>

          <!-- Detalhes do Pedido -->
          <div>
            <h3 class="font-semibold text-foreground mb-3">Itens do Pedido</h3>
            <div class="space-y-3">
              <div
                v-for="item in pedido?.items"
                :key="item.nome"
                class="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div class="flex-1">
                  <p class="font-medium text-foreground">{{ item.nome }}</p>
                  <p v-if="item.observacao" class="text-sm text-muted-foreground mt-1">
                    Obs: {{ item.observacao }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-foreground">{{ item.quantidade }}x R$ {{ item.preco.toFixed(2) }}</p>
                  <p class="font-semibold text-foreground">R$ {{ (item.quantidade * item.preco).toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumo Financeiro -->
          <div class="bg-muted/30 rounded-lg p-4">
            <h3 class="font-semibold text-foreground mb-3">Resumo Financeiro</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Subtotal</span>
                <span class="text-foreground">R$ {{ (pedido?.total - (pedido?.valorEntrega || 0)).toFixed(2) }}</span>
              </div>
              <div v-if="pedido?.valorEntrega && pedido?.tipoEntrega === 'entrega'" class="flex justify-between">
                <span class="text-muted-foreground">Taxa de entrega</span>
                <span class="text-foreground">R$ {{ pedido.valorEntrega.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold border-t border-border pt-2">
                <span class="text-foreground">Total</span>
                <span class="text-foreground">R$ {{ pedido?.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Informações de Pagamento e Entrega -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-muted/30 rounded-lg p-4">
              <h4 class="font-medium text-foreground mb-2">Pagamento</h4>
              <span :class="[
                'px-2 py-1 text-sm rounded-full',
                getPaymentColor(pedido?.formaPagamento || '')
              ]">
                {{ getPaymentLabel(pedido?.formaPagamento || '') }}
              </span>
              <div v-if="pedido?.troco" class="mt-2 space-y-1">
                <p class="text-sm text-muted-foreground">Troco para: R$ {{ Number(pedido.troco).toFixed(2) }}</p>
                <div 
                  v-if="Number(pedido.troco) > Number(pedido.total)"
                  class="p-2 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-md"
                >
                  <p class="text-sm text-green-700 dark:text-green-400 font-medium">
                    💰 Troco: R$ {{ (Number(pedido.troco) - Number(pedido.total)).toFixed(2) }}
                  </p>
                </div>
                <div 
                  v-else
                  class="p-2 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800 rounded-md"
                >
                  <p class="text-sm text-blue-700 dark:text-blue-400 font-medium">
                    ℹ️ Não precisa de troco
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-muted/30 rounded-lg p-4">
              <h4 class="font-medium text-foreground mb-2">Entrega</h4>
              <span :class="[
                'px-2 py-1 text-sm rounded-full',
                pedido?.tipoEntrega === 'entrega' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700'
              ]">
                {{ pedido?.tipoEntrega === 'entrega' ? 'Entrega' : 'Retirada' }}
              </span>
              <div v-if="pedido?.tempoEstimado" class="mt-2">
                <p class="text-sm text-muted-foreground">Tempo estimado: {{ pedido.tempoEstimado }} min</p>
              </div>
            </div>
          </div>

          <!-- Observações -->
          <div v-if="pedido?.observacao" class="bg-muted/30 rounded-lg p-4">
            <h4 class="font-medium text-foreground mb-2">Observações</h4>
            <p class="text-foreground">{{ pedido.observacao }}</p>
          </div>
        </div>
      </div>

      <!-- Footer com ações -->
      <div class="p-6 border-t border-border">
        <div class="flex items-center gap-3">
          <!-- Botões de mudança de status -->
          <template v-if="pedido?.status === 'novo'">
            <button
              @click="acceptPedido"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ✅ Aceitar Pedido
            </button>
          </template>
          
          <template v-else-if="pedido?.status === 'cozinha'">
            <button
              @click="markPedidoAsReady"
              class="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <font-awesome-icon icon="utensils" class="w-4 h-4 mr-2" />
              Marcar como Pronto
            </button>
          </template>
          
          <template v-else-if="pedido?.status === 'entrega'">
            <button
              @click="completePedido"
              class="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <font-awesome-icon icon="check-circle" class="w-4 h-4 mr-2" />
              Concluir Entrega
            </button>
          </template>

          <!-- Botão de imprimir sempre disponível -->
          <button
            @click="printPedido"
            class="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition-colors"
          >
            <font-awesome-icon icon="print" class="w-4 h-4 mr-2" />
            Imprimir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePedidos } from '~/composables/usePedidos'

interface PedidoItem {
  nome: string
  quantidade: number
  preco: number
  observacao?: string
}

interface Pedido {
  id: string
  numero: number
  cliente: string
  telefone: string
  endereco?: string
  items: PedidoItem[]
  total: number
  formaPagamento: 'dinheiro' | 'cartao' | 'pix'
  tipoEntrega: 'retirada' | 'entrega'
  status: 'novo' | 'cozinha' | 'entrega' | 'concluido'
  observacao?: string
  troco?: number
  dataHora: Date
  tempoEstimado?: number
  valorEntrega?: number
}

interface Props {
  isOpen: boolean
  pedido: Pedido | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  print: [pedido: Pedido]
  accept: [pedidoId: string]
  ready: [pedidoId: string]
  complete: [pedidoId: string]
}>()

// Funções que emitem eventos para o componente pai (como os botões da tela principal)
const acceptPedido = () => {
  if (props.pedido) {
    emit('accept', props.pedido.id)
    emit('close')
  }
}

const markPedidoAsReady = () => {
  if (props.pedido) {
    emit('ready', props.pedido.id)
    emit('close')
  }
}

const completePedido = () => {
  if (props.pedido) {
    emit('complete', props.pedido.id)
    emit('close')
  }
}

const updateStatus = (newStatus: string) => {
  alert(`🔥 MODAL: Botão clicado! Status: ${newStatus}`)
  console.log(`[PedidoModal] updateStatus chamado: ${newStatus}`, props.pedido)
  
  if (props.pedido) {
    console.log(`[PedidoModal] Emitindo evento update-status: ${props.pedido.id} -> ${newStatus}`)
    emit('update-status', props.pedido.id, newStatus)
    alert(`📡 MODAL: Evento emitido! ${props.pedido.id} -> ${newStatus}`)
  } else {
    console.error('[PedidoModal] Nenhum pedido encontrado para atualizar')
  }
}

const getStatusLabel = (status: string) => {
  const labels = {
    novo: 'Novo',
    cozinha: 'Na Cozinha',
    entrega: 'Saiu para Entrega',
    concluido: 'Concluído'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusColor = (status: string) => {
  const colors = {
    novo: 'bg-blue-100 text-blue-700',
    cozinha: 'bg-orange-100 text-orange-700',
    entrega: 'bg-purple-100 text-purple-700',
    concluido: 'bg-green-100 text-green-700'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
}

const getPaymentLabel = (payment: string) => {
  const labels = {
    dinheiro: 'Dinheiro',
    cartao: 'Cartão',
    pix: 'PIX'
  }
  return labels[payment as keyof typeof labels] || payment
}

const getPaymentColor = (payment: string) => {
  const colors = {
    dinheiro: 'bg-green-100 text-green-700',
    cartao: 'bg-purple-100 text-purple-700',
    pix: 'bg-orange-100 text-orange-700'
  }
  return colors[payment as keyof typeof colors] || 'bg-gray-100 text-gray-700'
}

const printPedido = () => {
  if (!props.pedido) {
    console.error('Nenhum pedido selecionado para imprimir')
    return
  }
  
  // Debug: Verificar dados do pedido
  console.log('Imprimindo pedido:', {
    numero: props.pedido.numero,
    cliente: props.pedido.cliente,
    telefone: props.pedido.telefone,
    items: props.pedido.items,
    total: props.pedido.total
  })
  
  // Criar janela de impressão
  const printWindow = window.open('', '_blank', 'width=300,height=600')
  
  if (!printWindow) {
    alert('Por favor, permita pop-ups para imprimir o pedido')
    return
  }

  // HTML formatado para impressora térmica 80mm
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Pedido #${props.pedido.numero}</title>
      <style>
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
        
        body {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.2;
          margin: 0;
          padding: 8px;
          width: 72mm;
          color: #000;
          background: #fff;
          font-weight: 600;
        }
        
        .header {
          text-align: center;
          border-bottom: 1px dashed #000;
          padding-bottom: 8px;
          margin-bottom: 8px;
        }
        
        .restaurant-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .separator {
          border-bottom: 1px dashed #000;
          margin: 8px 0;
        }
        
        .section {
          margin-bottom: 8px;
        }
        
        .section-title {
          font-weight: bold;
          margin-bottom: 4px;
          font-size: 14px;
        }
        
        .item-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2px;
          font-weight: 600;
          font-size: 15px;
        }
        
        .item-wrapper {
          margin-bottom: 4px;
        }
        
        .item-separator {
          color: #999;
          font-size: 10px;
          text-align: center;
          margin: 4px 0;
          overflow: hidden;
          white-space: nowrap;
        }
        
        .item-name {
          flex: 1;
          font-weight: 600;
          font-size: 15px;
        }
        
        .item-price {
          text-align: right;
          min-width: 60px;
          font-weight: 600;
          font-size: 15px;
        }
        
        .total-line {
          font-weight: bold;
          font-size: 16px;
          border-top: 1px solid #000;
          padding-top: 4px;
          margin-top: 8px;
        }
        
        .footer {
          text-align: center;
          margin-top: 16px;
          border-top: 1px dashed #000;
          padding-top: 8px;
        }
        
        .obs {
          background: #f5f5f5;
          padding: 4px;
          margin: 4px 0;
          border-left: 2px solid #666;
          font-weight: 600;
          font-size: 14px;
        }
        
        @media screen {
          body {
            max-width: 300px;
            margin: 20px auto;
            border: 1px solid #ccc;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="font-size: 12px; margin-bottom: 4px;">CUPOM NAO FISCAL</div>
        <div class="restaurant-name">Pizza'Vilha</div>
        <div style="font-size: 14px; font-weight: 600;">Plataforma: Pizza'Vilha</div>
        <div style="font-size: 14px; font-weight: 600; margin-top: 2px;">CNPJ: 54.534.693/0001-21</div>
      </div>
      
      <div class="section">
        <div style="display: flex; justify-content: space-between;">
          <span><strong>Pedido:</strong> #${props.pedido.numero}</span>
          <span><strong>Data:</strong> ${formatDateTime(props.pedido.dataHora)}</span>
        </div>
      </div>
      
      <div class="separator"></div>
      
      <div class="section">
        <div class="section-title">CLIENTE:</div>
        <div style="margin-bottom: 2px;">
          <strong>Nome:</strong> ${props.pedido.cliente}
        </div>
        <div style="margin-bottom: 2px;">
          <strong>Telefone:</strong> ${props.pedido.telefone}
        </div>
        ${props.pedido.endereco ? `
          <div style="margin-top: 4px; padding-top: 4px; border-top: 1px dotted #ccc;">
            <strong>Endereço:</strong><br/>
            ${props.pedido.endereco}
          </div>
        ` : '<div style="margin-top: 4px; padding: 4px; background: #f0f0f0; text-align: center;"><strong>RETIRADA NO BALCÃO</strong></div>'}
      </div>
      
      <div class="separator"></div>
      
      <div class="section">
        <div class="section-title">ITENS:</div>
        ${props.pedido.items.map((item, index) => `
          <div class="item-wrapper">
            <div class="item-line">
              <span class="item-name">${item.quantidade}x ${item.nome}</span>
              <span class="item-price">R$ ${(item.quantidade * item.preco).toFixed(2)}</span>
            </div>
            ${item.observacao ? `<div class="obs">Obs: ${item.observacao}</div>` : ''}
            ${index < props.pedido.items.length - 1 ? '<div class="item-separator">...................................</div>' : ''}
          </div>
        `).join('')}
      </div>
      
      <div class="separator"></div>
      
      <div class="section">
        <div class="item-line">
          <span>Subtotal:</span>
          <span>R$ ${(props.pedido.total - (props.pedido.valorEntrega || 0)).toFixed(2)}</span>
        </div>
        ${props.pedido.tipoEntrega === 'entrega' && props.pedido.valorEntrega ? `
          <div class="item-line">
            <span>Taxa de entrega:</span>
            <span>R$ ${props.pedido.valorEntrega.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="item-line total-line">
          <span>TOTAL:</span>
          <span>R$ ${props.pedido.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div class="section">
        <div><strong>Pagamento:</strong> ${getPaymentLabel(props.pedido.formaPagamento).toUpperCase()}</div>
        <div><strong>Tipo:</strong> ${props.pedido.tipoEntrega === 'entrega' ? 'ENTREGA' : 'RETIRADA'}</div>
        ${props.pedido.troco ? `
          <div><strong>Troco para:</strong> R$ ${Number(props.pedido.troco).toFixed(2)}</div>
          ${Number(props.pedido.troco) > Number(props.pedido.total) 
            ? `<div><strong>Troco:</strong> R$ ${(Number(props.pedido.troco) - Number(props.pedido.total)).toFixed(2)}</div>`
            : `<div><strong>Não precisa de troco</strong></div>`
          }
        ` : ''}
        ${props.pedido.tempoEstimado ? `<div><strong>Tempo estimado:</strong> ${props.pedido.tempoEstimado} min</div>` : ''}
      </div>
      
      ${props.pedido.observacao ? `
        <div class="separator"></div>
        <div class="section">
          <div class="section-title">OBSERVAÇÕES:</div>
          <div class="obs">${props.pedido.observacao}</div>
        </div>
      ` : ''}
      
      <div class="footer">
        <div>Obrigado pela preferência!</div>
        <div>PizzaVilha</div>
        <div>${formatDateTime(new Date())}</div>
      </div>
    </body>
    </html>
  `
  
  // Escrever conteúdo na janela
  printWindow.document.write(printContent)
  printWindow.document.close()
  
  // Aguardar carregamento e imprimir
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
      
      // Fechar janela após impressão (opcional)
      printWindow.onafterprint = () => {
        printWindow.close()
      }
    }, 250)
  }
  
  console.log(`Imprimindo pedido #${props.pedido.numero}`)
}

// Função auxiliar para formatar data/hora
const formatDateTime = (date: Date) => {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fechar modal com ESC
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      emit('close')
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>
