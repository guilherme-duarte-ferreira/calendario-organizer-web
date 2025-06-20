## I. PARA RESOLVER/FINALIZAR AGORA (Refinamento Final da Fase 3)

### A. Modal de Edição (`CardDialog.tsx` e `SpreadsheetDialog.tsx`)

1.  **Hierarquia de Fechamento de Pop-ups (Prioridade Alta):**
    * [x] **Problema Principal:** O clique fora da área de um pop-up específico (Etiquetas, Checklist, Datas, Mover, Capa, etc.) ou em áreas inesperadas do modal NÃO está fechando APENAS o pop-up ativo de forma consistente.
    * [x] **Requisito:** Garantir que, quando um pop-up estiver aberto SOBRE um modal (`CardDialog` ou `SpreadsheetDialog`):
        * [x] Um clique em **qualquer área visível do modal principal** que esteja FORA do conteúdo do pop-up ativo deve fechar APENAS o pop-up ativo (o modal principal permanece aberto).
        * [x] Um clique TOTALMENTE FORA do modal de edição (por exemplo, na área de trabalho) deve fechar APENAS o pop-up ativo, mantendo o modal de edição aberto.
        * [x] O clique no botão "X" (ou equivalente de fechamento) DENTRO do pop-up deve fechar APENAS o pop-up.
        * [x] A tecla "Escape" deve fechar APENAS o pop-up ativo. Se nenhum pop-up estiver ativo, "Escape" deve fechar o modal principal.
        * [x] Assegurar que o foco retorne corretamente ao elemento apropriado no modal de edição após fechar um pop-up.
        * [x] Verificar consistência deste comportamento para TODOS os pop-ups de ação da barra lateral.

    * [+] **Funcionalidade Adicional:** Implementação de `data-popup` para identificação precisa dos pop-ups ativos.
        * [x] Adicionado atributo `data-popup` em todos os pop-ups (Etiquetas, Checklist, Datas, Mover, Capa)
        * [x] Z-index consistente (`z-[9999]`) em todos os pop-ups
        * [x] Sistema de identificação unificado para controle de fechamento

    * [+] **Funcionalidade Adicional:** Sistema de gerenciamento de foco com `lastFocusedElement` para melhor acessibilidade.
        * [x] Implementado em `CardDialog.tsx` e `SpreadsheetDialog.tsx`
        * [x] Salva o último elemento focado antes de abrir um pop-up
        * [x] Restaura o foco corretamente após fechar o pop-up
        * [x] Tratamento de casos especiais (elemento removido do DOM)

2.  **Botão "X" de Fechamento do Modal (Consistência e Funcionalidade):**
    * [x] Garantir que haja APENAS UM botão "X" funcional e visível para fechar o modal de edição (`CardDialog` e `SpreadsheetDialog`), posicionado no canto superior direito.
    * [x] Remover quaisquer botões "X" duplicados, mal posicionados ou não funcionais.

3.  **Maximização do Modal (`CardDialog` e `SpreadsheetDialog`):**
    * [x] **Problema:** Botão "Maximizar/Restaurar" não está funcional ou não implementado corretamente.
    * [x] Implementar a funcionalidade para que o modal ocupe toda a tela ao maximizar (ocultando a área de trabalho) e retorne ao tamanho normal ao restaurar.
    * [x] Garantir que o modal maximizado utilize uma barra de rolagem INTERNA para seu conteúdo, caso ele exceda a altura da viewport.
    * [x] Assegurar que as opções de fechamento ("X", "Cancelar", "Salvar") permaneçam funcionais e visíveis no modo maximizado.

4.  **Barra de Rolagem da PÁGINA para Modal Extenso (Layout):**
    * [x] **Problema:** Quando o conteúdo do modal de edição (não maximizado) ultrapassa a altura da viewport, a PÁGINA principal (área de trabalho) não apresenta barra de rolagem, cortando parte do modal.

