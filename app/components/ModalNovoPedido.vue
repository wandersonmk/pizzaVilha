<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="$emit('close')"
      >
        <div class="bg-card border border-border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
            <h2 class="text-xl font-bold text-foreground">Novo Pedido Manual</h2>
            <button
              @click="$emit('close')"
              class="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="criarPedido" class="p-6 space-y-6">
            <!-- Informações do Cliente -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-foreground">Informações do Cliente</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">
                    Nome do Cliente *
                  </label>
                  <input
                    v-model="form.nome_cliente"
                    type="text"
                    required
                    placeholder="Ex: João Silva"
                    class="w-full px-3 py-2 bg-secondary border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">
                    Telefone *
                  </label>
                  <input
                    v-model="form.telefone_cliente"
                    type="tel"
                    required
                    placeholder="(00) 00000-0000"
                    @input="formatarTelefone"
                    maxlength="15"
                    class="w-full px-3 py-2 bg-secondary border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <!-- Endereço com Autocomplete -->
            <EnderecoAutocomplete 
              @update:endereco="form.endereco_entrega = $event"
              @update:tipo-entrega="form.tipo_retirada = $event"
            />

            <!-- Pedido -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-foreground">Itens do Pedido</h3>
                <span class="text-sm text-muted-foreground">{{ itensPedido.length }} item(ns)</span>
              </div>
              
              <!-- Botão Pizza ou Outros Produtos -->
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="iniciarPedidoPizza"
                  :class="[
                    'px-4 py-3 border-2 rounded-lg transition-all font-medium flex items-center justify-center gap-2',
                    etapaPizza > 0 ? 'border-orange-500 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'border-border hover:border-orange-300 text-foreground'
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                  </svg>
                  🍕 Adicionar Pizza
                </button>
                
                <button
                  type="button"
                  @click="mostrarOutrosProdutos = true; etapaPizza = 0"
                  :class="[
                    'px-4 py-3 border-2 rounded-lg transition-all font-medium flex items-center justify-center gap-2',
                    mostrarOutrosProdutos && etapaPizza === 0 ? 'border-primary bg-blue-100 dark:bg-blue-900/30 text-primary' : 'border-border hover:border-primary text-foreground'
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                  Outros Produtos
                </button>
              </div>

              <!-- FLUXO DE PIZZA -->
              <div v-if="etapaPizza > 0" class="space-y-4 border border-orange-300 dark:border-orange-700 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/10">
                
                <!-- Etapa 1: Tipo da Pizza -->
                <div v-if="etapaPizza === 1">
                  <h4 class="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span class="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs">1</span>
                    Escolha o tipo da pizza
                  </h4>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      @click="selecionarTipoPizza('salgada')"
                      class="px-6 py-4 border-2 border-border hover:border-orange-500 rounded-lg transition-all text-center"
                    >
                      <div class="text-3xl mb-1">🍕</div>
                      <div class="font-bold text-foreground">Pizza Salgada</div>
                    </button>
                    <button
                      type="button"
                      @click="selecionarTipoPizza('doce')"
                      class="px-6 py-4 border-2 border-border hover:border-orange-500 rounded-lg transition-all text-center"
                    >
                      <div class="text-3xl mb-1">🍫</div>
                      <div class="font-bold text-foreground">Pizza Doce</div>
                    </button>
                  </div>
                </div>

                <!-- Etapa 2: Tamanho da Pizza -->
                <div v-if="etapaPizza === 2">
                  <h4 class="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span class="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs">2</span>
                    Escolha o tamanho
                    <span class="text-sm font-normal text-muted-foreground">({{ pizzaConfig.tipo === 'doce' ? 'Doce' : 'Salgada' }})</span>
                  </h4>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button
                      v-for="tamanho in tamanhosPizza"
                      :key="tamanho.sigla"
                      type="button"
                      @click="selecionarTamanhoPizza(tamanho)"
                      :class="[
                        'px-4 py-3 border-2 rounded-lg transition-all text-center',
                        pizzaConfig.tamanho === tamanho.sigla
                          ? 'border-orange-500 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-bold'
                          : 'border-border hover:border-orange-300 text-foreground'
                      ]"
                    >
                      <div class="text-lg font-bold">{{ tamanho.sigla }}</div>
                      <div class="text-xs">{{ tamanho.nome }}</div>
                      <div class="text-xs text-muted-foreground">{{ tamanho.fatias }} fatias</div>
                      <div class="text-xs text-muted-foreground">até {{ tamanho.maxSabores }} sabor(es)</div>
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="etapaPizza = 1; pizzaConfig.tamanho = ''"
                    class="mt-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    ← Voltar
                  </button>
                </div>

                <!-- Etapa 3: Sabores -->
                <div v-if="etapaPizza === 3" class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h4 class="font-semibold text-foreground flex items-center gap-2">
                      <span class="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs">3</span>
                      Escolha os sabores ({{ pizzaConfig.sabores.length }}/{{ getTamanhoSelecionado()?.maxSabores }})
                    </h4>
                  </div>

                  <!-- Busca de Sabores -->
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                    <input
                      v-model="buscaSabor"
                      type="text"
                      placeholder="Buscar sabor..."
                      class="w-full pl-10 pr-3 py-2 bg-secondary border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <!-- Lista de Sabores -->
                  <div class="space-y-2 max-h-60 overflow-y-auto">
                    <button
                      v-for="sabor in saboresFiltrados"
                      :key="sabor.id"
                      type="button"
                      @click="toggleSaborPizza(sabor)"
                      :disabled="!pizzaConfig.sabores.includes(sabor.id) && pizzaConfig.sabores.length >= getTamanhoSelecionado()?.maxSabores"
                      :class="[
                        'w-full px-4 py-3 border-2 rounded-lg transition-all text-left flex items-center justify-between',
                        pizzaConfig.sabores.includes(sabor.id)
                          ? 'border-orange-500 bg-orange-100 dark:bg-orange-900/30'
                          : 'border-border hover:border-orange-300',
                        !pizzaConfig.sabores.includes(sabor.id) && pizzaConfig.sabores.length >= getTamanhoSelecionado()?.maxSabores
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      ]"
                    >
                      <div class="flex-1">
                        <p class="font-medium text-foreground">{{ sabor.nome }}</p>
                        <p class="text-xs text-muted-foreground">{{ sabor.categoria_nome }}</p>
                      </div>
                      <div v-if="pizzaConfig.sabores.includes(sabor.id)" class="text-orange-600">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                    </button>
                  </div>

                  <!-- Preço da Pizza -->
                  <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-foreground">Valor da Pizza:</span>
                      <span class="text-lg font-bold text-green-700 dark:text-green-400">
                        R$ {{ formatarValorExibicao(calcularValorPizza()) }}
                      </span>
                    </div>
                    <p class="text-xs text-muted-foreground mt-1">
                      {{ getTamanhoSelecionado()?.nome }} ({{ getTamanhoSelecionado()?.fatias }} fatias) - Cobrado pelo maior valor
                    </p>
                  </div>

                  <div class="flex gap-2">
                    <button
                      type="button"
                      @click="etapaPizza = 2; pizzaConfig.sabores = []"
                      class="text-sm text-muted-foreground hover:text-foreground"
                    >
                      ← Voltar
                    </button>
                    <button
                      type="button"
                      @click="etapaPizza = 4"
                      :disabled="pizzaConfig.sabores.length === 0"
                      class="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continuar →
                    </button>
                  </div>
                </div>

                <!-- Etapa 4: Borda e Quantidade -->
                <div v-if="etapaPizza === 4" class="space-y-3">
                  <h4 class="font-semibold text-foreground flex items-center gap-2">
                    <span class="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-xs">4</span>
                    Borda recheada (opcional)
                  </h4>

                  <div class="space-y-2">
                    <button
                      v-for="borda in bordasDisponiveis"
                      :key="borda.nome"
                      type="button"
                      @click="pizzaConfig.borda = borda.preco > 0 ? borda : null"
                      :class="[
                        'w-full px-4 py-3 border-2 rounded-lg transition-all text-left flex items-center justify-between',
                        (pizzaConfig.borda?.nome === borda.nome || (!pizzaConfig.borda && borda.nome === 'Sem borda'))
                          ? 'border-orange-500 bg-orange-100 dark:bg-orange-900/30'
                          : 'border-border hover:border-orange-300'
                      ]"
                    >
                      <span class="font-medium text-foreground">{{ borda.nome }}</span>
                      <span class="text-sm font-bold text-foreground">
                        {{ borda.preco > 0 ? `+ R$ ${formatarValorExibicao(borda.preco)}` : 'Grátis' }}
                      </span>
                    </button>
                  </div>

                  <!-- Quantidade -->
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1">
                      Quantidade de Pizzas
                    </label>
                    <input
                      v-model.number="quantidadeItem"
                      type="number"
                      min="1"
                      class="w-full px-3 py-2 bg-secondary border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <!-- Valor Total -->
                  <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-foreground">Valor Total:</span>
                      <span class="text-xl font-bold text-green-700 dark:text-green-400">
                        R$ {{ formatarValorExibicao((calcularValorPizza() + (pizzaConfig.borda?.preco || 0)) * quantidadeItem) }}
                      </span>
                    </div>
                    <p class="text-xs text-muted-foreground mt-1">
                      {{ quantidadeItem }}x pizza {{ pizzaConfig.borda ? `com borda de ${pizzaConfig.borda.nome}` : 'sem borda' }}
                    </p>
                  </div>

                  <div class="flex gap-2">
                    <button
                      type="button"
                      @click="etapaPizza = 3; pizzaConfig.borda = null"
                      class="text-sm text-muted-foreground hover:text-foreground"
                    >
                      ← Voltar
                    </button>
                    <button
                      type="button"
                      @click="adicionarPizza"
                      class="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      Adicionar ao Pedido
                    </button>
                  </div>
                </div>
              </div>

              <!-- SELEÇÃO DE OUTROS PRODUTOS -->
              <div v-if="mostrarOutrosProdutos && etapaPizza === 0" class="space-y-3">
                <!-- Categoria -->
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">
                    Categoria
                  </label>
                  <select
                    v-model="categoriaSelecionada"
                    @change="limparSelecaoProduto"
                    class="w-full px-3 py-2 bg-secondary border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Todas as categorias</option>
                    <option v-for="cat in categoriasNaoPizza" :key="cat.id" :value="cat.id">
                      {{ cat.nome }}
                    </option>
                  </select>
                </div>

                <!-- Busca de Produto -->
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">
                    Buscar Produto
                  </label>
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                    <input
                      v-model="buscaProduto"
                      type="text"
                      placeholder="Digite para buscar produto..."
                      @focus="mostrarListaProdutos = true"
                      class="w-full pl-10 pr-3 py-2 bg-secondary border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <!-- Lista de Produtos Filtrados -->
                  <div
                    v-if="mostrarListaProdutos && produtosFiltradosBusca.length > 0"
                    class="mt-2 max-h-60 overflow-y-auto bg-card border border-border rounded-lg shadow-lg"
                  >
                    <button
                      v-for="prod in produtosFiltradosBusca"
                      :key="prod.id"
                      type="button"
                      @click="selecionarProduto(prod)"
                      class="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b border-border last:border-b-0"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex-1">
                          <p class="text-sm font-medium text-foreground">{{ prod.nome }}</p>
                          <p class="text-xs text-muted-foreground">{{ getCategoriaName(prod.categoria_id) }}</p>
                        </div>
                        <span class="text-sm font-bold text-primary ml-3">
                          R$ {{ formatarValorExibicao(prod.preco) }}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Produto Selecionado e Quantidade -->
                <div v-if="produtoSelecionadoObj" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1">
                      Produto Selecionado
                    </label>
                    <div class="px-3 py-2 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-md">
                      <p class="text-sm font-medium text-green-800 dark:text-green-400">
                        {{ produtoSelecionadoObj.nome }}
                      </p>
                      <p class="text-xs text-green-600 dark:text-green-500">
                        R$ {{ formatarValorExibicao(produtoSelecionadoObj.preco) }}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1">
                      Quantidade
                    </label>
                    <input
                      v-model.number="quantidadeItem"
                      type="number"
                      min="1"
                      class="w-full px-3 py-2 bg-secondary border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <!-- Botão Adicionar Produto Normal -->
                <div v-if="produtoSelecionadoObj">
                  <button
                    type="button"
                    @click="adicionarItem"
                    :disabled="quantidadeItem < 1"
                    class="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Adicionar ao Pedido
                  </button>
                </div>
              </div>

              <!-- Lista de Itens Adicionados -->
              <div v-if="itensPedido.length > 0" class="space-y-2">
                <div class="border-t border-border pt-3">
                  <div
                    v-for="(item, index) in itensPedido"
                    :key="index"
                    class="flex items-center justify-between p-3 bg-secondary rounded-lg"
                  >
                    <div class="flex-1">
                      <p class="text-sm font-medium text-foreground">
                        {{ item.quantidade }}x {{ item.nome }}
                      </p>
                      <p class="text-xs text-muted-foreground">
                        R$ {{ formatarValorExibicao(item.preco) }} cada
                      </p>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="text-sm font-bold text-foreground">
                        R$ {{ formatarValorExibicao(item.quantidade * item.preco) }}
                      </span>
                      <button
                        type="button"
                        @click="removerItem(index)"
                        class="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Subtotal e Entrega -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">
                    Valor da Entrega
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <input
                      v-model="valorEntregaExibicao"
                      type="text"
                      placeholder="0,00"
                      @input="formatarValorEntrega"
                      class="w-full pl-10 pr-3 py-2 bg-secondary border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">
                    Valor Total
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <input
                      :value="formatarValorExibicao(valorTotalCalculado)"
                      type="text"
                      disabled
                      class="w-full pl-10 pr-3 py-2 bg-muted border border-input rounded-md text-foreground font-bold cursor-not-allowed"
                    />
                  </div>
                  <p class="text-xs text-muted-foreground mt-1">
                    Subtotal: R$ {{ formatarValorExibicao(subtotalItens) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Forma de Pagamento e Tipo -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-foreground">Pagamento e Entrega</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">
                    Forma de Pagamento *
                  </label>
                  <select
                    v-model="form.forma_pagamento"
                    required
                    class="w-full px-3 py-2 bg-secondary border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Selecione...</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao">Cartão</option>
                    <option value="pix">PIX</option>
                  </select>
                </div>

                <!-- Tipo de Entrega (automático - apenas visualização) -->
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">
                    Tipo de Entrega *
                  </label>
                  <div class="w-full px-3 py-2 bg-muted border border-input rounded-md text-foreground flex items-center gap-2">
                    <span v-if="form.tipo_retirada === 'retirada'" class="text-green-600 dark:text-green-400 font-medium">
                      🏪 Retirada no Balcão
                    </span>
                    <span v-else-if="form.tipo_retirada === 'entrega'" class="text-blue-600 dark:text-blue-400 font-medium">
                      🚚 Entrega
                    </span>
                    <span v-else class="text-muted-foreground">
                      (Será definido automaticamente)
                    </span>
                  </div>
                </div>
              </div>

              <!-- Tempo Estimado -->
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">
                  Tempo Estimado (minutos) *
                </label>
                <select
                  v-model="form.tempo_estimado"
                  required
                  class="w-full px-3 py-2 bg-secondary border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecione...</option>
                  <option value="15">15 minutos</option>
                  <option value="20">20 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="40">40 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1 hora e 30 min</option>
                  <option value="120">2 horas</option>
                </select>
              </div>

              <div v-if="form.forma_pagamento === 'dinheiro'">
                <label class="block text-sm font-medium text-foreground mb-1">
                  Troco para
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <input
                    v-model="trocoFormatado"
                    @input="formatarTroco"
                    type="text"
                    placeholder="0,00"
                    class="w-full pl-10 pr-3 py-2 bg-secondary border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <!-- Exibir troco calculado -->
                <div 
                  v-if="trocoCalculado > 0" 
                  class="mt-2 p-2 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-md"
                >
                  <p class="text-sm text-green-700 dark:text-green-400 font-medium">
                    💰 Troco: R$ {{ trocoCalculado.toFixed(2).replace('.', ',') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Observações -->
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">
                Observações
              </label>
              <textarea
                v-model="form.observacao"
                rows="2"
                placeholder="Observações adicionais..."
                class="w-full px-3 py-2 bg-secondary border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            <!-- Botões -->
            <div class="flex gap-3 justify-end pt-4 border-t border-border">
              <button
                type="button"
                @click="$emit('close')"
                class="px-6 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ loading ? 'Criando...' : 'Criar Pedido' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  'pedido-criado': []
}>()

const supabase = useSupabaseClient()
const { getEmpresaId } = useEmpresa()
const toast = await useToastSafe()
const loading = ref(false)

// Categorias e Produtos
const categorias = ref<any[]>([])
const produtos = ref<any[]>([])
const categoriaSelecionada = ref('')
const produtoSelecionado = ref('')
const produtoSelecionadoObj = ref<any>(null)
const quantidadeItem = ref(1)
const buscaProduto = ref('')
const mostrarListaProdutos = ref(false)
const mostrarOutrosProdutos = ref(false)
const buscaSabor = ref('')

// Configuração de Pizza - Novo Fluxo
const pizzaConfig = ref({
  tipo: '', // 'doce' ou 'salgada'
  categoria: '', // 'tradicional', 'especial', 'especial2', 'premium', 'doce'
  tamanho: '', // 'P', 'M', 'G', 'F'
  sabores: [] as string[], // IDs dos sabores
  borda: null as { nome: string, preco: number } | null
})

// Etapas do fluxo de pizza
const etapaPizza = ref(0) // 0=nada, 1=tipo, 2=tamanho, 3=sabores, 4=borda

const tamanhosPizza = [
  { sigla: 'P', nome: 'Pequena', fatias: 4, maxSabores: 2 },
  { sigla: 'M', nome: 'Média', fatias: 6, maxSabores: 3 },
  { sigla: 'G', nome: 'Grande', fatias: 8, maxSabores: 3 },
  { sigla: 'F', nome: 'Família', fatias: 8, maxSabores: 4 }
]

const bordasDisponiveis = [
  { nome: 'Sem borda', preco: 0 },
  { nome: 'Mussarela', preco: 10.00 },
  { nome: 'Catupiry', preco: 7.00 },
  { nome: 'Cheddar', preco: 7.00 }
]

// Itens do pedido
interface ItemPedido {
  produto_id: string
  nome: string
  quantidade: number
  preco: number
}

const itensPedido = ref<ItemPedido[]>([])

// Form state
const form = ref({
  nome_cliente: '',
  telefone_cliente: '',
  endereco_entrega: '',
  forma_pagamento: '',
  tipo_retirada: '',
  tempo_estimado: '30', // Valor padrão de 30 minutos
  troco: null as number | null,
  observacao: ''
})

const valorEntregaExibicao = ref('0,00')
const valorEntregaNumero = ref(0)
const trocoFormatado = ref('')

// Computed
const produtosFiltrados = computed(() => {
  if (!categoriaSelecionada.value) return []
  return produtos.value.filter(p => p.categoria_id === categoriaSelecionada.value)
})

const produtosFiltradosBusca = computed(() => {
  let produtosFiltrados = produtos.value

  // Filtrar por categoria se selecionada
  if (categoriaSelecionada.value) {
    produtosFiltrados = produtosFiltrados.filter(p => p.categoria_id === categoriaSelecionada.value)
  }

  // Filtrar por texto de busca
  if (buscaProduto.value.trim()) {
    const busca = buscaProduto.value.toLowerCase().trim()
    produtosFiltrados = produtosFiltrados.filter(p => 
      p.nome.toLowerCase().includes(busca)
    )
  }

  return produtosFiltrados
})

const subtotalItens = computed(() => {
  return itensPedido.value.reduce((sum, item) => sum + (item.quantidade * item.preco), 0)
})

const valorTotalCalculado = computed(() => {
  return subtotalItens.value + valorEntregaNumero.value
})

// Computed para calcular o valor do troco
const trocoCalculado = computed(() => {
  if (!form.value.troco || form.value.troco <= 0) return 0
  const troco = form.value.troco - valorTotalCalculado.value
  return troco > 0 ? troco : 0
})

// Categorias que não são pizza
const categoriasNaoPizza = computed(() => {
  return categorias.value.filter(c => 
    !c.nome.toLowerCase().includes('pizza') && 
    !c.nome.toLowerCase().includes('borda')
  )
})

// Sabores filtrados por busca e tipo de pizza
const saboresFiltrados = computed(() => {
  if (!pizzaConfig.value.tipo) return []
  
  // Filtrar pizzas por tipo (doce ou salgada)
  let sabores = produtos.value.filter(p => {
    if (p.tipo !== 'pizza') return false
    
    // Pegar nome da categoria
    const categoria = categorias.value.find(c => c.id === p.categoria_id)
    if (!categoria) return false
    
    const nomeCategoria = categoria.nome.toLowerCase()
    
    // Filtrar por tipo
    if (pizzaConfig.value.tipo === 'doce') {
      return nomeCategoria.includes('doce')
    } else {
      return nomeCategoria.includes('pizza') && !nomeCategoria.includes('doce')
    }
  })
  
  // Adicionar nome da categoria a cada sabor
  sabores = sabores.map(s => {
    const cat = categorias.value.find(c => c.id === s.categoria_id)
    return {
      ...s,
      categoria_nome: cat?.nome || ''
    }
  })
  
  // Filtrar por busca
  if (buscaSabor.value.trim()) {
    const busca = buscaSabor.value.toLowerCase().trim()
    sabores = sabores.filter(s => 
      s.nome.toLowerCase().includes(busca)
    )
  }
  
  return sabores
})

const pizzasDisponiveis = computed(() => {
  const todasPizzas = produtos.value.filter(p => p.tipo === 'pizza' && p.ativo)
  
  // Se não tiver sabores selecionados, mostrar todas
  if (pizzaConfig.value.sabores.length === 0) {
    return todasPizzas
  }
  
  // Verificar se o primeiro sabor selecionado é doce ou salgado
  const primeiroSabor = produtos.value.find(p => p.id === pizzaConfig.value.sabores[0])
  if (!primeiroSabor) return todasPizzas
  
  const isDoce = primeiroSabor.nome.toLowerCase().includes('doce')
  
  // Filtrar apenas pizzas da mesma categoria (doce ou salgada)
  return todasPizzas.filter(p => {
    const pizzaIsDoce = p.nome.toLowerCase().includes('doce')
    return pizzaIsDoce === isDoce
  })
})

const podAdicionarItem = computed(() => {
  if (!produtoSelecionadoObj.value) return false
  
  // Se for pizza, precisa ter tamanho e pelo menos 1 sabor
  if (produtoSelecionadoObj.value.tipo === 'pizza') {
    return pizzaConfig.value.tamanho && pizzaConfig.value.sabores.length > 0
  }
  
  // Se não for pizza, pode adicionar
  return true
})

// Carregar categorias e produtos
const carregarDados = async () => {
  try {
    const empresaId = await getEmpresaId()
    if (!empresaId) return

    // Carregar categorias ativas
    const { data: cats } = await supabase
      .from('categorias')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('ativa', true)
      .order('ordem')

    categorias.value = cats || []

    // Carregar produtos ativos
    const { data: prods } = await supabase
      .from('produtos')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('ativo', true)
      .order('nome')

    produtos.value = prods || []
    
    console.log('[ModalNovoPedido] Categorias carregadas:', categorias.value.length)
    console.log('[ModalNovoPedido] Produtos carregados:', produtos.value.length)
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    toast.error('Erro ao carregar categorias e produtos')
  }
}

// Funções do novo fluxo de pizza
const iniciarPedidoPizza = () => {
  etapaPizza.value = 1
  mostrarOutrosProdutos.value = false
  limparConfigPizza()
}

const selecionarTipoPizza = (tipo: 'doce' | 'salgada') => {
  pizzaConfig.value.tipo = tipo
  etapaPizza.value = 2
}

const selecionarTamanhoPizza = (tamanho: any) => {
  pizzaConfig.value.tamanho = tamanho.sigla
  // Limpar sabores se exceder o máximo permitido
  if (pizzaConfig.value.sabores.length > tamanho.maxSabores) {
    pizzaConfig.value.sabores = pizzaConfig.value.sabores.slice(0, tamanho.maxSabores)
  }
  etapaPizza.value = 3
}

const toggleSaborPizza = (sabor: any) => {
  const index = pizzaConfig.value.sabores.indexOf(sabor.id)
  if (index > -1) {
    // Remove sabor
    pizzaConfig.value.sabores.splice(index, 1)
  } else {
    // Adiciona sabor se não exceder o máximo
    const tamanho = getTamanhoSelecionado()
    if (tamanho && pizzaConfig.value.sabores.length < tamanho.maxSabores) {
      pizzaConfig.value.sabores.push(sabor.id)
    }
  }
}

const adicionarPizza = () => {
  if (!pizzaConfig.value.tamanho || pizzaConfig.value.sabores.length === 0) {
    toast.error('Selecione o tamanho e pelo menos um sabor')
    return
  }

  const tamanho = getTamanhoSelecionado()
  const valorPizza = calcularValorPizza()
  const valorBorda = pizzaConfig.value.borda?.preco || 0
  const valorTotal = valorPizza + valorBorda

  // Buscar sabores selecionados com suas categorias
  const saboresSelecionados = pizzaConfig.value.sabores.map(id => {
    const sabor = produtos.value.find(p => p.id === id)
    if (!sabor) return null
    const categoria = categorias.value.find(c => c.id === sabor.categoria_id)
    return {
      nome: sabor.nome,
      categoria: categoria?.nome || ''
    }
  }).filter(Boolean)

  // Identificar a categoria (usar a do sabor mais caro)
  const categoriaPizza = saboresSelecionados[0]?.categoria || 'Pizza'
  
  // Montar lista de sabores
  const saboresNomes = saboresSelecionados.map(s => s.nome).join(' + ')
  
  let nome = `${categoriaPizza} ${tamanho?.nome} (${tamanho?.fatias} fatias) - ${saboresNomes}`
  
  if (pizzaConfig.value.borda && pizzaConfig.value.borda.preco > 0) {
    nome += ` + Borda ${pizzaConfig.value.borda.nome}`
  }

  itensPedido.value.push({
    produto_id: 'pizza_' + Date.now(), // ID temporário
    nome: nome,
    quantidade: quantidadeItem.value,
    preco: valorTotal
  })

  // Resetar
  limparConfigPizza()
  etapaPizza.value = 0
  quantidadeItem.value = 1
  toast.success('Pizza adicionada ao pedido!')
}

const limparConfigPizza = () => {
  pizzaConfig.value = {
    tipo: '',
    categoria: '',
    tamanho: '',
    sabores: [],
    borda: null
  }
  buscaSabor.value = ''
}

// Função para formatar o campo troco com máscara de real brasileiro
const formatarTroco = (event: Event) => {
  const input = event.target as HTMLInputElement
  let valor = input.value.replace(/\D/g, '')
  
  if (valor === '') {
    trocoFormatado.value = ''
    form.value.troco = null
    return
  }
  
  const numeroValor = parseInt(valor) / 100
  form.value.troco = numeroValor
  trocoFormatado.value = numeroValor.toFixed(2).replace('.', ',')
}

// Funções auxiliares de pizza
const getTamanhoSelecionado = () => {
  return tamanhosPizza.find(t => t.sigla === pizzaConfig.value.tamanho)
}

const getPrimeiroSaborSelecionado = () => {
  if (pizzaConfig.value.sabores.length === 0) return null
  return produtos.value.find(p => p.id === pizzaConfig.value.sabores[0])
}

const calcularValorPizza = () => {
  if (!pizzaConfig.value.tamanho || pizzaConfig.value.sabores.length === 0) {
    return 0
  }

  // NOVA LÓGICA: O preço vem do sabor mais caro baseado no tamanho selecionado
  const tamanhoSelecionado = pizzaConfig.value.tamanho
  
  // Buscar todos os sabores selecionados
  const saboresSelecionados = pizzaConfig.value.sabores.map(id => {
    return produtos.value.find(p => p.id === id)
  }).filter(Boolean)

  if (saboresSelecionados.length === 0) return 0

  // Pegar o maior preço entre os sabores para o tamanho selecionado
  const precosDoTamanho = saboresSelecionados.map(sabor => {
    // Buscar o preço no array de tamanhos (JSONB)
    if (sabor.tamanhos && Array.isArray(sabor.tamanhos)) {
      const tamanhoInfo = sabor.tamanhos.find((t: any) => t.tamanho === tamanhoSelecionado)
      return tamanhoInfo ? Number(tamanhoInfo.preco) : 0
    }
    return 0
  })

  // Retornar o MAIOR preço (não soma!)
  const maiorPreco = Math.max(...precosDoTamanho)
  
  return maiorPreco
}

// Adicionar item ao pedido
const adicionarItem = () => {
  if (!produtoSelecionadoObj.value || quantidadeItem.value < 1) return

  let nome = produtoSelecionadoObj.value.nome
  let preco = produtoSelecionadoObj.value.preco

  // Se for pizza, calcular o nome e preço correto
  if (produtoSelecionadoObj.value.tipo === 'pizza') {
    const tamanho = getTamanhoSelecionado()
    const saboresNomes = pizzaConfig.value.sabores
      .map(id => produtos.value.find(p => p.id === id)?.nome)
      .filter(Boolean)
      .join(' + ')
    
    nome = `Pizza ${tamanho?.nome} (${tamanho?.fatias} fatias) - ${saboresNomes}`
    preco = calcularValorPizza()
  }

  itensPedido.value.push({
    produto_id: produtoSelecionadoObj.value.id,
    nome: nome,
    quantidade: quantidadeItem.value,
    preco: preco
  })

  // Resetar seleção
  limparSelecaoProduto()
}

// Selecionar produto da lista
const selecionarProduto = (produto: any) => {
  produtoSelecionadoObj.value = produto
  buscaProduto.value = ''
  mostrarListaProdutos.value = false
  quantidadeItem.value = 1
}

// Limpar seleção de produto
const limparSelecaoProduto = () => {
  produtoSelecionado.value = ''
  produtoSelecionadoObj.value = null
  buscaProduto.value = ''
  mostrarListaProdutos.value = false
  quantidadeItem.value = 1
}

// Obter nome da categoria
const getCategoriaName = (categoriaId: string) => {
  const categoria = categorias.value.find(c => c.id === categoriaId)
  return categoria?.nome || ''
}

// Remover item do pedido
const removerItem = (index: number) => {
  itensPedido.value.splice(index, 1)
}

// Formatar valor para exibição (0.00 -> 0,00)
const formatarValorExibicao = (valor: number) => {
  return valor.toFixed(2).replace('.', ',')
}

// Formatar valor da entrega
const formatarValorEntrega = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '') // Remove tudo que não é número
  
  if (value === '') {
    valorEntregaExibicao.value = '0,00'
    valorEntregaNumero.value = 0
    return
  }
  
  // Converte para número (centavos)
  const numero = parseInt(value) / 100
  valorEntregaNumero.value = numero
  
  // Formata para exibição
  valorEntregaExibicao.value = numero.toFixed(2).replace('.', ',')
}

// Resetar form
const resetForm = () => {
  form.value = {
    nome_cliente: '',
    telefone_cliente: '',
    endereco_entrega: '',
    forma_pagamento: '',
    tipo_retirada: '',
    troco: null,
    observacao: ''
  }
  itensPedido.value = []
  valorEntregaExibicao.value = '0,00'
  valorEntregaNumero.value = 0
  limparSelecaoProduto()
  limparConfigPizza()
  etapaPizza.value = 0
  mostrarOutrosProdutos.value = false
}

// Fechar lista ao clicar fora
if (process.client) {
  onMounted(() => {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (!target.closest('.relative')) {
        mostrarListaProdutos.value = false
      }
    })
  })
}

