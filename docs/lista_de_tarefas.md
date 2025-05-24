# Planejamento de Implementação do Sistema "Calendário" em 5 Fases

## Fase 1: Fundação do Sistema e Interface Principal

**Objetivo:** Estabelecer a estrutura base da aplicação, incluindo o layout principal, navegação essencial e as primeiras funcionalidades de criação de conteúdo.

**Detalhes da Implementação:**

1.  **Configuração Inicial do Projeto:**
    * Estruturar o frontend com HTML, CSS, JavaScript e TailwindCSS.
    * Definir a arquitetura básica do backend RESTful (a tecnologia específica pode ser escolhida, ex: Node.js, Python, Java), com endpoints iniciais para quadros (ex: `/api/boards`).
    * Implementar a função `generateId()` para IDs únicos.
    * Implementar a função `checkRequiredFields()` para validação.
    * Implementar a função básica `saveData()` para localStorage inicialmente, com estrutura para futura integração com backend.

2.  **Desenvolvimento do Cabeçalho (RF01 - Parcial):**
    * Exibir o nome "Calendário" com ícone de calendário à esquerda (RF01.1).
    * Implementar o botão "Criar Quadro" com ícone "+" e cor destacada. Funcionalidade: cria um novo quadro diretamente (RF01.2).
    * Garantir que não haja ícone de foto de perfil (RF01.4).

3.  **Desenvolvimento da Barra Lateral (RF02 - Parcial):**
    * Garantir que não haja seção de usuário (RF02.1).
    * Implementar o botão "Recolher Barra Lateral" com ícone de seta (esquerda/direita) no topo, abaixo do futuro botão "Calendário". Funcionalidade: recolher/expandir a barra lateral, ajustando a área de trabalho automaticamente (RF02.3).
    * Criar a estrutura da seção "Quadros" (RF02.5 - Parcial):
        * Listagem inicial de quadros (vazia ou com dados de exemplo).
        * Botão "+" para criar "Novo Quadro" (deve funcionar em conjunto com RF01.2).

4.  **Estrutura da Área de Trabalho (RF03 - Parcial):**
    * Definir a área principal onde os quadros e seus conteúdos serão exibidos.
    * Implementar a barra de scroll restrita à área de trabalho com ajuste dinâmico inicial (vertical/horizontal) (RF03.4).
    * Configurar a rolagem horizontal como padrão para a área de trabalho, permitindo que blocos cresçam horizontalmente e o espaço inicial seja adaptável à tela do cliente (mínimo: tamanho total da tela) (parte de RF03.4).

5.  **Sistema de Salvamento Inicial (RF06 - Parcial):**
    * Implementar o salvamento básico de dados dos quadros em formato JSON localmente (localStorage). Foco em salvar a estrutura dos quadros criados (RF06.1 - Parcial, salvando todos os dados em um único JSON por enquanto ou estrutura para múltiplos arquivos).
    * Implementar a validação básica do JSON ao carregar (RF06.2 - Parcial).

6.  **Interface Responsiva Inicial (RNF08 - Parcial):**
    * Aplicar TailwindCSS para garantir que a estrutura básica (cabeçalho, barra lateral, área de trabalho) seja responsiva desde o início (RNF08.1).
—------
## Fase 1: Fundação do Sistema e Interface Principal

**Objetivo:** Estabelecer a estrutura base da aplicação, incluindo o layout principal, navegação essencial e as primeiras funcionalidades de criação de conteúdo.

- [ ] **Configuração Inicial do Projeto:**
  - [ ] Estruturar o frontend com HTML, CSS, JavaScript.
  - [ ] Integrar TailwindCSS ao projeto frontend.
  - [ ] Definir a arquitetura básica do backend RESTful (tecnologia livre, ex: Node.js, Python, Java).
  - [ ] Configurar endpoints iniciais do backend para quadros (ex: `/api/boards`).
  - [ ] Implementar função de utilidade `generateId()` para IDs únicos.
  - [ ] Implementar função de utilidade `checkRequiredFields()` para validação de campos.
  - [ ] Implementar função de utilidade básica `saveData()` para localStorage (com estrutura para futura integração com backend).
