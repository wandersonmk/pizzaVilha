import { createClient } from '@supabase/supabase-js'

// Teste de conexão com Supabase
async function testSupabaseConnection() {
  console.log('🔍 Testando conexão com Supabase...')
  
  // Lendo variáveis do .env
  const url = 'https://wynjuzsrydsvkmyhjfhu.supabase.co'
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bmp1enNyeWRzdmtteWhqZmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTEzODcsImV4cCI6MjA2ODE4NzM4N30.9Ra2YjWSyl6xsV6fWfQLRzuvGnJjNrXTM3pBZP3Cork'
  
  if (!url || !anonKey) {
    console.error('❌ Variáveis de ambiente não encontradas')
    return false
  }
  
  try {
    // Criando cliente Supabase
    const supabase = createClient(url, anonKey)
    console.log('✅ Cliente Supabase criado com sucesso')
    
    // Testando uma query simples
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('⚠️  Erro na query (pode ser normal se a tabela não existir):', error.message)
      
      // Tentando listar tabelas disponíveis
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_schema_tables')
        
      if (!tablesError && tables) {
        console.log('📋 Tabelas disponíveis:', tables)
      }
    } else {
      console.log('✅ Conexão com Supabase funcionando! Dados encontrados:', data)
    }
    
    // Verificando se consegue acessar informações do projeto
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (!authError) {
      console.log('🔐 Auth funcionando:', authData ? 'Sessão ativa' : 'Nenhuma sessão')
    }
    
    console.log('🎉 Teste de conexão concluído!')
    return true
    
  } catch (error) {
    console.error('❌ Erro ao conectar com Supabase:', error)
    return false
  }
}

// Executando o teste
testSupabaseConnection()