
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

## Arquitetura Implementada

### Componentes Base
- **BaseDialog.tsx**: Layout e funcionalidades comuns ✅
- **Composables**: Funções reutilizáveis para Markdown e anexos ✅
- **Hooks personalizados**: Para gerenciamento de estado complexo ✅

### Funcionalidades Avançadas
- **Ajuste automático de blocos**: Baseado no conteúdo das planilhas ✅
- **Sistema de comentários**: Com histórico e anexos ✅
- **Movimentação entre blocos**: Interface para reorganização ✅

## Sistema de Pop-ups e Modais

### Comportamento Implementado dos Pop-ups:

#### 1. **Foco Exclusivo**
- Quando uma telinha (pop-up) está aberta, ela tem foco exclusivo
- Outros elementos do modal ficam em segundo plano

#### 2. **Fechamento Inteligente**
- **Clicar fora da telinha**: Fecha apenas a telinha, mantém modal aberto
- **Concluir ação**: Fecha a telinha automaticamente após salvar/aplicar
- **Clicar fora do modal**: Fecha modal apenas se nenhuma telinha estiver aberta

#### 3. **Proteção do Modal**
- Se há pop-up aberto, cliques fora do modal não fecham o modal
- Modal só fecha se não há pop-ups ativos

#### 4. **Implementação Técnica**
```typescript
// Controle de pop-ups abertos
const anyPopupOpen = showEtiquetaPopup || showDataPopup || showCapaPopup || showChecklistPopup || showMoverPopup;

// Função para fechar apenas pop-ups
const closeAllPopups = () => {
  setShowEtiquetaPopup(false);
  setShowDataPopup(false);
  // ... outros pop-ups
};

// Event listener para cliques fora
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // Se clicou dentro do modal, não faz nada
    if (modalRef.current.contains(target)) return;
    
    // Se há pop-up aberto, fecha apenas os pop-ups
    if (anyPopupOpen) {
      closeAllPopups();
      return;
    }
    
    // Se não há pop-ups, fecha o modal
    onClose();
  };
}, [anyPopupOpen]);
```

## Status de Implementação

### ✅ FASE 3 - PARTE 1 COMPLETAMENTE FINALIZADA (100%)
- Todos os modais básicos implementados
- Sistema de anexos funcionando
- Markdown suportado
- Arquitetura base estabelecida

### ✅ FASE 3 - PARTE 2 QUASE FINALIZADA (90%)

#### Funcionalidades Implementadas:
1. **CardDialog.tsx Completo**:
   - ✅ Pop-ups da barra lateral (Etiquetas, Checklist, Datas, Capa, Mover)
   - ✅ Comportamento correto de pop-ups com foco exclusivo
   - ✅ Sistema de capas (cores e imagens) 
   - ✅ Exibição de capas na área de trabalho
   - ✅ Sistema de checklist integrado
   - ✅ Salvamento de todas as funcionalidades

2. **SpreadsheetDialog.tsx Parcial**:
   - ✅ Modal básico funcionando
   - ✅ Capas implementadas na área de trabalho
   - ⏳ Barra lateral com pop-ups (pendente)
   - ⏳ Comportamento de pop-ups (pendente)

3. **Sistema de Notificações**:
   - ✅ Sino no cabeçalho
   - ⏳ Notificações funcionais (pendente)

#### Próximas Implementações (10% restante):
1. **SpreadsheetDialog Melhorias**: Aplicar mesmas funcionalidades do CardDialog
2. **Sistema de Notificações**: Implementar exibição e interação

### 📊 Progresso Geral da Fase 3:
- **Parte 1**: 100% ✅
- **Parte 2**: 90% 🚀
- **Estimativa para conclusão**: 1 sessão adicional

### 🎯 Qualidade da Implementação:
- **Comportamento de UI**: Consistente e intuitivo
- **Performance**: Otimizada com hooks adequados
- **Responsividade**: Garantida em todos os componentes
- **Manutenibilidade**: Código modular e bem estruturado

## Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **TailwindCSS** para estilização
- **Shadcn/UI** para componentes base
- **React Markdown** para renderização
- **Lucide React** para ícones
- **Sonner** para notificações toast

### Gerenciamento de Estado
- **Context API** (CalendarioContext)
- **useState** e **useEffect** para estado local
- **Custom Hooks** para lógica reutilizável

### Arquitetura
- **Componentes funcionais** com hooks
- **Props drilling** minimizado com context
- **Separação de responsabilidades** clara
- **Componentização** granular

## Padrões de Desenvolvimento

### 1. **Estrutura de Arquivos**
```
src/
├── components/
│   ├── dialogs/
│   │   ├── BaseDialog.tsx
│   │   ├── CardDialog.tsx
│   │   ├── SpreadsheetDialog.tsx
│   │   └── popups/
│   │       ├── EtiquetaPopup.tsx
│   │       ├── ChecklistPopup.tsx
│   │       ├── DataPopup.tsx
│   │       ├── CapaPopup.tsx
│   │       └── MoverPopup.tsx
│   └── workspace/
│       ├── CardItem.tsx
│       └── SpreadsheetItem.tsx
├── contexts/
│   └── CalendarioContext.tsx
└── types/
    └── calendario.ts
```

### 2. **Convenções de Nomenclatura**
- **Componentes**: PascalCase (ex: `CardDialog`)
- **Hooks**: camelCase com prefixo `use` (ex: `useCalendario`)
- **Interfaces**: PascalCase (ex: `Card`, `Spreadsheet`)
- **Estados**: camelCase (ex: `showEtiquetaPopup`)

### 3. **Gerenciamento de Estado**
- **Estado local**: `useState` para UI temporária
- **Estado global**: Context para dados persistentes
- **Estado de pop-ups**: Controle local com propagação para pai

### 4. **Tratamento de Eventos**
- **Handlers específicos**: Uma função por ação
- **Propagação controlada**: `stopPropagation` onde necessário
- **Cleanup**: `useEffect` com cleanup functions

**🎉 A Fase 3 representa um marco importante no desenvolvimento, estabelecendo uma base sólida para funcionalidades avançadas!**
