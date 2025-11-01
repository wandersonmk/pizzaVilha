export interface Cliente {
  id: string
  nome: string
  telefone: string
  endereco?: string
  qtdPedidos: number
  valorTotal: number
  ultimoPedido?: string
}

export function useClientes() {
  const clientes = useState<Cliente[]>('clientes_lista', () => [])
  const isLoading = useState<boolean>('clientes_loading', () => false)
  const error = useState<string | null>('clientes_error', () => null)

  // Buscar clientes agrupados da tabela pedidos
  async function buscarClientes() {
    if (!process.client) return

    try {
      isLoading.value = true
      error.value = null

      const supabase = useSupabaseClient()
      const { getEmpresaId } = useEmpresa()
      const empresaId = await getEmpresaId()

      if (!empresaId) {
        error.value = 'Empresa não encontrada'
        return
      }

      // Buscar todos os pedidos da empresa
      const { data: pedidos, error: pedidosError } = await supabase
        .from('pedidos')
        .select('nome_cliente, telefone_cliente, endereco_entrega, valor_total, created_at')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false })

      if (pedidosError) {
        console.error('Erro ao buscar pedidos:', pedidosError)
        error.value = 'Erro ao carregar clientes'
        return
      }

      if (!pedidos || pedidos.length === 0) {
        clientes.value = []
        return
      }

      // Agrupar pedidos por cliente (nome + telefone)
      const clientesMap = new Map<string, Cliente>()

      pedidos.forEach((pedido: any) => {
        const chave = `${pedido.nome_cliente}|${pedido.telefone_cliente || ''}`
        
        if (clientesMap.has(chave)) {
          const cliente = clientesMap.get(chave)!
          cliente.qtdPedidos++
          cliente.valorTotal += parseFloat(pedido.valor_total || 0)
          
          // Atualizar último pedido se for mais recente
          if (pedido.created_at && (!cliente.ultimoPedido || pedido.created_at > cliente.ultimoPedido)) {
            cliente.ultimoPedido = pedido.created_at
          }
        } else {
          clientesMap.set(chave, {
            id: chave,
            nome: pedido.nome_cliente,
            telefone: pedido.telefone_cliente || 'Não informado',
            endereco: pedido.endereco_entrega || undefined,
            qtdPedidos: 1,
            valorTotal: parseFloat(pedido.valor_total || 0),
            ultimoPedido: pedido.created_at
          })
        }
      })

      // Converter Map para Array e ordenar por quantidade de pedidos
      clientes.value = Array.from(clientesMap.values())
        .sort((a, b) => b.qtdPedidos - a.qtdPedidos)

      console.log(`${clientes.value.length} clientes carregados`)

    } catch (err) {
      console.error('Erro ao buscar clientes:', err)
      error.value = 'Erro ao carregar clientes'
    } finally {
      isLoading.value = false
    }
  }

  return {
    clientes: readonly(clientes),
    isLoading: readonly(isLoading),
    error: readonly(error),
    buscarClientes
  }
}
