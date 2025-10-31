interface ToastNotification {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  icon?: string
  duration?: number
}

export const useToastNotification = () => {
  const notifications = ref<ToastNotification[]>([])
  let notificationCounter = 0

  const showToast = (notification: Omit<ToastNotification, 'id'>) => {
    const toast: ToastNotification = {
      id: `toast-${++notificationCounter}`,
      duration: 5000, // 5 segundos por padrão
      ...notification
    }

    notifications.value.push(toast)

    // Remover automaticamente após a duração especificada
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(toast.id)
      }, toast.duration)
    }

    return toast.id
  }

  const removeToast = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const showNewOrderToast = (numerosPedidos: number[], nomeCliente?: string) => {
    const qtdePedidos = numerosPedidos.length
    
    if (qtdePedidos === 1) {
      return showToast({
        title: '🍕 Novo Pedido!',
        message: nomeCliente 
          ? `Pedido #${numerosPedidos[0]} - ${nomeCliente}`
          : `Pedido #${numerosPedidos[0]}`,
        type: 'info',
        icon: '🍕',
        duration: 8000 // 8 segundos para pedidos
      })
    } else {
      return showToast({
        title: '🍕 Novos Pedidos!',
        message: `${qtdePedidos} pedidos aguardando: #${numerosPedidos.join(', #')}`,
        type: 'info',
        icon: '🍕',
        duration: 10000 // 10 segundos para múltiplos pedidos
      })
    }
  }

  const clearAllToasts = () => {
    notifications.value = []
  }

  return {
    notifications: readonly(notifications),
    showToast,
    removeToast,
    showNewOrderToast,
    clearAllToasts
  }
}