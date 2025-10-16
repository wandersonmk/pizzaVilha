# 🚀 Guia de Deploy - Pizza Vilha

Este guia mostra como fazer o deploy do Pizza Vilha em produção.

## 📋 Pré-requisitos

- Conta no GitHub (já configurada ✅)
- Conta no Supabase (já configurada ✅)
- Conta na plataforma de deploy escolhida

---

## 🎯 Opção 1: Deploy na Vercel (Recomendado)

A **Vercel** é a plataforma mais simples e otimizada para projetos Nuxt.

### Passo a passo:

1. **Acesse a Vercel**
   - Vá para: https://vercel.com
   - Faça login com sua conta do GitHub

2. **Importe o Projeto**
   - Clique em "Add New Project"
   - Selecione o repositório `wandersonmk/pizzaVilha`
   - Clique em "Import"

3. **Configure as Variáveis de Ambiente**
   
   Na seção "Environment Variables", adicione:
   
   ```
   NUXT_PUBLIC_SUPABASE_URL = https://wynjuzsrydsvkmyhjfhu.supabase.co
   NUXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bmp1enNyeWRzdmtteWhqZmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTEzODcsImV4cCI6MjA2ODE4NzM4N30.9Ra2YjWSyl6xsV6fWfQLRzuvGnJjNrXTM3pBZP3Cork
   ```

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde 2-3 minutos
   - ✅ Pronto! Seu site estará no ar

5. **URL de Produção**
   - Você receberá uma URL tipo: `pizzavilha.vercel.app`
   - Pode configurar domínio próprio depois

### 🔄 Atualizações Automáticas

Após o primeiro deploy, qualquer `git push` para o GitHub irá:
- ✅ Fazer deploy automático
- ✅ Gerar preview de cada branch
- ✅ Notificar quando estiver pronto

---

## 🎯 Opção 2: Deploy na Netlify

### Passo a passo:

1. **Acesse a Netlify**
   - Vá para: https://netlify.com
   - Faça login com sua conta do GitHub

2. **Importe o Projeto**
   - Clique em "Add new site" > "Import an existing project"
   - Conecte com o GitHub
   - Selecione `wandersonmk/pizzaVilha`

3. **Configure o Build**
   
   ```
   Build command: npm run build
   Publish directory: .output/public
   ```

4. **Adicione as Variáveis de Ambiente**
   
   Em "Site settings" > "Environment variables":
   
   ```
   NUXT_PUBLIC_SUPABASE_URL = https://wynjuzsrydsvkmyhjfhu.supabase.co
   NUXT_PUBLIC_SUPABASE_ANON_KEY = sua_chave_aqui
   ```

5. **Deploy**
   - Clique em "Deploy site"
   - Aguarde o build completar
   - ✅ Site no ar!

---

## 🎯 Opção 3: Deploy na Cloudflare Pages

### Passo a passo:

1. **Acesse Cloudflare Pages**
   - Vá para: https://pages.cloudflare.com
   - Faça login

2. **Conecte o GitHub**
   - Clique em "Create a project"
   - Conecte sua conta do GitHub
   - Selecione `pizzaVilha`

3. **Configure**
   
   ```
   Build command: npm run build
   Output directory: .output/public
   ```

4. **Variáveis de Ambiente**
   
   Adicione as mesmas variáveis do Supabase

5. **Deploy**
   - Clique em "Save and Deploy"
   - ✅ Pronto!

---

## 🔒 Segurança - Importante!

⚠️ **NUNCA commite o arquivo `.env` no GitHub!**

O arquivo `.env` já está no `.gitignore`, mas sempre verifique:

```bash
git status
```

Se aparecer `.env` na lista, execute:

```bash
git rm --cached .env
git commit -m "remove: arquivo .env do repositório"
git push
```

---

## 🛠️ Comandos Úteis

### Build local para testar:
```bash
npm run build
npm run preview
```

### Verificar erros antes do deploy:
```bash
npm run build
```

Se o build passar localmente, passará no deploy também!

---

## 📝 Checklist Pré-Deploy

- ✅ Código commitado no GitHub
- ✅ Variáveis de ambiente do Supabase anotadas
- ✅ Build local funcionando (`npm run build`)
- ✅ Testes no modo development ok
- ✅ Arquivo `.env` não commitado

---

## 🎉 Após o Deploy

1. **Teste todas as funcionalidades:**
   - Login/Registro
   - Criação de pedidos
   - Gestão de cardápio
   - Impressão de pedidos
   - Exportação de relatórios

2. **Configure domínio personalizado** (opcional)
   - Na plataforma escolhida, vá em "Domains"
   - Adicione seu domínio
   - Configure DNS

3. **Configure Supabase para produção:**
   - No Supabase Dashboard
   - Vá em "Authentication" > "URL Configuration"
   - Adicione a URL do seu site em "Site URL"
   - Adicione em "Redirect URLs"

---

## 🆘 Problemas Comuns

### Erro: "Failed to load resource"
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o Supabase está acessível

### Erro: "Build failed"
- Execute `npm run build` localmente
- Corrija os erros antes de fazer push

### Página em branco
- Verifique o console do navegador (F12)
- Confirme variáveis de ambiente
- Verifique logs do deploy

---

## 📧 Suporte

Se precisar de ajuda, você pode:
- Verificar logs na plataforma de deploy
- Consultar documentação do Nuxt: https://nuxt.com/docs
- Verificar status do Supabase: https://status.supabase.com

---

**Criado para Pizza Vilha** 🍕  
Última atualização: Outubro 2025
