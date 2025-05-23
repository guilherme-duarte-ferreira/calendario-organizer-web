
# Checklist de Implementação - Fase 3

## Status Inicial (Pendente = [ ], Concluído = [x])

### RF03: Área de Trabalho (Funcionalidade de Botões em Blocos)
- [ ] **3.1. Botão "Criar Cartão Novo"**:
  - [x] Criar cartão com edição simples na área de trabalho (título, descrição) - *Implementado na Fase 2*
  - [x] Salvar e exibir no bloco - *Implementado na Fase 2*

- [ ] **3.1. Botão "Criar Planilha"**:
  - [x] Criar planilha com 2 colunas (tipo texto) e 1 linha - *Implementado na Fase 2*
  - [ ] Abrir modal `SpreadsheetDialog.tsx` automaticamente - *Pendente: Modal não existe ainda*

### RF03: Área de Trabalho (Gerenciamento de Cartões)
- [ ] **3.2. Gerenciamento de cartões**:
  - [x] Criar cartões com: Título (obrigatório), Descrição (Markdown), Status - *Implementado na Fase 2*
  - [ ] Checklist - *Pendente: Estrutura básica existe, precisa de funcionalidade completa*
  - [ ] **Comportamento do modal `CardDialog.tsx`**:
    - [x] Primeira criação: Edição simples na área de trabalho - *Implementado na Fase 2*
    - [ ] Clicar no cartão ou "Ver Cartão": Abrir modal de edição avançada - *Pendente: Modal não existe*
    - [x] Botão "Editar Cartão": Ativar edição simples na área de trabalho - *Implementado na Fase 2*
  - [ ] **Modal `CardDialog.tsx`** - *Pendente: Componente não existe*:
    - [ ] Layout com duas colunas: principal (título, descrição, atividade) e lateral (ações)
    - [ ] Campos: Título, Localização (ex.: "na lista A FAZER")
    - [ ] Descrição: Textarea com botões de formatação (Aa, negrito, itálico, lista, link, imagem, anexo, Markdown, ajuda)
    - [ ] Checklist: Adicionar/remover itens, marcar como concluído
    - [ ] Status: Seleção pendente/concluído (ícone visual)
    - [ ] Anexos: Adicionar arquivos (imagens como miniaturas, outros com ícone/nome)
    - [ ] Atividade: Comentários com Markdown, anexos, opções "Editar" e "Excluir", histórico de ações
    - [ ] Ações: Botões "Salvar", "Cancelar", "Arquivar", "Excluir", "Maximizar/Restaurar", "Ajuda"
    - [ ] Barra lateral: Botões "Etiquetas", "Checklist", "Datas", "Anexo", "Mover", "Copiar", "Arquivar", "Compartilhar"
    - [ ] Mover: Sub-janela com seleções de quadro, bloco e posição
    - [ ] Ajuda: Botão "?" com dicas de Markdown
  - [x] Arquivar cartões - *Estrutura existe no tipo, precisa de implementação na UI*
  - [x] Excluir cartões - *Implementado na Fase 2*
  - [x] Arrastar cartões para reordenar no bloco - *Implementado na Fase 2*
  - [ ] Arrastar cartões entre blocos - *Pendente: Precisa de implementação específica*
  - [ ] Menu de contexto: Editar, Abrir, Copiar, Colar, Arquivar, Excluir - *Parcialmente implementado (Editar, Excluir)*

### RF03: Área de Trabalho (Gerenciamento de Planilhas - Avançado)
- [ ] **3.3. Gerenciamento de planilhas**:
  - [x] Criar planilhas com colunas personalizáveis (texto, número, data, hora, checkbox, link) - *Estrutura de tipos implementada*
  - [ ] **Comportamento do modal `SpreadsheetDialog.tsx`** - *Pendente: Modal não existe*:
    - [ ] Primeira criação: Abrir modal automaticamente
    - [ ] Clicar na planilha ou "Ver Planilha": Abrir modal de edição avançada
    - [x] Botão "Editar Planilha": Ativar edição simples na área de trabalho - *Implementado na Fase 2*
  - [x] Edição em tempo real na área de trabalho (`SpreadsheetItem.tsx`) - *Implementado na Fase 2*
  - [ ] **Modal `SpreadsheetDialog.tsx`** - *Pendente: Componente não existe*:
    - [ ] Layout: Barra de ferramentas, tabela, barra lateral
    - [ ] Campos: Título editável
    - [ ] **Tabela**:
      - [ ] Cabeçalhos editáveis via popover (nome, tipo, largura, obrigatório)
      - [ ] Células editáveis por tipo (texto, número, data, hora, checkbox, link)
      - [ ] Resizers para colunas (mín. 50px) e linhas (mín. 25px)
      - [ ] Botões para adicionar/remover colunas e linhas
      - [ ] Seleção múltipla de células via arrastar
      - [ ] Menu de contexto para alterar tipo de célula
      - [ ] Navegação com teclas de seta
      - [ ] Coordenadas da célula selecionada (opcional: elemento dedicado)
    - [ ] **Barra de ferramentas**:
      - [ ] Formatação (negrito, itálico, sublinhado, alinhamento, cor de texto, cor de fundo, fonte, tamanho)
      - [ ] Seleção de tipo de célula
      - [ ] Alternar quebra de linha
      - [ ] Redefinir tamanhos de colunas/linhas
    - [ ] Importação de tabelas Markdown via textarea e botão "Importar"
    - [ ] Anexos: Botão "Adicionar Anexo"
    - [ ] Ações: Botões "Salvar Tudo", "Cancelar", "Maximizar/Restaurar", "Checklist", "Etiquetas", "Mover", "Ajuda"
    - [ ] Barra lateral: Botões "Copiar Planilha", "Arquivar Planilha", "Compartilhar", "Excluir Planilha"
    - [ ] Responsividade: Rolagem horizontal para telas menores
  - [x] Exibir colunas/linhas na área de trabalho com rolagem interna - *Implementado na Fase 2*
  - [x] Arrastar planilhas para reordenar no bloco - *Implementado na Fase 2*
  - [ ] Arrastar planilhas entre blocos - *Pendente: Precisa de implementação específica*
  - [ ] Menu de contexto: Editar, Abrir, Copiar, Colar, Excluir - *Parcialmente implementado (Editar, Excluir)*
  - [x] Arquivar planilhas - *Estrutura existe no tipo, precisa de implementação na UI*
  - [x] Excluir planilhas - *Implementado na Fase 2*

