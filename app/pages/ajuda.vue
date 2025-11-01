<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-6xl mx-auto p-6 space-y-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-4">
          <div class="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
            <Icon name="ph:question" class="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 class="text-4xl font-bold text-foreground mb-3">Central de Ajuda</h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Aprenda a usar todas as funcionalidades do sistema de forma rápida e eficiente
        </p>
      </div>

      <!-- Seções de Ajuda -->
      <div class="space-y-6">
        <!-- Como criar pedidos -->
        <HelpSection
          icon="ph:shopping-cart"
          icon-bg-class="bg-green-100 dark:bg-green-900"
          icon-color-class="text-green-600 dark:text-white"
          title="Como Criar Pedidos"
          description="Siga estes passos para registrar novos pedidos no sistema"
          :steps="[
            'Acesse a página de Pedidos através do menu lateral',
            'Clique no botão Novo Pedido no canto superior direito',
            'Preencha os dados do cliente: nome, telefone e endereço',
            'Selecione os produtos desejados e suas quantidades',
            'Escolha o tipo de entrega (Retirada ou Entrega)',
            'Selecione a forma de pagamento (Dinheiro, Cartão ou PIX)',
            'Confira o valor total e clique em Criar Pedido'
          ]"
          tip="O sistema calcula automaticamente o valor da entrega quando você seleciona Entrega como tipo de retirada."
        />

        <!-- Gerenciar pedidos -->
        <HelpSection
          icon="ph:list-checks"
          icon-bg-class="bg-orange-100 dark:bg-orange-900"
          icon-color-class="text-orange-600 dark:text-white"
          title="Gerenciar Status dos Pedidos"
          description="Controle o fluxo dos pedidos através dos diferentes status"
          :steps="[
            'Na página de Pedidos, visualize todos os pedidos organizados por status',
            'Novo: pedidos que acabaram de chegar',
            'Cozinha: pedidos em preparo',
            'Entrega: pedidos prontos para entregar',
            'Concluído: pedidos finalizados',
            'Clique em um pedido para ver detalhes completos',
            'Use os botões de ação para mudar o status rapidamente'
          ]"
          tip="Você pode filtrar pedidos por status, data e cliente usando a barra de filtros no topo da página."
        />

        <!-- Imprimir pedidos -->
        <HelpSection
          icon="ph:printer"
          icon-bg-class="bg-purple-100 dark:bg-purple-900"
          icon-color-class="text-purple-600 dark:text-white"
          title="Imprimir Pedidos"
          description="Gere comprovantes impressos dos pedidos"
          :steps="[
            'Abra o pedido que deseja imprimir clicando sobre ele',
            'Na modal de detalhes, clique no botão Imprimir no canto superior',
            'Uma prévia da impressão será aberta em nova janela',
            'Confira os dados e clique em Imprimir na janela do navegador',
            'Configure sua impressora (tamanho do papel, margens, etc.)',
            'Finalize a impressão'
          ]"
          tip="O formato de impressão é otimizado para papel térmico de 80mm, ideal para impressoras de cupom."
        />

        <!-- Gerenciar cardápio -->
        <HelpSection
          icon="ph:fork-knife"
          icon-bg-class="bg-red-100 dark:bg-red-900"
          icon-color-class="text-red-600 dark:text-white"
          title="Gerenciar Cardápio"
          description="Organize categorias e produtos do seu cardápio"
          :steps="[
            'Acesse a página de Cardápio no menu lateral',
            'Clique em Nova Categoria para criar categorias de produtos',
            'Dentro de cada categoria, adicione produtos clicando em Novo Produto',
            'Preencha: nome, descrição, preço e foto (opcional)',
            'Para pizzas, defina tamanhos e sabores disponíveis',
            'Use o toggle Ativo/Inativo para controlar disponibilidade',
            'Arraste categorias para reorganizar a ordem de exibição'
          ]"
          tip="Mantenha fotos dos produtos atualizadas. Imagens atraentes aumentam as vendas!"
        />

        <!-- Visualizar relatórios -->
        <HelpSection
          icon="ph:chart-line"
          icon-bg-class="bg-blue-100 dark:bg-blue-900"
          icon-color-class="text-blue-600 dark:text-white"
          title="Visualizar Relatórios"
          description="Acompanhe o desempenho do seu negócio"
          :steps="[
            'Na página Dashboard, visualize as estatísticas principais',
            'Pedidos Totais: quantidade de pedidos no período',
            'Faturamento: valor total em vendas',
            'Ticket Médio: valor médio por pedido',
            'Gráficos mostram tendências ao longo do tempo',
            'Use os filtros de data para análises personalizadas'
          ]"
          tip="Monitore o Dashboard diariamente para identificar padrões e oportunidades de melhoria."
        />

        <!-- Gerenciar clientes -->
        <HelpSection
          icon="ph:users"
          icon-bg-class="bg-teal-100 dark:bg-teal-900"
          icon-color-class="text-teal-600 dark:text-white"
          title="Gerenciar Clientes"
          description="Mantenha o cadastro de seus clientes organizado"
          :steps="[
            'Acesse a página de Clientes no menu lateral',
            'Visualize a lista completa de clientes cadastrados',
            'Use a busca para encontrar clientes rapidamente',
            'Clique em um cliente para ver histórico de pedidos',
            'Edite informações de contato quando necessário',
            'Exporte a lista de clientes para Excel quando precisar'
          ]"
          tip="Clientes frequentes aparecem com destaque. Use essas informações para criar promoções personalizadas."
        />

        <!-- Configurações -->
        <HelpSection
          icon="ph:gear"
          icon-bg-class="bg-gray-100 dark:bg-gray-800"
          icon-color-class="text-gray-600 dark:text-white"
          title="Configurar o Sistema"
          description="Personalize o sistema de acordo com seu negócio"
          :steps="[
            'Acesse Configurações no menu lateral',
            'Configure dados da empresa: nome, telefone, endereço',
            'Adicione o logotipo da sua empresa (URL da imagem)',
            'Defina os horários de funcionamento',
            'Salve as alterações clicando em Salvar Configurações',
            'As informações aparecerão nos pedidos e relatórios'
          ]"
          tip="Mantenha os dados da empresa sempre atualizados para uma comunicação profissional com seus clientes."
        />
      </div>

      <!-- Seção de contato/suporte -->
      <div class="mt-12 p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
        <div class="text-center">
          <Icon name="ph:headset" class="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h3 class="text-2xl font-bold text-foreground mb-3">Precisa de Mais Ajuda?</h3>
          <p class="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você a aproveitar ao máximo o sistema
          </p>
          <a 
            href="https://wa.me/5511914600243?text=Estou%20usando%20a%20ferramenta%20de%20delivery%20da%20Pizza%20Vilha%20e%20tenho%20uma%20dúvida%2C%20pode%20me%20ajudar%3F" 
            target="_blank"
            class="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Icon name="ph:whatsapp-logo" class="w-5 h-5" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

useHead({
  title: 'Ajuda - Sistema de Gestão'
})
</script>
