# 🔐 Teste do Sistema de Redefinição de Senha

## Pré-requisitos
- ✅ Site URL configurada no Supabase: `https://pizza-vilha.vercel.app`
- ✅ Redirect URLs configuradas: `https://pizza-vilha.vercel.app/**`
- ✅ Template de email corrigido (sem duplicação de URL)
- ✅ Deploy no Vercel concluído

## Passo a Passo do Teste

### 1. Solicitar Recuperação de Senha
1. Acesse: https://pizza-vilha.vercel.app/recuperar-senha
2. Digite um email cadastrado (ex: wandersoncnm@gmail.com)
3. Clique em "Enviar instruções"
4. **Resultado esperado:** 
   - ✅ Mensagem verde: "Email enviado com sucesso!"
   - ✅ Console mostra: `[useAuth] Enviando email com redirect para: https://pizza-vilha.vercel.app/redefinir-senha`

### 2. Verificar Email
1. Abra sua caixa de entrada
2. Procure email do Supabase com assunto "Resete sua senha"
3. **Verifique o link:** Deve conter `#access_token=` no final
4. Exemplo: `https://pizza-vilha.vercel.app/redefinir-senha#access_token=xxx&refresh_token=yyy&type=recovery`

### 3. Clicar no Link do Email
1. Clique no link do email
2. **Console deve mostrar:**
   ```
   🔥 CAPTURANDO TOKENS DO HASH IMEDIATAMENTE: #access_token=xxx...
   🎯 TOKENS CAPTURADOS: { hasAccessToken: true, hasRefreshToken: true, type: 'recovery' }
   🧹 Hash limpo da URL, tokens salvos em memória
   🚀 onMounted - Processando tokens: { hasAccessToken: true, source: 'memória' }
   Aguardando Supabase... tentativa 1 (se necessário)
   Sessão definida com sucesso: true
   ```
3. **Resultado esperado:**
   - ✅ Formulário aparece para digitar nova senha
   - ❌ NÃO deve mostrar "Acesso inválido"

### 4. Redefinir Senha
1. Digite uma nova senha (mínimo 6 caracteres)
2. Confirme a nova senha
3. Clique em "Salvar nova senha"
4. **Console deve mostrar:**
   ```
   Atualizando senha do usuário...
   Senha atualizada com sucesso
   ```
5. **Resultado esperado:**
   - ✅ Mensagem verde: "Senha redefinida com sucesso!"
   - ✅ Redirecionamento automático para /login após 3 segundos

### 5. Testar Nova Senha
1. Na tela de login
2. Digite o email e a NOVA senha
3. Clique em "Entrar"
4. **Resultado esperado:**
   - ✅ Login bem-sucedido
   - ✅ Acesso ao dashboard

## Possíveis Problemas e Soluções

### ❌ "Tokens não encontrados"
**Causa:** URL do email não contém tokens no hash
**Solução:** Verificar configuração de Redirect URLs no Supabase

### ❌ "Link de recuperação inválido ou expirado"
**Causa:** Tokens já foram usados ou expiraram (1 hora de validade)
**Solução:** Solicitar novo email de recuperação

### ❌ "Supabase não disponível"
**Causa:** Cliente não inicializou a tempo
**Solução:** Recarregar a página (sistema aguarda até 10 tentativas)

### ❌ "Acesso inválido. Use o link do email"
**Causa:** Acessou /redefinir-senha diretamente sem tokens
**Solução:** Usar o link do email de recuperação

## Checklist de Configuração do Supabase

- [ ] Authentication > URL Configuration > Site URL: `https://pizza-vilha.vercel.app`
- [ ] Authentication > URL Configuration > Redirect URLs: `https://pizza-vilha.vercel.app/**`
- [ ] Email Templates > Reset Password > Template correto (sem duplicação)
- [ ] Authentication > Providers > Email habilitado
- [ ] Authentication > Email Auth > Confirm email: Disabled (para testes) ou Enabled (produção)

## Status Atual do Sistema

✅ **Funcionando:**
- Envio de email de recuperação
- Captura de tokens do hash fragment
- Definição de sessão com tokens
- Atualização de senha
- Redirecionamento pós-sucesso

✅ **Testado:**
- Fluxo completo local
- Deploy no Vercel
- Configurações do Supabase

🎯 **Pronto para uso em produção!**