- [ ] **RF01: Cabeçalho (Parcial):**
  - [ ] 1.1. Exibir o nome "Calendário" com ícone de calendário à esquerda.
  - [ ] 1.2. Implementar visualmente o Botão "Criar Quadro" com ícone "+" e cor destacada (ex.: azul).
  - [ ] 1.4. Não exibir ícone de foto de perfil (sem suporte a usuários).
- [ ] **RF02: Barra Lateral (Parcial):**
  - [ ] 2.1. Não incluir seção de usuário (sem ícone ou letra "G").
  - [ ] 2.3. Botão "Recolher Barra Lateral" com ícone de seta:
    - [ ] Localizado no topo da barra lateral, abaixo do (futuro) botão "Calendário".
    - [ ] Funcionalidade: Recolhe a barra lateral, exibindo apenas os ícones dos botões.
    - [ ] Funcionalidade: Clicar novamente expande a barra lateral, restaurando a visualização completa.
    - [ ] Funcionalidade: Área de trabalho se ajusta automaticamente ao recolher/expandir.
  - [ ] 2.5. Seção "Quadros" (Estrutura Inicial):
    - [ ] Implementar a listagem inicial de quadros (pode estar vazia ou com dados de exemplo).
    - [ ] Implementar visualmente o botão "+" para criar "Novo Quadro" na seção "Quadros".
- [ ] **RF03: Área de Trabalho (Parcial):**
  - [ ] 3.4. Barra de scroll:
    - [ ] Restrita à área de trabalho.
    - [ ] Ajuste dinâmico inicial (horizontal/vertical).
    - [ ] **Rolagem Horizontal (padrão)**:
      - [ ] Área de trabalho rola horizontalmente (estilo Trello).
      - [ ] Blocos devem ter espaço suficiente para crescer horizontalmente.
      - [ ] Espaço inicial da área de trabalho adaptável à tela do cliente (mínimo: tamanho total da tela).
- [ ] **RF06: Salvamento (Parcial):**
  - [ ] 6.1. Salvar dados básicos dos quadros em JSON (inicialmente em um único arquivo JSON via localStorage).
  - [ ] 6.2. Implementar validação básica do JSON ao carregar os dados.
- [ ] **RNF08: Interface Responsiva e Intuitiva (Parcial):**
  - [ ] 8.1. Aplicar TailwindCSS para garantir que a estrutura básica do layout (cabeçalho, barra lateral, área de trabalho) seja responsiva.

—-------


## Fase 2: Gerenciamento de Quadros, Pastas e Blocos

**Objetivo:** Implementar funcionalidades completas para criação, organização e manipulação de quadros, pastas e blocos, que são os contêineres principais de conteúdo.

**Detalhes da Implementação:**

1.  **Funcionalidades Avançadas da Seção "Quadros" na Barra Lateral (RF02.5 Completo):**
    * Implementar hover funcional para cada quadro na lista.
    * Adicionar ícone de três pontos para cada quadro com opções: "Renomear", "Arquivar", "Deletar".
    * Implementar sistema de Pastas para organizar quadros:
        * Criar, renomear, arquivar, deletar pastas.
        * Funcionalidade de arrastar quadros/pastas para reordenar ou mover entre pastas.
        * Visualização em árvore (expandir/recolher) para pastas.
        * Opção de "Fixar" quadros/pastas no topo (com personalização de cores/ícones).

2.  **Gerenciamento de Blocos na Área de Trabalho (RF03.1 Completo):**
    * Permitir adicionar/editar/remover blocos com nome personalizável dentro de um quadro.
    * Implementar funcionalidade de arrastar e soltar para reorganização de blocos dentro da área de trabalho do quadro.
    * Adicionar os três botões abaixo de cada bloco: "Inserir Arquivo", "Criar Cartão Novo", "Criar Planilha" (inicialmente apenas os botões, a funcionalidade completa virá nas próximas fases).
    * Adicionar opção nos três pontinhos do bloco para "Inserir texto em Markdown" (a renderização virá depois).

3.  **Interação e Feedback Visual (RF03 - Parcial):**
    * Implementar prévia visual (sombra/contorno) ao arrastar blocos (RF03.6 - Parcial, focado em blocos).

