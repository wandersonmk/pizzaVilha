# Script PowerShell para facilitar commits e push para o GitHub
# Uso: .\commit.ps1 "mensagem do commit"

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