<template>
  <div class="space-y-4">
    <div v-if="categorias.length === 0" class="text-center py-8 text-muted-foreground">
      <font-awesome-icon icon="folder-open" class="text-4xl mb-4" />
      <p>Nenhuma categoria cadastrada</p>
    </div>
    
    <div v-else>
      <div 
        v-for="categoria in categorias" 
        :key="categoria.id"
        class="border border-border rounded-lg overflow-hidden bg-card shadow-sm"
      >
        <!-- Header da Categoria -->
        <div 
          class="p-4 bg-muted/30 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
          @click="toggleCategoria(categoria.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <font-awesome-icon 
                :icon="categoriasAbertas.has(categoria.id) ? 'chevron-down' : 'chevron-right'"
                class="transition-transform duration-200 text-muted-foreground"
              />
              <h3 class="font-semibold text-lg text-foreground">{{ categoria.nome }}</h3>
              <span class="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                {{ getProdutosPorCategoria(categoria.id).length }} produtos
              </span>
            </div>
            
            <!-- Ações da Categoria -->
            <div class="flex items-center space-x-2">
              <button
                class="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                title="Editar categoria"
                @click.stop="abrirModalEdicao(categoria)"
              >
                <font-awesome-icon icon="edit" class="w-4 h-4" />
              </button>
              <button
                class="p-2 text-muted-foreground hover:text-destructive hover:bg-destructiveSurface rounded-lg transition-colors"
                title="Excluir categoria"
                @click.stop="abrirModalExclusao(categoria)"
              >
                <font-awesome-icon icon="trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Lista de Produtos (Expandível) -->
        <div 
          v-if="categoriasAbertas.has(categoria.id)"
          class="p-4"
        >
          <!-- Botão Adicionar Produto -->
          <div class="mb-4 pb-4 border-b border-border">
            <button
              @click="abrirModalNovoProduto(categoria)"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg transition-colors"
            >
              <font-awesome-icon icon="plus" class="w-4 h-4" />
              <span class="font-medium">Adicionar Produto em {{ categoria.nome }}</span>
            </button>
          </div>

          <!-- Campo de Busca (só aparece se houver produtos) -->
          <div v-if="getProdutosPorCategoria(categoria.id).length > 0" class="mb-4">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <font-awesome-icon icon="search" class="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                v-model="filtrosProdutos[categoria.id]"
                type="text"
                class="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                :placeholder="`Buscar produtos em ${categoria.nome}...`"
              />
              <div v-if="filtrosProdutos[categoria.id]" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  @click="filtrosProdutos[categoria.id] = ''"
                  class="text-muted-foreground hover:text-foreground"
                >
                  <font-awesome-icon icon="times" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="getProdutosPorCategoria(categoria.id).length === 0" class="text-center py-6 text-muted-foreground">
            <font-awesome-icon icon="box-open" class="text-2xl mb-2" />
            <p class="text-sm">Nenhum produto nesta categoria</p>
            <p class="text-xs mt-1">Clique no botão acima para adicionar o primeiro produto</p>
          </div>

          <!-- Mensagem quando há produtos mas nenhum corresponde ao filtro -->
          <div v-else-if="getProdutosFiltrados(categoria.id).length === 0" class="text-center py-6 text-muted-foreground">
            <font-awesome-icon icon="search" class="text-2xl mb-2" />
            <p class="text-sm">Nenhum produto encontrado</p>
            <p class="text-xs mt-1">Tente buscar com outras palavras-chave</p>
          </div>
          
          <div v-else class="grid gap-3 max-h-[32rem] overflow-y-auto pr-2">
            <div 
              v-for="produto in getProdutosFiltrados(categoria.id)" 
              :key="produto.id"
              class="rounded-lg p-4 border bg-muted/20"
              :class="produto.ativo ? 'border-border' : 'border-amber-500/30'"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h4 class="font-medium text-foreground">{{ produto.nome }}</h4>
                    <!-- Badge de tipo de produto -->
                    <span 
                      v-if="produto.tipo === 'pizza'"
                      class="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-medium"
                    >
                      🍕 Pizza
                    </span>
                    <!-- Badge de status -->
                    <span 
                      class="text-xs px-2 py-0.5 rounded-full font-medium"
                      :class="produto.ativo ? 'bg-green-500/10 text-green-400' : 'bg-destructive/20 text-destructive'"
                    >
                      {{ produto.ativo ? '✓ Disponível' : '⚠️ Indisponível' }}
                    </span>
                  </div>
                  <p v-if="produto.descricao" class="text-sm text-muted-foreground mb-2">{{ produto.descricao }}</p>
                  
                  <!-- Preços: se for pizza mostra todos os tamanhos, se não mostra preço único -->
                  <div class="flex items-center space-x-4">
                    <!-- Produto tipo pizza: mostrar tamanhos -->
                    <div v-if="produto.tipo === 'pizza' && produto.tamanhos && Array.isArray(produto.tamanhos)" class="flex flex-wrap gap-2">
                      <div 
                        v-for="tamanho in produto.tamanhos" 
                        :key="tamanho.tamanho"
                        class="text-sm px-2 py-1 rounded"
                        :class="produto.ativo ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'"
                      >
                        <span class="font-bold">{{ tamanho.tamanho }}:</span> 
                        R$ {{ Number(tamanho.preco).toFixed(2).replace('.', ',') }}
                      </div>
                    </div>
                    
                    <!-- Produto comum: mostrar preço único -->
                    <span v-else class="text-lg font-bold" :class="produto.ativo ? 'text-primary' : 'text-muted-foreground'">
                      R$ {{ Number(produto.preco).toFixed(2).replace('.', ',') }}
                    </span>
                  </div>
                </div>
                
                <!-- Ações do Produto -->
                <div class="flex items-center space-x-1 ml-4">
                  <button
                    class="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Editar produto"
                    @click="editarProduto(produto)"
                  >
                    <font-awesome-icon icon="edit" class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 rounded-lg transition-colors"
                    :class="produto.ativo 
                      ? 'text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10' 
                      : 'text-muted-foreground hover:text-green-500 hover:bg-green-500/10'"
                    :title="produto.ativo ? 'Desativar produto' : 'Ativar produto'"
                    @click="toggleStatusProduto(produto)"
                  >
                    <font-awesome-icon :icon="produto.ativo ? 'eye-slash' : 'eye'" class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 text-muted-foreground hover:text-destructive hover:bg-destructiveSurface rounded-lg transition-colors"
                    title="Excluir produto permanentemente"
                    @click="excluirProduto(produto)"
                  >
                    <font-awesome-icon icon="trash" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edição de Categoria -->
    <div 
      v-if="categoriaEditando"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="fecharModalEdicao"
    >
      <div 
        class="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-foreground mb-4">Editar Categoria</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Nome da Categoria</label>
            <input
              v-model="nomeEdicao"
              type="text"
              class="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Digite o nome da categoria"
            />
          </div>

          <!-- Status da Categoria -->
          <div class="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <div>
              <label class="text-sm font-medium text-foreground">Status da Categoria</label>
              <p class="text-xs text-muted-foreground">Categorias ativas aparecem no cardápio</p>
            </div>
            <button
              type="button"
              @click="statusEdicao = !statusEdicao"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              :class="statusEdicao ? 'bg-primary' : 'bg-border'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="statusEdicao ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>
        </div>
        
        <div class="flex items-center gap-3 justify-end mt-6">
          <button
            @click="fecharModalEdicao"
            class="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="salvarEdicao"
            :disabled="!podeEditarCategoria"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div 
      v-if="categoriaExcluindo"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="fecharModalExclusao"
    >
      <div 
        class="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <font-awesome-icon icon="exclamation-triangle" class="text-2xl text-destructive" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-foreground mb-2">Confirmar Exclusão</h3>
            
            <div v-if="produtosNaCategoria.length > 0" class="space-y-3">
              <p class="text-muted-foreground">
                A categoria <strong class="text-foreground">"{{ categoriaExcluindo.nome }}"</strong> contém 
                <strong class="text-destructive">{{ produtosNaCategoria.length }} produto(s)</strong>.
              </p>
              
              <div class="bg-destructiveSurface rounded-lg p-3 border border-destructive/20">
                <p class="text-sm text-destructive font-medium mb-2">⚠️ Atenção:</p>
                <p class="text-sm text-muted-foreground">
                  Ao excluir esta categoria, <strong>TODOS os produtos dentro dela também serão removidos permanentemente</strong>. 
                  Esta ação não pode ser desfeita.
                </p>
              </div>
              
              <div class="bg-muted/20 rounded-lg p-3">
                <p class="text-sm font-medium text-foreground mb-2">Produtos que serão excluídos:</p>
                <ul class="space-y-1">
                  <li 
                    v-for="produto in produtosNaCategoria.slice(0, 3)" 
                    :key="produto.id"
                    class="text-sm text-muted-foreground flex items-center"
                  >
                    <font-awesome-icon icon="times" class="text-destructive text-xs mr-2" />
                    {{ produto.nome }} - R$ {{ produto.preco.toFixed(2).replace('.', ',') }}
                  </li>
                  <li 
                    v-if="produtosNaCategoria.length > 3"
                    class="text-sm text-muted-foreground"
                  >
                    <font-awesome-icon icon="ellipsis-h" class="text-xs mr-2" />
                    +{{ produtosNaCategoria.length - 3 }} outros produtos...
                  </li>
                </ul>
              </div>
            </div>
            
            <div v-else>
              <p class="text-muted-foreground">
                Tem certeza que deseja excluir a categoria <strong class="text-foreground">"{{ categoriaExcluindo.nome }}"</strong>?
              </p>
              <p class="text-sm text-muted-foreground mt-2">Esta ação não pode ser desfeita.</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-3 justify-end mt-6">
          <button
            @click="fecharModalExclusao"
            class="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmarExclusao"
            class="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors"
          >
            <font-awesome-icon icon="trash" class="mr-2" />
            {{ produtosNaCategoria.length > 0 ? `Excluir Categoria e ${produtosNaCategoria.length} Produto(s)` : 'Excluir Categoria' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Novo Produto -->
    <div 
      v-if="modalNovoProdutoAberto"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="fecharModalNovoProduto"
    >
      <div 
        class="bg-card border border-border rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-foreground">
            {{ modoEdicao ? 'Editar Produto' : 'Novo Produto' }} - {{ categoriaSelecionada?.nome }}
          </h3>
          <button
            @click="fecharModalNovoProduto"
            class="text-muted-foreground hover:text-foreground"
          >
            <font-awesome-icon icon="times" class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="salvarNovoProduto" class="space-y-4">
          <!-- Nome do Produto -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Nome do Produto *
            </label>
            <input
              v-model="formularioProduto.nome"
              type="text"
              required
              class="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ex: Pizza Margherita, Hambúrguer Clássico..."
            />
          </div>

          <!-- Descrição -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Descrição
            </label>
            <textarea
              v-model="formularioProduto.descricao"
              rows="3"
              class="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Descreva os ingredientes e características do produto..."
            ></textarea>
          </div>

          <!-- Tipo de Produto -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Tipo de Produto *
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="formularioProduto.tipo = 'comum'"
                :class="[
                  'px-4 py-3 border-2 rounded-lg transition-all font-medium flex items-center justify-center gap-2',
                  formularioProduto.tipo === 'comum' 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-border hover:border-primary/50 text-foreground'
                ]"
              >
                <span class="text-xl">🍔</span>
                Produto Comum
              </button>
              <button
                type="button"
                @click="formularioProduto.tipo = 'pizza'"
                :class="[
                  'px-4 py-3 border-2 rounded-lg transition-all font-medium flex items-center justify-center gap-2',
                  formularioProduto.tipo === 'pizza' 
                    ? 'border-orange-500 bg-orange-500/10 text-orange-600' 
                    : 'border-border hover:border-orange-300 text-foreground'
                ]"
              >
                <span class="text-xl">🍕</span>
                Pizza
              </button>
            </div>
            <p class="text-xs text-muted-foreground mt-2">
              {{ formularioProduto.tipo === 'pizza' ? 'Pizzas têm preços por tamanho (P, M, G, F)' : 'Produtos comuns têm preço único' }}
            </p>
          </div>

          <!-- Preço (Produto Comum) -->
          <div v-if="formularioProduto.tipo === 'comum'">
            <label class="block text-sm font-medium text-foreground mb-2">
              Preço *
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <input
                v-model="precoFormatado"
                @input="formatarPreco"
                type="text"
                required
                class="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0,00"
              />
            </div>
          </div>

          <!-- Preços por Tamanho (Pizza) -->
          <div v-if="formularioProduto.tipo === 'pizza'" class="space-y-3">
            <label class="block text-sm font-medium text-foreground mb-2">
              Preços por Tamanho *
            </label>
            
            <div class="grid grid-cols-2 gap-3">
              <!-- Tamanho P -->
              <div>
                <label class="block text-xs font-medium text-muted-foreground mb-1">
                  Pequena (P) - 4 fatias
                </label>
                <div class="relative">
                  <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                  <input
                    v-model="precosTamanhos.P"
                    @input="formatarPrecoTamanho('P', $event)"
                    type="text"
                    required
                    class="w-full pl-8 pr-2 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <!-- Tamanho M -->
              <div>
                <label class="block text-xs font-medium text-muted-foreground mb-1">
                  Média (M) - 6 fatias
                </label>
                <div class="relative">
                  <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                  <input
                    v-model="precosTamanhos.M"
                    @input="formatarPrecoTamanho('M', $event)"
                    type="text"
                    required
                    class="w-full pl-8 pr-2 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <!-- Tamanho G -->
              <div>
                <label class="block text-xs font-medium text-muted-foreground mb-1">
                  Grande (G) - 8 fatias
                </label>
                <div class="relative">
                  <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                  <input
                    v-model="precosTamanhos.G"
                    @input="formatarPrecoTamanho('G', $event)"
                    type="text"
                    required
                    class="w-full pl-8 pr-2 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <!-- Tamanho F -->
              <div>
                <label class="block text-xs font-medium text-muted-foreground mb-1">
                  Família (F) - 8 fatias
                </label>
                <div class="relative">
                  <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                  <input
                    v-model="precosTamanhos.F"
                    @input="formatarPrecoTamanho('F', $event)"
                    type="text"
                    required
                    class="w-full pl-8 pr-2 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p class="text-xs text-blue-800 dark:text-blue-400">
                💡 <strong>Dica:</strong> Configure os 4 preços para que os clientes possam escolher o tamanho ideal na hora do pedido.
              </p>
            </div>
          </div>

          <!-- Upload de Foto -->
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">
              Foto do Produto
            </label>
            <div class="space-y-3">
              <!-- Foto atual (modo edição) -->
              <div 
                v-if="modoEdicao && produtoEditando?.foto && !previewFoto"
                class="p-3 bg-muted/20 border border-border rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <font-awesome-icon icon="file-alt" class="w-6 h-6 text-primary" />
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-foreground">Foto atual do produto</p>
                    <p class="text-xs text-muted-foreground">Selecione uma nova foto para substituir</p>
                  </div>
                </div>
              </div>
              
              <!-- Preview da imagem nova -->
              <div 
                v-if="previewFoto" 
                class="relative w-32 h-32 mx-auto border border-border rounded-lg overflow-hidden bg-muted/20"
              >
                <img 
                  :src="previewFoto" 
                  alt="Preview do produto"
                  class="w-full h-full object-cover"
                />
                <button
                  type="button"
                  @click="removerFoto"
                  class="absolute top-1 right-1 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors"
                >
                  <font-awesome-icon icon="times" class="w-3 h-3" />
                </button>
              </div>
              
              <!-- Input de arquivo -->
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/20 transition-colors">
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <font-awesome-icon icon="cloud-upload-alt" class="w-8 h-8 mb-2 text-muted-foreground" />
                    <p class="mb-2 text-sm text-muted-foreground">
                      <span class="font-semibold">Clique para enviar</span> ou arraste a foto
                    </p>
                    <p class="text-xs text-muted-foreground">PNG, JPG ou WEBP (máx. 5MB)</p>
                  </div>
                  <input
                    ref="inputFoto"
                    type="file"
                    accept="image/*"
                    @change="handleFileUpload"
                    class="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-foreground">
              Produto disponível para venda
            </span>
            <button
              type="button"
              @click="formularioProduto.ativo = !formularioProduto.ativo"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              :class="formularioProduto.ativo ? 'bg-primary' : 'bg-border'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="formularioProduto.ativo ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>

          <!-- Botões -->
          <div class="flex items-center gap-3 justify-end mt-6 pt-4 border-t border-border">
            <button
              type="button"
              @click="fecharModalNovoProduto"
              class="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="!podeAdicionarProduto"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <font-awesome-icon :icon="modoEdicao ? 'save' : 'plus'" class="w-4 h-4" />
              {{ modoEdicao ? 'Salvar Alterações' : 'Adicionar Produto' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal de Confirmação de Exclusão de Produto -->
  <div
    v-if="modalExclusaoProdutoAberto && produtoExcluindo"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click="fecharModalExclusaoProduto"
  >
    <div
      class="bg-card border border-border rounded-lg p-6 w-full max-w-md shadow-xl"
      @click.stop
    >
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
          <font-awesome-icon icon="exclamation-triangle" class="w-6 h-6 text-destructive" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-foreground">Confirmar Exclusão</h3>
          <p class="text-sm text-muted-foreground">Esta ação não pode ser desfeita</p>
        </div>
      </div>

      <div class="mb-6">
        <p class="text-foreground mb-2">
          Tem certeza que deseja excluir permanentemente o produto:
        </p>
        <div class="bg-muted/20 rounded-lg p-3 border border-border">
          <h4 class="font-medium text-foreground">{{ produtoExcluindo.nome }}</h4>
          <p v-if="produtoExcluindo.descricao" class="text-sm text-muted-foreground">{{ produtoExcluindo.descricao }}</p>
          <p class="text-sm font-semibold text-primary mt-1">
            R$ {{ produtoExcluindo.preco.toFixed(2).replace('.', ',') }}
          </p>
        </div>
        <div class="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p class="text-xs text-amber-800 dark:text-amber-400">
            💡 <strong>Dica:</strong> Se você quer apenas desativar temporariamente, use o botão de olho (👁️) em vez de excluir.
          </p>
        </div>
      </div>

      <div class="flex gap-3 justify-end">
        <button
          @click="fecharModalExclusaoProduto"
          class="px-4 py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/10 transition-colors"
        >
          Cancelar
        </button>
        <button
          @click="confirmarExclusaoProduto"
          class="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2"
        >
          <font-awesome-icon icon="trash" class="w-4 h-4" />
          Excluir Permanentemente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Categoria, Produto } from '../../shared/types/cardapio.types'

interface Props {
  categorias: Categoria[]
  produtos: Produto[]
}

const props = defineProps<Props>()

// Composable para gerenciar o cardápio
const { adicionarProduto, editarProduto: editarProdutoCardapio, removerProduto } = useCardapio()

// Estado para controlar quais categorias estão abertas/expandidas
const categoriasAbertas = ref<Set<string>>(new Set())

// Estado para filtros de busca por categoria
const filtrosProdutos = ref<Record<string, string>>({})

// Estados dos modais
const categoriaEditando = ref<Categoria | null>(null)
const categoriaExcluindo = ref<Categoria | null>(null)
const nomeEdicao = ref('')
const statusEdicao = ref(true)

// Estados do modal de exclusão de produto
const produtoExcluindo = ref<Produto | null>(null)
const modalExclusaoProdutoAberto = ref(false)

// Estados do modal de novo produto
const modalNovoProdutoAberto = ref(false)
const categoriaSelecionada = ref<Categoria | null>(null)
const produtoEditando = ref<Produto | null>(null)
const modoEdicao = ref(false)
const formularioProduto = ref({
  nome: '',
  descricao: '',
  preco: 0,
  tipo: 'comum' as 'comum' | 'pizza',
  ativo: true,
  foto: null as File | null
})

// Estados para o upload de foto
const previewFoto = ref<string | null>(null)
const inputFoto = ref<HTMLInputElement | null>(null)

// Estado para o preço formatado (produto comum)
const precoFormatado = ref('')

// Estados para preços dos tamanhos (pizza)
const precosTamanhos = ref({
  P: '',
  M: '',
  G: '',
  F: ''
})

// Função para alternar estado da categoria (abrir/fechar)
const toggleCategoria = (categoriaId: string) => {
  if (categoriasAbertas.value.has(categoriaId)) {
    categoriasAbertas.value.delete(categoriaId)
  } else {
    categoriasAbertas.value.add(categoriaId)
  }
}

// Função para buscar produtos de uma categoria específica
const getProdutosPorCategoria = (categoriaId: string): Produto[] => {
  return props.produtos.filter(produto => produto.categoriaId === categoriaId)
}

// Função para buscar produtos filtrados por nome em uma categoria
const getProdutosFiltrados = (categoriaId: string): Produto[] => {
  const produtos = getProdutosPorCategoria(categoriaId)
  const filtro = filtrosProdutos.value[categoriaId]
  
  if (!filtro || filtro.trim() === '') {
    return produtos
  }
  
  return produtos.filter(produto => 
    produto.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    (produto.descricao && produto.descricao.toLowerCase().includes(filtro.toLowerCase()))
  )
}

// Computed para produtos na categoria sendo excluída
const produtosNaCategoria = computed(() => {
  if (!categoriaExcluindo.value) return []
  return getProdutosPorCategoria(categoriaExcluindo.value.id)
})

// Computed para verificar se houve mudanças na edição
const houveMudancas = computed(() => {
  if (!categoriaEditando.value) return false
  return nomeEdicao.value.trim() !== categoriaEditando.value.nome || 
         statusEdicao.value !== categoriaEditando.value.ativa
})

// Computed para validar se pode salvar
const podeEditarCategoria = computed(() => {
  return nomeEdicao.value.trim().length >= 2 && houveMudancas.value
})

// Computed para validar se pode adicionar produto
const podeAdicionarProduto = computed(() => {
  const nomeValido = formularioProduto.value.nome.trim().length >= 2
  
  // Se for produto comum, validar preço único
  if (formularioProduto.value.tipo === 'comum') {
    return nomeValido && formularioProduto.value.preco > 0
  }
  
  // Se for pizza, validar que todos os 4 tamanhos têm preço
  if (formularioProduto.value.tipo === 'pizza') {
    const todosPreenchidos = precosTamanhos.value.P !== '' && 
                             precosTamanhos.value.M !== '' && 
                             precosTamanhos.value.G !== '' && 
                             precosTamanhos.value.F !== ''
    return nomeValido && todosPreenchidos
  }
  
  return false
})

// Função para resetar o formulário de produto
const resetarFormularioProduto = () => {
  formularioProduto.value = {
    nome: '',
    descricao: '',
    preco: 0,
    tipo: 'comum',
    ativo: true,
    foto: null
  }
  precoFormatado.value = ''
  precosTamanhos.value = { P: '', M: '', G: '', F: '' }
  previewFoto.value = null
  modoEdicao.value = false
  produtoEditando.value = null
  if (inputFoto.value) {
    inputFoto.value.value = ''
  }
}

// Funções do modal de edição
const abrirModalEdicao = (categoria: Categoria) => {
  categoriaEditando.value = categoria
  nomeEdicao.value = categoria.nome
  statusEdicao.value = categoria.ativa
}

const fecharModalEdicao = () => {
  categoriaEditando.value = null
  nomeEdicao.value = ''
  statusEdicao.value = true
}

const salvarEdicao = () => {
  if (!categoriaEditando.value || !nomeEdicao.value.trim()) return
  
  // TODO: Implementar a edição da categoria
  console.log('Editando categoria:', categoriaEditando.value.id, 'Novo nome:', nomeEdicao.value.trim(), 'Status:', statusEdicao.value)
  
  fecharModalEdicao()
}

// Funções do modal de exclusão
const abrirModalExclusao = (categoria: Categoria) => {
  categoriaExcluindo.value = categoria
}

const fecharModalExclusao = () => {
  categoriaExcluindo.value = null
}

const confirmarExclusao = () => {
  if (!categoriaExcluindo.value) return
  
  // TODO: Implementar a exclusão da categoria e produtos
  console.log('Excluindo categoria:', categoriaExcluindo.value.id)
  console.log('Produtos que serão excluídos:', produtosNaCategoria.value.length)
  
  fecharModalExclusao()
}

// Funções do modal de novo produto
const abrirModalNovoProduto = (categoria: Categoria) => {
  categoriaSelecionada.value = categoria
  resetarFormularioProduto()
  modalNovoProdutoAberto.value = true
}

const fecharModalNovoProduto = () => {
  modalNovoProdutoAberto.value = false
  categoriaSelecionada.value = null
  resetarFormularioProduto()
}

const salvarNovoProduto = () => {
  if (!categoriaSelecionada.value || !podeAdicionarProduto.value) return
  
  if (modoEdicao.value && produtoEditando.value) {
    // Modo edição - atualizar produto existente
    const produtoAtualizado: any = {
      nome: formularioProduto.value.nome.trim(),
      descricao: formularioProduto.value.descricao.trim(),
      tipo: formularioProduto.value.tipo,
      ativo: formularioProduto.value.ativo,
      // Manter a foto existente se não foi alterada, ou usar nova se foi
      foto: formularioProduto.value.foto ? 'foto-produto-' + Date.now() + '.jpg' : produtoEditando.value.foto
    }
    
    // Se for pizza, construir array de tamanhos JSONB
    if (formularioProduto.value.tipo === 'pizza') {
      produtoAtualizado.tamanhos = [
        { tamanho: 'P', preco: parseFloat(precosTamanhos.value.P.replace(',', '.')) },
        { tamanho: 'M', preco: parseFloat(precosTamanhos.value.M.replace(',', '.')) },
        { tamanho: 'G', preco: parseFloat(precosTamanhos.value.G.replace(',', '.')) },
        { tamanho: 'F', preco: parseFloat(precosTamanhos.value.F.replace(',', '.')) }
      ]
      // Para pizzas, também salvar preço (média) para compatibilidade
      const precos = produtoAtualizado.tamanhos.map((t: any) => t.preco)
      produtoAtualizado.preco = precos.reduce((sum: number, p: number) => sum + p, 0) / precos.length
    } else {
      // Se for produto comum, usar preço único
      produtoAtualizado.preco = Number(formularioProduto.value.preco)
    }
    
    // Editar o produto usando o composable
    editarProdutoCardapio(produtoEditando.value.id, produtoAtualizado)
    
    console.log('Produto editado com sucesso:', produtoEditando.value.id, produtoAtualizado)
    console.log('Nova foto selecionada:', formularioProduto.value.foto ? 'Sim' : 'Não')
    
  } else {
    // Modo criação - criar novo produto
    const novoProduto: any = {
      nome: formularioProduto.value.nome.trim(),
      descricao: formularioProduto.value.descricao.trim(),
      categoriaId: categoriaSelecionada.value.id,
      tipo: formularioProduto.value.tipo,
      ativo: formularioProduto.value.ativo,
      foto: formularioProduto.value.foto ? 'foto-produto-' + Date.now() + '.jpg' : undefined
    }
    
    // Se for pizza, construir array de tamanhos JSONB
    if (formularioProduto.value.tipo === 'pizza') {
      novoProduto.tamanhos = [
        { tamanho: 'P', preco: parseFloat(precosTamanhos.value.P.replace(',', '.')) },
        { tamanho: 'M', preco: parseFloat(precosTamanhos.value.M.replace(',', '.')) },
        { tamanho: 'G', preco: parseFloat(precosTamanhos.value.G.replace(',', '.')) },
        { tamanho: 'F', preco: parseFloat(precosTamanhos.value.F.replace(',', '.')) }
      ]
      // Para pizzas, também salvar preço (média) para compatibilidade
      const precos = novoProduto.tamanhos.map((t: any) => t.preco)
      novoProduto.preco = precos.reduce((sum: number, p: number) => sum + p, 0) / precos.length
    } else {
      // Se for produto comum, usar preço único
      novoProduto.preco = Number(formularioProduto.value.preco)
    }
    
    // Adicionar o produto usando o composable
    adicionarProduto(novoProduto)
    
    console.log('Produto adicionado com sucesso:', novoProduto)
    console.log('Arquivo de foto:', formularioProduto.value.foto ? 'Presente' : 'Não selecionado')
  }
  
  fecharModalNovoProduto()
}

// Funções para formatação de preço (produto comum)
const formatarPreco = (event: Event) => {
  const input = event.target as HTMLInputElement
  let valor = input.value.replace(/\D/g, '') // Remove todos os caracteres não numéricos
  
  if (valor === '') {
    precoFormatado.value = ''
    formularioProduto.value.preco = 0
    return
  }
  
  // Converte para número e divide por 100 para ter centavos
  const numeroValor = parseInt(valor) / 100
  formularioProduto.value.preco = numeroValor
  
  // Formata para exibição brasileira
  precoFormatado.value = numeroValor.toFixed(2).replace('.', ',')
}

// Função para formatação de preço por tamanho (pizza)
const formatarPrecoTamanho = (tamanho: 'P' | 'M' | 'G' | 'F', event: Event) => {
  const input = event.target as HTMLInputElement
  let valor = input.value.replace(/\D/g, '') // Remove todos os caracteres não numéricos
  
  if (valor === '') {
    precosTamanhos.value[tamanho] = ''
    return
  }
  
  // Converte para número e divide por 100 para ter centavos
  const numeroValor = parseInt(valor) / 100
  
  // Formata para exibição brasileira
  precosTamanhos.value[tamanho] = numeroValor.toFixed(2).replace('.', ',')
}

// Funções para upload de foto
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  // Validar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecione apenas arquivos de imagem.')
    return
  }
  
  // Validar tamanho (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('A imagem deve ter no máximo 5MB.')
    return
  }
  
  formularioProduto.value.foto = file
  
  // Criar preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewFoto.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removerFoto = () => {
  formularioProduto.value.foto = null
  previewFoto.value = null
  if (inputFoto.value) {
    inputFoto.value.value = ''
  }
}