4.  **Sistema de Salvamento (RF06 - Parcial):**
    * Expandir o sistema de salvamento para incluir dados de pastas e blocos.
    * Implementar o requisito de salvar cada quadro em um arquivo JSON separado (RF06.1 - Completo para esta parte).

5.  **Interface Responsiva (RNF08 - Parcial):**
    * Garantir que as novas funcionalidades de quadros, pastas e blocos sejam responsivas.

—--------------

## Fase 2: Gerenciamento de Quadros, Pastas e Blocos

**Objetivo:** Implementar funcionalidades completas para criação, organização e manipulação de quadros, pastas e blocos.

- [ ] **RF01: Cabeçalho (Funcionalidade):**
  - [ ] 1.2. Funcionalidade completa do Botão "Criar Quadro": cria um novo quadro diretamente, sem opções intermediárias, e o adiciona à lista.
- [ ] **RF02: Barra Lateral (Seção "Quadros" Completa):**
  - [ ] 2.5. Seção "Quadros":
    - [ ] Funcionalidade completa do botão "+" para "Novo Quadro" (adiciona à lista e salva).
    - [ ] Cada quadro na lista deve ter:
      - [ ] Hover funcional (feedback visual ao passar o mouse).
      - [ ] Ícone de três pontos com opções iniciais: "Renomear", "Deletar" (Arquivar e Mover para pasta virão depois).
      - [ ] Funcionalidade de Renomear quadro.
      - [ ] Funcionalidade de Deletar quadro (com confirmação).
    - [ ] Pastas para organizar quadros:
      - [ ] Funcionalidade para Criar nova pasta.
      - [ ] Funcionalidade para Renomear pasta.
      - [ ] Funcionalidade para Deletar pasta (com confirmação, e tratamento de quadros dentro).
      - [ ] Funcionalidade básica de Arrastar quadros/pastas para reordenar ou mover quadros para dentro/fora de pastas.
      - [ ] Implementar Visualização em árvore (expandir/recolher) para pastas.
      - [ ] Implementar visualmente a Opção de "Fixar" quadros/pastas no topo (cores/ícones personalizáveis - funcionalidade completa depois).
- [ ] **RF03: Área de Trabalho (Gerenciamento de Blocos):**
  - [ ] 3.1. Gerenciamento de blocos:
    - [ ] Adicionar blocos com nome personalizável a um quadro.
    - [ ] Editar nome de blocos.
    - [ ] Remover blocos.
    - [ ] Arrastar e soltar blocos para reorganização dentro do quadro.
    - [ ] Implementar visualmente os Três botões embaixo de cada bloco: "Inserir Arquivo", "Criar Cartão Novo", "Criar Planilha".
    - [ ] Implementar visualmente a Opção nos três pontinhos do bloco: "Inserir texto em Markdown", "Criar Tabela via Markdown".
  - [ ] 3.6. Clicar e arrastar (Prévia visual para blocos):
    - [ ] Exibir prévia visual (sombra/contorno) ao arrastar blocos.
- [ ] **RF06: Salvamento (Quadros, Pastas, Blocos):**
  - [ ] 6.1. Salvar dados de pastas (estrutura e conteúdo) em JSON.
  - [ ] 6.1. Salvar dados de blocos (nomes, ordem, a qual quadro pertencem) em JSON.
  - [ ] 6.1. Implementar o salvamento de cada quadro em um arquivo JSON separado (se utilizando backend para arquivos) ou estrutura equivalente no localStorage.


—--------------
# Fase 3: Implementação de Cartões Simples e Planilhas (Funcionalidades Essenciais)


**Objetivo:** Desenvolver cartões simples e planilhas com funcionalidades básicas de criação, edição e organização, incluindo suporte a Markdown e modals de edição avançada com funcionalidades estilo Excel.


## Detalhes da Implementação


