\# Planejamento de Implementação do Sistema "Calendário" em 5 Fases

\#\# Fase 1: Fundação do Sistema e Interface Principal

\*\*Objetivo:\*\* Estabelecer a estrutura base da aplicação, incluindo o layout principal, navegação essencial e as primeiras funcionalidades de criação de conteúdo.

\*\*Detalhes da Implementação:\*\*

1\.  \*\*Configuração Inicial do Projeto:\*\*  
    \* Estruturar o frontend com HTML, CSS, JavaScript e TailwindCSS.  
    \* Definir a arquitetura básica do backend RESTful (a tecnologia específica pode ser escolhida, ex: Node.js, Python, Java), com endpoints iniciais para quadros (ex: \`/api/boards\`).  
    \* Implementar a função \`generateId()\` para IDs únicos.  
    \* Implementar a função \`checkRequiredFields()\` para validação.  
    \* Implementar a função básica \`saveData()\` para localStorage inicialmente, com estrutura para futura integração com backend.

2\.  \*\*Desenvolvimento do Cabeçalho (RF01 \- Parcial):\*\*  
    \* Exibir o nome "Calendário" com ícone de calendário à esquerda (RF01.1).  
    \* Implementar o botão "Criar Quadro" com ícone "+" e cor destacada. Funcionalidade: cria um novo quadro diretamente (RF01.2).  
    \* Garantir que não haja ícone de foto de perfil (RF01.4).

3\.  \*\*Desenvolvimento da Barra Lateral (RF02 \- Parcial):\*\*  
    \* Garantir que não haja seção de usuário (RF02.1).  
    \* Implementar o botão "Recolher Barra Lateral" com ícone de seta (esquerda/direita) no topo, abaixo do futuro botão "Calendário". Funcionalidade: recolher/expandir a barra lateral, ajustando a área de trabalho automaticamente (RF02.3).  
    \* Criar a estrutura da seção "Quadros" (RF02.5 \- Parcial):  
        \* Listagem inicial de quadros (vazia ou com dados de exemplo).  
        \* Botão "+" para criar "Novo Quadro" (deve funcionar em conjunto com RF01.2).

4\.  \*\*Estrutura da Área de Trabalho (RF03 \- Parcial):\*\*  
    \* Definir a área principal onde os quadros e seus conteúdos serão exibidos.  
    \* Implementar a barra de scroll restrita à área de trabalho com ajuste dinâmico inicial (vertical/horizontal) (RF03.4).  
    \* Configurar a rolagem horizontal como padrão para a área de trabalho, permitindo que blocos cresçam horizontalmente e o espaço inicial seja adaptável à tela do cliente (mínimo: tamanho total da tela) (parte de RF03.4).

5\.  \*\*Sistema de Salvamento Inicial (RF06 \- Parcial):\*\*  
    \* Implementar o salvamento básico de dados dos quadros em formato JSON localmente (localStorage). Foco em salvar a estrutura dos quadros criados (RF06.1 \- Parcial, salvando todos os dados em um único JSON por enquanto ou estrutura para múltiplos arquivos).  
    \* Implementar a validação básica do JSON ao carregar (RF06.2 \- Parcial).

6\.  \*\*Interface Responsiva Inicial (RNF08 \- Parcial):\*\*  
    \* Aplicar TailwindCSS para garantir que a estrutura básica (cabeçalho, barra lateral, área de trabalho) seja responsiva desde o início (RNF08.1).  
—------  
\#\# Fase 1: Fundação do Sistema e Interface Principal

\*\*Objetivo:\*\* Estabelecer a estrutura base da aplicação, incluindo o layout principal, navegação essencial e as primeiras funcionalidades de criação de conteúdo.

\- \[ \] \*\*Configuração Inicial do Projeto:\*\*  
  \- \[ \] Estruturar o frontend com HTML, CSS, JavaScript.  
  \- \[ \] Integrar TailwindCSS ao projeto frontend.  
  \- \[ \] Definir a arquitetura básica do backend RESTful (tecnologia livre, ex: Node.js, Python, Java).  
  \- \[ \] Configurar endpoints iniciais do backend para quadros (ex: \`/api/boards\`).  
  \- \[ \] Implementar função de utilidade \`generateId()\` para IDs únicos.  
  \- \[ \] Implementar função de utilidade \`checkRequiredFields()\` para validação de campos.  
  \- \[ \] Implementar função de utilidade básica \`saveData()\` para localStorage (com estrutura para futura integração com backend).  
\- \[ \] \*\*RF01: Cabeçalho (Parcial):\*\*  
  \- \[ \] 1.1. Exibir o nome "Calendário" com ícone de calendário à esquerda.  
  \- \[ \] 1.2. Implementar visualmente o Botão "Criar Quadro" com ícone "+" e cor destacada (ex.: azul).  
  \- \[ \] 1.4. Não exibir ícone de foto de perfil (sem suporte a usuários).  
\- \[ \] \*\*RF02: Barra Lateral (Parcial):\*\*  
  \- \[ \] 2.1. Não incluir seção de usuário (sem ícone ou letra "G").  
  \- \[ \] 2.3. Botão "Recolher Barra Lateral" com ícone de seta:  
    \- \[ \] Localizado no topo da barra lateral, abaixo do (futuro) botão "Calendário".  
    \- \[ \] Funcionalidade: Recolhe a barra lateral, exibindo apenas os ícones dos botões.  
    \- \[ \] Funcionalidade: Clicar novamente expande a barra lateral, restaurando a visualização completa.  
    \- \[ \] Funcionalidade: Área de trabalho se ajusta automaticamente ao recolher/expandir.  
  \- \[ \] 2.5. Seção "Quadros" (Estrutura Inicial):  
    \- \[ \] Implementar a listagem inicial de quadros (pode estar vazia ou com dados de exemplo).  
    \- \[ \] Implementar visualmente o botão "+" para criar "Novo Quadro" na seção "Quadros".  
\- \[ \] \*\*RF03: Área de Trabalho (Parcial):\*\*  
  \- \[ \] 3.4. Barra de scroll:  
    \- \[ \] Restrita à área de trabalho.  
    \- \[ \] Ajuste dinâmico inicial (horizontal/vertical).  
    \- \[ \] \*\*Rolagem Horizontal (padrão)\*\*:  
      \- \[ \] Área de trabalho rola horizontalmente (estilo Trello).  
      \- \[ \] Blocos devem ter espaço suficiente para crescer horizontalmente.  
      \- \[ \] Espaço inicial da área de trabalho adaptável à tela do cliente (mínimo: tamanho total da tela).  
\- \[ \] \*\*RF06: Salvamento (Parcial):\*\*  
  \- \[ \] 6.1. Salvar dados básicos dos quadros em JSON (inicialmente em um único arquivo JSON via localStorage).  
  \- \[ \] 6.2. Implementar validação básica do JSON ao carregar os dados.  
\- \[ \] \*\*RNF08: Interface Responsiva e Intuitiva (Parcial):\*\*  
  \- \[ \] 8.1. Aplicar TailwindCSS para garantir que a estrutura básica do layout (cabeçalho, barra lateral, área de trabalho) seja responsiva.

—-------

\#\# Fase 2: Gerenciamento de Quadros, Pastas e Blocos

\*\*Objetivo:\*\* Implementar funcionalidades completas para criação, organização e manipulação de quadros, pastas e blocos, que são os contêineres principais de conteúdo.

\*\*Detalhes da Implementação:\*\*

1\.  \*\*Funcionalidades Avançadas da Seção "Quadros" na Barra Lateral (RF02.5 Completo):\*\*  
    \* Implementar hover funcional para cada quadro na lista.  
    \* Adicionar ícone de três pontos para cada quadro com opções: "Renomear", "Arquivar", "Deletar".  
    \* Implementar sistema de Pastas para organizar quadros:  
        \* Criar, renomear, arquivar, deletar pastas.  
        \* Funcionalidade de arrastar quadros/pastas para reordenar ou mover entre pastas.  
        \* Visualização em árvore (expandir/recolher) para pastas.  
        \* Opção de "Fixar" quadros/pastas no topo (com personalização de cores/ícones).

2\.  \*\*Gerenciamento de Blocos na Área de Trabalho (RF03.1 Completo):\*\*  
    \* Permitir adicionar/editar/remover blocos com nome personalizável dentro de um quadro.  
    \* Implementar funcionalidade de arrastar e soltar para reorganização de blocos dentro da área de trabalho do quadro.  
    \* Adicionar os três botões abaixo de cada bloco: "Inserir Arquivo", "Criar Cartão Novo", "Criar Planilha" (inicialmente apenas os botões, a funcionalidade completa virá nas próximas fases).  
    \* Adicionar opção nos três pontinhos do bloco para "Inserir texto em Markdown" (a renderização virá depois).

3\.  \*\*Interação e Feedback Visual (RF03 \- Parcial):\*\*  
    \* Implementar prévia visual (sombra/contorno) ao arrastar blocos (RF03.6 \- Parcial, focado em blocos).

4\.  \*\*Sistema de Salvamento (RF06 \- Parcial):\*\*  
    \* Expandir o sistema de salvamento para incluir dados de pastas e blocos.  
    \* Implementar o requisito de salvar cada quadro em um arquivo JSON separado (RF06.1 \- Completo para esta parte).

5\.  \*\*Interface Responsiva (RNF08 \- Parcial):\*\*  
    \* Garantir que as novas funcionalidades de quadros, pastas e blocos sejam responsivas.

—--------------

\#\# Fase 2: Gerenciamento de Quadros, Pastas e Blocos

\*\*Objetivo:\*\* Implementar funcionalidades completas para criação, organização e manipulação de quadros, pastas e blocos.

\- \[ \] \*\*RF01: Cabeçalho (Funcionalidade):\*\*  
  \- \[ \] 1.2. Funcionalidade completa do Botão "Criar Quadro": cria um novo quadro diretamente, sem opções intermediárias, e o adiciona à lista.  
\- \[ \] \*\*RF02: Barra Lateral (Seção "Quadros" Completa):\*\*  
  \- \[ \] 2.5. Seção "Quadros":  
    \- \[ \] Funcionalidade completa do botão "+" para "Novo Quadro" (adiciona à lista e salva).  
    \- \[ \] Cada quadro na lista deve ter:  
      \- \[ \] Hover funcional (feedback visual ao passar o mouse).  
      \- \[ \] Ícone de três pontos com opções iniciais: "Renomear", "Deletar" (Arquivar e Mover para pasta virão depois).  
      \- \[ \] Funcionalidade de Renomear quadro.  
      \- \[ \] Funcionalidade de Deletar quadro (com confirmação).  
    \- \[ \] Pastas para organizar quadros:  
      \- \[ \] Funcionalidade para Criar nova pasta.  
      \- \[ \] Funcionalidade para Renomear pasta.  
      \- \[ \] Funcionalidade para Deletar pasta (com confirmação, e tratamento de quadros dentro).  
      \- \[ \] Funcionalidade básica de Arrastar quadros/pastas para reordenar ou mover quadros para dentro/fora de pastas.  
      \- \[ \] Implementar Visualização em árvore (expandir/recolher) para pastas.  
      \- \[ \] Implementar visualmente a Opção de "Fixar" quadros/pastas no topo (cores/ícones personalizáveis \- funcionalidade completa depois).  
\- \[ \] \*\*RF03: Área de Trabalho (Gerenciamento de Blocos):\*\*  
  \- \[ \] 3.1. Gerenciamento de blocos:  
    \- \[ \] Adicionar blocos com nome personalizável a um quadro.  
    \- \[ \] Editar nome de blocos.  
    \- \[ \] Remover blocos.  
    \- \[ \] Arrastar e soltar blocos para reorganização dentro do quadro.  
    \- \[ \] Implementar visualmente os Três botões embaixo de cada bloco: "Inserir Arquivo", "Criar Cartão Novo", "Criar Planilha".  
    \- \[ \] Implementar visualmente a Opção nos três pontinhos do bloco: "Inserir texto em Markdown", "Criar Tabela via Markdown".  
  \- \[ \] 3.6. Clicar e arrastar (Prévia visual para blocos):  
    \- \[ \] Exibir prévia visual (sombra/contorno) ao arrastar blocos.  
\- \[ \] \*\*RF06: Salvamento (Quadros, Pastas, Blocos):\*\*  
  \- \[ \] 6.1. Salvar dados de pastas (estrutura e conteúdo) em JSON.  
  \- \[ \] 6.1. Salvar dados de blocos (nomes, ordem, a qual quadro pertencem) em JSON.  
  \- \[ \] 6.1. Implementar o salvamento de cada quadro em um arquivo JSON separado (se utilizando backend para arquivos) ou estrutura equivalente no localStorage.

—--------------  
\# Fase 3: Implementação de Cartões Simples e Planilhas (Funcionalidades Essenciais)

\*\*Objetivo:\*\* Desenvolver cartões simples e planilhas com funcionalidades básicas de criação, edição e organização, incluindo suporte a Markdown e modals de edição avançada com funcionalidades estilo Excel.

\#\# Detalhes da Implementação

1\. \*\*Gerenciamento de Cartões Simples (RF03.2 Completo):\*\*  
   \- Botão "Criar Cartão Novo" inicia edição simples na área de trabalho (título, descrição).  
   \- Campos: Título (obrigatório), Descrição (Markdown), Checklist, Status (pendente/concluído).  
   \- \*\*Comportamento do Modal de Edição (\`CardDialog.tsx\`):\*\*  
     \- \*\*Primeira criação:\*\* Edição simples na área de trabalho.  
     \- \*\*Abertura do modal:\*\* Clicar no cartão ou no botão "Ver Cartão" abre o modal de edição avançada.  
     \- \*\*Edição simples:\*\* Botão "Editar Cartão" ativa edição na área de trabalho (como na Fase 2).  
     \- Layout: Duas colunas (principal: título, descrição; lateral: ações).  
     \- Botões: "Salvar", "Arquivar", "Excluir", "Maximizar/Restaurar".  
     \- Suporte a comentários e anexos (imagens como miniaturas, outros como ícone/nome).  
     \- Menu de contexto: Editar, Abrir, Copiar, Colar, Arquivar, Excluir.  
     \- Movimentação entre blocos via sub-janela.

2\. \*\*Gerenciamento de Planilhas Avançadas (RF03.3 Completo):\*\*  
   \- Botão "Criar Planilha" abre modal de edição (\`SpreadsheetDialog.tsx\`) automaticamente na primeira criação.  
   \- Colunas personalizáveis (texto, número, data, hora, checkbox, link).  
   \- \*\*Comportamento do Modal de Edição:\*\*  
     \- \*\*Primeira criação:\*\* Modal \`SpreadsheetDialog.tsx\` aberto automaticamente.  
     \- \*\*Abertura do modal:\*\* Clicar na planilha ou no botão "Ver Planilha" abre o modal de edição avançada.  
     \- \*\*Edição simples:\*\* Botão "Editar Planilha" ativa edição na área de trabalho.  
     \- Funcionalidades estilo Excel: Edição de células (salvar com Enter, descartar com Esc), redimensionamento de colunas/linhas (mín. 50px/25px), menu de contexto para tipo de célula, navegação com teclas de seta, barra de ferramentas para formatação.  
   \- Modal de configuração:  
     \- Botões: "Salvar Tudo", "Arquivar", "Excluir", "Maximizar/Restaurar", "Checklist", "Etiquetas", "Mover".  
     \- Suporte a anexos e importação de tabelas Markdown.  
   \- Menu de contexto: Editar, Abrir, Copiar, Colar, Excluir.

3\. \*\*Ajuste Automático de Blocos (RF05.1 \- Parcial):\*\*  
   \- Parâmetro \`blockAutoAdjustToSpreadsheet\` redimensiona blocos com base no tamanho da planilha.  
   \- Desativado: usa tamanhos padrão (\`defaultBlockWidth\`, \`defaultBlockHeight\`).

4\. \*\*Suporte a Markdown (RF07 \- Parcial):\*\*  
   \- Renderização em descrições, comentários e células de planilhas.  
   \- Botões de formatação nos modals.

5\. \*\*Arquitetura de Software:\*\*  
   \- \*\*Componente Base (\`BaseDialog.tsx\`):\*\* Encapsula layout de duas colunas, botões comuns ("Salvar", "Cancelar", "Arquivar", "Excluir", "Maximizar/Restaurar"), e lógica compartilhada (ex.: formatação Markdown).  
   \- \*\*Modais Específicos:\*\* \`CardDialog.tsx\` e \`SpreadsheetDialog.tsx\` herdam de \`BaseDialog.tsx\`, adicionando funcionalidades específicas.  
   \- \*\*Composables:\*\* Funções reutilizáveis para Markdown, anexos e salvamento.  
   \- \*\*Estado:\*\* Gerenciado via \`CalendarioContext.tsx\`.

6\. \*\*Sistema de Salvamento (RF06 \- Parcial):\*\*  
   \- Salva cartões, planilhas, anexos e comentários em JSON no \`localStorage\`.  
   \- Validação de campos obrigatórios.

7\. \*\*Interface Responsiva e Desempenho (RNF08 \- Parcial):\*\*  
   \- Responsividade com TailwindCSS.  
   \- Rolagem interna para planilhas grandes.  
   \- Renderização rápida de Markdown com \`react-markdown\`.  
   \- Latência \< 200ms.

\#\# Checklist de Implementação da Fase 3

\*\*Objetivo:\*\* Desenvolver cartões simples e planilhas com funcionalidades de criação, edição, organização e suporte a Markdown, introduzindo modals avançados, ajuste automático de blocos, anexos e comentários.

\- \[ \] \*\*RF03: Área de Trabalho (Funcionalidade de Botões em Blocos):\*\*  
  \- \[ \] 3.1. Botão "Criar Cartão Novo":  
    \- \[ \] Criar cartão com edição simples na área de trabalho (título, descrição).  
    \- \[ \] Salvar e exibir no bloco.  
  \- \[ \] 3.1. Botão "Criar Planilha":  
    \- \[ \] Criar planilha com 2 colunas (tipo texto) e 1 linha.  
    \- \[ \] Abrir modal \`SpreadsheetDialog.tsx\` automaticamente.

\- \[ \] \*\*RF03: Área de Trabalho (Gerenciamento de Cartões):\*\*  
  \- \[ \] 3.2. Gerenciamento de cartões:  
    \- \[ \] Criar cartões com: Título (obrigatório), Descrição (Markdown), Checklist, Status.  
    \- \[ \] Comportamento do modal \`CardDialog.tsx\`:  
      \- \[ \] Primeira criação: Edição simples na área de trabalho.  
      \- \[ \] Clicar no cartão ou "Ver Cartão": Abrir modal de edição avançada.  
      \- \[ \] Botão "Editar Cartão": Ativar edição simples na área de trabalho.  
    \- \[ \] Modal \`CardDialog.tsx\`:  
      \- \[ \] Layout com duas colunas: principal (título, descrição, atividade) e lateral (ações).  
      \- \[ \] Campos: Título, Localização (ex.: "na lista A FAZER").  
      \- \[ \] Descrição: Textarea com botões de formatação (Aa, negrito, itálico, lista, link, imagem, anexo, Markdown, ajuda).  
      \- \[ \] Checklist: Adicionar/remover itens, marcar como concluído.  
      \- \[ \] Status: Seleção pendente/concluído (ícone visual).  
      \- \[ \] Anexos: Adicionar arquivos (imagens como miniaturas, outros com ícone/nome).  
      \- \[ \] Atividade: Comentários com Markdown, anexos, opções "Editar" e "Excluir", histórico de ações.  
      \- \[ \] Ações: Botões "Salvar", "Cancelar", "Arquivar", "Excluir", "Maximizar/Restaurar", "Ajuda".  
      \- \[ \] Barra lateral: Botões "Etiquetas", "Checklist", "Datas", "Anexo", "Mover", "Copiar", "Arquivar", "Compartilhar".  
      \- \[ \] Mover: Sub-janela com seleções de quadro, bloco e posição.  
      \- \[ \] Ajuda: Botão "?" com dicas de Markdown.  
    \- \[ \] Arquivar cartões.  
    \- \[ \] Excluir cartões.  
    \- \[ \] Arrastar cartões para reordenar no bloco.  
    \- \[ \] Arrastar cartões entre blocos.  
    \- \[ \] Menu de contexto: Editar, Abrir, Copiar, Colar, Arquivar, Excluir.

\- \[ \] \*\*RF03: Área de Trabalho (Gerenciamento de Planilhas \- Avançado):\*\*  
  \- \[ \] 3.3. Gerenciamento de planilhas:  
    \- \[ \] Criar planilhas com colunas personalizáveis (texto, número, data, hora, checkbox, link).  
    \- \[ \] Comportamento do modal \`SpreadsheetDialog.tsx\`:  
      \- \[ \] Primeira criação: Abrir modal automaticamente.  
      \- \[ \] Clicar na planilha ou "Ver Planilha": Abrir modal de edição avançada.  
      \- \[ \] Botão "Editar Planilha": Ativar edição simples na área de trabalho.  
    \- \[ \] Edição em tempo real na área de trabalho (\`SpreadsheetItem.tsx\`).  
    \- \[ \] Modal \`SpreadsheetDialog.tsx\`:  
      \- \[ \] Layout: Barra de ferramentas, tabela, barra lateral.  
      \- \[ \] Campos: Título editável.  
      \- \[ \] Tabela:  
        \- Cabeçalhos editáveis via popover (nome, tipo, largura, obrigatório).  
        \- Células editáveis por tipo (texto, número, data, hora, checkbox, link).  
        \- Resizers para colunas (mín. 50px) e linhas (mín. 25px).  
        \- Botões para adicionar/remover colunas e linhas.  
        \- Seleção múltipla de células via arrastar.  
        \- Menu de contexto para alterar tipo de célula.  
        \- Navegação com teclas de seta.  
        \- Coordenadas da célula selecionada (opcional: elemento dedicado).  
      \- \[ \] Barra de ferramentas:  
        \- Formatação (negrito, itálico, sublinhado, alinhamento, cor de texto, cor de fundo, fonte, tamanho).  
        \- Seleção de tipo de célula.  
        \- Alternar quebra de linha.  
        \- Redefinir tamanhos de colunas/linhas.  
      \- \[ \] Importação de tabelas Markdown via textarea e botão "Importar".  
      \- \[ \] Anexos: Botão "Adicionar Anexo".  
      \- \[ \] Ações: Botões "Salvar Tudo", "Cancelar", "Maximizar/Restaurar", "Checklist", "Etiquetas", "Mover", "Ajuda".  
      \- \[ \] Barra lateral: Botões "Copiar Planilha", "Arquivar Planilha", "Compartilhar", "Excluir Planilha".  
      \- \[ \] Responsividade: Rolagem horizontal para telas menores.  
    \- \[ \] Exibir colunas/linhas na área de trabalho com rolagem interna.  
    \- \[ \] Arrastar planilhas para reordenar no bloco.  
    \- \[ \] Arrastar planilhas entre blocos.  
    \- \[ \] Menu de contexto: Editar, Abrir, Copiar, Colar, Excluir.  
    \- \[ \] Arquivar planilhas.  
    \- \[ \] Excluir planilhas.

\- \[ \] \*\*RF05: Ajuste Automático de Blocos:\*\*  
  \- \[ \] 5.1. Implementar ajuste automático:  
    \- \[ \] Parâmetro \`blockAutoAdjustToSpreadsheet\` em \`CalendarioSettings\`.  
    \- \[ \] Ajustar largura (soma de \`column.width\` \+ 40px) e altura (\`rowCount \* 40px \+ 80px\`).  
    \- \[ \] Retornar ao padrão (\`defaultBlockWidth\`, \`defaultBlockHeight\`) quando desativado.  
    \- \[ \] Aplicar estilos dinâmicos em \`BlockComponent.tsx\`.

\- \[ \] \*\*RF03: Área de Trabalho (Inserir Arquivo):\*\*  
  \- \[ \] 3.7. Botão "Inserir Arquivo" nos modals:  
    \- \[ \] Adicionar arquivos em cartões e planilhas.  
    \- \[ \] Exibir imagens como miniaturas (\`FileItemComponent.tsx\`).  
    \- \[ \] Exibir outros arquivos como ícone com nome/extensão.  
    \- \[ \] Suportar anexos em comentários de cartões.  
    \- \[ \] Permitir remover anexos.

\- \[ \] \*\*RF07: Suporte a Markdown (Inicial):\*\*  
  \- \[ \] 7.2. Blocos de anotações:  
    \- \[ \] Renderizar Markdown (negrito, itálico, listas, links, citações, código, imagens).  
    \- \[ \] Exibir código Markdown na edição.  
    \- \[ \] Botões de formatação nos modals (Aa, negrito, itálico, lista, link, imagem, anexo, Markdown).  
  \- \[ \] 3.1. Opção "Inserir texto em Markdown" nos blocos:  
    \- \[ \] Renderizar Markdown inserido.  
  \- \[ \] 3.3. Importação de tabelas Markdown:  
    \- \[ \] Campo para colar Markdown e botão "Importar".

\- \[ \] \*\*RNF08: Interface Responsiva e Intuitiva:\*\*  
  \- \[ \] 8.1. Responsividade para cartões, planilhas e modals (TailwindCSS).  
  \- \[ \] 8.3. Navegação por teclado (Tab entre células, Enter para salvar).  
  \- \[ \] 8.6. Renderização rápida de Markdown (\`react-markdown\`).

\- \[ \] \*\*RF06: Salvamento (Cartões, Planilhas, Anexos, Comentários):\*\*  
  \- \[ \] 6.1. Salvar dados de cartões (título, descrição, checklist, status, anexos, comentários) em JSON.  
  \- \[ \] 6.1. Salvar dados de planilhas (título, colunas, linhas, estilos) in JSON.  
  \- \[ \] 6.1. Salvar anexos (referências de arquivos) em JSON.  
  \- \[ \] 6.1. Validar campos obrigatórios com feedback via toast.

\- \[ \] \*\*Arquitetura de Software:\*\*  
  \- \[ \] Implementar \`BaseDialog.tsx\` com layout de duas colunas e botões comuns.  
  \- \[ \] Criar \`CardDialog.tsx\` e \`SpreadsheetDialog.tsx\` herdando de \`BaseDialog.tsx\`.  
  \- \[ \] Desenvolver composables para Markdown, anexos e salvamento.  
  \- \[ \] Configurar \`CalendarioContext.tsx\` para gerenciar estado.

—-

\# Fase 3: Implementação de Cartões Simples e Planilhas (Funcionalidades Essenciais) \- Parte 2

\*\*Objetivo:\*\* Aprimorar os modals de edição de cartões (\`CardDialog.tsx\`) e planilhas (\`SpreadsheetDialog.tsx\`) com funcionalidades adicionais e correções de problemas identificados, garantindo consistência entre eles, usabilidade inspirada no Trello e suporte a requisitos pendentes. Implementar botões da barra lateral, notificações, ajustes no layout e melhorias no editor de texto, usando os códigos de referência HTML (1, 2, 4, 5, 7, 9, 10\) como guia visual.

\#\# Detalhes da Implementação

\#\#\# 1\. Modal de Edição de Cartões (\`CardDialog.tsx\`)

\- \*\*Cabeçalho:\*\*  
  \- Exibir "No bloco \[nome do bloco\]" (ex.: "No bloco A fazer") clicável, abrindo o pop-up de "Mover" (referência 4\) com seleções de quadro, bloco e posição.  
  \- Remover o segundo botão "X" (fechar), mantendo apenas um botão de fechamento no canto superior direito.  
  \- Remover o botão de interrogação (ajuda) para simplificar o layout.

\- \*\*Campo de Descrição:\*\*  
  \- Expandir para mínimo de 200px de altura, com crescimento dinâmico conforme o conteúdo aumenta.  
  \- Sem rolagem interna; a rolagem será gerenciada pela barra de rolagem do modal.

\- \*\*Barra de Rolagem do Modal:\*\*  
  \- Implementar barra de rolagem no modal, visível na área de trabalho, para acomodar conteúdos extensos (ex.: checklists longos, comentários, anexos).  
  \- Garantir que o modal não ultrapasse os limites da tela sem rolagem.

\- \*\*Barra Lateral (Ações):\*\*  
  \- \*\*Comportamento Geral dos Pop-ups:\*\*  
    \- Todos os pop-ups (etiquetas, checklist, datas, mover, capa) fecham ao:  
      \- Clicar fora do pop-up (incluindo dentro do modal, mas fora do pop-up), retornando o foco ao modal.  
    \- Alinhar o posicionamento dos pop-ups abaixo ou próximo ao botão que os acionou, evitando que apareçam no final do modal.  
  \- \*\*Etiquetas:\*\*  
    \- Botão abre pop-up (referência 5\) com campo de busca, lista de etiquetas existentes, opção de criar nova etiqueta (nome e cor), e botão "Aplicar".  
    \- Funcionalidade de pesquisa básica implementada; pesquisa avançada será tratada na Fase 4\.  
  \- \*\*Checklist:\*\*  
    \- Corrigir a integração entre o pop-up (\`ChecklistPopUp.tsx\`) e o modal:  
      \- Itens adicionados no pop-up devem ser exibidos no modal imediatamente.  
    \- \*\*Criação e Exibição:\*\*  
      \- Pop-up exibe campo de texto para nome do checklist, com botão "Adicionar" ou Enter para criar.  
      \- Lista de checklists no modal com título editável (clicar para editar), barra de progresso (ex.: 50% se 1 de 2 itens marcados), e menu de contexto (três pontinhos) com opção "Excluir" (sem confirmação).  
    \- \*\*Adição de Itens:\*\*  
      \- Botão "Adicionar Item" abaixo de cada checklist no modal.  
      \- Ao clicar: exibir campo de texto com botões "Adicionar", "Cancelar" e "Data de Entrega" (visíveis apenas durante a adição).  
      \- Enter adiciona o item e mantém o campo aberto para itens consecutivos; "Adicionar" confirma e limpa o campo; "Cancelar" fecha o campo.  
      \- "Data de Entrega" abre pop-up (referência 1\) para definir data de início, entrega e lembrete.  
    \- \*\*Gerenciamento de Itens:\*\*  
      \- Itens exibem menu de contexto (três pontinhos) com "Renomear", "Excluir" (sem confirmação), e "Marcar/Desmarcar como Feito".  
      \- Ícone de relógio ao passar o mouse para editar data de entrega.  
      \- Suporte a arrastar e soltar para reordenar itens e checklists.  
  \- \*\*Datas:\*\*  
    \- Pop-up (referência 1\) com campos para data de início, entrega e lembrete (ex.: "1 dia antes"), fechando ao clicar fora ou salvar.  
    \- Integrar com notificações no sino para datas de vencimento.  
  \- \*\*Mover:\*\*  
    \- Pop-up (referência 4\) com seleções de quadro, bloco e posição, e botão "Mover".  
    \- Implementar lógica para atualizar a posição do cartão na área de trabalho após a movimentação.  
    \- Exibir notificação no sino após conclusão.  
  \- \*\*Capa:\*\*  
    \- Pop-up (referência 2\) com cores predefinidas, campo para cor personalizada, e botão "Remover Capa".  
    \- Exibir a capa no topo do modal e na área de trabalho (referência 9).  
  \- \*\*Compartilhar:\*\*  
    \- Botão presente visualmente, mas sem funcionalidade (a definir na Fase 4).  
  \- \*\*Arquivar:\*\*  
    \- Botão presente, mas sem funcionalidade (implementação completa na Fase 4).  
  \- \*\*Copiar:\*\*  
    \- Botão presente, mas sem funcionalidade (a definir na Fase 4).  
  \- \*\*Anexo:\*\*  
    \- Permitir upload de arquivos (imagens como miniaturas, outros como ícone/nome).  
    \- Implementar download e visualização (ex.: abrir imagens/vídeos em nova aba ou modal).

\- \*\*Atividades e Comentários:\*\*  
  \- \*\*Seção Atividade:\*\*  
    \- Botão "Mostrar Detalhes"/"Ocultar Detalhes" (referência 7\) para exibir histórico de ações (ex.: "Checklist adicionado", "Item concluído").  
    \- Integrar ações do checklist ao histórico.  
  \- \*\*Comentários:\*\*  
    \- Campo para adicionar comentários abaixo da seção "Atividade", com botão "Enviar" (Enter confirma).  
    \- Suporte a Markdown usando \`react-markdown\` para formatação (ex.: negrito, listas).  
    \- Hover em comentários exibe menu de três pontinhos com "Editar" e "Excluir".  
    \- Notificações contextuais no modal para ações de comentários.

\- \*\*Editor de Texto (TipTap):\*\*  
  \- Substituir o textarea atual por um editor TipTap funcional:  
    \- \*\*Modo Visualização:\*\* Após salvar (botão "Salvar" ou "Concluir"), exibir texto formatado (Markdown renderizado ou formatação direta).  
    \- \*\*Modo Edição:\*\* Clicar no texto formatado reabre o TipTap para edição.  
    \- Suporte a formatação (negrito, itálico, listas, etc.) e Markdown.  
    \- Botões "Salvar" e "Cancelar" visíveis durante a edição.  
    \- Crescimento dinâmico do campo, sem rolagem interna; rolagem gerenciada pelo modal.  
    \- Opção "Ver mais..." para recolher/expandir textos longos.

\- \*\*Maximização do Modal:\*\*  
  \- Botão "Maximizar/Restaurar" expande o modal para ocupar toda a tela, ocultando a área de trabalho.  
  \- Modal maximizado usa barra de rolagem interna; opções de fechamento: "X", "Cancelar" ou "Salvar".

\#\#\# 2\. Modal de Edição de Planilhas (\`SpreadsheetDialog.tsx\`)

\- \*\*Cabeçalho:\*\*  
  \- Mesma implementação do modal de cartões: "No bloco \[nome do bloco\]" clicável (pop-up referência 4), apenas um botão "X".  
\- \*\*Campo de Descrição:\*\*  
  \- Expandir para 200px (se aplicável), com crescimento dinâmico e rolagem via modal.  
\- \*\*Barra Lateral (Ações):\*\*  
  \- Implementar os mesmos botões do modal de cartões (etiquetas, checklist, datas, mover, capa, compartilhar, arquivar, copiar, anexo) com idêntica funcionalidade e comportamento de pop-ups.  
\- \*\*Atividades e Comentários:\*\*  
  \- Mesma implementação do modal de cartões, com suporte a Markdown e histórico de ações.  
\- \*\*Editor de Texto (TipTap):\*\*  
  \- Aplicar a mesma lógica do modal de cartões para notas ou campos de texto.  
\- \*\*Maximização:\*\*  
  \- Igual ao modal de cartões, com rolagem interna quando maximizado.

\#\#\# 3\. Notificações

\- \*\*Ícone de Sino:\*\*  
  \- Posicionado no cabeçalho, à direita da barra de pesquisa.  
\- \*\*Comportamento:\*\*  
  \- Exibir notificações destacadas (ex.: fundo vermelho) para lembretes (datas de vencimento) e ações (ex.: "Cartão movido").  
  \- Clicar na notificação abre o contexto (modal do cartão/planilha).

\#\#\# 4\. Consistência entre Modals

\- Garantir layout idêntico na barra lateral, seções de atividades/comentários, comportamento de pop-ups e maximização em ambos os modals.

\#\#\# 5\. Arquitetura de Software

\- \*\*Componente Base (\`BaseDialog.tsx\`):\*\*  
  \- Reutilizar para layout de duas colunas, botões comuns ("Salvar", "Cancelar", "Excluir", "Maximizar/Restaurar"), e lógica de rolagem/fechamento.  
\- \*\*Pop-ups:\*\*  
  \- Componentes React (\`EtiquetaPopUp.tsx\`, \`ChecklistPopUp.tsx\`, etc.) com posicionamento dinâmico.  
\- \*\*Estado:\*\*  
  \- Gerenciar via \`CalendarioContext.tsx\` (notificações, checklists, anexos, etc.).  
\- \*\*Estilos:\*\*  
  \- TailwindCSS para responsividade e consistência.

\#\#\# 6\. Sistema de Salvamento

\- Salvar em JSON no \`localStorage\`: etiquetas, checklists (itens e marcações), datas, capas, atividades, comentários e anexos.  
\- Validar campos obrigatórios (ex.: título do cartão/checklist).

\#\#\# 7\. Interface Responsiva e Desempenho

\- Modals e pop-ups responsivos com TailwindCSS.  
\- Latência \< 200ms para abertura de pop-ups, adição de itens e renderização.  
\- Usar \`react-markdown\` para comentários e TipTap para edição de texto.

\#\# Checklist de Implementação \- Fase 3 (Parte 2\)

\*\*Objetivo:\*\* Corrigir e aprimorar os modals de cartões e planilhas, implementando funcionalidades pendentes e garantindo usabilidade.

\- \[ \] \*\*RF03: Modal de Edição de Cartões (\`CardDialog.tsx\`):\*\*  
  \- \[ \] Cabeçalho:  
    \- \[ \] "No bloco \[nome\]" clicável para pop-up de "Mover" (referência 4).  
    \- \[ \] Apenas um botão "X".  
  \- \[ \] Campo de Descrição:  
    \- \[ \] Crescimento dinâmico com TipTap (sem rolagem interna).  
  \- \[ \] Barra de Rolagem:  
    \- \[ \] Implementar rolagem no modal via área de trabalho.  
  \- \[ \] Barra Lateral:  
    \- \[ \] Pop-ups fecham ao clicar fora (inclusive no modal) ou concluir ação.  
    \- \[ \] Etiquetas: Pop-up (referência 5\) com busca, criação e aplicação.  
    \- \[ \] Checklist:  
      \- \[ \] Corrigir exibição de itens do pop-up no modal.  
      \- \[ \] Criação: Campo de texto, "Adicionar"/Enter, lista com progresso e exclusão.  
      \- \[ \] Itens: "Adicionar Item", campo com "Adicionar"/"Cancelar"/"Data de Entrega", Enter para itens consecutivos.  
      \- \[ \] Menu de contexto: "Renomear", "Excluir", "Marcar/Desmarcar", ícone de relógio.  
      \- \[ \] Reordenação via arrastar e soltar.  
    \- \[ \] Datas: Pop-up (referência 1\) com notificações.  
    \- \[ \] Mover: Pop-up (referência 4\) com lógica de movimentação e notificação.  
    \- \[ \] Capa: Pop-up (referência 2\) com exibição no modal e área de trabalho.  
    \- \[ \] Compartilhar: Visual, sem funcionalidade.  
    \- \[ \] Arquivar: Visual, sem funcionalidade.  
    \- \[ \] Copiar: Visual, sem funcionalidade.  
    \- \[ \] Anexo: Upload, download e visualização de arquivos.  
  \- \[ \] Atividades: "Mostrar Detalhes"/"Ocultar Detalhes" com histórico de checklist.  
  \- \[ \] Comentários:  
    \- \[ \] Campo com "Enviar" (Enter), Markdown, menu "Editar"/"Excluir", notificações.  
  \- \[ \] Editor TipTap:  
    \- \[ \] Modos visualização/edição, formatação, botões "Salvar"/"Cancelar", "Ver mais...".  
  \- \[ \] Maximização:  
    \- \[ \] Ocupar tela inteira com rolagem interna.

\- \[ \] \*\*RF03: Modal de Edição de Planilhas (\`SpreadsheetDialog.tsx\`):\*\*  
  \- \[ \] Cabeçalho: Igual ao de cartões.  
  \- \[ \] Campo de Descrição: Crescimento dinâmico com TipTap.  
  \- \[ \] Barra Lateral: Mesmas ações do modal de cartões.  
  \- \[ \] Atividades e Comentários: Igual ao de cartões.  
  \- \[ \] Maximização: Igual ao de cartões.

\- \[ \] \*\*RF03: Notificações:\*\*  
  \- \[ \] Sino com notificações destacadas e clicáveis.

\- \[ \] \*\*RF03: Consistência nos Modals:\*\*  
  \- \[ \] Layout e comportamento idênticos.

\- \[ \] \*\*RF06: Salvamento:\*\*  
  \- \[ \] Salvar todos os dados em JSON com validação.

\- \[ \] \*\*RNF08: Interface Responsiva:\*\*  
  \- \[ \] Responsividade e latência \< 200ms.

\---

*\# Fase 4: Funcionalidades Avançadas, Personalização e Otimizações*

\*\*Objetivo:\*\* Implementar recursos avançados, opções de personalização da interface, ajustes na área de trabalho e otimizações de desempenho, garantindo uma experiência de usuário mais fluida e eficiente no sistema "Calendário".

*\#\# Detalhes da Implementação*

*\#\#\# 1\. Configurações Avançadas*  
\- \*\*Pop-up de Configurações:\*\*  
  \- Acessível por um ícone na barra lateral ou no cabeçalho.  
  \- Organizado em abas: \*\*Geral\*\*, \*\*Aparência\*\*, \*\*Dados\*\* e \*\*Área de Trabalho\*\*.  
  \- \*\*Aba Aparência:\*\*  
    \- Opção para mudar o wallpaper (upload de imagem ou cor sólida).  
    \- Escolha entre tema claro ou escuro para o sistema.  
  \- \*\*Aba Área de Trabalho:\*\*  
    \- \*\*"Orientação da Rolagem"\*\*: Horizontal (padrão) ou vertical.  
    \- \*\*"Tamanhos Padrão"\*\*: Definir largura e altura padrão para blocos, planilhas e cartões (em pixels ou porcentagem).  
    \- \*\*"Ajuste Automático de Blocos à Planilha"\*\* (\`blockFitToSpreadsheetSize\`):  
      \- \*\*Ativado:\*\* Os blocos se ajustam ao tamanho total da planilha (largura: soma das colunas \+ margens; altura: linhas \+ cabeçalho), sem rolagem interna. A rolagem fica na área de trabalho.  
      \- \*\*Desativado (padrão):\*\* Blocos têm tamanhos fixos, com rolagem interna nas planilhas.  
    \- \*\*"Ocultar Descrição dos Cartões"\*\* (\`hideCardDescription\`):  
      \- \*\*Ativado:\*\* Mostra só o título dos cartões na área de trabalho (estilo Trello).  
      \- \*\*Desativado (padrão):\*\* Mostra título e descrição.  
  \- \*\*Aba Dados:\*\*  
    \- \*\*"Edição de Planilhas"\*\*: Escolher entre editar direto na área de trabalho ou via janela pop-up.  
    \- Botão \*\*"Exportar Dados"\*\*: Salvar os dados como arquivo JSON.  
    \- Botão \*\*"Importar Dados"\*\*: Carregar dados de um arquivo JSON.  
  \- \*\*Aba Geral:\*\*  
    \- \*\*"Salvamento Automático"\*\*: Escolher o intervalo (ex.: 30s, 1min, ou desligado).  
    \- \*\*"Alinhamento de Blocos"\*\*: Novos blocos se alinham horizontalmente até o limite da tela, continuando na mesma linha com rolagem (se horizontal estiver ativo).

*\#\#\# 2\. Área de Trabalho*  
\- \*\*Ajuste Dinâmico dos Blocos:\*\*  
  \- Com \`blockFitToSpreadsheetSize\` ativado, os blocos se expandem para o tamanho da planilha, usando a rolagem da área de trabalho.  
  \- Com \`hideCardDescription\` ativado, os cartões mostram apenas o título.  
\- \*\*Rolagem Vertical (Opcional):\*\*  
  \- Se a rolagem for vertical, os blocos ficam em "prateleiras" horizontais, ocupando o espaço disponível e passando para a próxima linha quando necessário.  
\- \*\*Arrastar Múltiplos Itens:\*\*  
  \- Seleção múltipla (Ctrl \+ clique) para mover ou copiar blocos, cartões e planilhas de uma vez.  
\- \*\*Papel de Parede por Quadro:\*\*  
  \- Cada quadro pode ter seu próprio wallpaper, configurável pelo menu de contexto ou pelos três pontinhos na barra lateral.

*\#\#\# 3\. Otimizações de Desempenho*  
\- \*\*Virtualização de Tabelas:\*\*  
  \- Para planilhas grandes, só carregar as células visíveis na tela.  
\- \*\*Lazy Loading:\*\*  
  \- Carregar apenas os blocos e conteúdos visíveis ou próximos na área de trabalho, com uma barra de progresso para carregamentos longos.  
\- \*\*Renderização Rápida:\*\*  
  \- Garantir que ajustes de blocos, renderização de texto e abertura de janelas levem menos de 200ms.  
\- \*\*Otimização de Imagens:\*\*  
  \- Comprimir wallpapers e imagens anexadas para não pesar o sistema.

*\#\#\# 4\. Sistema de Arquivamento*  
\- \*\*Arquivamento de Itens:\*\*  
  \- Quadros, blocos, planilhas e cartões podem ser arquivados.  
  \- Itens arquivados vão para a seção "Arquivos" na barra lateral.  
\- \*\*Seção "Arquivos":\*\*  
  \- Mostra os itens arquivados com opções para:  
    \- Restaurar ao lugar original.  
    \- Excluir permanentemente (com confirmação).  
    \- Filtrar por tipo (quadro, bloco, etc.) ou data.  
\- \*\*Integração:\*\*  
  \- Botão "Arquivar" nos pop-ups de cartões e planilhas passa a funcionar, enviando os itens para "Arquivos".

*\#\#\# 5\. Barra Lateral*  
\- \*\*Seção "Quadros":\*\*  
  \- Opções de arquivar quadros, mover para pastas, organizar em árvore e fixar quadros importantes.  
\- \*\*Botão "Calendário":\*\*  
  \- Adicionar o botão com ícone na barra lateral (funcionalidade completa virá na Fase 5).

*\#\#\# 6\. Pesquisa Avançada*  
\- \*\*Barra de Pesquisa:\*\*  
  \- Filtrar quadros, blocos, planilhas e cartões em tempo real.  
  \- Mostrar resultados num menu suspenso com prévia (títulos ou trechos).  
  \- Adicionar ícone de filtros avançados (ex.: por tipo ou quadro), com detalhes na Fase 5\.

*\#\#\# 7\. Suporte a Markdown*  
\- \*\*Tabelas via Markdown:\*\*  
  \- Nos três pontinhos do bloco, opção para criar tabelas com Markdown, que viram tabelas editáveis visualmente.

*\#\#\# 8\. Sistema de Salvamento*  
\- \*\*Salvamento Automático:\*\*  
  \- Configurar intervalos de salvamento automático.  
\- \*\*Histórico de Versões:\*\*  
  \- Guardar as últimas 5 versões dos dados, com opção de voltar atrás nas configurações.

*\#\# Checklist da Fase 4*  
\- \[ \] \*\*Configurações Avançadas:\*\*  
  \- \[ \] Pop-up com abas: Geral, Aparência, Dados, Área de Trabalho.  
  \- \[ \] Wallpaper e temas claro/escuro.  
  \- \[ \] Parâmetros: rolagem, tamanhos, \`blockFitToSpreadsheetSize\`, \`hideCardDescription\`.  
  \- \[ \] Edição de planilhas, exportação e importação de dados.  
  \- \[ \] Salvamento automático e alinhamento de blocos.  
\- \[ \] \*\*Área de Trabalho:\*\*  
  \- \[ \] Ajuste dinâmico dos blocos e ocultamento de descrições.  
  \- \[ \] Rolagem vertical com "prateleiras".  
  \- \[ \] Seleção múltipla e wallpaper por quadro.  
\- \[ \] \*\*Otimizações de Desempenho:\*\*  
  \- \[ \] Virtualização de tabelas e lazy loading.  
  \- \[ \] Compressão de imagens e renderização em \< 200ms.  
\- \[ \] \*\*Sistema de Arquivamento:\*\*  
  \- \[ \] Arquivar itens e criar seção "Arquivos" com restauração e exclusão.  
\- \[ \] \*\*Barra Lateral:\*\*  
  \- \[ \] Funcionalidades de quadros e botão "Calendário" visual.  
\- \[ \] \*\*Pesquisa Avançada:\*\*  
  \- \[ \] Filtro em tempo real e ícone de filtros.  
\- \[ \] \*\*Markdown:\*\*  
  \- \[ \] Criar tabelas via Markdown.  
\- \[ \] \*\*Salvamento:\*\*  
  \- \[ \] Salvamento automático e histórico de versões.

\---

\#\# Fase 5: Finalização, Arquivamento, Documentação Interna e Revisão Geral

\*\*Objetivo:\*\* Concluir todas as funcionalidades restantes, implementar o sistema de arquivamento, adicionar documentação interna ao sistema e realizar uma revisão completa para garantir a qualidade e conformidade com todos os requisitos.

\*\*Detalhes da Implementação:\*\*

1\.  \*\*Botão "Calendário" na Barra Lateral (RF02.2 Completo):\*\*  
    \* Implementar o botão "Calendário" com ícone, que exibe um calendário interativo na área de trabalho. A interatividade pode incluir visualização de itens com datas ou criação rápida de eventos/cartões.

2\.  \*\*Área de Arquivos (RF04 Completo):\*\*  
    \* Criar a seção "Arquivos" na barra lateral.  
    \* Armazenar itens arquivados (quadros, blocos, planilhas, cartões, arquivos, fotos, pastas) (RF04.1).  
    \* Implementar arquivamento de quadros inteiros (RF04.2).  
    \* Funcionalidades da área de arquivos (RF04.3):  
        \* Restaurar itens para sua localização original.  
        \* Excluir permanentemente itens arquivados (com confirmação).  
        \* Filtrar itens arquivados por tipo e data.

3\.  \*\*Instruções Finais de Implementação e Boas Práticas:\*\*  
    \* Garantir que o backend segue estritamente os padrões RESTful (GET/POST para dados, endpoints \`/api/boards\`, etc.).  
    \* Revisar a modularidade e boas práticas em todo o código (frontend e backend).  
    \* Incluir exemplos de dados iniciais (quadros, planilhas, cartões com Markdown) para popular o sistema na primeira utilização.  
    \* Validar todos os campos obrigatórios e confirmar todas as ações críticas (ex.: exclusão permanente).

4\.  \*\*Documentação Interna do Sistema (Conforme Instruções para Implementação):\*\*  
    \* Criar um quadro no sistema (ex: "Documentação do Sistema").  
    \* Dentro deste quadro, em um cartão, incluir uma árvore de funções/componentes que permita visualizar a estrutura de diretórios e funções/componentes principais do sistema. Esta árvore deve ser interativa (ex: expansível/recolhível) para facilitar a navegação e compreensão da arquitetura do código.

5\.  \*\*Revisão Final e Testes:\*\*  
    \* Testar exaustivamente todas as funcionalidades listadas nos Requisitos Funcionais (RF01 a RF07).  
    \* Verificar o cumprimento de todos os Requisitos Não Funcionais (RNF08), especialmente responsividade em diversos dispositivos e desempenho geral.  
    \* Conferir o checklist completo para garantir que todos os itens foram abordados.  
    \* Refinar a interface do usuário e a experiência do usuário com base nos testes.

 agora que nós já fizemos a base do projeto eu vi que muita coisa não foi implantado eu vou revisar o projeto inteiro com você em fases Ou seja eu vou mandar para você fazer um dois três quatro e cinco assim por diante para nós revisarmos tudo que está faltando 

—--------

\# Checklist Detalhado de Implementação do Sistema "Calendário" por Fases

\#\# Fase 1: Fundação do Sistema e Interface Principal

\*\*Objetivo:\*\* Estabelecer a estrutura base da aplicação, incluindo o layout principal, navegação essencial e as primeiras funcionalidades de criação de conteúdo.

\- \[ \] \*\*Configuração Inicial do Projeto:\*\*  
  \- \[ \] Estruturar o frontend com HTML, CSS, JavaScript.  
  \- \[ \] Integrar TailwindCSS ao projeto frontend.  
  \- \[ \] Definir a arquitetura básica do backend RESTful (tecnologia livre, ex: Node.js, Python, Java).  
  \- \[ \] Configurar endpoints iniciais do backend para quadros (ex: \`/api/boards\`).  
  \- \[ \] Implementar função de utilidade \`generateId()\` para IDs únicos.  
  \- \[ \] Implementar função de utilidade \`checkRequiredFields()\` para validação de campos.  
  \- \[ \] Implementar função de utilidade básica \`saveData()\` para localStorage (com estrutura para futura integração com backend).  
\- \[ \] \*\*RF01: Cabeçalho (Parcial):\*\*  
  \- \[ \] 1.1. Exibir o nome "Calendário" com ícone de calendário à esquerda.  
  \- \[ \] 1.2. Implementar visualmente o Botão "Criar Quadro" com ícone "+" e cor destacada (ex.: azul).  
  \- \[ \] 1.4. Não exibir ícone de foto de perfil (sem suporte a usuários).  
\- \[ \] \*\*RF02: Barra Lateral (Parcial):\*\*  
  \- \[ \] 2.1. Não incluir seção de usuário (sem ícone ou letra "G").  
  \- \[ \] 2.3. Botão "Recolher Barra Lateral" com ícone de seta:  
    \- \[ \] Localizado no topo da barra lateral, abaixo do (futuro) botão "Calendário".  
    \- \[ \] Funcionalidade: Recolhe a barra lateral, exibindo apenas os ícones dos botões.  
    \- \[ \] Funcionalidade: Clicar novamente expande a barra lateral, restaurando a visualização completa.  
    \- \[ \] Funcionalidade: Área de trabalho se ajusta automaticamente ao recolher/expandir.  
  \- \[ \] 2.5. Seção "Quadros" (Estrutura Inicial):  
    \- \[ \] Implementar a listagem inicial de quadros (pode estar vazia ou com dados de exemplo).  
    \- \[ \] Implementar visualmente o botão "+" para criar "Novo Quadro" na seção "Quadros".  
\- \[ \] \*\*RF03: Área de Trabalho (Parcial):\*\*  
  \- \[ \] 3.4. Barra de scroll:  
    \- \[ \] Restrita à área de trabalho.  
    \- \[ \] Ajuste dinâmico inicial (horizontal/vertical).  
    \- \[ \] \*\*Rolagem Horizontal (padrão)\*\*:  
      \- \[ \] Área de trabalho rola horizontalmente (estilo Trello).  
      \- \[ \] Blocos devem ter espaço suficiente para crescer horizontalmente.  
      \- \[ \] Espaço inicial da área de trabalho adaptável à tela do cliente (mínimo: tamanho total da tela).  
\- \[ \] \*\*RF06: Salvamento (Parcial):\*\*  
  \- \[ \] 6.1. Salvar dados básicos dos quadros em JSON (inicialmente em um único arquivo JSON via localStorage).  
  \- \[ \] 6.2. Implementar validação básica do JSON ao carregar os dados.  
\- \[ \] \*\*RNF08: Interface Responsiva e Intuitiva (Parcial):\*\*  
  \- \[ \] 8.1. Aplicar TailwindCSS para garantir que a estrutura básica do layout (cabeçalho, barra lateral, área de trabalho) seja responsiva.

\#\# Fase 2: Gerenciamento de Quadros, Pastas e Blocos

\*\*Objetivo:\*\* Implementar funcionalidades completas para criação, organização e manipulação de quadros, pastas e blocos.

\- \[ \] \*\*RF01: Cabeçalho (Funcionalidade):\*\*  
  \- \[ \] 1.2. Funcionalidade completa do Botão "Criar Quadro": cria um novo quadro diretamente, sem opções intermediárias, e o adiciona à lista.  
\- \[ \] \*\*RF02: Barra Lateral (Seção "Quadros" Completa):\*\*  
  \- \[ \] 2.5. Seção "Quadros":  
    \- \[ \] Funcionalidade completa do botão "+" para "Novo Quadro" (adiciona à lista e salva).  
    \- \[ \] Cada quadro na lista deve ter:  
      \- \[ \] Hover funcional (feedback visual ao passar o mouse).  
      \- \[ \] Ícone de três pontos com opções iniciais: "Renomear", "Deletar" (Arquivar e Mover para pasta virão depois).  
      \- \[ \] Funcionalidade de Renomear quadro.  
      \- \[ \] Funcionalidade de Deletar quadro (com confirmação).  
    \- \[ \] Pastas para organizar quadros:  
      \- \[ \] Funcionalidade para Criar nova pasta.  
      \- \[ \] Funcionalidade para Renomear pasta.  
      \- \[ \] Funcionalidade para Deletar pasta (com confirmação, e tratamento de quadros dentro).  
      \- \[ \] Funcionalidade básica de Arrastar quadros/pastas para reordenar ou mover quadros para dentro/fora de pastas.  
      \- \[ \] Implementar Visualização em árvore (expandir/recolher) para pastas.  
      \- \[ \] Implementar visualmente a Opção de "Fixar" quadros/pastas no topo (cores/ícones personalizáveis \- funcionalidade completa depois).  
\- \[ \] \*\*RF03: Área de Trabalho (Gerenciamento de Blocos):\*\*  
  \- \[ \] 3.1. Gerenciamento de blocos:  
    \- \[ \] Adicionar blocos com nome personalizável a um quadro.  
    \- \[ \] Editar nome de blocos.  
    \- \[ \] Remover blocos.  
    \- \[ \] Arrastar e soltar blocos para reorganização dentro do quadro.  
    \- \[ \] Implementar visualmente os Três botões embaixo de cada bloco: "Inserir Arquivo", "Criar Cartão Novo", "Criar Planilha".  
    \- \[ \] Implementar visualmente a Opção nos três pontinhos do bloco: "Inserir texto em Markdown", "Criar Tabela via Markdown".  
  \- \[ \] 3.6. Clicar e arrastar (Prévia visual para blocos):  
    \- \[ \] Exibir prévia visual (sombra/contorno) ao arrastar blocos.  
\- \[ \] \*\*RF06: Salvamento (Quadros, Pastas, Blocos):\*\*  
  \- \[ \] 6.1. Salvar dados de pastas (estrutura e conteúdo) em JSON.  
  \- \[ \] 6.1. Salvar dados de blocos (nomes, ordem, a qual quadro pertencem) em JSON.  
  \- \[ \] 6.1. Implementar o salvamento de cada quadro em um arquivo JSON separado (se utilizando backend para arquivos) ou estrutura equivalente no localStorage.

\#\# Fase 3: Implementação de Cartões Simples e Planilhas (Funcionalidades Essenciais)

\*\*Objetivo:\*\* Desenvolver os elementos de conteúdo detalhados: cartões simples e planilhas, incluindo suas funcionalidades básicas de criação, edição, organização e introdução ao Markdown.

\- \[ \] \*\*RF03: Área de Trabalho (Funcionalidade de Botões em Blocos):\*\*  
  \- \[ \] 3.1. Funcionalidade do botão "Criar Cartão Novo" em blocos.  
  \- \[ \] 3.1. Funcionalidade do botão "Criar Planilha" em blocos (criação básica).  
\- \[ \] \*\*RF03: Área de Trabalho (Gerenciamento de Cartões):\*\*  
  \- \[ \] 3.2. Gerenciamento de cartões:  
    \- \[ \] Criar cartões com: Título, Descrição (suporte inicial a Markdown), Checklist (adicionar/remover/marcar itens), Status (pendente/concluído).  
    \- \[ \] Implementar funcionalidade básica de Arquivar cartões.  
    \- \[ \] Implementar funcionalidade de Excluir cartões.  
    \- \[ \] Arrastar cartões para reordenar dentro de um bloco.  
    \- \[ \] Arrastar cartões para mover entre blocos diferentes.  
    \- \[ \] Menu de contexto para cartões (clique direito ou ícone de três pontos): Editar, Abrir, Copiar, Colar, Arquivar (básico), Excluir.  
    \- \[ \] Anexar arquivos pequenos (PDFs, links) aos cartões (upload/link e armazenamento da referência).  
    \- \[ \] Tela de configuração do cartão (modal/popup) com botões funcionais: "Salvar", "Arquivar", "Excluir".  
\- \[ \] \*\*RF03: Área de Trabalho (Gerenciamento de Planilhas \- Básico):\*\*  
  \- \[ \] 3.3. Gerenciamento de planilhas:  
    \- \[ \] Criar planilhas (interface de criação, não via Markdown ainda).  
    \- \[ \] Colunas personalizáveis (implementar tipos iniciais: texto, número, data).  
    \- \[ \] Edição em tempo real de células (para os tipos de coluna implementados).  
    \- \[ \] Adicionar/remover colunas dinamicamente.  
    \- \[ \] Adicionar/remover linhas dinamicamente.  
    \- \[ \] Arrastar planilhas para reordenar dentro de um bloco.  
    \- \[ \] Arrastar planilhas para mover entre blocos diferentes.  
    \- \[ \] Menu de contexto básico para planilhas: Editar, Abrir, Copiar, Colar, Excluir.  
    \- \[ \] Tela de configuração da planilha (modal/popup) com botões funcionais: "Salvar", "Arquivar", "Excluir".  
\- \[ \] \*\*RF03: Área de Trabalho (Inserir Arquivo):\*\*  
  \- \[ \] 3.7. Inserir arquivo (Funcionalidade do botão "Inserir Arquivo" em blocos):  
    \- \[ \] Imagens devem ser exibidas como miniaturas no bloco após inserção.  
    \- \[ \] Outros tipos de arquivos devem ser exibidos como um logotipo de arquivo com nome e extensão.  
\- \[ \] \*\*RF07: Suporte a Markdown (Inicial):\*\*  
  \- \[ \] 7.2. Blocos de anotações (para descrição de cartões e texto em blocos):  
    \- \[ \] Renderizar texto formatado em Markdown (negrito, itálico, listas, links básicos, checkboxes de visualização).  
    \- \[ \] Edição do campo deve exibir o código Markdown original.  
  \- \[ \] 3.1. Funcionalidade da opção "Inserir texto em Markdown" nos blocos (renderizar o Markdown inserido).  
\- \[ \] \*\*RNF08: Interface Responsiva e Intuitiva (Markdown):\*\*  
  \- \[ \] 8.6. Implementar ou integrar biblioteca otimizada para renderização rápida de Markdown.  
\- \[ \] \*\*RF06: Salvamento (Cartões, Planilhas, Anexos):\*\*  
  \- \[ \] 6.1. Salvar dados de cartões (título, descrição Markdown, checklist, status, anexos) em JSON.  
  \- \[ \] 6.1. Salvar dados de planilhas básicas (estrutura de colunas, dados das células) em JSON.

\#\# Fase 4: Funcionalidades Avançadas, Personalização e Otimizações

\*\*Objetivo:\*\* Implementar recursos avançados, opções de personalização da interface, e otimizar o desempenho e a usabilidade do sistema.

\- \[ \] \*\*RF01: Cabeçalho (Pesquisa):\*\*  
  \- \[ \] 1.3. Barra de pesquisa no lado direito:  
    \- \[ \] Filtragem dinâmica (em tempo real) de quadros, blocos, planilhas, cartões e palavras-chave contidas neles.  
    \- \[ \] Exibição de resultados em dropdown com prévia (títulos ou trechos relevantes).  
    \- \[ \] Implementar filtros opcionais via ícone de funil (ex.: filtrar por tipo de item \- quadro, planilha, cartão; filtrar dentro de um quadro específico).  
\- \[ \] \*\*RF02: Barra Lateral / RF05: Configurações (Pop-up de Configurações):\*\*  
  \- \[ \] 2.4. / 5.1. Pop-up de configurações acessível (ex: ícone na barra lateral):  
    \- \[ \] Estrutura do pop-up com abas: Geral, Aparência, Dados.  
    \- \[ \] \*\*Aba Aparência Geral\*\*:  
      \- \[ \] Funcionalidade de Alteração de wallpaper (upload de imagens ou seleção de cores sólidas) para o fundo geral.  
      \- \[ \] Funcionalidade de Tema claro/escuro para toda a aplicação.  
    \- \[ \] \*\*Aba Área de Trabalho\*\*:  
      \- \[ \] Parâmetro "Orientação da Rolagem" (horizontal ou vertical) com efeito na área de trabalho.  
      \- \[ \] Parâmetro para definir Tamanhos padrão para blocos, planilhas e cartões (opções: pixels, porcentagem ou presets).  
      \- \[ \] Parâmetro "Ajuste Automático de Blocos" (expansão de blocos para acomodar planilhas grandes, se ativado).  
    \- \[ \] \*\*Aba Comportamento de Planilhas\*\*:  
      \- \[ \] Parâmetro "Edição de Planilhas na Área de Trabalho" (edição direta na célula ou via modal).  
      \- \[ \] Parâmetro/Botão para "Editar dados dentro do sistema" (habilitar/desabilitar edição global ou similar).  
      \- \[ \] Funcionalidade para "Exportar Dados como JSON" (do quadro atual ou todos os dados).  
      \- \[ \] Funcionalidade para "Importar Dados" de um arquivo JSON.  
    \- \[ \] Parâmetro "Ajuste Automático de Blocos à Planilha":  
        \- \[ \] Se ativado, blocos se ajustam ao tamanho da planilha, eliminando rolagem interna do bloco.  
        \- \[ \] Se a planilha for muito grande, o usuário usará as barras de rolagem da área de trabalho (horizontal/vertical).  
        \- \[ \] Parâmetro deve estar desativado por padrão.  
    \- \[ \] \*\*Configurações Avançadas (dentro do Pop-up RF05.1)\*\*:  
      \- \[ \] Parâmetro para definir Largura/altura padrão dos blocos.  
      \- \[ \] Parâmetro para definir Intervalo de salvamento automático (ex.: 30 segundos, 1 minuto, desligado).  
      \- \[ \] Parâmetro: "Quando novos blocos forem adicionados, eles devem se alinhar horizontalmente até o limite da tela. Após atingir o limite, os próximos blocos devem continuar na mesma linha, permitindo rolagem horizontal." (se a rolagem horizontal estiver ativa).  
\- \[ \] \*\*RF02: Barra Lateral (Funcionalidades Avançadas de Quadros e Pastas):\*\*  
    \- \[ \] 2.5. Opções de quadro: Funcionalidade completa de "Arquivar Quadro" e "Mover para pasta".  
    \- \[ \] 2.5. Pastas: Funcionalidade completa de "Arquivar Pasta". Funcionalidade completa de arrastar e soltar quadros/pastas. Funcionalidade completa de visualização em árvore. Funcionalidade completa de "Fixar" quadros/pastas no topo com personalização.  
\- \[ \] \*\*RF03: Área de Trabalho (Funcionalidades Avançadas):\*\*  
  \- \[ \] 3.1. Opção nos três pontinhos do bloco: Funcionalidade completa de "Criar Tabela via Markdown" (ligada a RF07.3).  
  \- \[ \] 3.3. Gerenciamento de planilhas (Avançado):  
    \- \[ \] Funcionalidade para Importar planilhas via Markdown (converter tabelas Markdown em planilhas editáveis) (RF07.1 Completo).  
    \- \[ \] Adicionar tipos de colunas restantes: hora, moeda, checkbox (funcional), peso, porcentagem.  
    \- \[ \] Edição em tempo real de checkboxes nas células.  
    \- \[ \] Funcionalidade de Seleção múltipla de linhas para exclusão.  
    \- \[ \] Implementar Validação de campos obrigatórios ao salvar planilhas (se definido).  
    \- \[ \] Implementar Modelos predefinidos de planilhas (ex.: orçamento, lista de tarefas).  
    \- \[ \] Indicador visual para planilhas editadas recentemente.  
  \- \[ \] 3.4. Barra de scroll (Rolagem Vertical):  
    \- \[ \] Se "Orientação da Rolagem" vertical estiver ativa ou "Ajuste Automático de Blocos à Planilha":  
      \- \[ \] Blocos organizados em filas horizontais (estilo prateleira).  
      \- \[ \] Cada fila ocupa todo o espaço horizontal; blocos dispostos lado a lado até o limite.  
      \- \[ \] Após o limite, blocos vão para a próxima fila abaixo, criando fluxo vertical.  
      \- \[ \] Área de trabalho cresce verticalmente conforme mais blocos são adicionados.  
  \- \[ \] 3.5. Clicar e arrastar (Prévia visual completa):  
    \- \[ \] Exibir prévia visual (sombra/contorno) ao arrastar cartões e planilhas.  
  \- \[ \] 3.6. Arrastar múltiplos itens:  
    \- \[ \] Implementar seleção com Ctrl+clique para mover/copiar em lote (blocos, cartões, planilhas).  
  \- \[ \] 3.8. Configurar papel de paredes (para cada área de trabalho de quadro):  
    \- \[ \] Opção de configurar papel de parede nos três pontinhos do quadro na barra lateral.  
    \- \[ \] Na barra de título do quadro, criar botão (alinhado à direita depois do nome) para configurar papel de parede.  
    \- \[ \] Opção de configurar papel de parede no menu de contexto específico da área de trabalho (clique direito na área vazia do quadro).  
\- \[ \] \*\*RF05: Configurações (Exportação/Importação e Histórico):\*\*  
  \- \[ \] 5.2. Implementar funcionalidade de Exportação/importação JSON com opção de backup automático ao exportar/antes de importar.  
  \- \[ \] 5.3. / RF06.3 Histórico de versões para reversão (armazenar e permitir reverter para as últimas 5 versões salvas dos dados).  
\- \[ \] \*\*RF06: Salvamento (Avançado):\*\*  
  \- \[ \] 6.1. Garantir que todas as configurações do sistema (RF05) sejam salvas.  
  \- \[ \] 6.2. Implementar compactação do JSON ao salvar e validação completa ao carregar (para integridade).  
\- \[ \] \*\*RF07: Suporte a Markdown (Avançado):\*\*  
  \- \[ \] 7.3. Opção nos três pontos do bloco: "Criar Tabela via Markdown" \- funcionalidade que converte código Markdown de tabela em uma tabela visual e editável (ou planilha simples) dentro do bloco.  
\- \[ \] \*\*RNF08: Interface Responsiva e Intuitiva (Otimizações):\*\*  
  \- \[ \] 8.2. Otimizar a pesquisa dinâmica para garantir latência \< 200ms.  
  \- \[ \] 8.3. Otimizar o processo de salvamento para ser eficiente (JSON compactado, operações assíncronas).  
  \- \[ \] 8.4. Testar e garantir que wallpapers (imagens grandes) não impactem negativamente o desempenho.  
  \- \[ \] 8.5. Implementar Lazy loading para quadros grandes (carregar apenas blocos visíveis/próximos) e textos longos em cartões/blocos, com barra de progresso visual se o carregamento for demorado.

\#\# Fase 5: Finalização, Arquivamento, Documentação Interna e Revisão Geral

\*\*Objetivo:\*\* Concluir todas as funcionalidades restantes, implementar o sistema de arquivamento, adicionar documentação interna ao sistema e realizar uma revisão completa.

\- \[ \] \*\*RF02: Barra Lateral (Funcionalidade Calendário):\*\*  
  \- \[ \] 2.2. Botão "Calendário" com ícone:  
    \- \[ \] Ao clicar, exibe um calendário interativo na área de trabalho principal.  
    \- \[ \] O calendário deve permitir visualização de itens com datas (ex: cartões com prazo) ou ter alguma forma de interação.  
\- \[ \] \*\*RF03: Área de Trabalho (Arquivamento de Itens):\*\*  
  \- \[ \] 3.1. Funcionalidade completa de Arquivamento de blocos (com visualização opcional na área de trabalho ou apenas na área de arquivos).  
  \- \[ \] 3.2. Funcionalidade completa de Arquivar/excluir cartões (integrada com RF04).  
  \- \[ \] 3.3. Funcionalidade completa de Arquivar/excluir planilhas (integrada com RF04).  
\- \[ \] \*\*RF04: Área de Arquivos:\*\*  
  \- \[ \] 4.1. Implementar a Área de Arquivos para armazenar itens arquivados (quadros, blocos, planilhas, cartões, arquivos e fotos anexados, pastas).  
  \- \[ \] 4.2. Implementar funcionalidade de arquivamento de quadros inteiros.  
  \- \[ \] 4.3. Seção "Arquivos" acessível na barra lateral, com as seguintes opções funcionais:  
    \- \[ \] Restaurar itens arquivados para sua localização original.  
    \- \[ \] Excluir permanentemente itens arquivados (com diálogo de confirmação).  
    \- \[ \] Filtrar itens arquivados por tipo (quadro, bloco, cartão, etc.) e por data de arquivamento.  
\- \[ \] \*\*Instruções para Implementação (Verificação Final e Entregáveis):\*\*  
  \- \[ \] Revisão: O sistema completo com frontend em HTML/CSS/JavaScript \+ TailwindCSS está funcional.  
  \- \[ \] Revisão: O backend segue padrões RESTful (GET/POST para dados, endpoints \`/api/boards\`, etc.) e está funcional.  
  \- \[ \] Revisão: Todas as funcionalidades dos Requisitos Funcionais (RF01-RF07) estão implementadas e testadas.  
  \- \[ \] Revisão: Funcionalidade de arrastar múltiplos itens está correta.  
  \- \[ \] Revisão: Renderização de Markdown está correta e otimizada.  
  \- \[ \] Revisão: Código possui boa modularidade e segue boas práticas.  
  \- \[ \] Implementar: Inclusão de exemplos de dados iniciais (quadros, planilhas, cartões com Markdown) para primeira utilização.  
  \- \[ \] Revisão: Validação de campos obrigatórios e confirmações para ações críticas (ex.: exclusão) estão implementadas em todo o sistema.  
  \- \[ \] Implementar: "Inclua uma árvore de funções em um dos blocos em um cartao do sistema atual vigente, que permita visualizar a estrutura de diretórios e funções do sistema. Essa árvore deve ser interativa e permitir que o usuário navegue pela estrutura do sistema." (Entregar como parte da documentação interna no próprio sistema).  
\- \[ \] \*\*RNF08: Interface Responsiva e Intuitiva (Revisão Final):\*\*  
    \- \[ \] Testes finais de responsividade em diferentes dispositivos e tamanhos de tela.  
    \- \[ \] Testes finais de desempenho geral da aplicação.  
\- \[ \] \*\*Revisão Geral e Testes:\*\*  
    \- \[ \] Testar exaustivamente todas as interações e fluxos de usuário.  
    \- \[ \] Verificar a consistência da interface e da experiência do usuário.  
    \- \[ \] Corrigir todos os bugs identificados.  
    \- \[ \] Preparar a versão final para "entrega" (mesmo sendo de uso local).  