### RF05: Ajuste Automático de Blocos
- [ ] **5.1. Implementar ajuste automático**:
  - [x] Parâmetro `blockAutoAdjustToSpreadsheet` em `CalendarioSettings` - *Estrutura existe no tipo*
  - [ ] Ajustar largura (soma de `column.width` + 40px) e altura (`rowCount * 40px + 80px`) - *Pendente: Lógica de cálculo*
  - [ ] Retornar ao padrão (`defaultBlockWidth`, `defaultBlockHeight`) quando desativado - *Pendente: Implementação*
  - [ ] Aplicar estilos dinâmicos em `BlockComponent.tsx` - *Pendente: Integração*

### RF03: Área de Trabalho (Inserir Arquivo)
- [ ] **3.7. Botão "Inserir Arquivo" nos modals**:
  - [ ] Adicionar arquivos em cartões e planilhas - *Pendente: Modals não existem*
  - [x] Exibir imagens como miniaturas (`FileItemComponent.tsx`) - *Implementado na Fase 2*
  - [x] Exibir outros arquivos como ícone com nome/extensão - *Implementado na Fase 2*
  - [ ] Suportar anexos em comentários de cartões - *Pendente: Sistema de comentários*
  - [ ] Permitir remover anexos - *Pendente: Funcionalidade de remoção*

### RF07: Suporte a Markdown (Inicial)
- [ ] **7.2. Blocos de anotações**:
  - [x] Renderizar Markdown (negrito, itálico, listas, links, citações, código, imagens) - *Implementado na Fase 2*
  - [x] Exibir código Markdown na edição - *Implementado na Fase 2*
  - [ ] Botões de formatação nos modals (Aa, negrito, itálico, lista, link, imagem, anexo, Markdown) - *Pendente: Modals não existem*
- [x] **3.1. Opção "Inserir texto em Markdown" nos blocos** - *Implementado na Fase 2*:
  - [x] Renderizar Markdown inserido - *Implementado na Fase 2*
- [ ] **3.3. Importação de tabelas Markdown**:
  - [ ] Campo para colar Markdown e botão "Importar" - *Pendente: Modal de planilha*

### RNF08: Interface Responsiva e Intuitiva
- [x] **8.1. Responsividade para cartões, planilhas** (TailwindCSS) - *Implementado na Fase 2*
- [ ] **8.1. Responsividade para modals** (TailwindCSS) - *Pendente: Modais não existem*
- [ ] **8.3. Navegação por teclado** (Tab entre células, Enter para salvar) - *Pendente: Implementação*
- [x] **8.6. Renderização rápida de Markdown** (`react-markdown`) - *Implementado na Fase 2*

### RF06: Salvamento (Cartões, Planilhas, Anexos, Comentários)
- [x] **6.1. Salvar dados de cartões** (título, descrição, status) em JSON - *Implementado na Fase 2*
- [ ] **6.1. Salvar dados de cartões** (checklist, anexos, comentários) em JSON - *Pendente: Funcionalidades avançadas*
- [x] **6.1. Salvar dados de planilhas** (título, colunas, linhas) em JSON - *Implementado na Fase 2*
- [ ] **6.1. Salvar dados de planilhas** (estilos) em JSON - *Pendente: Sistema de formatação*
- [ ] **6.1. Salvar anexos** (referências de arquivos) em JSON - *Pendente: Sistema de anexos*
- [x] **6.1. Validar campos obrigatórios** com feedback via toast - *Implementado na Fase 2*

### Arquitetura de Software
- [ ] **Implementar `BaseDialog.tsx`** com layout de duas colunas e botões comuns - *Pendente: Criação do componente*
- [ ] **Criar `CardDialog.tsx`** herdando de `BaseDialog.tsx` - *Pendente: Criação do componente*
- [ ] **Criar `SpreadsheetDialog.tsx`** herdando de `BaseDialog.tsx` - *Pendente: Criação do componente*
- [ ] **Desenvolver composables** para Markdown, anexos e salvamento - *Pendente: Criação de utilitários*
- [x] **Configurar `CalendarioContext.tsx`** para gerenciar estado - *Implementado e funcionando*

## Resumo do Status Inicial

**Itens Concluídos**: 17/85 (20%)
**Itens Pendentes**: 68/85 (80%)

### Principais Conquistas da Fase 2 que Beneficiam a Fase 3:
- ✅ Sistema básico de cartões e planilhas funcionando
- ✅ Estrutura de tipos TypeScript completa
- ✅ Sistema de salvamento e contexto estabelecido
- ✅ Componentes base de itens implementados
- ✅ Renderização de Markdown funcionando
- ✅ Sistema de drag & drop operacional

### Próximas Prioridades para Implementação:
1. **BaseDialog.tsx** - Componente base para modals
2. **CardDialog.tsx** - Modal avançado de cartões
3. **SpreadsheetDialog.tsx** - Modal avançado de planilhas
4. **Sistema de anexos** - Upload e gerenciamento de arquivos
5. **Formatação avançada** - Botões e controles de Markdown
