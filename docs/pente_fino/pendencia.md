6. **Editor de Texto (TipTap) - Campo de Descrição e Outros:**
   Documento de Especificação Técnica e Plano de Implementação: Editor de Texto Rico (TipTap)  
   Versão: 2.0  
   Data: 06 de junho de 2025  
   Autor: Inteligência Artificial (Assistente Gemini)

   1.0 **Visão Geral e Objetivos**  
   O objetivo desta implementação é substituir o componente `<textarea>` existente nos modais de edição (CardDialog.tsx e SpreadsheetDialog.tsx) por um editor de texto rico, WYSIWYG ("What You See Is What You Get"), utilizando a biblioteca TipTap.

   A nova implementação deve replicar fielmente a aparência e o comportamento do protótipo "Editor de Propostas", focando em uma experiência de usuário fluida que alterna entre um modo de visualização limpo e um modo de edição completo.

   2.0 **Arquitetura da Solução**  
   Para garantir modularidade, manutenibilidade e reutilização de código, a solução será arquitetada da seguinte forma:

   - **Componente Encapsulado (TipTapEditor.tsx):** Toda a lógica do editor, incluindo a inicialização do TipTap, gerenciamento de estado de edição (visualização/edição) e a renderização da barra de ferramentas e ações, será contida em um único componente reutilizável.
   - **Integração Simples:** O CardDialog.tsx (e posteriormente o SpreadsheetDialog.tsx) irá importar e renderizar o componente TipTapEditor.tsx, passando o conteúdo atual da descrição e recebendo o novo conteúdo através de um callback (onChange). Isso manterá os modais limpos e focados em sua função principal.
   - **Gerenciamento de Estado:** O estado do conteúdo do editor será mantido dentro do CardDialog.tsx (a variável description). O TipTapEditor.tsx receberá esse estado como prop e usará sua própria gestão interna para a edição. Ao salvar, ele chamará a função updateItem do CalendarioContext para persistir os dados.

   3.0 **Componentes Principais a Serem Desenvolvidos**  
   - **TipTapEditor.tsx (src/components/ui/):** O componente principal que encapsula a lógica. Ele gerenciará a alternância entre os modos de visualização e edição.
   - **Toolbar.tsx (src/components/ui/):** Componente que renderiza a barra de ferramentas de formatação. Receberá a instância do editor TipTap como prop para interagir com o conteúdo.
   - **Actionbar.tsx (src/components/ui/):** Componente para o rodapé do editor no modo de edição, contendo os botões "Salvar", "Cancelar" e "Copiar".

   **Novo Checklist e Plano de Implementação Detalhado**  
   Esta seção substitui o item 6 da "lista antiga".

   **Fase 1: Fundação do Editor e Integração Inicial**  
   Objetivo: Ter um editor funcional dentro do CardDialog que alterna entre visualização e edição, com uma barra de ferramentas básica e ações de salvar/cancelar.

   - [x] 1.1. Instalação de Dependências:
   - [x] Adicionar `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit` e outras extensões necessárias (Underline, TextAlign, TextStyle, Color, FontFamily) ao package.json.
   - [x] 1.2. Criação do Componente TipTapEditor.tsx:
   - [x] Criar o arquivo `src/components/ui/TipTapEditor.tsx`.
   - [x] Implementar a lógica de estado para `isEditing`.
   - [x] Renderizar condicionalmente a área de visualização (`dangerouslySetInnerHTML`) ou o contêiner do editor (`<EditorContent />`).
   - [x] Adicionar um evento `onClick` na área de visualização para ativar o modo de edição.
   - [x] 1.3. Criação da Barra de Ferramentas (Toolbar.tsx):
   - [x] Criar o arquivo `src/components/ui/Toolbar.tsx`.
   - [x] Implementar botões básicos (Negrito, Itálico, Riscado) usando o componente `<Toggle>` do ShadCN para refletir o estado `isActive` do editor.
   - [x] 1.4. Criação da Barra de Ações (Actionbar.tsx):
   - [x] Criar o arquivo `src/components/ui/Actionbar.tsx`.
   - [x] Implementar os botões "Salvar" e "Cancelar".
   - [x] Passar as funções `onSave` e `onCancel` como props.
   - [x] 1.5. Integração no CardDialog.tsx:
   - [x] Substituir o `<textarea>` e a barra de ferramentas antiga pelo novo componente `<TipTapEditor />`.
   - [x] Conectar o estado `description` do CardDialog ao editor.
   - [x] Implementar as funções `handleSaveDescription` e `handleCancelDescription` para interagir com o TipTapEditor.

   **Fase 2: Barra de Ferramentas Avançada e Estilização**  
   Objetivo: Expandir a barra de ferramentas para incluir todas as funcionalidades do protótipo e aplicar o estilo visual desejado.

   - [x] 2.1. Aprimorar Toolbar.tsx:
   - [x] Adicionar um seletor (`<Select>`) para Família de Fonte.
   - [x] Adicionar um seletor (`<Select>`) para Tamanho de Fonte.
   - [x] Adicionar um seletor de cor (`<input type="color">`) para a cor do texto.
   - [x] Adicionar botões para alinhamento de texto (Esquerda, Centro, Direita).
   - [x] Adicionar botões para listas e citações (blockquote).
   - [x] Implementar divisórias (`<Separator />`) para organizar a barra.
   - [x] 2.2. Estilização do Editor e Conteúdo:
   - [x] Utilizar classes do Tailwind (`prose`) no TipTapEditor.tsx para estilizar o conteúdo renderizado (cabeçalhos, parágrafos, listas) conforme o protótipo.
   - [x] Implementar o placeholder dinâmico, visível apenas quando o editor está vazio.
   - [x] Estilizar o contêiner do editor para que a borda mude de cor quando ele estiver em foco, replicando o efeito de `focus-within`.
