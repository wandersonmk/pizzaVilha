/**
 * Normaliza formas de pagamento para o formato aceito pelo banco
 * Remove acentos, converte para minúsculas e padroniza variações
 */
export function normalizarFormaPagamento(formaPagamento: string): string {
  if (!formaPagamento) return 'dinheiro' // default

  // Converter para minúsculas e remover espaços extras
  let normalized = formaPagamento.toLowerCase().trim()

  // Remover acentos
  normalized = normalized
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  // Mapear variações para valores padronizados
  const mapeamento: Record<string, string> = {
    // PIX
    'pix': 'pix',
    
    // Dinheiro
    'dinheiro': 'dinheiro',
    'especie': 'dinheiro',
    'cash': 'dinheiro',
    
    // Cartão (genérico)
    'cartao': 'cartao',
    'card': 'cartao',
    
    // Crédito
    'credito': 'credito',
    'credit': 'credito',
    'cartao de credito': 'credito',
    
    // Débito
    'debito': 'debito',
    'debit': 'debito',
    'cartao de debito': 'debito'
  }

  return mapeamento[normalized] || 'dinheiro' // default para dinheiro se não reconhecer
}

/**
 * Valida se a forma de pagamento é aceita pelo banco
 */
export function isFormaPagamentoValida(formaPagamento: string): boolean {
  const formasAceitas = ['dinheiro', 'cartao', 'pix', 'credito', 'debito']
  return formasAceitas.includes(formaPagamento.toLowerCase())
}

/**
 * Retorna o label formatado para exibição
 */
export function getFormaPagamentoLabel(formaPagamento: string): string {
  const labels: Record<string, string> = {
    'pix': 'PIX',
    'dinheiro': 'Dinheiro',
    'cartao': 'Cartão',
    'credito': 'Crédito',
    'debito': 'Débito'
  }

  return labels[formaPagamento.toLowerCase()] || formaPagamento
}
