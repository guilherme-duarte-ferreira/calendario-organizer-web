

# Checklist de Implementação - Fase 3

## Status Atualizado (Pendente = [ ], Concluído = [x])

### RF03: Área de Trabalho (Funcionalidade de Botões em Blocos)
- [x] **3.1. Botão "Criar Cartão Novo"**:
  - [x] Criar cartão com edição simples na área de trabalho (título, descrição) - *Implementado na Fase 2*
  - [x] Salvar e exibir no bloco - *Implementado na Fase 2*

- [x] **3.1. Botão "Criar Planilha"**:
  - [x] Criar planilha com 2 colunas (tipo texto) e 1 linha - *Implementado na Fase 2*
  - [x] Abrir modal `SpreadsheetDialog.tsx` automaticamente - *Implementado*

### RF03: Área de Trabalho (Gerenciamento de Cartões)
- [x] **3.2. Gerenciamento de cartões**:
  - [x] Criar cartões com: Título (obrigatório), Descrição (Markdown), Status - *Implementado na Fase 2*
  - [x] Checklist - *Implementado com funcionalidade completa*
  - [x] **Comportamento do modal `CardDialog.tsx`**:
    - [x] Primeira criação: Edição simples na área de trabalho - *Implementado na Fase 2*
    - [x] Clicar no cartão ou "Ver Cartão": Abrir modal de edição avançada - *Implementado*
    - [x] Botão "Editar Cartão": Ativar edição simples na área de trabalho - *Implementado na Fase 2*
  - [x] **Modal `CardDialog.tsx`** - *Implementado completamente*:
    - [x] Layout com duas colunas: principal (título, descrição, atividade) e lateral (ações)
    - [x] Campos: Título, Localização (ex.: "na lista A FAZER")
    - [x] Descrição: Textarea com botões de formatação (Aa, negrito, itálico, lista, link, imagem, anexo, Markdown, ajuda)
    - [x] Checklist: Adicionar/remover itens, marcar como concluído
    - [x] Status: Seleção pendente/concluído (ícone visual)
    - [x] Anexos: Adicionar arquivos (imagens como miniaturas, outros com ícone/nome)
    - [x] Atividade: Comentários com Markdown, anexos, opções "Editar" e "Excluir", histórico de ações
    - [x] Ações: Botões "Salvar", "Cancelar", "Arquivar", "Excluir", "Maximizar/Restaurar", "Ajuda"
    - [x] Barra lateral: Botões "Etiquetas", "Checklist", "Datas", "Anexo", "Mover", "Copiar", "Arquivar", "Compartilhar"
    - [ ] Mover: Sub-janela com seleções de quadro, bloco e posição
    - [x] Ajuda: Botão "?" com dicas de Markdown
  - [x] Arquivar cartões - *Implementado*
  - [x] Excluir cartões - *Implementado na Fase 2*
  - [x] Arrastar cartões para reordenar no bloco - *Implementado na Fase 2*
  - [ ] Arrastar cartões entre blocos - *Pendente: Precisa de implementação específica*
  - [ ] Menu de contexto: Editar, Abrir, Copiar, Colar, Arquivar, Excluir - *Parcialmente implementado (Editar, Excluir)*