---------------------
   Fase 2.1 Refinamento e Implementação de Funcionalidades Essenciais do Editor

   **Objetivo:** Corrigir todos os bugs da implementação inicial do TipTap, estabilizar o componente, e implementar os pontos de entrada fundamentais para as funcionalidades de imagem e tabela, deixando o editor pronto para os aprimoramentos avançados da Fase 3.

   2.1 Correção de Bugs Críticos
       - **Descrição:** Resolução de todas as falhas que impediam o funcionamento correto da barra de ferramentas, garantindo a estabilidade do editor.
       - **Checklist de Implementação:**
         - [ ] **Correção do Tamanho da Fonte:** O erro crítico `editor.setFontSize is not a function` foi resolvido. A implementação foi corrigida para usar o método `setMark('textStyle', { fontSize: ... })`, que é o correto para a extensão `@tiptap/extension-text-style`.
         - [ ] **Reativação dos Botões de Estrutura:** A funcionalidade dos botões de "Lista com Marcadores", "Lista Numerada" e "Citação" foi validada e está operante, utilizando as extensões do `StarterKit`.
         - [x] **Adição do Alinhamento "Justificar":** O botão para `setTextAlign('justify')` foi adicionado à `Toolbar.tsx`, completando as opções de alinhamento de parágrafo.

   2.2 Implementação da Inserção de Objetos (Funcionalidade Essencial)
       - **Descrição:** Adicionar à interface do editor os controles primários para que o usuário possa inserir os tipos de conteúdo mais complexos: imagens e tabelas.
       - **Checklist de Implementação:**
         - [ ] **Instalação das Dependências:** Os pacotes `@tiptap/extension-image` e `@tiptap/extension-table` (com suas sub-dependências) foram adicionados ao `package.json` e instalados.
         - [ ] **Configuração do Editor:** O arquivo `TipTapEditor.tsx` foi atualizado para carregar e configurar as novas extensões de Imagem e Tabela, habilitando as funcionalidades no núcleo do editor.
         - [ ] **Botão "Inserir Imagem":** Um botão com o ícone de imagem foi adicionado à `Toolbar.tsx`.
               - *Comentário:* A funcionalidade básica atual abre um `window.prompt()` para inserir a URL da imagem. A interface avançada (com opções de URL e upload local) será desenvolvida na Fase 3.
         - [ ] **Botão "Inserir Tabela":** Um botão com o ícone de tabela foi adicionado à `Toolbar.tsx`.
               - *Comentário:* A funcionalidade básica atual insere uma tabela padrão de 3x3. A interface avançada (seletor de grade estilo Word) será desenvolvida na Fase 3.

   2.3. Visão para a Fase 3: Módulos Avançados de Imagem e Planilha
       - **Descrição:** O trabalho realizado na Fase 2 - Parte 2 é a fundação para os seguintes requisitos avançados, que agora formam o escopo claro da **Fase 3**.
       - **Checklist de Planejamento (Fase 3):**
         - [ ] **Módulo de Imagem Avançado:**
               - [ ] Criar um modal para inserção de imagem com abas para "URL" e "Upload do Computador".
               - [ ] Implementar a lógica de upload de arquivo e conversão para base64 ou URL de objeto.
               - [ ] Habilitar a seleção da imagem dentro do editor, exibindo alças de redimensionamento.
               - [ ] Implementar a lógica de redimensionamento (proporcional e não proporcional).
               - [ ] Implementar a lógica de arrastar e soltar (drag-and-drop) para posicionamento livre.
         - [ ] **Módulo de Tabela Avançado:**
               - [ ] Substituir a inserção padrão por um menu suspenso com seletor de grade (estilo Word).
               - [ ] Implementar a adição dinâmica de linhas e colunas através de botões `+` flutuantes nas bordas.
               - [ ] Habilitar o redimensionamento de colunas e linhas arrastando suas bordas.
               - [ ] Implementar a funcionalidade de colorir o fundo de células selecionadas.


---------------------
   **Fase 3: Funcionalidades Complexas e Finalização**  
   Objetivo: Implementar os recursos mais avançados e garantir que a experiência do usuário seja coesa.

   - [ ] 3.1. Funcionalidade de Cópia Avançada:
   - [ ] No Actionbar.tsx, implementar o menu suspenso para o botão "Copiar".
   - [ ] Adicionar a biblioteca turndown para converter HTML em Markdown.
   - [ ] Implementar as três lógicas de cópia:
     - Copiar como HTML (`editor.getHTML()`).
     - Copiar como Texto Simples (`editor.getText()`).
     - Copiar como Markdown (usando turndown).
   - [ ] 3.2. Expansão de Conteúdo (Ver mais...):
   - [ ] Implementar uma lógica no modo de visualização para truncar descrições longas e exibir um botão "Ver mais..." que expande o conteúdo.
   - [ ] 3.3. Paridade no SpreadsheetDialog.tsx:
   - [ ] Replicar a integração do `<TipTapEditor />` no modal de planilhas para garantir consistência entre os componentes, conforme o item C.1 da lista de pendências.

   **Comentários Adicionais:**
   * A Fase 1 foi concluída com sucesso, com todas as funcionalidades básicas implementadas conforme especificado.
   * A Fase 2 foi concluída com sucesso, implementando todas as funcionalidades avançadas da barra de ferramentas e melhorando a estilização.
   * O editor agora possui todas as funcionalidades de formatação (fonte, tamanho, cor, alinhamento, listas, citações) e uma interface visual aprimorada.
   * A extensão de placeholder foi adicionada para melhorar a experiência do usuário quando o editor está vazio.
   * Próximos passos focarão na Fase 3, implementando as funcionalidades complexas de cópia e expansão de conteúdo.
