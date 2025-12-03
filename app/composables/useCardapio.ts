import type { CardapioState, Categoria, Produto } from '../../shared/types/cardapio.types'

export const useCardapio = () => {
  const supabase = useSupabaseClient()
  
  // Estado reativo do cardápio
  const cardapioState = useState<CardapioState>('cardapio', () => ({
    categorias: [],
    produtos: [],
    carrinho: []
  }))

  const loading = ref(false)
  const error = ref<string | null>(null)

  // Obter empresa_id do usuário logado
  const obterEmpresaId = async (): Promise<string | null> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('❌ [useCardapio] Erro ao obter usuário:', authError)
        return null
      }
      
      if (!user?.id) {
        console.log('⚠️ [useCardapio] Usuário não está logado')
        return null
      }

      console.log('🔍 [useCardapio] Buscando empresa para user.id:', user.id, 'email:', user.email)

      // 1. PRIORIDADE: Buscar empresa compartilhada via empresa_usuarios
      const { data: empresaCompartilhada, error: erroCompartilhada } = await supabase
        .from('empresa_usuarios')
        .select('empresa_id')
        .eq('usuario_id', user.id)
        .limit(1)
        .maybeSingle()

      if (erroCompartilhada) {
        console.error('❌ [useCardapio] Erro ao buscar empresa compartilhada:', erroCompartilhada)
      }

      if (empresaCompartilhada?.empresa_id) {
        console.log('✅ [useCardapio] Usando empresa compartilhada:', empresaCompartilhada.empresa_id)
        return empresaCompartilhada.empresa_id
      }

      console.log('ℹ️ [useCardapio] Nenhuma empresa compartilhada encontrada, buscando empresa própria...')

      // 2. FALLBACK: Buscar empresa própria (onde usuario_id é dono)
      const { data: empresaPropria, error: erroPropria } = await supabase
        .from('empresas')
        .select('id')
        .eq('usuario_id', user.id)
        .maybeSingle()

      if (erroPropria) {
        console.error('❌ [useCardapio] Erro ao buscar empresa própria:', erroPropria)
      }

      if (empresaPropria?.id) {
        console.log('✅ [useCardapio] Usando empresa própria:', empresaPropria.id)
        return empresaPropria.id
      }

      console.warn('⚠️ [useCardapio] Nenhuma empresa encontrada para o usuário')
      return null
    } catch (e) {
      console.error('❌ [useCardapio] Erro ao obter empresa_id:', e)
      return null
    }
  }

  // Carregar categorias do banco
  const carregarCategorias = async () => {
    console.log('🚀 [carregarCategorias] INICIANDO...')
    const empresaId = await obterEmpresaId()
    console.log('🏢 [carregarCategorias] empresaId obtido:', empresaId)
    console.log('🏢 [carregarCategorias] tipo do empresaId:', typeof empresaId)
    
    if (!empresaId) {
      error.value = 'Empresa não identificada'
      console.error('❌ [carregarCategorias] Empresa não identificada - empresaId é:', empresaId)
      return
    }

    try {
      loading.value = true
      error.value = null

      console.log('📡 [carregarCategorias] Buscando categorias para empresa:', empresaId)
      const { data, error: supabaseError } = await supabase
        .from('categorias')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('ativa', true)
        .order('ordem', { ascending: true })

      if (supabaseError) {
        console.error('❌ [carregarCategorias] Erro Supabase:', supabaseError)
        throw supabaseError
      }

      console.log('✅ [carregarCategorias] Categorias encontradas:', data?.length || 0)
      console.log('📋 [carregarCategorias] Dados:', data)

      // Mapear os dados do banco para o formato esperado
      cardapioState.value.categorias = (data || []).map((cat: any) => ({
        id: cat.id,
        nome: cat.nome,
        descricao: cat.descricao || '',
        ordem: cat.ordem,
        ativa: cat.ativa,
        icone: cat.icone || 'utensils'
      }))
    } catch (e: any) {
      error.value = e.message
      console.error('Erro ao carregar categorias:', e)
    } finally {
      loading.value = false
    }
  }

  // Carregar produtos do banco
  const carregarProdutos = async () => {
    console.log('🚀 [carregarProdutos] INICIANDO...')
    const empresaId = await obterEmpresaId()
    console.log('🏢 [carregarProdutos] empresaId obtido:', empresaId)
    console.log('🏢 [carregarProdutos] tipo do empresaId:', typeof empresaId)
    
    if (!empresaId) {
      error.value = 'Empresa não identificada'
      console.error('❌ [carregarProdutos] Empresa não identificada - empresaId é:', empresaId)
      return
    }

    try {
      loading.value = true
      error.value = null

      console.log('📡 [carregarProdutos] Buscando produtos para empresa:', empresaId)
      const { data, error: supabaseError } = await supabase
        .from('produtos')
        .select('*')
        .eq('empresa_id', empresaId)
        // Removido filtro .eq('ativo', true) para carregar todos os produtos

      if (supabaseError) {
        console.error('❌ [carregarProdutos] Erro Supabase:', supabaseError)
        throw supabaseError
      }
      
      console.log('✅ [carregarProdutos] Produtos encontrados:', data?.length || 0)
      console.log('📋 [carregarProdutos] Primeiros 3 produtos:', data?.slice(0, 3))

      // Mapear os dados do banco para o formato esperado
      cardapioState.value.produtos = (data || []).map((prod: any) => ({
        id: prod.id,
        nome: prod.nome,
        preco: prod.preco, // Mantém preco para produtos comuns e como fallback
        descricao: prod.descricao || '',
        foto: prod.foto || '',
        categoriaId: prod.categoria_id,
        ativo: prod.ativo,
        tipo: prod.tipo,
        // Campos opcionais para pizzas
        ...(prod.tamanhos && { tamanhos: prod.tamanhos }),
        ...(prod.sabores && { sabores: prod.sabores })
      }))
      
      console.log('[useCardapio] Produtos carregados:', cardapioState.value.produtos.length)
      console.log('[useCardapio] Produtos tipo pizza:', cardapioState.value.produtos.filter(p => p.tipo === 'pizza').length)
    } catch (e: any) {
      error.value = e.message
      console.error('Erro ao carregar produtos:', e)
    } finally {
      loading.value = false
    }
  }

  // Carregar tudo
  const carregarCardapio = async () => {
    await Promise.all([
      carregarCategorias(),
      carregarProdutos()
    ])
  }

  // Getters
  const categorias = computed(() => cardapioState.value.categorias.filter(c => c.ativa).sort((a, b) => a.ordem - b.ordem))
  const produtos = computed(() => cardapioState.value.produtos) // Retorna todos os produtos, incluindo inativos

  // Funções para categorias
  const adicionarCategoria = async (categoria: Omit<Categoria, 'id'>) => {
    const empresaId = await obterEmpresaId()
    if (!empresaId) {
      error.value = 'Empresa não identificada'
      return
    }

    try {
      loading.value = true
      const { data, error: supabaseError } = await supabase
        .from('categorias')
        .insert({
          empresa_id: empresaId,
          nome: categoria.nome,
          descricao: categoria.descricao,
          icone: categoria.icone,
          ordem: categoria.ordem,
          ativa: categoria.ativa
        })
        .select()
        .single()

      if (supabaseError) throw supabaseError
      
      // Recarregar categorias
      await carregarCategorias()
    } catch (e: any) {
      error.value = e.message
      console.error('Erro ao adicionar categoria:', e)
    } finally {
      loading.value = false
    }
  }

  const editarCategoria = async (id: string, dadosAtualizados: Partial<Omit<Categoria, 'id'>>) => {
    try {
      loading.value = true
      const { error: supabaseError } = await supabase
        .from('categorias')
        .update(dadosAtualizados)
        .eq('id', id)

      if (supabaseError) throw supabaseError
      
      // Recarregar categorias
      await carregarCategorias()
    } catch (e: any) {
      error.value = e.message
      console.error('Erro ao editar categoria:', e)
    } finally {
      loading.value = false
    }
  }

  const removerCategoria = async (id: string) => {
    try {
      loading.value = true
      // Soft delete - apenas desativa
      const { error: supabaseError } = await supabase
        .from('categorias')
        .update({ ativa: false })
        .eq('id', id)

      if (supabaseError) throw supabaseError
      
      // Recarregar categorias
      await carregarCategorias()
    } catch (e: any) {
      error.value = e.message
      console.error('Erro ao remover categoria:', e)
    } finally {
      loading.value = false
    }
  }

  // Funções para produtos
  const adicionarProduto = async (produto: Omit<Produto, 'id'>) => {
    const empresaId = await obterEmpresaId()
    if (!empresaId) {
      error.value = 'Empresa não identificada'
      return
    }

    try {
      loading.value = true
      const { data, error: supabaseError } = await supabase
        .from('produtos')
        .insert({
          empresa_id: empresaId,
          categoria_id: produto.categoriaId,
          nome: produto.nome,
          descricao: produto.descricao,
          preco: produto.preco,
          foto: produto.foto,
          tipo: produto.tipo,
          ativo: produto.ativo,
          tamanhos: produto.tamanhos || null,
          sabores: produto.sabores || null
        })
        .select()
        .single()

      if (supabaseError) throw supabaseError
      
      // Recarregar produtos
      await carregarProdutos()
      
      // Toast de sucesso
      const toast = await useToastSafe()
      if (toast) {
        toast.success(`Produto "${produto.nome}" adicionado com sucesso!`)
      }
    } catch (e: any) {
      error.value = e.message
      console.error('Erro ao adicionar produto:', e)
      
      // Toast de erro
      const toast = await useToastSafe()
      if (toast) {
        toast.error(`Erro ao adicionar produto: ${e.message}`)
      }
    } finally {
      loading.value = false
    }
  }

  const editarProduto = async (id: string, dadosAtualizados: Partial<Omit<Produto, 'id'>>) => {
    try {
      loading.value = true
      
      // Mapear campos do frontend para o banco
      const updateData: any = {}
      if (dadosAtualizados.nome !== undefined) updateData.nome = dadosAtualizados.nome
      if (dadosAtualizados.descricao !== undefined) updateData.descricao = dadosAtualizados.descricao
      if (dadosAtualizados.preco !== undefined) updateData.preco = dadosAtualizados.preco
      if (dadosAtualizados.foto !== undefined) updateData.foto = dadosAtualizados.foto
      if (dadosAtualizados.categoriaId !== undefined) updateData.categoria_id = dadosAtualizados.categoriaId
      if (dadosAtualizados.tipo !== undefined) updateData.tipo = dadosAtualizados.tipo
      if (dadosAtualizados.ativo !== undefined) updateData.ativo = dadosAtualizados.ativo
      if (dadosAtualizados.tamanhos !== undefined) updateData.tamanhos = dadosAtualizados.tamanhos
      if (dadosAtualizados.sabores !== undefined) updateData.sabores = dadosAtualizados.sabores

      const { error: supabaseError } = await supabase
        .from('produtos')
        .update(updateData)
        .eq('id', id)

      if (supabaseError) throw supabaseError
      
      // Recarregar produtos
      await carregarProdutos()
      
      // Toast de sucesso (verifica se é alteração de status ou edição completa)
      const toast = await useToastSafe()
      if (toast) {
        if (dadosAtualizados.ativo !== undefined && Object.keys(dadosAtualizados).length === 1) {
          // Apenas mudança de status
          toast.success(dadosAtualizados.ativo ? 'Produto ativado!' : 'Produto desativado!')
        } else {
          // Edição completa
          toast.success('Produto atualizado com sucesso!')
        }
      }
    } catch (e: any) {
      error.value = e.message
      console.error('Erro ao editar produto:', e)
      
      // Toast de erro
      const toast = await useToastSafe()
      if (toast) {
        toast.error(`Erro ao editar produto: ${e.message}`)
      }
    } finally {
      loading.value = false
    }
  }

  const removerProduto = async (id: string) => {
    try {
      loading.value = true
      // DELETE permanente do banco de dados
      const { error: supabaseError } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError
      
      // Recarregar produtos
      await carregarProdutos()
      
      // Toast de sucesso
      const toast = await useToastSafe()
      if (toast) {
        toast.success('Produto excluído permanentemente!')
      }
    } catch (e: any) {
      error.value = e.message
      console.error('Erro ao remover produto:', e)
      
      // Toast de erro
      const toast = await useToastSafe()
      if (toast) {
        toast.error(`Erro ao excluir produto: ${e.message}`)
      }
    } finally {
      loading.value = false
    }
  }

  // Funções utilitárias
  const produtosPorCategoria = (categoriaId: string) => {
    return produtos.value.filter(p => p.categoriaId === categoriaId)
  }

  const calcularPrecoPizza = (sabores: any[], tamanho: { multiplicador: number }) => {
    if (sabores.length === 0) return 0
    
    // Regra especial: pega o maior preço entre os sabores
    const maiorPreco = Math.max(...sabores.map(s => s.preco))
    return maiorPreco * tamanho.multiplicador
  }

  return {
    // Estado
    categorias,
    produtos,
    loading: readonly(loading),
    error: readonly(error),
    
    // Funções de carregamento
    carregarCardapio,
    carregarCategorias,
    carregarProdutos,
    
    // Funções de categoria
    adicionarCategoria,
    editarCategoria,
    removerCategoria,
    
    // Funções de produto
    adicionarProduto,
    editarProduto,
    removerProduto,
    
    // Funções utilitárias
    produtosPorCategoria,
    calcularPrecoPizza
  }
}