1. **Gerenciamento de Cartões Simples (RF03.2 Completo):**
   - Botão "Criar Cartão Novo" inicia edição simples na área de trabalho (título, descrição).
   - Campos: Título (obrigatório), Descrição (Markdown), Checklist, Status (pendente/concluído).
   - **Comportamento do Modal de Edição (`CardDialog.tsx`):**
     - **Primeira criação:** Edição simples na área de trabalho.
     - **Abertura do modal:** Clicar no cartão ou no botão "Ver Cartão" abre o modal de edição avançada.
     - **Edição simples:** Botão "Editar Cartão" ativa edição na área de trabalho (como na Fase 2).
     - Layout: Duas colunas (principal: título, descrição; lateral: ações).
     - Botões: "Salvar", "Arquivar", "Excluir", "Maximizar/Restaurar".
     - Suporte a comentários e anexos (imagens como miniaturas, outros como ícone/nome).
     - Menu de contexto: Editar, Abrir, Copiar, Colar, Arquivar, Excluir.
     - Movimentação entre blocos via sub-janela.


2. **Gerenciamento de Planilhas Avançadas (RF03.3 Completo):**
   - Botão "Criar Planilha" abre modal de edição (`SpreadsheetDialog.tsx`) automaticamente na primeira criação.
   - Colunas personalizáveis (texto, número, data, hora, checkbox, link).
   - **Comportamento do Modal de Edição:**
     - **Primeira criação:** Modal `SpreadsheetDialog.tsx` aberto automaticamente.
     - **Abertura do modal:** Clicar na planilha ou no botão "Ver Planilha" abre o modal de edição avançada.
     - **Edição simples:** Botão "Editar Planilha" ativa edição na área de trabalho.
     - Funcionalidades estilo Excel: Edição de células (salvar com Enter, descartar com Esc), redimensionamento de colunas/linhas (mín. 50px/25px), menu de contexto para tipo de célula, navegação com teclas de seta, barra de ferramentas para formatação.
   - Modal de configuração:
     - Botões: "Salvar Tudo", "Arquivar", "Excluir", "Maximizar/Restaurar", "Checklist", "Etiquetas", "Mover".
     - Suporte a anexos e importação de tabelas Markdown.
   - Menu de contexto: Editar, Abrir, Copiar, Colar, Excluir.


3. **Ajuste Automático de Blocos (RF05.1 - Parcial):**
   - Parâmetro `blockAutoAdjustToSpreadsheet` redimensiona blocos com base no tamanho da planilha.
   - Desativado: usa tamanhos padrão (`defaultBlockWidth`, `defaultBlockHeight`).


4. **Suporte a Markdown (RF07 - Parcial):**
   - Renderização em descrições, comentários e células de planilhas.
   - Botões de formatação nos modals.


5. **Arquitetura de Software:**
   - **Componente Base (`BaseDialog.tsx`):** Encapsula layout de duas colunas, botões comuns ("Salvar", "Cancelar", "Arquivar", "Excluir", "Maximizar/Restaurar"), e lógica compartilhada (ex.: formatação Markdown).
   - **Modais Específicos:** `CardDialog.tsx` e `SpreadsheetDialog.tsx` herdam de `BaseDialog.tsx`, adicionando funcionalidades específicas.
   - **Composables:** Funções reutilizáveis para Markdown, anexos e salvamento.
   - **Estado:** Gerenciado via `CalendarioContext.tsx`.


6. **Sistema de Salvamento (RF06 - Parcial):**
   - Salva cartões, planilhas, anexos e comentários em JSON no `localStorage`.
   - Validação de campos obrigatórios.


7. **Interface Responsiva e Desempenho (RNF08 - Parcial):**
   - Responsividade com TailwindCSS.
   - Rolagem interna para planilhas grandes.
   - Renderização rápida de Markdown com `react-markdown`.
   - Latência < 200ms.


## Checklist de Implementação da Fase 3


**Objetivo:** Desenvolver cartões simples e planilhas com funcionalidades de criação, edição, organização e suporte a Markdown, introduzindo modals avançados, ajuste automático de blocos, anexos e comentários.


- [ ] **RF03: Área de Trabalho (Funcionalidade de Botões em Blocos):**
  - [ ] 3.1. Botão "Criar Cartão Novo":
    - [ ] Criar cartão com edição simples na área de trabalho (título, descrição).
    - [ ] Salvar e exibir no bloco.
  - [ ] 3.1. Botão "Criar Planilha":
    - [ ] Criar planilha com 2 colunas (tipo texto) e 1 linha.
    - [ ] Abrir modal `SpreadsheetDialog.tsx` automaticamente.


