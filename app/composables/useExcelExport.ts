interface Cliente {
  id: string
  nome: string
  telefone: string
  qtdPedidos: number
  ultimoPedido?: string
}

export const useExcelExport = () => {
  
  const exportarClientesExcel = async (clientes: Cliente[], filtrados: Cliente[] | null = null) => {
    // Verificar se está no cliente
    if (typeof window === 'undefined') {
      throw new Error('Excel export only available on client side')
    }

    try {
      // Importação dinâmica para evitar problemas SSR
      const XLSX = await import('xlsx')
      
      const dadosParaExportar = filtrados || clientes
      
      // Preparar dados para o Excel
      const dadosExcel = dadosParaExportar.map((cliente, index) => ({
        '#': index + 1,
        'Nome do Cliente': cliente.nome,
        'Telefone': cliente.telefone,
        'Qtd. Pedidos': cliente.qtdPedidos,
        'Último Pedido': cliente.ultimoPedido 
          ? new Date(cliente.ultimoPedido).toLocaleDateString('pt-BR') 
          : 'Nenhum',
        'Observações': `Cliente ativo - ${cliente.qtdPedidos} pedidos realizados`
      }))
      
      // Adicionar linha de resumo no início
      const totalPedidos = dadosParaExportar.reduce((acc, cliente) => acc + cliente.qtdPedidos, 0)
      const mediaPedidos = totalPedidos / dadosParaExportar.length
      
      const resumo = [
        {
          '#': '',
          'Nome do Cliente': 'RESUMO GERAL',
          'Telefone': '',
          'Qtd. Pedidos': '',
          'Último Pedido': '',
          'Observações': ''
        },
        {
          '#': '',
          'Nome do Cliente': `Total de clientes: ${dadosParaExportar.length}`,
          'Telefone': '',
          'Qtd. Pedidos': '',
          'Último Pedido': '',
          'Observações': ''
        },
        {
          '#': '',
          'Nome do Cliente': `Total de pedidos: ${totalPedidos}`,
          'Telefone': '',
          'Qtd. Pedidos': '',
          'Último Pedido': '',
          'Observações': ''
        },
        {
          '#': '',
          'Nome do Cliente': `Média por cliente: ${mediaPedidos.toFixed(1)} pedidos`,
          'Telefone': '',
          'Qtd. Pedidos': '',
          'Último Pedido': '',
          'Observações': ''
        },
        {
          '#': '',
          'Nome do Cliente': '',
          'Telefone': '',
          'Qtd. Pedidos': '',
          'Último Pedido': '',
          'Observações': ''
        }
      ]
      
      // Combinar resumo + dados
      const dadosCompletos = [...resumo, ...dadosExcel]
      
      // Criar workbook e worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(dadosCompletos)
      
      // Configurar larguras das colunas
      const columnWidths = [
        { wch: 5 },   // #
        { wch: 25 },  // Nome do Cliente
        { wch: 18 },  // Telefone
        { wch: 12 },  // Qtd. Pedidos
        { wch: 15 },  // Último Pedido
        { wch: 35 }   // Observações
      ]
      worksheet['!cols'] = columnWidths
      
      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes')
      
      // Gerar nome do arquivo
      const agora = new Date()
      const timestamp = agora.toISOString().split('T')[0]
      const nomeArquivo = filtrados 
        ? `clientes-filtrados-${timestamp}.xlsx`
        : `clientes-completo-${timestamp}.xlsx`
      
      // Salvar o arquivo
      XLSX.writeFile(workbook, nomeArquivo)
      
      return {
        success: true,
        filename: nomeArquivo,
        totalClientes: dadosParaExportar.length
      }
      
    } catch (error) {
      console.error('Erro ao gerar Excel:', error)
      throw new Error('Falha ao gerar o arquivo Excel')
    }
  }

  return {
    exportarClientesExcel
  }
}