5.  **Pop-up "No bloco X" (Cabeçalho dos Modais):**
    * [x] Corrigir o posicionamento do pop-up de "Mover" (referência HTML 4) que é acionado ao clicar no texto "No bloco [nome do bloco]". Ele deve aparecer corretamente sobreposto ao modal, e não de forma desalinhada ou abaixo dele.
----------------------------------------------------------------------------------------------
6. **Editor de Texto (TipTap) - Campo de Descrição e Outros:**
   Documento de Especificação Técnica e Plano de Implementação: Editor de Texto Rico (TipTap)  
   Versão: 2.0  
   Data: 06 de junho de 2025  
   Autor: Inteligência Artificial (Assistente Gemini)

   6.1 **Visão Geral e Objetivos**  
   O objetivo desta implementação é substituir o componente `<textarea>` existente nos modais de edição (CardDialog.tsx e SpreadsheetDialog.tsx) por um editor de texto rico, WYSIWYG ("What You See Is What You Get"), utilizando a biblioteca TipTap.

   A nova implementação deve replicar fielmente a aparência e o comportamento do protótipo "Editor de Propostas", focando em uma experiência de usuário fluida que alterna entre um modo de visualização limpo e um modo de edição completo.

   6.2 **Arquitetura da Solução**  
   Para garantir modularidade, manutenibilidade e reutilização de código, a solução será arquitetada da seguinte forma:

   - **Componente Encapsulado (TipTapEditor.tsx):** Toda a lógica do editor, incluindo a inicialização do TipTap, gerenciamento de estado de edição (visualização/edição) e a renderização da barra de ferramentas e ações, será contida em um único componente reutilizável.
   - **Integração Simples:** O CardDialog.tsx (e posteriormente o SpreadsheetDialog.tsx) irá importar e renderizar o componente TipTapEditor.tsx, passando o conteúdo atual da descrição e recebendo o novo conteúdo através de um callback (onChange). Isso manterá os modais limpos e focados em sua função principal.
   - **Gerenciamento de Estado:** O estado do conteúdo do editor será mantido dentro do CardDialog.tsx (a variável description). O TipTapEditor.tsx receberá esse estado como prop e usará sua própria gestão interna para a edição. Ao salvar, ele chamará a função updateItem do CalendarioContext para persistir os dados.

   6.3 **Componentes Principais a Serem Desenvolvidos**  
   - **TipTapEditor.tsx (src/components/ui/):** O componente principal que encapsula a lógica. Ele gerenciará a alternância entre os modos de visualização e edição.
   - **Toolbar.tsx (src/components/ui/):** Componente que renderiza a barra de ferramentas de formatação. Receberá a instância do editor TipTap como prop para interagir com o conteúdo.
   - **Actionbar.tsx (src/components/ui/):** Componente para o rodapé do editor no modo de edição, contendo os botões "Salvar", "Cancelar" e "Copiar".

   **Novo Checklist e Plano de Implementação Detalhado**  
   Esta seção substitui o item 6 da "lista antiga".

   **Fase 1: Fundação do Editor e Integração Inicial**  
   Objetivo: Ter um editor funcional dentro do CardDialog que alterna entre visualização e edição, com uma barra de ferramentas básica e ações de salvar/cancelar.

   - [x] 6.1.1. Instalação de Dependências:
   - [x] Adicionar `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit` e outras extensões necessárias (Underline, TextAlign, TextStyle, Color, FontFamily) ao package.json.
   - [x] 6.1.2. Criação do Componente TipTapEditor.tsx:
   - [x] Criar o arquivo `src/components/ui/TipTapEditor.tsx`.
   - [x] Implementar a lógica de estado para `isEditing`.
   - [x] Renderizar condicionalmente a área de visualização (`dangerouslySetInnerHTML`) ou o contêiner do editor (`<EditorContent />`).
   - [x] Adicionar um evento `onClick` na área de visualização para ativar o modo de edição.
   - [x] 6.1.3. Criação da Barra de Ferramentas (Toolbar.tsx):
   - [x] Criar o arquivo `src/components/ui/Toolbar.tsx`.
   - [x] Implementar botões básicos (Negrito, Itálico, Riscado) usando o componente `<Toggle>` do ShadCN para refletir o estado `isActive` do editor.
   - [x] 6.1.4. Criação da Barra de Ações (Actionbar.tsx):
   - [x] Criar o arquivo `src/components/ui/Actionbar.tsx`.
   - [x] Implementar os botões "Salvar" e "Cancelar".
   - [x] Passar as funções `onSave` e `onCancel` como props.
   - [x] 6.1.5. Integração no CardDialog.tsx:
   - [x] Substituir o `<textarea>` e a barra de ferramentas antiga pelo novo componente `<TipTapEditor />`.
   - [x] Conectar o estado `description` do CardDialog ao editor.
   - [x] Implementar as funções `handleSaveDescription` e `handleCancelDescription` para interagir com o TipTapEditor.

   **Fase 6.2: Barra de Ferramentas Avançada e Estilização**  
   Objetivo: Expandir a barra de ferramentas para incluir todas as funcionalidades do protótipo e aplicar o estilo visual desejado.

   - [x] 6.2.1. Aprimorar Toolbar.tsx:
   - [x] Adicionar um seletor (`<Select>`) para Família de Fonte.
   - [x] Adicionar um seletor (`<Select>`) para Tamanho de Fonte.
   - [x] Adicionar um seletor de cor (`<input type="color">`) para a cor do texto.
   - [x] Adicionar botões para alinhamento de texto (Esquerda, Centro, Direita).
   - [x] Adicionar botões para listas e citações (blockquote).
   - [x] Implementar divisórias (`<Separator />`) para organizar a barra.
   - [x] 6.2.2. Estilização do Editor e Conteúdo:
   - [x] Utilizar classes do Tailwind (`prose`) no TipTapEditor.tsx para estilizar o conteúdo renderizado (cabeçalhos, parágrafos, listas) conforme o protótipo.
   - [x] Implementar o placeholder dinâmico, visível apenas quando o editor está vazio.
   - [x] Estilizar o contêiner do editor para que a borda mude de cor quando ele estiver em foco, replicando o efeito de `focus-within`.