- [ ] **RF03: Área de Trabalho (Gerenciamento de Cartões):**
  - [ ] 3.2. Gerenciamento de cartões:
    - [ ] Criar cartões com: Título (obrigatório), Descrição (Markdown), Checklist, Status.
    - [ ] Comportamento do modal `CardDialog.tsx`:
      - [ ] Primeira criação: Edição simples na área de trabalho.
      - [ ] Clicar no cartão ou "Ver Cartão": Abrir modal de edição avançada.
      - [ ] Botão "Editar Cartão": Ativar edição simples na área de trabalho.
    - [ ] Modal `CardDialog.tsx`:
      - [ ] Layout com duas colunas: principal (título, descrição, atividade) e lateral (ações).
      - [ ] Campos: Título, Localização (ex.: "na lista A FAZER").
      - [ ] Descrição: Textarea com botões de formatação (Aa, negrito, itálico, lista, link, imagem, anexo, Markdown, ajuda).
      - [ ] Checklist: Adicionar/remover itens, marcar como concluído.
      - [ ] Status: Seleção pendente/concluído (ícone visual).
      - [ ] Anexos: Adicionar arquivos (imagens como miniaturas, outros com ícone/nome).
      - [ ] Atividade: Comentários com Markdown, anexos, opções "Editar" e "Excluir", histórico de ações.
      - [ ] Ações: Botões "Salvar", "Cancelar", "Arquivar", "Excluir", "Maximizar/Restaurar", "Ajuda".
      - [ ] Barra lateral: Botões "Etiquetas", "Checklist", "Datas", "Anexo", "Mover", "Copiar", "Arquivar", "Compartilhar".
      - [ ] Mover: Sub-janela com seleções de quadro, bloco e posição.
      - [ ] Ajuda: Botão "?" com dicas de Markdown.
    - [ ] Arquivar cartões.
    - [ ] Excluir cartões.
    - [ ] Arrastar cartões para reordenar no bloco.
    - [ ] Arrastar cartões entre blocos.
    - [ ] Menu de contexto: Editar, Abrir, Copiar, Colar, Arquivar, Excluir.


- [ ] **RF03: Área de Trabalho (Gerenciamento de Planilhas - Avançado):**
  - [ ] 3.3. Gerenciamento de planilhas:
    - [ ] Criar planilhas com colunas personalizáveis (texto, número, data, hora, checkbox, link).
    - [ ] Comportamento do modal `SpreadsheetDialog.tsx`:
      - [ ] Primeira criação: Abrir modal automaticamente.
      - [ ] Clicar na planilha ou "Ver Planilha": Abrir modal de edição avançada.
      - [ ] Botão "Editar Planilha": Ativar edição simples na área de trabalho.
    - [ ] Edição em tempo real na área de trabalho (`SpreadsheetItem.tsx`).
    - [ ] Modal `SpreadsheetDialog.tsx`:
      - [ ] Layout: Barra de ferramentas, tabela, barra lateral.
      - [ ] Campos: Título editável.
      - [ ] Tabela:
        - Cabeçalhos editáveis via popover (nome, tipo, largura, obrigatório).
        - Células editáveis por tipo (texto, número, data, hora, checkbox, link).
        - Resizers para colunas (mín. 50px) e linhas (mín. 25px).
        - Botões para adicionar/remover colunas e linhas.
        - Seleção múltipla de células via arrastar.
        - Menu de contexto para alterar tipo de célula.
        - Navegação com teclas de seta.
        - Coordenadas da célula selecionada (opcional: elemento dedicado).
      - [ ] Barra de ferramentas:
        - Formatação (negrito, itálico, sublinhado, alinhamento, cor de texto, cor de fundo, fonte, tamanho).
        - Seleção de tipo de célula.
        - Alternar quebra de linha.
        - Redefinir tamanhos de colunas/linhas.
      - [ ] Importação de tabelas Markdown via textarea e botão "Importar".
      - [ ] Anexos: Botão "Adicionar Anexo".
      - [ ] Ações: Botões "Salvar Tudo", "Cancelar", "Maximizar/Restaurar", "Checklist", "Etiquetas", "Mover", "Ajuda".
      - [ ] Barra lateral: Botões "Copiar Planilha", "Arquivar Planilha", "Compartilhar", "Excluir Planilha".
      - [ ] Responsividade: Rolagem horizontal para telas menores.
    - [ ] Exibir colunas/linhas na área de trabalho com rolagem interna.
    - [ ] Arrastar planilhas para reordenar no bloco.
    - [ ] Arrastar planilhas entre blocos.
    - [ ] Menu de contexto: Editar, Abrir, Copiar, Colar, Excluir.
    - [ ] Arquivar planilhas.
    - [ ] Excluir planilhas.


