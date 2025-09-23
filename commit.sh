#!/bin/bash

# Script para facilitar commits e push para o GitHub
# Uso: ./commit.sh "tipo: descrição da mudança"
#
# Tipos disponíveis:
# - adiciona: Novas funcionalidades
# - corrige: Correção de bugs  
# - atualiza: Modificações em funcionalidades
# - remove: Remoção de código
# - refatora: Refatoração de código
# - docs: Atualizações na documentação
# - config: Mudanças em configurações
# - estilo: Formatação e espaçamento
# - testa: Adição ou modificação de testes
#
# Exemplo: ./commit.sh "adiciona: sistema de autenticação"

if [ -z "$1" ]; then
    echo "❌ Por favor, forneça uma mensagem de commit."
    echo "Uso: ./commit.sh \"tipo: sua mensagem aqui\""
    echo ""
    echo "Tipos disponíveis:"
    echo "  adiciona:  Novas funcionalidades"
    echo "  corrige:   Correção de bugs"
    echo "  atualiza:  Modificações em funcionalidades"
    echo "  remove:    Remoção de código"
    echo "  refatora:  Refatoração de código"
    echo "  docs:      Atualizações na documentação"
    echo "  config:    Mudanças em configurações"
    echo "  estilo:    Formatação e espaçamento"
    echo "  testa:     Adição ou modificação de testes"
    exit 1
fi

echo "📋 Verificando status do Git..."
git status

echo ""
echo "➕ Adicionando todos os arquivos alterados..."
git add .

echo ""
echo "💾 Fazendo commit com a mensagem: $1"
git commit -m "$1"

echo ""
echo "🚀 Enviando para o GitHub..."
git push

echo ""
echo "✅ Commit e push realizados com sucesso!"
echo "🔗 Verifique em: https://github.com/wandersonmk/pizzaVilha"