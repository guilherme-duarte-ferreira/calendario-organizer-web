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

   - [ ] 2.1. Aprimorar Toolbar.tsx:
   - [ ] Adicionar um seletor (`<Select>`) para Família de Fonte.
   - [ ] Adicionar um seletor (`<Select>`) para Tamanho de Fonte.
   - [ ] Adicionar um seletor de cor (`<input type="color">`) para a cor do texto.
   - [ ] Adicionar botões para alinhamento de texto (Esquerda, Centro, Direita).
   - [ ] Adicionar botões para listas e citações (blockquote).
   - [ ] Implementar divisórias (`<Separator />`) para organizar a barra.
   - [ ] 2.2. Estilização do Editor e Conteúdo:
   - [ ] Utilizar classes do Tailwind (`prose`) no TipTapEditor.tsx para estilizar o conteúdo renderizado (cabeçalhos, parágrafos, listas) conforme o protótipo.
   - [ ] Implementar o placeholder dinâmico, visível apenas quando o editor está vazio.
   - [ ] Estilizar o contêiner do editor para que a borda mude de cor quando ele estiver em foco, replicando o efeito de `focus-within`.

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
   * O editor já está funcionando com formatação básica (negrito, itálico, riscado) e alternância entre modos de visualização e edição.
   * A integração com o CardDialog.tsx foi realizada com sucesso, mantendo a consistência do estado e a persistência dos dados.
   * Próximos passos focarão na Fase 2, expandindo as funcionalidades da barra de ferramentas e melhorando a estilização.