- [ ] **RF05: Ajuste Automático de Blocos:**
  - [ ] 5.1. Implementar ajuste automático:
    - [ ] Parâmetro `blockAutoAdjustToSpreadsheet` em `CalendarioSettings`.
    - [ ] Ajustar largura (soma de `column.width` + 40px) e altura (`rowCount * 40px + 80px`).
    - [ ] Retornar ao padrão (`defaultBlockWidth`, `defaultBlockHeight`) quando desativado.
    - [ ] Aplicar estilos dinâmicos em `BlockComponent.tsx`.


- [ ] **RF03: Área de Trabalho (Inserir Arquivo):**
  - [ ] 3.7. Botão "Inserir Arquivo" nos modals:
    - [ ] Adicionar arquivos em cartões e planilhas.
    - [ ] Exibir imagens como miniaturas (`FileItemComponent.tsx`).
    - [ ] Exibir outros arquivos como ícone com nome/extensão.
    - [ ] Suportar anexos em comentários de cartões.
    - [ ] Permitir remover anexos.


- [ ] **RF07: Suporte a Markdown (Inicial):**
  - [ ] 7.2. Blocos de anotações:
    - [ ] Renderizar Markdown (negrito, itálico, listas, links, citações, código, imagens).
    - [ ] Exibir código Markdown na edição.
    - [ ] Botões de formatação nos modals (Aa, negrito, itálico, lista, link, imagem, anexo, Markdown).
  - [ ] 3.1. Opção "Inserir texto em Markdown" nos blocos:
    - [ ] Renderizar Markdown inserido.
  - [ ] 3.3. Importação de tabelas Markdown:
    - [ ] Campo para colar Markdown e botão "Importar".


- [ ] **RNF08: Interface Responsiva e Intuitiva:**
  - [ ] 8.1. Responsividade para cartões, planilhas e modals (TailwindCSS).
  - [ ] 8.3. Navegação por teclado (Tab entre células, Enter para salvar).
  - [ ] 8.6. Renderização rápida de Markdown (`react-markdown`).


- [ ] **RF06: Salvamento (Cartões, Planilhas, Anexos, Comentários):**
  - [ ] 6.1. Salvar dados de cartões (título, descrição, checklist, status, anexos, comentários) em JSON.
  - [ ] 6.1. Salvar dados de planilhas (título, colunas, linhas, estilos) in JSON.
  - [ ] 6.1. Salvar anexos (referências de arquivos) em JSON.
  - [ ] 6.1. Validar campos obrigatórios com feedback via toast.


- [ ] **Arquitetura de Software:**
  - [ ] Implementar `BaseDialog.tsx` com layout de duas colunas e botões comuns.
  - [ ] Criar `CardDialog.tsx` e `SpreadsheetDialog.tsx` herdando de `BaseDialog.tsx`.
  - [ ] Desenvolver composables para Markdown, anexos e salvamento.
  - [ ] Configurar `CalendarioContext.tsx` para gerenciar estado.

—-

# Fase 3: Implementação de Cartões Simples e Planilhas (Funcionalidades Essenciais) - Parte 2


**Objetivo:** Aprimorar os modals de edição de cartões (`CardDialog.tsx`) e planilhas (`SpreadsheetDialog.tsx`) com funcionalidades adicionais, garantindo consistência entre eles e usabilidade inspirada no Trello. Implementar botões da barra lateral, notificações, e ajustes no layout, usando os códigos de referência HTML (1, 2, 4, 5, 7, 9, 10) como guia visual.


## Detalhes da Implementação


### 1. Modal de Edição de Cartões (`CardDialog.tsx`)