**Fase 6.2.3: Simplificação do Editor e Preparação para o Módulo de Imagem Avançado**

### 1. Remoção de Funcionalidades de Tabela
- [x] Remover dependências relacionadas a tabelas do `package.json`
- [x] Simplificar o `TipTapEditor.tsx` removendo extensões de tabela
- [x] Atualizar o `Toolbar.tsx` removendo botões de tabela
- [x] Executar `npm install` para atualizar dependências
- [x] Verificar se todas as funcionalidades de tabela foram removidas corretamente

### 2. Implementação do Módulo de Imagem Avançado
#### 2.1 Modal de Upload
- [x] Criar componente `ImageUploadDialog.tsx`
  - [x] Estrutura básica do modal
  - [x] Importações necessárias
  - [x] Props e tipos
  - [x] Lógica de upload
  - [x] Interface de usuário
  - [x] Feedback visual
  - [x] Tratamento de erros
  - [x] Validações
  - [x] Integração com o editor

#### 2.2 Extensão de Imagem Customizada
- [x] Criar componente `ResizableImageNode.tsx`
  - [x] Estrutura básica do componente
  - [x] Lógica de redimensionamento
  - [x] Handlers de eventos
  - [x] Estilização
  - [x] Integração com o editor
- [x] Criar extensão `CustomImage.ts`
  - [x] Configuração da extensão
  - [x] Integração com o ResizableImageNode
  - [x] Atributos customizados
  - [x] Comandos personalizados
