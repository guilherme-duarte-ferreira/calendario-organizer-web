
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


---

# Documentação do Sistema de Modais e Pop-ups - Projeto Calendário

Este documento descreve a arquitetura e o fluxo de funcionamento dos modais de edição (ex: `CardDialog.tsx`) e seus sub-pop-ups, com ênfase nas soluções implementadas para controle de visibilidade, posicionamento e interatividade.

## 1. Arquitetura Geral

### 1.1. Componentes de Base

* **`BaseDialog.tsx`**:
    * Fornece a estrutura visual padrão para os modais principais do sistema.
    * Inclui seções como cabeçalho (com título, "botão variável" de localização e botões de ação como fechar/maximizar), área de conteúdo principal, uma barra lateral opcional e um rodapé com botões de ação (salvar, cancelar, etc.).
    * O "botão variável" no cabeçalho (identificado por `data-testid="location-trigger-button"`) exibe o nome do bloco atual do item sendo editado (prop `location`) e aciona a função `onLocationClick` quando clicado.

* **`Popover` (shadcn/ui)**:
    * Utilizado como o componente fundamental para todos os pop-ups de ação dentro dos modais (ex: Etiquetas, Datas, Mover).
    * A suíte de componentes inclui `Popover` (raiz), `PopoverTrigger` (gatilho), `PopoverContent` (conteúdo do pop-up) e `PopoverClose` (para fechar).

### 1.2. Gerenciamento Centralizado de Pop-ups (`CardDialog.tsx`)

O componente `CardDialog.tsx` é o principal orquestrador da lógica dos pop-ups aninhados.

* **Estado `activePopup: string | null`**:
    * Um estado central que armazena uma string identificadora única para o pop-up que deve estar visível no momento (ex: `'etiquetas'`, `'moverAction'`, `'moverHeader'`).
    * Seu valor é `null` quando nenhum pop-up aninhado está ativo.
    * [cite_start]A prop `open` de cada componente `<Popover>` (que envolve um pop-up de ação) é vinculada a uma condição como `activePopup === 'suaChaveUnica'`. 

* [cite_start]**Estado `lastFocusedTriggerElement: HTMLElement | null`**: 
    * Armazena o elemento DOM que acionou a abertura do último pop-up.
    * **Utilidades Principais**:
        1.  **Restauração de Foco**: Ao fechar um pop-up, o foco é devolvido a este elemento.
        2.  **Ancoragem para Posicionamento**: Para pop-ups abertos programaticamente (como o `MoverPopup` do cabeçalho), este elemento serve como referência para calcular a posição do `PopoverContent`.

* **Funções de Controle de Pop-up**:
    * `openPopup(popupName: string, triggerElement?: HTMLElement)`:
        * Define `activePopup = popupName`.
        * Atualiza `lastFocusedTriggerElement` com o `triggerElement` fornecido (ou o elemento atualmente focado se `triggerElement` não for passado).
    * `closeActivePopup()`:
        * Define `activePopup = null`.
        * Tenta restaurar o foco para o `lastFocusedTriggerElement`.

* **Hierarquia de Fechamento e Interações Externas**:
    * **Tecla "Escape"**: Se um pop-up estiver ativo (`activePopup !== null`), a tecla "Escape" primeiramente chama `closeActivePopup()` para fechar o pop-up aninhado. Se nenhum pop-up aninhado estiver ativo, o `Dialog` raiz (em `BaseDialog.tsx`) lida com o fechamento do modal principal.
    * **Clique Fora do Pop-up (`onOpenChange` do `Popover`)**: Cada `<Popover>` usa sua prop `onOpenChange` para detectar interações que devem fechar o pop-up (como clique fora do `PopoverContent`). [cite_start]Essa função geralmente chama `closeActivePopup()` ou `openPopup()` (com a chave do pop-up se for para abrir, ou `null` para fechar via `closeActivePopup`). 
    * **Clique Fora do Modal (`onInteractOutside` do `BaseDialog`)**: A prop `onInteractOutside` do `BaseDialog.tsx` é conectada a `handleDialogInteractOutside` em `CardDialog.tsx`. Esta função verifica se um pop-up aninhado está ativo e, se o clique foi realmente fora de tudo (incluindo o pop-up ativo e seu trigger), fecha o pop-up ativo, prevenindo o fechamento do modal principal.

## 2. Implementação de Pop-ups Específicos

### 2.1. Pop-ups da Barra Lateral de Ações (Ex: Etiquetas, Mover da Barra Lateral)

* **Estrutura Típica (`CardDialog.tsx` - `sidebarContent`)**:
    * Cada botão na barra lateral que aciona um pop-up é o `PopoverTrigger` de seu respectivo `Popover`.
    * `onClick` no `PopoverTrigger` chama `openPopup('chaveDoPopupDaSidebar', event.currentTarget)`.
    * O `PopoverContent` contém o conteúdo específico do pop-up (ex: `EtiquetaPopupContent.tsx`, `MoverPopup.tsx`).
