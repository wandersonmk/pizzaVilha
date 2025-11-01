// Tipos para o sistema de cupons de desconto

export type TipoDesconto = 'percentual' | 'valor_fixo'
export type StatusCupom = 'ativo' | 'inativo' | 'expirado'

export interface Cupom {
  id: string
  codigo: string
  descricao: string
  tipoDesconto: TipoDesconto
  valorDesconto: number // percentual (0-100) ou valor fixo em R$
  valorMinimoPedido?: number // valor mínimo do pedido para usar o cupom
  dataInicio: string // ISO date
  dataExpiracao: string // ISO date
  quantidadeMaximaUsos?: number // limite de usos totais
  quantidadeUsada: number
  usoPorCliente?: number // limite de usos por cliente
  status: StatusCupom
  ativo: boolean
  criadoEm: string
  atualizadoEm: string
}

export interface CupomFormData {
  codigo: string
  descricao: string
  tipoDesconto: TipoDesconto
  valorDesconto: number
  valorMinimoPedido?: number
  dataInicio: string
  dataExpiracao: string
  quantidadeMaximaUsos?: number
  usoPorCliente?: number
  ativo: boolean
}

export interface CupomFilter {
  status?: StatusCupom
  ativo?: boolean
  busca?: string
}
