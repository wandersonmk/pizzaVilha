#!/bin/bash

# Script para facilitar commits e push para o GitHub
# Uso: ./commit.sh "mensagem do commit"

if [ -z "$1" ]; then
    echo "❌ Por favor, forneça uma mensagem de commit."
    echo "Uso: ./commit.sh \"sua mensagem aqui\""
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