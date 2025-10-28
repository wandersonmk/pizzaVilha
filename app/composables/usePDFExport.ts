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

  return {
    exportarClientesPDF
  }
}