- **Cabeçalho:**
  - Exibir "No bloco [nome do bloco]" (ex.: "No bloco A fazer") no lugar de "Na lista", refletindo o bloco atual do cartão.
  - O nome do bloco é clicável, abrindo um pop-up (referência 4) com seleções de quadro, bloco e posição para mover o cartão.
  - Remover o segundo botão "X" (fechar) e o botão de interrogação (ajuda) para simplificar o layout.
- **Campo de Descrição:**
  - Expandir o campo de descrição para ocupar mais espaço vertical (mínimo 200px de altura), com rolagem interna se necessário, para facilitar leitura e edição, similar ao Trello.
- **Barra Lateral (Ações):**
  - **Etiquetas:** Botão abre pop-up (referência 5) abaixo do botão, com campo de busca, lista de etiquetas existentes, opção de criar nova etiqueta com nome e cor (ex.: verde, vermelha), e botão "Aplicar" para associar ao cartão.
  - **Checklist:** Implementar layout (referência 10):
    - Nome editável ao clicar (ex.: "Checklist de Tarefas").
    - Botão "Adicionar Item" exibe campo de texto, botões "Adicionar", "Cancelar" e "Data de Entrega" (visíveis apenas durante adição).
    - Barra de progresso no topo (ex.: 50% se 1 de 2 itens marcados).
    - Hover em cada item exibe ícone de relógio (para editar data de entrega) e botão "Excluir".
    - Botão "Excluir" no topo remove o checklist inteiro.
  - **Datas:** Botão abre pop-up (referência 1) com campos para data de início, entrega, lembrete (ex.: "1 dia antes"), e botão "Salvar".
  - **Mover:** Botão abre pop-up (referência 4) com seleções de quadro (ex.: "ORACULO"), bloco (ex.: "A fazer"), posição (ex.: 1), e botão "Mover". Exibir notificação no sino após movimentação.
  - **Capa:** Botão abre pop-up (referência 2) com cores predefinidas, campo para cor personalizada, e botão "Remover Capa". A capa (ex.: cor vermelha) é exibida no topo do modal e na área de trabalho (referência 9).
- **Atividades e Comentários:**
  - Seção "Atividade" com botão "Mostrar Detalhes"/"Ocultar Detalhes" (referência 7) para exibir/esconder histórico de ações (ex.: "Guilherme removeu checklist").
  - Comentários sempre visíveis abaixo, com campo para adicionar novo comentário (botão "Enviar" ao pressionar Enter).
  - Hover em comentários exibe menu de três pontinhos com opções "Editar" e "Excluir".
- **Capa na Área de Trabalho:**
  - Exibir capa (cor ou padrão) acima do título do cartão, conforme referência 9, se definida.


### 2. Modal de Edição de Planilhas (`SpreadsheetDialog.tsx`)


- **Cabeçalho:** Mesma implementação do modal de cartões: "No bloco [nome do bloco]" clicável (pop-up referência 4), sem segundo "X" ou interrogação.
- **Campo de Descrição:** Expandir campo, se aplicável, para edição de título ou notas (mínimo 200px de altura).
- **Barra Lateral (Ações):** Implementar os mesmos botões do modal de cartões (etiquetas, checklist, datas, mover, capa), com idêntica funcionalidade e pop-ups (referências 1, 2, 4, 5, 10).
- **Atividades e Comentários:** Mesma implementação do modal de cartões, com "Mostrar Detalhes"/"Ocultar Detalhes" e comentários com hover.
- **Capa na Área de Trabalho:** Exibir capa no topo da planilha, similar ao cartão (referência 9).


### 3. Notificações


- **Ícone de Sino:** Adicionar ao cabeçalho, à direita da barra de pesquisa, na sequência (direita para esquerda): sino, ícone de filtro, barra de pesquisa, espaço em branco, botão "Criar", logo "Calendário".
- **Comportamento:** Exibir notificações de lembretes (ex.: data de entrega) e ações (ex.: "Cartão movido para bloco Concluído") com fundo destacado (ex.: vermelho) até visualizadas. Clicar na notificação abre o contexto (ex.: modal do cartão/planilha).
- **Exemplo:** "Lembrete: Cartão 'Checklist' vence em 1 dia" abre o modal do cartão ao clicar.


### 4. Consistência entre Modals