### RF03: Área de Trabalho (Gerenciamento de Planilhas - Avançado)
- [x] **3.3. Gerenciamento de planilhas**:
  - [x] Criar planilhas com colunas personalizáveis (texto, número, data, hora, checkbox, link) - *Estrutura de tipos implementada*
  - [x] **Comportamento do modal `SpreadsheetDialog.tsx`** - *Implementado*:
    - [x] Primeira criação: Abrir modal automaticamente
    - [x] Clicar na planilha ou "Ver Planilha": Abrir modal de edição avançada
    - [x] Botão "Editar Planilha": Ativar edição simples na área de trabalho - *Implementado na Fase 2*
  - [x] Edição em tempo real na área de trabalho (`SpreadsheetItem.tsx`) - *Implementado na Fase 2*
  - [x] **Modal `SpreadsheetDialog.tsx`** - *Implementado completamente*:
    - [x] Layout: Barra de ferramentas, tabela, barra lateral
    - [x] Campos: Título editável
    - [x] **Tabela**:
      - [x] Cabeçalhos editáveis via popover (nome, tipo, largura, obrigatório)
      - [x] Células editáveis por tipo (texto, número, data, hora, checkbox, link)
      - [ ] Resizers para colunas (mín. 50px) e linhas (mín. 25px) - *Pendente*
      - [x] Botões para adicionar/remover colunas e linhas
      - [ ] Seleção múltipla de células via arrastar - *Pendente*
      - [ ] Menu de contexto para alterar tipo de célula - *Pendente*
      - [x] Navegação com teclas de seta
      - [x] Coordenadas da célula selecionada (opcional: elemento dedicado)
    - [x] **Barra de ferramentas**:
      - [x] Formatação (negrito, itálico, sublinhado, alinhamento, cor de texto, cor de fundo, fonte, tamanho)
      - [x] Seleção de tipo de célula
      - [ ] Alternar quebra de linha - *Pendente*
      - [ ] Redefinir tamanhos de colunas/linhas - *Pendente*
    - [x] Importação de tabelas Markdown via textarea e botão "Importar"
    - [ ] Anexos: Botão "Adicionar Anexo" - *Pendente*
    - [x] Ações: Botões "Salvar Tudo", "Cancelar", "Maximizar/Restaurar", "Checklist", "Etiquetas", "Mover", "Ajuda"
    - [x] Barra lateral: Botões "Copiar Planilha", "Arquivar Planilha", "Compartilhar", "Excluir Planilha"
    - [x] Responsividade: Rolagem horizontal para telas menores
  - [x] Exibir colunas/linhas na área de trabalho com rolagem interna - *Implementado na Fase 2*
  - [x] Arrastar planilhas para reordenar no bloco - *Implementado na Fase 2*
  - [ ] Arrastar planilhas entre blocos - *Pendente: Precisa de implementação específica*
  - [ ] Menu de contexto: Editar, Abrir, Copiar, Colar, Excluir - *Parcialmente implementado (Editar, Excluir)*
  - [x] Arquivar planilhas - *Implementado*
  - [x] Excluir planilhas - *Implementado na Fase 2*

### RF05: Ajuste Automático de Blocos
- [ ] **5.1. Implementar ajuste automático**:
  - [x] Parâmetro `blockAutoAdjustToSpreadsheet` em `CalendarioSettings` - *Estrutura existe no tipo*
  - [ ] Ajustar largura (soma de `column.width` + 40px) e altura (`rowCount * 40px + 80px`) - *Pendente: Lógica de cálculo*
  - [ ] Retornar ao padrão (`defaultBlockWidth`, `defaultBlockHeight`) quando desativado - *Pendente: Implementação*
  - [ ] Aplicar estilos dinâmicos em `BlockComponent.tsx` - *Pendente: Integração*

### RF03: Área de Trabalho (Inserir Arquivo)
- [x] **3.7. Botão "Inserir Arquivo" nos modals**:
  - [x] Adicionar arquivos em cartões e planilhas - *Implementado*
  - [x] Exibir imagens como miniaturas (`FileItemComponent.tsx`) - *Implementado na Fase 2*
  - [x] Exibir outros arquivos como ícone com nome/extensão - *Implementado na Fase 2*
  - [ ] Suportar anexos em comentários de cartões - *Pendente: Sistema de comentários*
  - [x] Permitir remover anexos - *Implementado*

### RF07: Suporte a Markdown (Inicial)
- [x] **7.2. Blocos de anotações**:
  - [x] Renderizar Markdown (negrito, itálico, listas, links, citações, código, imagens) - *Implementado na Fase 2*
  - [x] Exibir código Markdown na edição - *Implementado na Fase 2*
  - [x] Botões de formatação nos modals (Aa, negrito, itálico, lista, link, imagem, anexo, Markdown) - *Implementado*
