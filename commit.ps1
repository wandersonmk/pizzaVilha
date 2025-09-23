# Script PowerShell para facilitar commits e push para o GitHub
# Uso: .\commit.ps1 "tipo: descrição da mudança"
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
# Exemplo: .\commit.ps1 "adiciona: sistema de autenticação"

param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)

Write-Host "📋 Verificando status do Git..." -ForegroundColor Cyan
git status

Write-Host ""
Write-Host "➕ Adicionando todos os arquivos alterados..." -ForegroundColor Green
git add .

Write-Host ""
Write-Host "💾 Fazendo commit com a mensagem: $Message" -ForegroundColor Yellow
git commit -m $Message

Write-Host ""
Write-Host "🚀 Enviando para o GitHub..." -ForegroundColor Blue
git push

Write-Host ""
Write-Host "✅ Commit e push realizados com sucesso!" -ForegroundColor Green
Write-Host "🔗 Verifique em: https://github.com/wandersonmk/pizzaVilha" -ForegroundColor Magenta