- [x] Integrar extensão no TipTapEditor
  - [x] Importar extensão
  - [x] Configurar extensão
  - [x] Testar funcionalidades

#### 2.3 Funcionalidades de Imagem
- [x] Implementar redimensionamento de imagens
  - [x] Adicionar handles de redimensionamento
  - [x] Implementar lógica de redimensionamento
  - [x] Manter proporção da imagem
  - [x] Limites de tamanho
- [x] Implementar alinhamento de imagens
  - [x] Adicionar opções de alinhamento
  - [x] Implementar lógica de alinhamento
  - [x] Atualizar estilos
- [x] Implementar legendas
  - [x] Adicionar campo de legenda
  - [x] Implementar lógica de legendas
  - [x] Estilizar legendas
- [x] Implementar opções de imagem
  - [x] Adicionar menu de opções
  - [x] Implementar edição de atributos
  - [x] Implementar remoção de imagem
  - [x] Implementar substituição de imagem

### 3. Testes e Validação
- [ ] Testar upload de imagens
  - [ ] Testar diferentes formatos
  - [ ] Testar diferentes tamanhos
  - [ ] Testar limites de upload
- [ ] Testar redimensionamento
  - [ ] Testar diferentes proporções
  - [ ] Testar limites de tamanho
  - [ ] Testar responsividade
- [ ] Testar alinhamento
  - [ ] Testar todas as opções de alinhamento
  - [ ] Testar responsividade
- [ ] Testar legendas
  - [ ] Testar adição de legendas
  - [ ] Testar edição de legendas
  - [ ] Testar remoção de legendas
- [ ] Testar opções de imagem
  - [ ] Testar edição de atributos
  - [ ] Testar remoção de imagem
  - [ ] Testar substituição de imagem

### 4. Documentação
- [ ] Atualizar documentação do editor
  - [ ] Documentar novas funcionalidades
  - [ ] Atualizar exemplos
  - [ ] Adicionar screenshots
- [ ] Atualizar README
  - [ ] Documentar módulo de imagem
  - [ ] Atualizar instruções de uso
  - [ ] Adicionar exemplos

### 5. Limpeza e Otimização
- [ ] Remover código não utilizado
- [ ] Otimizar imports
- [ ] Verificar performance
- [ ] Aplicar boas práticas de código

**Fase 6.3: Funcionalidades Complexas e Finalização**  
Objetivo: Implementar os recursos mais avançados e garantir que a experiência do usuário seja coesa.

- [ ] 6.3.1. Funcionalidade de Cópia Avançada:
- [ ] No Actionbar.tsx, implementar o menu suspenso para o botão "Copiar".
- [ ] Adicionar a biblioteca turndown para converter HTML em Markdown.
- [ ] 6.3.2. Expansão de Conteúdo (Ver mais...):
- [ ] Implementar uma lógica no modo de visualização para truncar descrições longas e exibir um botão "Ver mais..." que expande o conteúdo.
----------------------------------------------------------------------------------------------
### B. Funcionalidades do `CardDialog.tsx` (Checklist, Comentários, Datas):

1.  **Sincronização e Funcionalidade do Checklist:**
    * [ ] **Problema:** Itens de checklist e novos checklists criados/modificados através do `ChecklistPopup.tsx` não estão refletindo imediata ou corretamente no `CardDialog.tsx`.
    * [ ] Garantir que a adição, exclusão, renomeação e marcação de itens/checklists no pop-up atualizem o estado e a exibição no modal principal instantaneamente.
    * [ ] Refinar (ou implementar se a versão básica da Lovable não estiver adequada) a funcionalidade de arrastar e soltar para reordenar itens DENTRO de uma checklist.
    * [ ] Refinar (ou implementar) a funcionalidade de arrastar e soltar para reordenar CHECKLISTS inteiros dentro do modal.
    * [ ] Implementar a funcionalidade de definir/editar "Data de Entrega" para itens individuais do checklist (acessível pelo botão "Data de Entrega" ao adicionar/editar item, ou pelo ícone de relógio ao passar o mouse).

