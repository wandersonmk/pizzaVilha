interface Cliente {
  id: string
  nome: string
  telefone: string
  qtdPedidos: number
  ultimoPedido?: string
}

export const usePDFExport = () => {
  
  const exportarClientesPDF = async (clientes: Cliente[], filtrados: Cliente[] | null = null) => {
    // Verificar se está no cliente
    if (typeof window === 'undefined') {
      throw new Error('PDF export only available on client side')
    }

    try {
      // Importação mais simples
      const jsPDF = (await import('jspdf')).default
      
      // Criar nova instância do jsPDF em orientação horizontal
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })
      
      const dadosParaExportar = filtrados || clientes
      console.log('Exportando clientes:', dadosParaExportar)
      
      // Configurações do documento
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      
      // Header personalizado
      doc.setFillColor(129, 98, 255)
      doc.rect(0, 0, pageWidth, 40, 'F')
      
      // Logo/Título
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('PizzaVilha', margin, 25)
      
      // Subtítulo
      doc.setFontSize(14)
      doc.setFont('helvetica', 'normal')
      doc.text('Gestão de Pedidos', margin, 35)
      
      // Data/hora da exportação
      doc.setFontSize(10)
      const agora = new Date()
      const dataFormatada = agora.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      doc.text(`Exportado em: ${dataFormatada}`, pageWidth - margin - 70, 25)
      
      // Linha decorativa
      doc.setDrawColor(129, 98, 255)
      doc.setLineWidth(2)
      doc.line(margin, 50, pageWidth - margin, 50)
      
      // Título do relatório
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('Relatório de Clientes', margin, 65)
      
      // Informações resumidas
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`Total de clientes: ${dadosParaExportar.length}`, margin, 80)
      
      if (filtrados) {
        doc.text(`(Filtrados de ${clientes.length} clientes)`, margin + 120, 80)
      }
      
      // Estatísticas rápidas
      const totalPedidos = dadosParaExportar.reduce((acc, cliente) => acc + cliente.qtdPedidos, 0)
      const mediaPedidos = totalPedidos / dadosParaExportar.length
      
      doc.text(`Total de pedidos: ${totalPedidos}`, margin, 90)
      doc.text(`Média por cliente: ${mediaPedidos.toFixed(1)} pedidos`, margin, 100)
      
      // TABELA SIMPLES - SEM COMPLEXIDADE
      let yPos = 120
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Lista de Clientes:', margin, yPos)
      
      yPos += 15
      
      // Cabeçalho da tabela
      doc.setFillColor(129, 98, 255)
      doc.rect(margin, yPos, pageWidth - (margin * 2), 12, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('#', margin + 5, yPos + 8)
      doc.text('Nome', margin + 25, yPos + 8)
      doc.text('Telefone', margin + 100, yPos + 8)
      doc.text('Pedidos', margin + 160, yPos + 8)
      doc.text('Último Pedido', margin + 200, yPos + 8)
      
      yPos += 12
      
      // Dados dos clientes - LOOP SIMPLES
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      
      dadosParaExportar.forEach((cliente, index) => {
        console.log(`Adicionando cliente ${index + 1}: ${cliente.nome}`)
        
        // Verificar se precisa de nova página
        if (yPos > pageHeight - 30) {
          doc.addPage()
          yPos = 30
          
          // Repetir cabeçalho
          doc.setFillColor(129, 98, 255)
          doc.rect(margin, yPos, pageWidth - (margin * 2), 12, 'F')
          
          doc.setTextColor(255, 255, 255)
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.text('#', margin + 5, yPos + 8)
          doc.text('Nome', margin + 25, yPos + 8)
          doc.text('Telefone', margin + 100, yPos + 8)
          doc.text('Pedidos', margin + 160, yPos + 8)
          doc.text('Último Pedido', margin + 200, yPos + 8)
          
          yPos += 12
          
          doc.setTextColor(0, 0, 0)
          doc.setFontSize(9)
          doc.setFont('helvetica', 'normal')
        }
        
        // Background alternado
        if (index % 2 === 1) {
          doc.setFillColor(248, 249, 250)
          doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F')
        }
        
        // Dados da linha
        doc.text((index + 1).toString(), margin + 5, yPos + 7)
        doc.text(cliente.nome, margin + 25, yPos + 7)
        doc.text(cliente.telefone, margin + 100, yPos + 7)
        doc.text(cliente.qtdPedidos.toString(), margin + 160, yPos + 7)
        doc.text(
          cliente.ultimoPedido 
            ? new Date(cliente.ultimoPedido).toLocaleDateString('pt-BR')
            : 'Nenhum', 
          margin + 200, 
          yPos + 7
        )
        
        yPos += 10
        
        // Linha horizontal
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.2)
        doc.line(margin, yPos, pageWidth - margin, yPos)
      })
      
      console.log('Todos os clientes foram adicionados ao PDF')
      
      // Footer simples
      const footerY = pageHeight - 20
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text('© 2025 PizzaVilha - Sistema de Gestão de Pedidos', margin, footerY)
      doc.text(`${dadosParaExportar.length} clientes exportados`, pageWidth - margin - 80, footerY)
      
      // Gerar nome do arquivo
      const timestamp = agora.toISOString().split('T')[0]
      const nomeArquivo = filtrados 
        ? `clientes-filtrados-${timestamp}.pdf`
        : `clientes-completo-${timestamp}.pdf`
      
      // Salvar o PDF
      doc.save(nomeArquivo)
      
      return {
        success: true,
        filename: nomeArquivo,
        totalClientes: dadosParaExportar.length
      }
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      throw new Error('Falha ao gerar o PDF')
    }
  }

  const exportarRelatoriosPDF = async (pedidos: any[], estatisticas: any) => {
    // Verificar se está no cliente
    if (typeof window === 'undefined') {
      throw new Error('PDF export only available on client side')
    }

    try {
      const jsPDF = (await import('jspdf')).default
      
      // Criar nova instância do jsPDF em orientação horizontal
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })
      
      console.log('Exportando relatórios:', pedidos.length, 'pedidos')
      
      // Configurações do documento
      const margin = 15
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      
      // Título
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('Relatório de Pedidos', margin, 20)
      
      // Data do relatório
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const dataAtual = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      doc.text(`Gerado em: ${dataAtual}`, margin, 30)
      
      // Linha separadora
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, 35, pageWidth - margin, 35)
      
      // Estatísticas resumidas
      let yPosition = 45
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Resumo Geral', margin, yPosition)
      
      yPosition += 10
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Total de Pedidos: ${estatisticas?.totalPedidos || 0}`, margin, yPosition)
      doc.text(`Valor Total: R$ ${(estatisticas?.totalValor || 0).toFixed(2).replace('.', ',')}`, margin + 70, yPosition)
      doc.text(`Ticket Médio: R$ ${(estatisticas?.ticketMedio || 0).toFixed(2).replace('.', ',')}`, margin + 140, yPosition)
      
      // Linha separadora
      yPosition += 7
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      
      // Tabela de pedidos
      yPosition += 10
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Lista de Pedidos', margin, yPosition)
      
      yPosition += 8
      
      // Cabeçalho da tabela
      doc.setFillColor(230, 230, 230)
      doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 7, 'F')
      
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('#', margin + 2, yPosition)
      doc.text('Cliente', margin + 12, yPosition)
      doc.text('Telefone', margin + 60, yPosition)
      doc.text('Pedido', margin + 95, yPosition)
      doc.text('Pagamento', margin + 165, yPosition)
      doc.text('Tipo', margin + 205, yPosition)
      doc.text('Valor', margin + 230, yPosition)
      doc.text('Data', margin + 255, yPosition)
      
      yPosition += 10
      doc.setFont('helvetica', 'normal')
      
      // Dados dos pedidos
      pedidos.forEach((pedido, index) => {
        // Verificar se precisa de nova página
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = 20
          
          // Repetir cabeçalho
          doc.setFillColor(230, 230, 230)
          doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 7, 'F')
          doc.setFont('helvetica', 'bold')
          doc.text('#', margin + 2, yPosition)
          doc.text('Cliente', margin + 12, yPosition)
          doc.text('Telefone', margin + 60, yPosition)
          doc.text('Pedido', margin + 95, yPosition)
          doc.text('Pagamento', margin + 165, yPosition)
          doc.text('Tipo', margin + 205, yPosition)
          doc.text('Valor', margin + 230, yPosition)
          doc.text('Data', margin + 255, yPosition)
          yPosition += 10
          doc.setFont('helvetica', 'normal')
        }
        
        // Zebrar linhas
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250)
          doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 7, 'F')
        }
        
        // Dados
        const numeroPedido = pedido.numero_pedido || '-'
        const nomeCliente = pedido.nome_cliente || '-'
        const telefone = pedido.telefone_cliente || '-'
        const pedidoTexto = (pedido.pedido || '').substring(0, 30) + '...'
        const pagamento = pedido.forma_pagamento === 'dinheiro' ? 'Dinheiro' : pedido.forma_pagamento === 'cartao' ? 'Cartão' : '-'
        const tipo = pedido.tipo_retirada === 'entrega' ? 'Entrega' : 'Retirada'
        const valorTotal = parseFloat(pedido.valor_total || 0) + parseFloat(pedido.valor_entrega || 0)
        const dataPedido = pedido.created_at 
          ? new Date(pedido.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
          : '-'
        
        doc.setFontSize(8)
        doc.text(`${numeroPedido}`, margin + 2, yPosition)
        doc.text(nomeCliente.substring(0, 20), margin + 12, yPosition)
        doc.text(telefone, margin + 60, yPosition)
        doc.text(pedidoTexto, margin + 95, yPosition)
        doc.text(pagamento, margin + 165, yPosition)
        doc.text(tipo, margin + 205, yPosition)
        doc.text(`R$ ${valorTotal.toFixed(2).replace('.', ',')}`, margin + 230, yPosition)
        doc.text(dataPedido, margin + 255, yPosition)
        
        yPosition += 7
      })
      
      // Rodapé em todas as páginas
      const totalPages = doc.internal.pages.length - 1
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        const footerY = pageHeight - 10
        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text(`Página ${i} de ${totalPages}`, margin, footerY)
        doc.text(`${pedidos.length} pedidos exportados`, pageWidth - margin - 60, footerY)
      }
      
      // Nome do arquivo
      const timestamp = new Date().toISOString().split('T')[0]
      const nomeArquivo = `relatorio-pedidos-${timestamp}.pdf`
      
      // Salvar o PDF
      doc.save(nomeArquivo)
      
      return {
        success: true,
        filename: nomeArquivo,
        totalPedidos: pedidos.length
      }
      
    } catch (error) {
      console.error('Erro ao gerar PDF de relatório:', error)
      throw new Error('Falha ao gerar o PDF do relatório')
    }
  }

  return {
    exportarClientesPDF,
    exportarRelatoriosPDF
  }
}