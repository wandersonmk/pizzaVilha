# 📝 Convenções de Commit - Pizza Vilha

Este documento define as convenções para mensagens de commit em português no projeto Pizza Vilha.

## 🎯 Formato

```
tipo: descrição breve

corpo da mensagem (opcional)
```

## 📋 Tipos de Commit

- **adiciona**: Novas funcionalidades ou arquivos
- **corrige**: Correção de bugs
- **atualiza**: Modificações em funcionalidades existentes
- **remove**: Remoção de código ou arquivos
- **refatora**: Refatoração de código (sem mudança de funcionalidade)
- **estilo**: Mudanças de formatação, espaçamento, etc.
- **docs**: Atualizações na documentação
- **config**: Mudanças em configurações
- **testa**: Adição ou modificação de testes

## ✅ Exemplos

```bash
adiciona: Sistema de autenticação de usuários
corrige: Bug no cálculo do total do pedido
atualiza: Interface do dashboard de vendas
remove: Dependências não utilizadas
refatora: Estrutura do componente de cardápio
estilo: Formatação do código nos composables
docs: Atualiza README com instruções de instalação
config: Configurações do Tailwind CSS
testa: Testes unitários para useAuth
```

## 🚀 Scripts de Commit

Para facilitar o processo, use os scripts criados:

### PowerShell (Windows)
```powershell
.\commit.ps1 "adiciona: Nova funcionalidade de relatórios"
```

### Bash (Linux/Mac)
```bash
./commit.sh "adiciona: Nova funcionalidade de relatórios"
```

## 📌 Dicas

- Use o presente do indicativo
- Seja específico mas conciso
- Comece com letra minúscula após o tipo
- Não termine com ponto final
- Use até 72 caracteres na primeira linha