2.  **Comentários:**
    * [ ] Implementar suporte completo a Markdown para formatação de comentários, utilizando `react-markdown` para renderização visual.
    * [ ] Implementar o menu de contexto (três pontinhos ao passar o mouse) em comentários, com opções funcionais de "Editar" e "Excluir".

3.  **Datas e Lembretes (Integração com Notificações):**
    * [ ] Integrar completamente as "Datas de Vencimento" e "Lembretes" (definidas no `DataPopup.tsx`) com o sistema de notificações (ícone de sino no `Header.tsx`) para gerar lembretes automáticos e visuais.

### C. `SpreadsheetDialog.tsx` (Paridade e Funcionalidades):

1.  **Paridade com `CardDialog.tsx`:**
    * [ ] Aplicar o mesmo sistema de controle de foco e comportamento de fechamento de pop-ups (hierarquia correta, incluindo o novo requisito de clique dentro do modal) que for implementado e corrigido no `CardDialog.tsx`.
    * [ ] Implementar a barra lateral de ações idêntica à do `CardDialog.tsx` (Etiquetas, Checklist, Datas, Mover, Capa, Anexo, etc.), incluindo a funcionalidade completa e o comportamento correto dos respectivos pop-ups.
    * [ ] Garantir que a seção de "Atividades e Comentários" seja idêntica à do `CardDialog.tsx`, incluindo suporte a Markdown e histórico.
    * [ ] Assegurar que a funcionalidade de Maximização seja idêntica.

### D. Geral (Ambos Modais):

1.  **Botão "Mover" (Pop-up de Mover):**
    * [ ] **Problema:** A lógica para efetivamente mover o cartão/planilha para o novo quadro/bloco/posição não está operacional.
    * [ ] Implementar a funcionalidade completa do botão "Mover" no pop-up, garantindo que o item seja de fato realocado na estrutura de dados e a UI reflita a mudança.
    * [ ] Exibir notificação no sino após a movimentação bem-sucedida.

## II. PARA TRATAR NA FASE 4 (Incluindo Regressões da Fase 2 e Itens Adiados/Planejados)

### A. Regressões da Fase 2 (Área de Trabalho - `WorkArea.tsx`, `BlockComponent.tsx`):

1.  **Rolagem da Área de Trabalho:**
    * [P4] **Problema:** A rolagem da área de trabalho (horizontal ou vertical, dependendo da configuração) está quebrada, especialmente quando os blocos crescem ou há muitos blocos, tornando o conteúdo e botões inferiores inacessíveis.
    * [P4] Corrigir para permitir rolagem fluida de toda a área de trabalho.

2.  **Funcionalidades dos Blocos:**
    * [P4] **Problema:** Ausência do menu de três pontinhos nos blocos.
    * [P4] Restaurar o menu de três pontinhos em cada `BlockComponent.tsx`, com suas opções planejadas (ex: "Inserir texto em Markdown", "Criar Tabela via Markdown", "Inserir Arquivo", "Arquivar Bloco", "Excluir Bloco").
    * [P4] **Problema:** Edição do nome do bloco não está funcionando como a "tela personalizada" que você mencionou (possivelmente um modo de edição inline ou um pop-up simples).
    * [P4] Restaurar/implementar a funcionalidade de edição do nome do bloco.

3.  **Botões de Ação nos Blocos:**
    * [P4] **Problema:** Aparência e quantidade de botões de ação abaixo dos blocos não estão conforme o desejado.
    * [P4] Ajustar para ter APENAS os botões "Adicionar Cartão" e "Adicionar Planilha" diretamente visíveis abaixo de cada bloco. Outras adições (Markdown, Arquivo) devem vir do menu de três pontinhos do bloco.
    * [P4] Garantir que esses botões não quebrem o layout do bloco e sejam sempre acessíveis.