// Funções para produtos
const editarProduto = (produto: Produto) => {
  // Encontrar a categoria do produto
  const categoria = props.categorias.find(c => c.id === produto.categoriaId)
  if (!categoria) return
  
  // Configurar para modo edição
  categoriaSelecionada.value = categoria
  produtoEditando.value = produto
  modoEdicao.value = true
  
  // Preencher o formulário com os dados do produto
  formularioProduto.value = {
    nome: produto.nome,
    descricao: produto.descricao || '',
    preco: produto.preco,
    tipo: produto.tipo,
    ativo: produto.ativo,
    foto: null // Resetar o input de foto
  }
  
  // Se for pizza, carregar os preços dos tamanhos
  if (produto.tipo === 'pizza' && produto.tamanhos && Array.isArray(produto.tamanhos)) {
    // Resetar preços
    precosTamanhos.value = { P: '', M: '', G: '', F: '' }
    
    // Preencher com os valores do banco
    produto.tamanhos.forEach((tamanho: any) => {
      const preco = Number(tamanho.preco)
      precosTamanhos.value[tamanho.tamanho as 'P' | 'M' | 'G' | 'F'] = preco.toFixed(2).replace('.', ',')
    })
  } else {
    // Se for produto comum, formatar o preço único
    precoFormatado.value = produto.preco.toFixed(2).replace('.', ',')
    // Resetar preços de tamanhos
    precosTamanhos.value = { P: '', M: '', G: '', F: '' }
  }
  
  // Se o produto tem foto, não mostrar preview (pois é do banco)
  previewFoto.value = null
  
  // Abrir o modal
  modalNovoProdutoAberto.value = true
}

const excluirProduto = (produto: Produto) => {
  produtoExcluindo.value = produto
  modalExclusaoProdutoAberto.value = true
}

// Funções do modal de exclusão de produto
const fecharModalExclusaoProduto = () => {
  modalExclusaoProdutoAberto.value = false
  produtoExcluindo.value = null
}

const confirmarExclusaoProduto = () => {
  if (produtoExcluindo.value) {
    removerProduto(produtoExcluindo.value.id)
    console.log(`Produto "${produtoExcluindo.value.nome}" foi removido`)
    fecharModalExclusaoProduto()
  }
}

// Função para alternar status do produto (ativar/desativar)
const toggleStatusProduto = async (produto: Produto) => {
  const novoStatus = !produto.ativo
  await editarProdutoCardapio(produto.id, { ativo: novoStatus })
  console.log(`Produto "${produto.nome}" ${novoStatus ? 'ativado' : 'desativado'}`)
}
</script>

<style scoped>
/* Estilização customizada da barra de rolagem */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #26272B;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #8162FF;
}

/* Para Firefox */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #26272B transparent;
}
</style>