* **Posicionamento**: As props `align` (ex: `"start"`), `side` (ex: `"right"`), e `sideOffset` do `PopoverContent` são usadas para posicioná-lo adequadamente em relação ao botão da barra lateral.
* **Comportamento de Fechamento Pós-Ação**:
    * **`CapaPopup.tsx`**: Ações como definir uma capa ou cor **não** fecham o pop-up automaticamente. O fechamento é explícito (botão "X" ou clique fora).
    * **`DataPopupContent.tsx`**: Similar ao `CapaPopup`, definir uma data **não** fecha o pop-up automaticamente.
    * **Outros (Ex: `EtiquetaPopupContent`, `ChecklistPopup`, `MoverPopup`)**: Podem fechar após uma ação principal se `closeActivePopup()` for chamado em seus respectivos handlers em `CardDialog.tsx`.

### 2.2. Pop-up "Mover" Acionado pelo Cabeçalho do Modal (`moverHeader`)

Este pop-up permite mover o item atual clicando no "botão variável" (ex: "No bloco A Fazer") no cabeçalho do modal.

* **Fluxo de Abertura Direto (Simplificado)**:
    1.  O usuário clica no "botão variável" (`data-testid="location-trigger-button"`) no `BaseDialog.tsx`.
    2.  A prop `onLocationClick` do `BaseDialog` (que é `handleLocationClick` em `CardDialog.tsx`) é acionada.
    3.  [cite_start]`handleLocationClick` chama `openPopup('moverHeader', triggerBtn)`, onde `triggerBtn` é o elemento DOM do "botão variável". 
    4.  Isso define `activePopup = 'moverHeader'` e armazena `triggerBtn` em `lastFocusedTriggerElement`.
    5.  O `<Popover open={activePopup === 'moverHeader'} ...>` em `CardDialog.tsx` se torna visível, renderizando o `MoverPopup.tsx`.
    6.  O componente `LocalizacaoCartao.tsx` não é mais usado como intermediário neste fluxo específico, simplificando a interação.

* **Posicionamento Dinâmico (Abaixo do "Botão Variável")**:
    * Devido ao `PopoverTrigger` para o `moverHeader` em `CardDialog.tsx` ser um elemento "dummy" (invisível), o posicionamento automático via props `side` e `align` do `PopoverContent` não se refere diretamente ao "botão variável" clicado.
    * **Solução Implementada**: Um `useEffect` em `CardDialog.tsx` monitora as mudanças em `activePopup` e `lastFocusedTriggerElement`.
        * Quando `activePopup` é `'moverHeader'` e `lastFocusedTriggerElement` (o "botão variável") está definido, o `useEffect` calcula as coordenadas `top` e `left` usando `lastFocusedTriggerElement.getBoundingClientRect()`.
        * A rolagem da página (`window.scrollY`) é considerada no cálculo de `top`.
        * Um pequeno `offset` (ex: 5px) é adicionado para posicionar o pop-up ligeiramente abaixo do botão.
        * Essas coordenadas são aplicadas ao `PopoverContent` do `moverHeader` através de um estado `moverHeaderPopoverStyle` e da prop `style`.
        * `position: 'fixed'` é usado no estilo, pois o `PopoverContent` é geralmente renderizado em um portal no `document.body`.
    * Para garantir que o estilo seja aplicado com as coordenadas mais recentes no momento exato da abertura, a lógica de cálculo de estilo também é invocada no `onOpenChange` do `Popover` quando ele está abrindo.

* **Funcionalidade**: O pop-up reutiliza o mesmo componente `MoverPopup.tsx` que é usado pela barra lateral, mantendo a mesma lógica interna de seleção e a chamada para `handleMoveCard` para executar a movimentação.

### 3. Considerações de UI/UX e Manutenibilidade

* [cite_start]**Foco**: O estado `lastFocusedTriggerElement`  ajuda a restaurar o foco para o elemento correto após o fechamento de um pop-up. A prop `onOpenAutoFocus={(e) => e.preventDefault()}` é usada em `PopoverContent` (especialmente aqueles abertos programaticamente) para evitar que o pop-up roube o foco de forma indesejada ao abrir.
* **Comentários no Código**: Comentários foram adicionados (ou estão sendo adicionados) para explicar seções chave, o propósito dos componentes, a lógica de estado e os fluxos de interação, visando facilitar a manutenção e o entendimento por outros desenvolvedores ou IAs.

Este sistema de gerenciamento de pop-ups visa fornecer uma base sólida para interações complexas dentro dos modais, mantendo a consistência e a usabilidade.

