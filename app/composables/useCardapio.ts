import type { CardapioState, Categoria, Produto } from '../../shared/types/cardapio.types'

export const useCardapio = () => {
  // Estado reativo do cardápio
  const cardapioState = useState<CardapioState>('cardapio', () => ({
    categorias: [
      {
        id: '1',
        nome: 'Pizzas',
        descricao: 'Deliciosas pizzas artesanais',
        ordem: 1,
        ativa: true,
        icone: 'pizza-slice'
      },
      {
        id: '2',
        nome: 'Hambúrguers',
        descricao: 'Hambúrguers artesanais e suculentos',
        ordem: 2,
        ativa: true,
        icone: 'hamburger'
      },
      {
        id: '3',
        nome: 'Bebidas',
        descricao: 'Sucos, refrigerantes e bebidas especiais',
        ordem: 3,
        ativa: true,
        icone: 'glass-water'
      },
      {
        id: '4',
        nome: 'Sobremesas',
        descricao: 'Doces e sobremesas irresistíveis',
        ordem: 4,
        ativa: true,
        icone: 'ice-cream'
      }
    ],
    produtos: [
      {
        id: '1',
        nome: 'Pizza Margherita',
        preco: 32.90,
        descricao: 'Pizza clássica com molho de tomate, mussarela e manjericão fresco',
        foto: '/images/pizza-margherita.jpg',
        categoriaId: '1',
        ativo: true,
        tipo: 'pizza',
        sabores: [
          {
            nome: 'Margherita',
            preco: 32.90,
            ingredientes: ['Molho de tomate', 'Mussarela', 'Manjericão']
          }
        ],
        tamanhos: [
          { nome: 'Pequena', multiplicador: 1.0 },
          { nome: 'Média', multiplicador: 1.3 },
          { nome: 'Grande', multiplicador: 1.6 }
        ]
      },
      {
        id: '2',
        nome: 'Pizza Calabresa',
        preco: 35.90,
        descricao: 'Pizza saborosa com calabresa, cebola e azeitonas',
        foto: '/images/pizza-calabresa.jpg',
        categoriaId: '1',
        ativo: true,
        tipo: 'pizza',
        sabores: [
          {
            nome: 'Calabresa',
            preco: 35.90,
            ingredientes: ['Molho de tomate', 'Mussarela', 'Calabresa', 'Cebola', 'Azeitonas']
          }
        ],
        tamanhos: [
          { nome: 'Pequena', multiplicador: 1.0 },
          { nome: 'Média', multiplicador: 1.3 },
          { nome: 'Grande', multiplicador: 1.6 }
        ]
      },
      {
        id: '3',
        nome: 'Hambúrguer Artesanal',
        preco: 24.50,
        descricao: 'Pão brioche, hambúrguer 180g, queijo, alface, tomate e molho especial',
        foto: '/images/hamburger.jpg',
        categoriaId: '2',
        ativo: true,
        tipo: 'comum'
      },
      {
        id: '4',
        nome: 'Suco Natural',
        preco: 8.90,
        descricao: 'Suco natural de frutas frescas',
        foto: '/images/suco.jpg',
        categoriaId: '3',
        ativo: true,
        tipo: 'comum'
      },
      // Pizzas adicionais (10 produtos total na categoria)
      {
        id: '5',
        nome: 'Pizza Portuguesa',
        preco: 38.90,
        descricao: 'Pizza com presunto, ovos, ervilha, cebola e azeitonas',
        foto: '/images/pizza-portuguesa.jpg',
        categoriaId: '1',
        ativo: true,
        tipo: 'pizza',
        sabores: [
          {
            nome: 'Portuguesa',
            preco: 38.90,
            ingredientes: ['Molho de tomate', 'Mussarela', 'Presunto', 'Ovos', 'Ervilha', 'Cebola', 'Azeitonas']
          }
        ],
        tamanhos: [
          { nome: 'Pequena', multiplicador: 1.0 },
          { nome: 'Média', multiplicador: 1.3 },
          { nome: 'Grande', multiplicador: 1.6 }
        ]
      },
      {
        id: '6',
        nome: 'Pizza Quatro Queijos',
        preco: 42.90,
        descricao: 'Pizza com mussarela, provolone, gorgonzola e parmesão',
        foto: '/images/pizza-quatro-queijos.jpg',
        categoriaId: '1',
        ativo: true,
        tipo: 'pizza',
        sabores: [
          {
            nome: 'Quatro Queijos',
            preco: 42.90,
            ingredientes: ['Molho de tomate', 'Mussarela', 'Provolone', 'Gorgonzola', 'Parmesão']
          }
        ],
        tamanhos: [
          { nome: 'Pequena', multiplicador: 1.0 },
          { nome: 'Média', multiplicador: 1.3 },
          { nome: 'Grande', multiplicador: 1.6 }
        ]
      },
      {
        id: '7',
        nome: 'Pizza Pepperoni',
        preco: 39.90,
        descricao: 'Pizza com pepperoni importado e orégano',
        foto: '/images/pizza-pepperoni.jpg',
        categoriaId: '1',
        ativo: true,
        tipo: 'pizza',
        sabores: [
          {
            nome: 'Pepperoni',
            preco: 39.90,
            ingredientes: ['Molho de tomate', 'Mussarela', 'Pepperoni', 'Orégano']
          }
        ],
        tamanhos: [
          { nome: 'Pequena', multiplicador: 1.0 },
          { nome: 'Média', multiplicador: 1.3 },
          { nome: 'Grande', multiplicador: 1.6 }
        ]
      },
      {
        id: '8',
        nome: 'Pizza Napolitana',
        preco: 36.90,
        descricao: 'Pizza com mussarela, tomate, parmesão e manjericão',
        foto: '/images/pizza-napolitana.jpg',
        categoriaId: '1',
        ativo: true,
        tipo: 'pizza',
        sabores: [
          {
            nome: 'Napolitana',
            preco: 36.90,
            ingredientes: ['Molho de tomate', 'Mussarela', 'Tomate', 'Parmesão', 'Manjericão']
          }
        ],
        tamanhos: [
          { nome: 'Pequena', multiplicador: 1.0 },
          { nome: 'Média', multiplicador: 1.3 },
          { nome: 'Grande', multiplicador: 1.6 }
        ]
      },
      {
        id: '9',
        nome: 'Pizza Frango Catupiry',
        preco: 37.90,
        descricao: 'Pizza com frango desfiado e catupiry',
        foto: '/images/pizza-frango-catupiry.jpg',
        categoriaId: '1',
        ativo: true,
        tipo: 'pizza',
        sabores: [
          {
            nome: 'Frango Catupiry',
            preco: 37.90,
            ingredientes: ['Molho de tomate', 'Mussarela', 'Frango desfiado', 'Catupiry']
          }
        ],
        tamanhos: [
          { nome: 'Pequena', multiplicador: 1.0 },
          { nome: 'Média', multiplicador: 1.3 },
          { nome: 'Grande', multiplicador: 1.6 }
        ]
      },
      {
        id: '10',
        nome: 'Pizza Bacon',
        preco: 41.90,
        descricao: 'Pizza com bacon crocante e cebola caramelizada',
        foto: '/images/pizza-bacon.jpg',
        categoriaId: '1',
        ativo: true,
        tipo: 'pizza',
        sabores: [
          {
            nome: 'Bacon',
            preco: 41.90,
            ingredientes: ['Molho de tomate', 'Mussarela', 'Bacon', 'Cebola caramelizada']
          }
        ],
        tamanhos: [
          { nome: 'Pequena', multiplicador: 1.0 },
          { nome: 'Média', multiplicador: 1.3 },
          { nome: 'Grande', multiplicador: 1.6 }
        ]
      },
      {
        id: '11',
        nome: 'Pizza Vegetariana',
        preco: 34.90,
        descricao: 'Pizza com abobrinha, berinjela, pimentão e tomate seco',
        foto: '/images/pizza-vegetariana.jpg',
        categoriaId: '1',
        ativo: true,
        tipo: 'pizza',
        sabores: [
          {
            nome: 'Vegetariana',
            preco: 34.90,
            ingredientes: ['Molho de tomate', 'Mussarela', 'Abobrinha', 'Berinjela', 'Pimentão', 'Tomate seco']
          }
        ],
        tamanhos: [
          { nome: 'Pequena', multiplicador: 1.0 },
          { nome: 'Média', multiplicador: 1.3 },
          { nome: 'Grande', multiplicador: 1.6 }
        ]
      },
      {
        id: '12',
        nome: 'Pizza Atum',
        preco: 40.90,
        descricao: 'Pizza com atum, cebola roxa e azeitonas pretas',
        foto: '/images/pizza-atum.jpg',
        categoriaId: '1',
        ativo: true,
        tipo: 'pizza',
        sabores: [
          {
            nome: 'Atum',
            preco: 40.90,
            ingredientes: ['Molho de tomate', 'Mussarela', 'Atum', 'Cebola roxa', 'Azeitonas pretas']
          }
        ],
        tamanhos: [
          { nome: 'Pequena', multiplicador: 1.0 },
          { nome: 'Média', multiplicador: 1.3 },
          { nome: 'Grande', multiplicador: 1.6 }
        ]
      },
      {
        id: '13',
        nome: 'Pizza Rucula Tomate Seco',
        preco: 43.90,
        descricao: 'Pizza com rúcula fresca, tomate seco e parmesão',
        foto: '/images/pizza-rucula.jpg',
        categoriaId: '1',
        ativo: true,
        tipo: 'pizza',
        sabores: [
          {
            nome: 'Rúcula Tomate Seco',
            preco: 43.90,
            ingredientes: ['Molho de tomate', 'Mussarela', 'Rúcula', 'Tomate seco', 'Parmesão']
          }
        ],
        tamanhos: [
          { nome: 'Pequena', multiplicador: 1.0 },
          { nome: 'Média', multiplicador: 1.3 },
          { nome: 'Grande', multiplicador: 1.6 }
        ]
      },
      {
        id: '14',
        nome: 'Pizza Doce Brigadeiro',
        preco: 29.90,
        descricao: 'Pizza doce com brigadeiro e granulado',
        foto: '/images/pizza-brigadeiro.jpg',
        categoriaId: '1',
        ativo: true,
        tipo: 'pizza',
        sabores: [
          {
            nome: 'Brigadeiro',
            preco: 29.90,
            ingredientes: ['Massa doce', 'Brigadeiro', 'Granulado', 'Leite condensado']
          }
        ],
        tamanhos: [
          { nome: 'Pequena', multiplicador: 1.0 },
          { nome: 'Média', multiplicador: 1.3 },
          { nome: 'Grande', multiplicador: 1.6 }
        ]
      },
      // Hambúrguers adicionais (5 produtos total na categoria)
      {
        id: '15',
        nome: 'Hambúrguer Bacon',
        preco: 28.90,
        descricao: 'Pão brioche, hambúrguer 180g, bacon, queijo e molho barbecue',
        foto: '/images/hamburger-bacon.jpg',
        categoriaId: '2',
        ativo: true,
        tipo: 'comum'
      },
      {
        id: '16',
        nome: 'Hambúrguer Duplo',
        preco: 34.90,
        descricao: 'Pão brioche, dois hambúrguers 120g, queijo duplo, alface e tomate',
        foto: '/images/hamburger-duplo.jpg',
        categoriaId: '2',
        ativo: true,
        tipo: 'comum'
      },
      {
        id: '17',
        nome: 'Hambúrguer Vegetariano',
        preco: 22.90,
        descricao: 'Pão integral, hambúrguer de quinoa, queijo vegetal e salada',
        foto: '/images/hamburger-veggie.jpg',
        categoriaId: '2',
        ativo: true,
        tipo: 'comum'
      },
      {
        id: '18',
        nome: 'Hambúrguer Frango',
        preco: 26.90,
        descricao: 'Pão brioche, filé de frango grelhado, queijo e molho especial',
        foto: '/images/hamburger-frango.jpg',
        categoriaId: '2',
        ativo: true,
        tipo: 'comum'
      },
      {
        id: '19',
        nome: 'Hambúrguer Gourmet',
        preco: 39.90,
        descricao: 'Pão australiano, hambúrguer 200g, queijo brie, rúcula e geleia',
        foto: '/images/hamburger-gourmet.jpg',
        categoriaId: '2',
        ativo: true,
        tipo: 'comum'
      },
      // Bebidas adicionais (5 produtos total na categoria)
      {
        id: '20',
        nome: 'Refrigerante Lata',
        preco: 5.50,
        descricao: 'Refrigerante em lata 350ml - Coca, Pepsi, Guaraná',
        foto: '/images/refrigerante-lata.jpg',
        categoriaId: '3',
        ativo: true,
        tipo: 'comum'
      },
      {
        id: '21',
        nome: 'Água Mineral',
        preco: 3.50,
        descricao: 'Água mineral sem gás 500ml',
        foto: '/images/agua.jpg',
        categoriaId: '3',
        ativo: true,
        tipo: 'comum'
      },
      {
        id: '22',
        nome: 'Suco de Laranja',
        preco: 12.90,
        descricao: 'Suco natural de laranja 500ml',
        foto: '/images/suco-laranja.jpg',
        categoriaId: '3',
        ativo: true,
        tipo: 'comum'
      },
      {
        id: '23',
        nome: 'Cerveja Artesanal',
        preco: 18.90,
        descricao: 'Cerveja artesanal 600ml - IPA ou Pilsen',
        foto: '/images/cerveja.jpg',
        categoriaId: '3',
        ativo: true,
        tipo: 'comum'
      },
      {
        id: '24',
        nome: 'Café Expresso',
        preco: 4.50,
        descricao: 'Café expresso tradicional',
        foto: '/images/cafe.jpg',
        categoriaId: '3',
        ativo: true,
        tipo: 'comum'
      },
      // Sobremesas adicionais (5 produtos total na categoria)
      {
        id: '25',
        nome: 'Pudim de Leite',
        preco: 12.90,
        descricao: 'Pudim caseiro de leite condensado com calda de caramelo',
        foto: '/images/pudim.jpg',
        categoriaId: '4',
        ativo: true,
        tipo: 'comum'
      },
      {
        id: '26',
        nome: 'Brownie com Sorvete',
        preco: 16.90,
        descricao: 'Brownie de chocolate quente com sorvete de baunilha',
        foto: '/images/brownie.jpg',
        categoriaId: '4',
        ativo: true,
        tipo: 'comum'
      },
      {
        id: '27',
        nome: 'Torta de Limão',
        preco: 14.90,
        descricao: 'Torta de limão com merengue e base de biscoito',
        foto: '/images/torta-limao.jpg',
        categoriaId: '4',
        ativo: true,
        tipo: 'comum'
      },
      {
        id: '28',
        nome: 'Petit Gateau',
        preco: 18.90,
        descricao: 'Bolinho de chocolate quente com sorvete e calda',
        foto: '/images/petit-gateau.jpg',
        categoriaId: '4',
        ativo: true,
        tipo: 'comum'
      },
      {
        id: '29',
        nome: 'Mousse de Maracujá',
        preco: 11.90,
        descricao: 'Mousse cremoso de maracujá com biscoito triturado',
        foto: '/images/mousse-maracuja.jpg',
        categoriaId: '4',
        ativo: true,
        tipo: 'comum'
      }
    ],
    carrinho: []
  }))

  // Getters
  const categorias = computed(() => cardapioState.value.categorias.filter(c => c.ativa).sort((a, b) => a.ordem - b.ordem))
  const produtos = computed(() => cardapioState.value.produtos.filter(p => p.ativo))

  // Funções para categorias
  const adicionarCategoria = (categoria: Omit<Categoria, 'id'>) => {
    const novaCategoria: Categoria = {
      ...categoria,
      id: Date.now().toString()
    }
    cardapioState.value.categorias.push(novaCategoria)
  }

  const editarCategoria = (id: string, dadosAtualizados: Partial<Omit<Categoria, 'id'>>) => {
    const index = cardapioState.value.categorias.findIndex(c => c.id === id)
    if (index !== -1) {
      const categoria = cardapioState.value.categorias[index]
      if (categoria) {
        Object.assign(categoria, dadosAtualizados)
      }
    }
  }

  const removerCategoria = (id: string) => {
    const index = cardapioState.value.categorias.findIndex(c => c.id === id)
    if (index !== -1) {
      cardapioState.value.categorias.splice(index, 1)
    }
  }

  // Funções para produtos
  const adicionarProduto = (produto: Omit<Produto, 'id'>) => {
    const novoProduto: Produto = {
      ...produto,
      id: Date.now().toString()
    }
    cardapioState.value.produtos.push(novoProduto)
  }

  const editarProduto = (id: string, dadosAtualizados: Partial<Omit<Produto, 'id'>>) => {
    const index = cardapioState.value.produtos.findIndex(p => p.id === id)
    if (index !== -1) {
      const produto = cardapioState.value.produtos[index]
      if (produto) {
        Object.assign(produto, dadosAtualizados)
      }
    }
  }

  const removerProduto = (id: string) => {
    const index = cardapioState.value.produtos.findIndex(p => p.id === id)
    if (index !== -1) {
      cardapioState.value.produtos.splice(index, 1)
    }
  }

  // Funções utilitárias
  const produtosPorCategoria = (categoriaId: string) => {
    return produtos.value.filter(p => p.categoriaId === categoriaId)
  }

  const calcularPrecoPizza = (sabores: any[], tamanho: { multiplicador: number }) => {
    if (sabores.length === 0) return 0
    
    // Regra especial: pega o maior preço entre os sabores
    const maiorPreco = Math.max(...sabores.map(s => s.preco))
    return maiorPreco * tamanho.multiplicador
  }

  return {
    // Estado
    categorias,
    produtos,
    
    // Funções de categoria
    adicionarCategoria,
    editarCategoria,
    removerCategoria,
    
    // Funções de produto
    adicionarProduto,
    editarProduto,
    removerProduto,
    
    // Funções utilitárias
    produtosPorCategoria,
    calcularPrecoPizza
  }
}
