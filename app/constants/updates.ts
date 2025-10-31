/**
 * Changelog do aplicativo
 * 
 * Para adicionar uma nova atualização:
 * 1. Adicione um novo objeto no início do array
 * 2. Use um ID único
 * 3. Escolha o tipo apropriado: 'feature', 'fix', 'improvement', 'security'
 * 4. Escreva um título curto e descrição clara
 * 5. Use a data atual
 */

export type UpdateType = 'feature' | 'fix' | 'improvement' | 'security'

export interface AppUpdate {
  id: string
  type: UpdateType
  title: string
  description: string
  date: Date
}

export const APP_VERSION = '1.3.0'

export const APP_UPDATES: AppUpdate[] = [
  {
    id: '4',
    type: 'feature',
    title: 'Sistema de notificações de atualizações',
    description: 'Novo painel de notificações que exibe melhorias e correções do aplicativo de forma organizada e intuitiva.',
    date: new Date('2025-10-31T21:00:00')
  },
  {
    id: '3',
    type: 'fix',
    title: 'Correção no filtro de pedidos concluídos',
    description: 'Pedidos concluídos agora desaparecem corretamente após 5 horas da criação, usando o campo created_at ao invés de updated_at.',
    date: new Date('2025-10-31T20:00:00')
  },
  {
    id: '2',
    type: 'feature',
    title: 'Som de notificação na primeira carga',
    description: 'O sistema agora reproduz o som de notificação ao carregar a página se houver pedidos novos aguardando.',
    date: new Date('2025-10-31T19:30:00')
  },
  {
    id: '1',
    type: 'improvement',
    title: 'Otimização do sistema de filtros',
    description: 'Sistema de filtros de pedidos reescrito com filtros client-side para melhor performance e precisão na exibição.',
    date: new Date('2025-10-31T18:00:00')
  }
]

// Guia de tipos:
// - 'feature': Novas funcionalidades adicionadas
// - 'fix': Correções de bugs
// - 'improvement': Melhorias em funcionalidades existentes
// - 'security': Atualizações de segurança