- Garantir que `CardDialog.tsx` e `SpreadsheetDialog.tsx` tenham layout idêntico na barra lateral, seções de atividades/comentários, e comportamento de pop-ups, exceto nas funcionalidades específicas (ex.: tabela para planilhas).


### 5. Arquitetura de Software


- **Componente Base (`BaseDialog.tsx`):** Reutilizar para layout de duas colunas, botões comuns ("Salvar", "Cancelar", "Excluir", "Maximizar/Restaurar"), e lógica compartilhada (ex.: abertura de pop-ups).
- **Pop-ups:** Implementar como componentes React (`EtiquetaPopUp.tsx`, `ChecklistPopUp.tsx`, etc.), renderizados abaixo dos botões correspondentes, com posicionamento dinâmico.
- **Estado:** Gerenciar via `CalendarioContext.tsx`, incluindo notificações e estado do sino.
- **Estilos:** Usar TailwindCSS para responsividade e consistência visual.


### 6. Sistema de Salvamento


- Salvar configurações de etiquetas, checklists, datas, capas, atividades e comentários em JSON no `localStorage`, com validação de campos obrigatórios (ex.: título do cartão).


### 7. Interface Responsiva e Desempenho


- Garantir que pop-ups e modals sejam responsivos, com rolagem interna se necessário.
- Latência < 200ms para abertura de pop-ups e renderização de atividades.
- Usar `react-markdown` para renderização rápida de comentários em Markdown.


## Checklist de Implementação - Fase 3 (Parte 2)


**Objetivo:** Implementar melhorias nos modals de cartões e planilhas, garantindo consistência, usabilidade e funcionalidades inspiradas no Trello.


- [ ] **RF03: Modal de Edição de Cartões (`CardDialog.tsx`):**
  - [ ] Cabeçalho:
    - [ ] Exibir "No bloco [nome]" (ex.: "No bloco A fazer"), clicável para pop-up (referência 4).
    - [ ] Remover segundo "X" e botão de interrogação.
  - [ ] Campo de Descrição: Expandir para 200px de altura, com rolagem interna.
  - [ ] Barra Lateral:
    - [ ] Etiquetas: Pop-up (referência 5) com busca, criação de etiquetas (nome, cor), botão "Aplicar".
    - [ ] Checklist: Layout (referência 10) com nome editável, itens (hover com relógio/"Excluir"), barra de progresso, botão "Excluir".
    - [ ] Datas: Pop-up (referência 1) com data de início, entrega, lembrete, botão "Salvar".
    - [ ] Mover: Pop-up (referência 4) com quadro, bloco, posição, notificação no sino.
    - [ ] Capa: Pop-up (referência 2) com cores predefinidas/personalizadas, exibição no modal e área de trabalho (referência 9).
  - [ ] Atividades: Botão "Mostrar Detalhes"/"Ocultar Detalhes" (referência 7) para histórico.
  - [ ] Comentários: Visíveis, com hover (três pontinhos) para "Editar"/"Excluir".


- [ ] **RF03: Modal de Edição de Planilhas (`SpreadsheetDialog.tsx`):**
  - [ ] Cabeçalho: "No bloco [nome]" clicável (referência 4), sem segundo "X" ou interrogação.
  - [ ] Barra Lateral: Implementar etiquetas, checklist, datas, mover, capa (mesmas especificações do modal de cartões).
  - [ ] Atividades e Comentários: Mesma implementação do modal de cartões.


- [ ] **RF03: Notificações:**
  - [ ] Adicionar sino no cabeçalho (direita da barra de pesquisa).
  - [ ] Exibir notificações destacadas, clicáveis para abrir contexto (ex.: modal do cartão).
  - [ ] Implementar notificações para lembretes e ações (ex.: movimentação).


- [ ] **RF03: Consistência nos Modals:**
  - [ ] Garantir layout e funcionalidades idênticas na barra lateral e seções de atividades/comentários.


- [ ] **RF06: Salvamento:**
  - [ ] Salvar etiquetas, checklists, datas, capas, atividades e comentários em JSON.
  - [ ] Validar campos obrigatórios (ex.: título).


- [ ] **RNF08: Interface Responsiva:**
  - [ ] Garantir responsividade de modals e pop-ups com TailwindCSS.
  - [ ] Latência < 200ms para abertura de pop-ups e renderização.


---