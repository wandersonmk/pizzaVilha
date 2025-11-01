import type { Cupom, CupomFormData } from '../../shared/types/cupom.types'

export const useCupons = () => {
  // Só executar no cliente
  if (process.server) {
    return {
      cupons: computed(() => []),
      loading: computed(() => false),
      error: computed(() => null),
      carregarCupons: async () => {},
      criarCupom: async () => false,
      atualizarCupom: async () => false,
      toggleStatus: async () => false,
      removerCupom: async () => false,
      duplicarCupom: async () => false,
      validarCupom: async () => ({ valido: false, mensagem: 'Servidor' })
    }
  }
  
  const supabase = useSupabaseClient()
  
  // Estado reativo dos cupons
  const cupons = useState<Cupom[]>('cupons', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Helper para mostrar toasts
  const showToast = async (type: 'success' | 'error', message: string) => {
    if (process.client) {
      const toast = await useToastSafe()
      if (toast && toast[type]) {
        toast[type](message)
      }
    }
  }

  // Carregar cupons do banco
  const carregarCupons = async () => {
    try {
      loading.value = true
      error.value = null

      const { data, error: supabaseError } = await supabase
        .from('cupons')
        .select('*')
        .order('criado_em', { ascending: false })

      if (supabaseError) throw supabaseError

      // Mapear os dados do banco para o formato do frontend
      cupons.value = (data || []).map((cupom: any) => ({
        id: cupom.id,
        codigo: cupom.codigo,
        descricao: cupom.descricao,
        tipoDesconto: cupom.tipo_desconto,
        valorDesconto: parseFloat(cupom.valor_desconto),
        valorMinimoPedido: cupom.valor_minimo_pedido ? parseFloat(cupom.valor_minimo_pedido) : undefined,
        dataInicio: cupom.data_inicio,
        dataExpiracao: cupom.data_expiracao,
        quantidadeMaximaUsos: cupom.quantidade_maxima_usos,
        quantidadeUsada: cupom.quantidade_usada,
        usoPorCliente: cupom.uso_por_cliente,
        status: cupom.status,
        ativo: cupom.ativo,
        criadoEm: cupom.criado_em,
        atualizadoEm: cupom.atualizado_em
      }))

      return cupons.value
    } catch (e: any) {
      console.error('Erro ao carregar cupons:', e)
      error.value = e.message || 'Erro ao carregar cupons'
      await showToast('error', 'Erro ao carregar cupons')
      return []
    } finally {
      loading.value = false
    }
  }

  // Criar novo cupom
  const criarCupom = async (cupomData: CupomFormData): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      const { data, error: supabaseError } = await supabase
        .from('cupons')
        .insert({
          codigo: cupomData.codigo,
          descricao: cupomData.descricao,
          tipo_desconto: cupomData.tipoDesconto,
          valor_desconto: cupomData.valorDesconto,
          valor_minimo_pedido: cupomData.valorMinimoPedido || null,
          data_inicio: cupomData.dataInicio,
          data_expiracao: cupomData.dataExpiracao,
          quantidade_maxima_usos: cupomData.quantidadeMaximaUsos || null,
          uso_por_cliente: cupomData.usoPorCliente || null,
          ativo: cupomData.ativo
        })
        .select()
        .single()

      if (supabaseError) throw supabaseError

      await showToast('success', 'Cupom criado com sucesso!')
      await carregarCupons()
      return true
    } catch (e: any) {
      console.error('Erro ao criar cupom:', e)
      error.value = e.message || 'Erro ao criar cupom'
      
      // Tratar erro de código duplicado
      if (e.code === '23505') {
        await showToast('error', 'Este código de cupom já existe!')
      } else {
        await showToast('error', 'Erro ao criar cupom')
      }
      return false
    } finally {
      loading.value = false
    }
  }

  // Atualizar cupom existente
  const atualizarCupom = async (id: string, cupomData: CupomFormData): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      const { error: supabaseError } = await supabase
        .from('cupons')
        .update({
          codigo: cupomData.codigo,
          descricao: cupomData.descricao,
          tipo_desconto: cupomData.tipoDesconto,
          valor_desconto: cupomData.valorDesconto,
          valor_minimo_pedido: cupomData.valorMinimoPedido || null,
          data_inicio: cupomData.dataInicio,
          data_expiracao: cupomData.dataExpiracao,
          quantidade_maxima_usos: cupomData.quantidadeMaximaUsos || null,
          uso_por_cliente: cupomData.usoPorCliente || null,
          ativo: cupomData.ativo
        })
        .eq('id', id)

      if (supabaseError) throw supabaseError

      await showToast('success', 'Cupom atualizado com sucesso!')
      await carregarCupons()
      return true
    } catch (e: any) {
      console.error('Erro ao atualizar cupom:', e)
      error.value = e.message || 'Erro ao atualizar cupom'
      
      if (e.code === '23505') {
        await showToast('error', 'Este código de cupom já existe!')
      } else {
        await showToast('error', 'Erro ao atualizar cupom')
      }
      return false
    } finally {
      loading.value = false
    }
  }

  // Alternar status ativo/inativo do cupom
  const toggleStatus = async (id: string): Promise<boolean> => {
    try {
      const cupom = cupons.value.find(c => c.id === id)
      if (!cupom) return false

      const novoStatus = !cupom.ativo

      const { error: supabaseError } = await supabase
        .from('cupons')
        .update({ ativo: novoStatus })
        .eq('id', id)

      if (supabaseError) throw supabaseError

      await showToast('success', novoStatus ? 'Cupom ativado!' : 'Cupom desativado!')
      await carregarCupons()
      return true
    } catch (e: any) {
      console.error('Erro ao alterar status do cupom:', e)
      await showToast('error', 'Erro ao alterar status do cupom')
      return false
    }
  }

  // Remover cupom
  const removerCupom = async (id: string): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      const { error: supabaseError } = await supabase
        .from('cupons')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError

      await showToast('success', 'Cupom removido com sucesso!')
      await carregarCupons()
      return true
    } catch (e: any) {
      console.error('Erro ao remover cupom:', e)
      error.value = e.message || 'Erro ao remover cupom'
      await showToast('error', 'Erro ao remover cupom')
      return false
    } finally {
      loading.value = false
    }
  }

  // Duplicar cupom (criar cópia com código diferente)
  const duplicarCupom = async (cupom: Cupom): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      // Gerar novo código com sufixo
      let novoCodigo = `${cupom.codigo}_COPIA`
      let tentativa = 1
      
      // Verificar se o código já existe
      while (cupons.value.some(c => c.codigo === novoCodigo)) {
        novoCodigo = `${cupom.codigo}_COPIA${tentativa}`
        tentativa++
      }

      const { error: supabaseError } = await supabase
        .from('cupons')
        .insert({
          codigo: novoCodigo,
          descricao: cupom.descricao + ' (Cópia)',
          tipo_desconto: cupom.tipoDesconto,
          valor_desconto: cupom.valorDesconto,
          valor_minimo_pedido: cupom.valorMinimoPedido || null,
          data_inicio: cupom.dataInicio,
          data_expiracao: cupom.dataExpiracao,
          quantidade_maxima_usos: cupom.quantidadeMaximaUsos || null,
          quantidade_usada: 0, // Reset contador
          uso_por_cliente: cupom.usoPorCliente || null,
          ativo: false // Iniciar desativado
        })

      if (supabaseError) throw supabaseError

      await showToast('success', 'Cupom duplicado com sucesso!')
      await carregarCupons()
      return true
    } catch (e: any) {
      console.error('Erro ao duplicar cupom:', e)
      error.value = e.message || 'Erro ao duplicar cupom'
      await showToast('error', 'Erro ao duplicar cupom')
      return false
    } finally {
      loading.value = false
    }
  }

  // Validar se um cupom pode ser usado
  const validarCupom = async (codigo: string): Promise<{ valido: boolean; cupom?: Cupom; mensagem?: string }> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('cupons')
        .select('*')
        .eq('codigo', codigo.toUpperCase())
        .single()

      if (supabaseError || !data) {
        return { valido: false, mensagem: 'Cupom não encontrado' }
      }

      const cupom: Cupom = {
        id: data.id,
        codigo: data.codigo,
        descricao: data.descricao,
        tipoDesconto: data.tipo_desconto,
        valorDesconto: parseFloat(data.valor_desconto),
        valorMinimoPedido: data.valor_minimo_pedido ? parseFloat(data.valor_minimo_pedido) : undefined,
        dataInicio: data.data_inicio,
        dataExpiracao: data.data_expiracao,
        quantidadeMaximaUsos: data.quantidade_maxima_usos,
        quantidadeUsada: data.quantidade_usada,
        usoPorCliente: data.uso_por_cliente,
        status: data.status,
        ativo: data.ativo,
        criadoEm: data.criado_em,
        atualizadoEm: data.atualizado_em
      }

      // Verificar se está ativo
      if (!cupom.ativo) {
        return { valido: false, mensagem: 'Este cupom está desativado' }
      }

      // Verificar status
      if (cupom.status !== 'ativo') {
        return { valido: false, mensagem: 'Este cupom não está mais válido' }
      }

      // Verificar data de validade
      const agora = new Date()
      const dataExpiracao = new Date(cupom.dataExpiracao)
      
      if (dataExpiracao < agora) {
        return { valido: false, mensagem: 'Este cupom expirou' }
      }

      // Verificar limite de usos
      if (cupom.quantidadeMaximaUsos && cupom.quantidadeUsada >= cupom.quantidadeMaximaUsos) {
        return { valido: false, mensagem: 'Este cupom atingiu o limite de usos' }
      }

      return { valido: true, cupom }
    } catch (e: any) {
      console.error('Erro ao validar cupom:', e)
      return { valido: false, mensagem: 'Erro ao validar cupom' }
    }
  }

  return {
    cupons: computed(() => cupons.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    carregarCupons,
    criarCupom,
    atualizarCupom,
    toggleStatus,
    removerCupom,
    duplicarCupom,
    validarCupom
  }
}
