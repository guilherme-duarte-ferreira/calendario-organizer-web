
# Documentação da Fase 3 - Sistema Calendário

## Visão Geral

A Fase 3 do Sistema Calendário foca na implementação avançada de cartões e planilhas, introduzindo modals de edição sofisticados (`CardDialog.tsx` e `SpreadsheetDialog.tsx`) com funcionalidades estilo Excel, suporte completo a Markdown, sistema de anexos e arquitetura baseada em componentes reutilizáveis.

## Objetivos da Fase 3

### 1. Modals de Edição Avançada
- **CardDialog.tsx**: Modal completo para edição de cartões com layout de duas colunas
- **SpreadsheetDialog.tsx**: Editor estilo Excel para planilhas
- **BaseDialog.tsx**: Componente base reutilizável

### 2. Funcionalidades Estilo Excel
- Edição de células em tempo real
- Redimensionamento de colunas e linhas
- Navegação por teclado
- Formatação de células
- Tipos de dados variados

### 3. Sistema de Anexos
- Suporte a imagens, documentos e links
- Miniaturas para imagens
- Anexos em comentários
- Upload e gerenciamento de arquivos

### 4. Markdown Avançado
- Botões de formatação
- Preview em tempo real
- Importação de tabelas Markdown
- Suporte em todas as áreas de texto

## Arquitetura Planejada

### Componentes Base
- **BaseDialog.tsx**: Layout e funcionalidades comuns
- **Composables**: Funções reutilizáveis para Markdown e anexos
- **Hooks personalizados**: Para gerenciamento de estado complexo

### Funcionalidades Avançadas
- **Ajuste automático de blocos**: Baseado no conteúdo das planilhas
- **Sistema de comentários**: Com histórico e anexos
- **Movimentação entre blocos**: Interface para reorganização

## Status de Implementação

**Início da Fase 3**: Planejamento e arquitetura definidos
**Próximos passos**: Implementação do checklist detalhado
