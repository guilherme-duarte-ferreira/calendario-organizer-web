
# Documentação da Fase 3 - Sistema Calendário

## Visão Geral

A Fase 3 do Sistema Calendário foca na implementação avançada de cartões e planilhas, introduzindo modais de edição sofisticados (`CardDialog.tsx` e `SpreadsheetDialog.tsx`) com funcionalidades estilo Excel, suporte completo a Markdown, sistema de anexos e arquitetura baseada em componentes reutilizáveis.

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

## Comportamento de Pop-ups e Modais

### Controle de Foco Exclusivo
Quando uma telinha (pop-up) está aberta no modal:

1. **Foco Exclusivo**: A telinha tem prioridade sobre todas as interações
2. **Clique fora da telinha**: Fecha apenas a telinha, mantendo o modal aberto
3. **Ações na telinha**: Botões como "Adicionar", "Salvar" fecham a telinha e retornam foco ao modal
4. **Clique fora do modal**: 
   - Se nenhuma telinha estiver aberta: fecha o modal
   - Se uma telinha estiver aberta: fecha apenas a telinha

### Implementação Técnica
- Sistema de estado `activePopup` para controlar qual pop-up está ativo
- Função `closeActivePopup()` para fechar apenas a telinha atual
- Função `handleModalClose()` que verifica se há pop-up ativo antes de fechar o modal
- Uso de `stopPropagation()` em botões para evitar fechamento acidental

## Status de Implementação

**Fase 3 - Parte 2**: 90% concluída

### ✅ CONCLUÍDO

#### Modal de Edição de Cartões (`CardDialog.tsx`):
- ✅ Modal dinâmico que cresce conforme o conteúdo
- ✅ Rolagem na tela principal (não no modal)
- ✅ Barra lateral integrada ao modal
- ✅ Capa no cabeçalho do modal (cores e imagens)
- ✅ Campo de descrição expandido (200px mínimo)
- ✅ Popups que ultrapassam limites do modal
- ✅ Botão "No bloco [nome]" clicável para localização
- ✅ Seção de atividades com "Mostrar/Ocultar Detalhes"
- ✅ Comentários com hover para editar/excluir
- ✅ Sistema de controle de foco para pop-ups

#### Funcionalidades de Barra Lateral:
- ✅ Popup de Etiquetas (busca, criação, aplicação)
- ✅ Popup de Datas (início, entrega, lembrete)
- ✅ Popup de Capa (cores predefinidas, personalizadas, remoção)
- ✅ Popup de Mover (quadro, bloco, posição)
- ✅ Localização do cartão implementada
- ✅ Comportamento correto de fechamento dos pop-ups

#### Sistema de Notificações:
- ✅ Sino movido para cabeçalho principal
- ✅ Notificações com badge de quantidade
- ✅ Notificações destacadas até serem lidas
- ✅ Clique abre contexto (modal do cartão)

#### Capas:
- ✅ Capa no cabeçalho do modal
- ✅ Capa nos cartões da área de trabalho
- ✅ Suporte a cores e imagens
- ✅ Cores predefinidas e personalizadas

#### Checklist:
- ✅ Popup reformulado para criação de checklists
- ✅ Campo de texto com botão "Adicionar" e Enter
- ✅ Visão geral com porcentagens e contagem
- ✅ Lista de checklists existentes com exclusão
- ✅ Fechamento da telinha ao clicar fora
- ✅ Exibição de checklists no modal principal
- ✅ Adição de itens com botão "Adicionar Item"
- ✅ Menu de contexto nos itens (Excluir)
- ✅ Barra de progresso individual por checklist

### 🔄 EM ANDAMENTO (10% restante)

#### Modal de Planilhas - Pendente:
- ⏳ Aplicar sistema de controle de foco dos pop-ups
- ⏳ Barra lateral idêntica ao CardDialog
- ⏳ Capas em planilhas (já implementado no SpreadsheetItem)

#### Refinamentos Finais:
- ⏳ Sistema de notificações avançado
- ⏳ Comentários com Markdown
- ⏳ Reordenação via arrastar e soltar

---

## Cronograma Estimado
- **Fase 3 Parte 2**: 90% concluída
- **Restante da Fase 3**: 1 sessão de trabalho
- **Início Fase 4**: Próxima semana

### FEEDBACK DO USUÁRIO IMPLEMENTADO:
✅ Modal dinâmico sem rolagem interna
✅ Popups ultrapassam limites do modal
✅ Capa no cabeçalho e cartões
✅ Sino no cabeçalho principal
✅ Barra lateral integrada
✅ Localização do cartão clicável
✅ Checklist popup reformulado
✅ Sistema de controle de foco correto para pop-ups
✅ Checklist completo no modal principal

O projeto está na reta final da Fase 3 com todas as funcionalidades principais implementadas e funcionando corretamente!