// Formatar telefone com máscara
const formatarTelefone = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '') // Remove tudo que não é número
  
  if (value.length <= 10) {
    // Formato: (00) 0000-0000
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
  } else {
    // Formato: (00) 00000-0000
    value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3')
  }
  
  form.value.telefone_cliente = value
}

// Criar pedido
const criarPedido = async () => {
  if (itensPedido.value.length === 0) {
    toast.error('Adicione pelo menos um item ao pedido')
    return
  }

  loading.value = true
  
  try {
    const empresaId = await getEmpresaId()
    if (!empresaId) {
      toast.error('Erro ao obter empresa')
      return
    }

    // Buscar o último número de pedido para incrementar
    const { data: ultimoPedido } = await supabase
      .from('pedidos')
      .select('numero_pedido')
      .eq('empresa_id', empresaId)
      .order('numero_pedido', { ascending: false })
      .limit(1)
      .single()

    const proximoNumero = ultimoPedido ? ultimoPedido.numero_pedido + 1 : 1

    // Montar descrição do pedido com preços individuais
    const descricaoPedido = itensPedido.value
      .map(item => `${item.quantidade}x ${item.nome} - R$ ${(item.quantidade * item.preco).toFixed(2)}`)
      .join(', ')

    // Inserir novo pedido
    const { error } = await supabase
      .from('pedidos')
      .insert({
        empresa_id: empresaId,
        numero_pedido: proximoNumero,
        nome_cliente: form.value.nome_cliente,
        telefone_cliente: form.value.telefone_cliente,
        endereco_entrega: form.value.endereco_entrega || null,
        pedido: descricaoPedido,
        valor_total: valorTotalCalculado.value,
        valor_entrega: valorEntregaNumero.value || null,
        forma_pagamento: form.value.forma_pagamento,
        tipo_retirada: form.value.tipo_retirada,
        tempo_estimado: parseInt(form.value.tempo_estimado),
        troco: form.value.troco,
        observacao: form.value.observacao || null,
        status: 'novo'
      })

    if (error) {
      console.error('Erro ao criar pedido:', error)
      toast.error('Erro ao criar pedido')
      return
    }

    toast.success(`Pedido #${proximoNumero} criado com sucesso!`)
    resetForm()
    emit('pedido-criado')
    
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    toast.error('Erro ao criar pedido')
  } finally {
    loading.value = false
  }
}

// Carregar dados quando modal abrir
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    carregarDados()
  } else {
    resetForm()
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
