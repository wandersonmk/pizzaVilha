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

  const exportarRelatoriosExcel = async (pedidos: any[], estatisticas: any) => {
    // Verificar se está no cliente
    if (typeof window === 'undefined') {
      throw new Error('Excel export only available on client side')
    }

    try {
      // Importação dinâmica para evitar problemas SSR
      const XLSX = await import('xlsx')
      
      // Preparar dados dos pedidos para o Excel
      const dadosExcel = pedidos.map((pedido, index) => {
        const valorTotal = parseFloat(pedido.valor_total || 0) + parseFloat(pedido.valor_entrega || 0)
        
        return {
          '#': pedido.numero_pedido || index + 1,
          'Cliente': pedido.nome_cliente || '-',
          'Telefone': pedido.telefone_cliente || '-',
          'Endereço': pedido.endereco_entrega || '-',
          'Pedido': pedido.pedido || '-',
          'Forma de Pagamento': pedido.forma_pagamento === 'dinheiro' ? 'Dinheiro' : pedido.forma_pagamento === 'cartao' ? 'Cartão' : '-',
          'Tipo': pedido.tipo_retirada === 'entrega' ? 'Entrega' : 'Retirada',
          'Valor Pedido': `R$ ${parseFloat(pedido.valor_total || 0).toFixed(2).replace('.', ',')}`,
          'Valor Entrega': `R$ ${parseFloat(pedido.valor_entrega || 0).toFixed(2).replace('.', ',')}`,
          'Valor Total': `R$ ${valorTotal.toFixed(2).replace('.', ',')}`,
          'Status': pedido.status || '-',
          'Data': pedido.created_at 
            ? new Date(pedido.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : '-',
          'Observação': pedido.observacao || ''
        }
      })
      
      // Adicionar linha de resumo no início
      const resumo = [
        {
          '#': '',
          'Cliente': 'RESUMO DO RELATÓRIO',
          'Telefone': '',
          'Endereço': '',
          'Pedido': '',
          'Forma de Pagamento': '',
          'Tipo': '',
          'Valor Pedido': '',
          'Valor Entrega': '',
          'Valor Total': '',
          'Status': '',
          'Data': new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          'Observação': ''
        },
        {
          '#': '',
          'Cliente': `Total de Pedidos: ${estatisticas?.totalPedidos || 0}`,
          'Telefone': '',
          'Endereço': '',
          'Pedido': '',
          'Forma de Pagamento': '',
          'Tipo': '',
          'Valor Pedido': '',
          'Valor Entrega': '',
          'Valor Total': `R$ ${(estatisticas?.totalValor || 0).toFixed(2).replace('.', ',')}`,
          'Status': '',
          'Data': '',
          'Observação': ''
        },
        {
          '#': '',
          'Cliente': `Ticket Médio: R$ ${(estatisticas?.ticketMedio || 0).toFixed(2).replace('.', ',')}`,
          'Telefone': '',
          'Endereço': '',
          'Pedido': '',
          'Forma de Pagamento': '',
          'Tipo': '',
          'Valor Pedido': '',
          'Valor Entrega': '',
          'Valor Total': '',
          'Status': '',
          'Data': '',
          'Observação': ''
        },
        {
          '#': '',
          'Cliente': '',
          'Telefone': '',
          'Endereço': '',
          'Pedido': '',
          'Forma de Pagamento': '',
          'Tipo': '',
          'Valor Pedido': '',
          'Valor Entrega': '',
          'Valor Total': '',
          'Status': '',
          'Data': '',
          'Observação': ''
        }
      ]
      
      // Combinar resumo + dados
      const dadosCompletos = [...resumo, ...dadosExcel]
      
      // Criar workbook e worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(dadosCompletos)
      
      // Configurar larguras das colunas
      const columnWidths = [
        { wch: 6 },   // #
        { wch: 25 },  // Cliente
        { wch: 18 },  // Telefone
        { wch: 30 },  // Endereço
        { wch: 40 },  // Pedido
        { wch: 18 },  // Forma de Pagamento
        { wch: 10 },  // Tipo
        { wch: 14 },  // Valor Pedido
        { wch: 14 },  // Valor Entrega
        { wch: 14 },  // Valor Total
        { wch: 12 },  // Status
        { wch: 18 },  // Data
        { wch: 30 }   // Observação
      ]
      worksheet['!cols'] = columnWidths
      
      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório de Pedidos')
      
      // Gerar nome do arquivo
      const timestamp = new Date().toISOString().split('T')[0]
      const nomeArquivo = `relatorio-pedidos-${timestamp}.xlsx`
      
      // Salvar o arquivo
      XLSX.writeFile(workbook, nomeArquivo)
      
      return {
        success: true,
        filename: nomeArquivo,
        totalPedidos: pedidos.length
      }
      
    } catch (error) {
      console.error('Erro ao gerar Excel do relatório:', error)
      throw new Error('Falha ao gerar o arquivo Excel do relatório')
    }
  }

  return {
    exportarClientesExcel,
    exportarRelatoriosExcel
  }
}