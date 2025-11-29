// Interface para configurações da empresa
export interface EmpresaConfig {
  id?: string
  nome: string
  endereco: string | null
  telefone: string | null
  logotipo: string | null
  hora_abertura: string
  hora_fechamento: string
  tempo_estimado?: number
  aberto?: boolean
}

export function useEmpresa() {
  // Estado global para o nome da empresa
  const nomeEmpresa = useState<string | null>('empresa_nome', () => null)
  const isLoadingEmpresa = useState<boolean>('empresa_loading', () => false)

  // Busca SIMPLES e DIRETA do nome da empresa
  async function buscarNomeEmpresa() {
    if (!process.client) return

    try {
      isLoadingEmpresa.value = true
      const supabase = useSupabaseClient()
      
      // Pega o usuário atual da sessão do Supabase diretamente
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.id) {
        console.log('Usuário não está logado')
        nomeEmpresa.value = null
        return
      }

      console.log('Buscando empresa para usuário:', user.id)
      
      // Busca a empresa através da tabela de relacionamento
      const { data, error } = await supabase
        .from('empresa_usuarios')
        .select('empresas(nome)')
        .eq('usuario_id', user.id)
        .single()
      
      const empresaData = data?.empresas as any

      if (error) {
        console.error('Erro ao buscar empresa:', error)
        nomeEmpresa.value = null
        return
      }

      console.log('Nome da empresa encontrado:', empresaData?.nome)
      nomeEmpresa.value = empresaData?.nome || null
      
    } catch (err) {
      console.error('Erro:', err)
      nomeEmpresa.value = null
    } finally {
      isLoadingEmpresa.value = false
    }
  }

  // Função para obter o ID da empresa
  async function getEmpresaId(): Promise<string | null> {
    if (!process.client) return null

    try {
      const supabase = useSupabaseClient()
      
      // Pega o usuário atual da sessão do Supabase diretamente
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.id) {
        console.log('Usuário não está logado')
        return null
      }

      // Busca a empresa através da tabela de relacionamento
      const { data, error } = await supabase
        .from('empresa_usuarios')
        .select('empresa_id')
        .eq('usuario_id', user.id)
        .single()

      if (error) {
        console.error('Erro ao buscar empresa ID:', error)
        return null
      }

      return data?.empresa_id || null
      
    } catch (err) {
      console.error('Erro ao buscar empresa ID:', err)
      return null
    }
  }

  // Buscar todas as configurações da empresa
  async function buscarConfiguracoes(): Promise<EmpresaConfig | null> {
    if (!process.client) return null

    try {
      const supabase = useSupabaseClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.id) {
        console.log('Usuário não está logado')
        return null
      }

      const { data, error } = await supabase
        .from('empresa_usuarios')
        .select('empresas(id, nome, endereco, telefone, logotipo, hora_abertura, hora_fechamento, tempo_estimado, aberto)')
        .eq('usuario_id', user.id)
        .single()

      if (error) {
        console.error('Erro ao buscar configurações:', error)
        return null
      }

      const empresaData = data?.empresas as any
      return empresaData as EmpresaConfig
      
    } catch (err) {
      console.error('Erro ao buscar configurações:', err)
      return null
    }
  }

  // Salvar configurações da empresa
  async function salvarConfiguracoes(config: Partial<EmpresaConfig>): Promise<boolean> {
    if (!process.client) return false

    try {
      const supabase = useSupabaseClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.id) {
        console.log('Usuário não está logado')
        return false
      }

      // Buscar empresa_id do usuário
      const empresaId = await getEmpresaId()
      if (!empresaId) {
        console.error('Empresa não encontrada para o usuário')
        return false
      }

      const { error } = await supabase
        .from('empresas')
        .update(config)
        .eq('id', empresaId)

      if (error) {
        console.error('Erro ao salvar configurações:', error)
        return false
      }

      // Atualiza o nome da empresa no estado global se foi modificado
      if (config.nome) {
        nomeEmpresa.value = config.nome
      }

      return true
      
    } catch (err) {
      console.error('Erro ao salvar configurações:', err)
      return false
    }
  }

  return {
    nomeEmpresa: readonly(nomeEmpresa),
    isLoadingEmpresa: readonly(isLoadingEmpresa),
    buscarNomeEmpresa,
    getEmpresaId,
    buscarConfiguracoes,
    salvarConfiguracoes
  }
}