4.  **Arrastar e Soltar Blocos:**
    * [P4] **Problema:** Funcionalidade de clicar e arrastar blocos para reorganização na área de trabalho está quebrada ou não funciona como esperado.
    * [P4] Corrigir/Reintegrar usando `@dnd-kit/core` e `@dnd-kit/sortable` para permitir a reordenação suave dos `BlockComponent`s dentro da `WorkArea.tsx`.

### B. Itens Adiados da Fase 3 (Funcionalidades Visuais sem Lógica Completa nos Modais):

1.  **Botão "Compartilhar":**
    * [P4] Implementar funcionalidade completa (atualmente apenas visual).
2.  **Botão "Arquivar" (Modal):**
    * [P4] Conectar com o sistema de arquivamento completo da Fase 4/5. A funcionalidade atual de marcar `card.archived = true` pode ser um placeholder.
3.  **Botão "Copiar":**
    * [P4] Implementar funcionalidade completa para duplicar cartões/planilhas.

### C. Itens Planejados para Fase 4 (Conforme Documentação Geral):
    * [P4] **Configurações Avançadas (Pop-up de Configurações - `SettingsDialog.tsx`):**
        * Implementar todas as abas e opções:
            * Aparência: Wallpaper (upload/cor), Tema (claro/escuro).
            * Área de Trabalho: "Orientação da Rolagem", "Tamanhos Padrão" (blocos, planilhas, cartões), "Ajuste Automático de Blocos à Planilha" (`blockFitToSpreadsheetSize`), "Ocultar Descrição dos Cartões" (`hideCardDescription`), "Alinhamento de Blocos".
            * Dados: "Edição de Planilhas" (direto/pop-up), "Exportar Dados" (JSON), "Importar Dados" (JSON), "Intervalo de Salvamento Automático".
    * [P4] **Área de Trabalho (Ajustes Dinâmicos):**
        * Implementar o ajuste dinâmico dos blocos com base no `blockFitToSpreadsheetSize`.
        * Implementar o ocultamento de descrições de cartões com base no `hideCardDescription`.
        * Implementar a rolagem vertical da área de trabalho com "prateleiras" horizontais para blocos.
    * [P4] **Arrastar Múltiplos Itens:**
        * Implementar seleção múltipla (Ctrl/Cmd + clique) e arrastar para mover/copiar blocos, cartões, planilhas.
    * [P4] **Papel de Parede por Quadro:**
        * Permitir que cada quadro tenha seu próprio wallpaper.
    * [P4] **Otimizações de Desempenho:**
        * Virtualização para planilhas grandes (`SpreadsheetItem.tsx`).
        * Lazy loading para quadros e conteúdos na `WorkArea.tsx`.
        * Compressão/otimização de imagens de wallpaper e anexos.
    * [P4] **Sistema de Arquivamento Completo:**
        * Implementar a seção "Arquivos" na barra lateral (`Sidebar.tsx`).
        * Funcionalidades de restaurar, excluir permanentemente e filtrar itens arquivados.
    * [P4] **Botão "Calendário" (Barra Lateral):**
        * Implementar a funcionalidade completa de exibir um calendário interativo na área de trabalho.
    * [P4] **Pesquisa Avançada (`Header.tsx`):**
        * Adicionar filtros avançados (por tipo de item, dentro de quadro específico, etc.).
    * [P4] **Tabelas via Markdown (Blocos):**
        * Implementar a opção "Criar Tabela via Markdown" no menu de três pontinhos do bloco, convertendo o Markdown em uma planilha editável.
    * [P4] **Histórico de Versões:**
        * Guardar as últimas 5 versões dos dados, com opção de reverter nas configurações.
    * [P4] **Documentação Interna do Sistema:**
        * Criar quadro "Documentação do Sistema" com cartão contendo árvore interativa de funções/componentes.