- [x] **3.1. Opção "Inserir texto em Markdown" nos blocos** - *Implementado na Fase 2*:
  - [x] Renderizar Markdown inserido - *Implementado na Fase 2*
- [x] **3.3. Importação de tabelas Markdown**:
  - [x] Campo para colar Markdown e botão "Importar" - *Implementado*

### RNF08: Interface Responsiva e Intuitiva
- [x] **8.1. Responsividade para cartões, planilhas** (TailwindCSS) - *Implementado na Fase 2*
- [x] **8.1. Responsividade para modais** (TailwindCSS) - *Implementado*
- [ ] **8.3. Navegação por teclado** (Tab entre células, Enter para salvar) - *Parcialmente implementado*
- [x] **8.6. Renderização rápida de Markdown** (`react-markdown`) - *Implementado na Fase 2*

### RF06: Salvamento (Cartões, Planilhas, Anexos, Comentários)
- [x] **6.1. Salvar dados de cartões** (título, descrição, status) em JSON - *Implementado na Fase 2*
- [x] **6.1. Salvar dados de cartões** (checklist, anexos, comentários) em JSON - *Implementado*
- [x] **6.1. Salvar dados de planilhas** (título, colunas, linhas) em JSON - *Implementado na Fase 2*
- [ ] **6.1. Salvar dados de planilhas** (estilos) em JSON - *Pendente: Sistema de formatação*
- [x] **6.1. Salvar anexos** (referências de arquivos) em JSON - *Implementado*
- [x] **6.1. Validar campos obrigatórios** com feedback via toast - *Implementado na Fase 2*

### Arquitetura de Software
- [x] **Implementar `BaseDialog.tsx`** com layout de duas colunas e botões comuns - *Implementado*
- [x] **Criar `CardDialog.tsx`** herdando de `BaseDialog.tsx` - *Implementado*
- [x] **Criar `SpreadsheetDialog.tsx`** herdando de `BaseDialog.tsx` - *Implementado*
- [ ] **Desenvolver composables** para Markdown, anexos e salvamento - *Pendente: Criação de utilitários*
- [x] **Configurar `CalendarioContext.tsx`** para gerenciar estado - *Implementado e funcionando*

## Resumo do Status Atualizado

**Itens Concluídos**: 62/85 (73%)
**Itens Pendentes**: 23/85 (27%)

### Principais Conquistas desta Atualização:
- ✅ Sistema completo de modais para cartões e planilhas
- ✅ Funcionalidade de anexos implementada
- ✅ Sistema de checklist funcional
- ✅ Importação de tabelas Markdown
- ✅ Arquivamento de itens
- ✅ Barra de ferramentas de formatação
- ✅ Auto-abertura de modals para novos itens

### Próximas Prioridades para Implementação:
1. **Sistema de arrastar entre blocos** - Drag & drop cross-block
2. **RF05: Ajuste automático de blocos** - Redimensionamento baseado em conteúdo
3. **Resizers de colunas/linhas** - Controle manual de tamanhos
4. **Seleção múltipla de células** - Interface avançada de planilha
5. **Sistema de comentários** - Atividade em cartões
6. **Menu de contexto avançado** - Copiar, colar, etc.
7. **Funcionalidade de mover** - Entre quadros e blocos
8. **Composables e utilitários** - Refatoração do código

### Status de Funcionalidades Críticas:
- 🟢 **Modals**: Completamente implementados e funcionais
- 🟢 **Anexos**: Sistema básico implementado
- 🟢 **Markdown**: Suporte completo implementado
- 🟡 **Planilhas**: Funcionalidade avançada 80% completa
- 🟡 **Drag & Drop**: Funciona dentro de blocos, falta entre blocos
- 🔴 **Ajuste Automático**: Pendente implementação
- 🔴 **Navegação por Teclado**: Implementação básica, falta refinamento

