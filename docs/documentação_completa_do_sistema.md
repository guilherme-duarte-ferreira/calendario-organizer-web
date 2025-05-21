
# Documentação Completa do Sistema Calendario

## Estrutura do Projeto
```
📁 /
├── 📁 docs/
│   ├── 📄 documentacao.md [conteúdo não fornecido]
│   ├── 📄 fase2_implementacao.md
│   ├── 📄 implementacao_fase1.md [conteúdo não fornecido]
│   ├── 📄 implementacao_fase2.md [conteúdo não fornecido]
│   └── 📄 documentação_completa_do_sistema.md (este arquivo)
├── 📁 public/
│   ├── 📄 favicon.ico [conteúdo não fornecido]
│   ├── 📄 placeholder.svg [conteúdo não fornecido]
│   └── 📄 robots.txt [conteúdo não fornecido]
├── 📁 src/
│   ├── 📄 App.css [conteúdo não fornecido]
│   ├── 📄 App.tsx [conteúdo não fornecido]
│   ├── 📁 components/
│   │   ├── 📄 Header.tsx [conteúdo não fornecido]
│   │   ├── 📄 Sidebar.tsx
│   │   │   ├── 📤 [Component] default Sidebar()
│   │   ├── 📄 WorkArea.tsx [conteúdo não fornecido]
│   │   ├── 📁 dialogs/
│   │   │   └── 📄 SettingsDialog.tsx [conteúdo não fornecido]
│   │   ├── 📁 sidebar/
│   │   │   ├── 📄 BoardItem.tsx
│   │   │   │   ├── 📤 [Component] default BoardItem({ board, isActive, onClick })
│   │   │   └── 📄 FolderItem.tsx
│   │   │       ├── 📤 [Component] default FolderItem({ folder, depth })
│   │   ├── 📁 ui/ [múltiplos arquivos de componentes UI]
│   │   │   └── 📄 use-toast.ts
│   │   │       ├── 📤 useToast
│   │   │       ├── 📤 toast
│   │   └── 📁 workspace/
│   │       ├── 📄 BlockComponent.tsx [conteúdo não fornecido]
│   │       ├── 📄 CardItem.tsx [conteúdo não fornecido]
│   │       ├── 📄 FileItemComponent.tsx [conteúdo não fornecido]
│   │       ├── 📄 MarkdownItem.tsx [conteúdo não fornecido]
│   │       └── 📄 SpreadsheetItem.tsx [conteúdo não fornecido]
│   ├── 📁 contexts/
│   │   └── 📄 CalendarioContext.tsx
│   │       ├── 📤 [Context] CalendarioContext
│   │       ├── 📤 [Component] CalendarioProvider({ children })
│   │       ├── 📤 useCalendario()
│   │       ├── 🔧 loadData()
│   │       ├── 🔧 saveData()
│   │       ├── 🔧 createBoard(name)
│   │       ├── 🔧 updateBoard(board)
│   │       ├── 🔧 archiveBoard(boardId)
│   │       ├── 🔧 restoreBoard(boardId)
│   │       ├── 🔧 deleteBoard(boardId)
│   │       ├── 🔧 setCurrentBoard(boardId)
│   │       ├── 🔧 createBlock(boardId, name)
│   │       ├── 🔧 updateBlock(block)
│   │       ├── 🔧 archiveBlock(blockId)
│   │       ├── 🔧 restoreBlock(blockId)
│   │       ├── 🔧 deleteBlock(blockId)
│   │       ├── 🔧 createCard(blockId)
│   │       ├── 🔧 createSpreadsheet(blockId)
│   │       ├── 🔧 createMarkdownNote(blockId, content)
│   │       ├── 🔧 createFileItem(blockId, file)
│   │       ├── 🔧 updateItem(item)
│   │       ├── 🔧 archiveItem(itemId, type)
│   │       ├── 🔧 restoreItem(itemId, type)
│   │       ├── 🔧 deleteItem(itemId, type)
│   │       ├── 🔧 createFolder(name)
│   │       ├── 🔧 updateFolder(folder)
│   │       ├── 🔧 archiveFolder(folderId)
│   │       ├── 🔧 restoreFolder(folderId)
│   │       ├── 🔧 deleteFolder(folderId)
│   │       ├── 🔧 updateSettings(newSettings)
│   │       ├── 🔧 toggleSidebar()
│   │       ├── 🔧 exportData()
│   │       └── 🔧 importData(jsonData)
│   ├── 📁 hooks/
│   │   ├── 📄 use-drag-drop.tsx
│   │   │   ├── 📤 useDragDrop(options)
│   │   │   │   ├── 🔧 handleDragStart(e, id)
│   │   │   │   ├── 🔧 handleDragEnd(e)
│   │   │   │   ├── 🔧 handleDragOver(e)
│   │   │   │   ├── 🔧 handleDragLeave()
│   │   │   │   └── 🔧 handleDrop(e, targetId)
│   │   ├── 📄 use-mobile.tsx [conteúdo não fornecido]
│   │   └── 📄 use-toast.ts
│   │       ├── 📤 useToast()
│   │       └── 📤 toast({ title, description, variant })
│   ├── 📄 index.css [conteúdo não fornecido]
│   ├── 📄 main.tsx
│   │   ├── 📤 [Component] ReactDOM.render()
│   ├── 📁 pages/
│   │   ├── 📄 Index.tsx
│   │   │   ├── 📤 [Component] default Index()
│   │   └── 📄 NotFound.tsx [conteúdo não fornecido]
│   ├── 📁 types/
│   │   └── 📄 calendario.ts
│   │       ├── 📤 [Type] ThemeMode
│   │       ├── 📤 [Type] ScrollOrientation
│   │       ├── 📤 [Interface] Board
│   │       ├── 📤 [Interface] BoardFolder
│   │       ├── 📤 [Interface] Block
│   │       ├── 📤 [Type] ItemType
│   │       ├── 📤 [Interface] BaseItem
│   │       ├── 📤 [Interface] Card
│   │       ├── 📤 [Interface] ChecklistItem
│   │       ├── 📤 [Interface] Attachment
│   │       ├── 📤 [Interface] Spreadsheet
│   │       ├── 📤 [Interface] SpreadsheetColumn
│   │       ├── 📤 [Interface] SpreadsheetRow
│   │       ├── 📤 [Interface] MarkdownNote
│   │       ├── 📤 [Interface] FileItem
│   │       ├── 📤 [Interface] CalendarioSettings
│   │       └── 📤 [Interface] Version
│   └── 📁 utils/
│       ├── 📄 markdown.ts [conteúdo não fornecido]
│       └── 📄 storage.ts
│           ├── 📤 generateId()
│           ├── 📤 checkRequiredFields(data, requiredFields)
│           ├── 📤 saveBoards(boards)
│           ├── 📤 saveFolders(folders)
│           ├── 📤 saveSettings(settings)
│           ├── 📤 saveVersion(version)
│           ├── 📤 saveArchived(archived)
│           ├── 📤 getBoards()
│           ├── 📤 getFolders()
│           ├── 📤 getSettings()
│           ├── 📤 getVersions()
│           ├── 📤 getArchived()
│           ├── 📤 saveCurrentStateAsVersion(description)
│           ├── 📤 restoreVersion(versionId)
│           └── 📤 initializeDataIfEmpty()
├── 📄 index.html [conteúdo não fornecido]
└── 📄 vite.config.ts [conteúdo não fornecido]
```
## Descrição dos Componentes e Funções Principais

### CalendarioContext

O CalendarioContext é o componente central do sistema, gerenciando todo o estado da aplicação e fornecendo funções para manipular quadros, blocos, itens, pastas e configurações.

- **CalendarioProvider**: Componente de provedor que encapsula a aplicação, fornecendo acesso ao contexto.
- **useCalendario**: Hook personalizado para acessar o contexto em qualquer componente.

#### Funções de Gerenciamento de Dados
- **loadData()**: Carrega os dados salvos do armazenamento local.
- **saveData()**: Salva os dados atuais no armazenamento local.

#### Funções de Gerenciamento de Quadros
- **createBoard(name)**: Cria um novo quadro com o nome especificado.
- **updateBoard(board)**: Atualiza um quadro existente.
- **archiveBoard(boardId)**: Arquiva um quadro.
- **restoreBoard(boardId)**: Restaura um quadro arquivado.
- **deleteBoard(boardId)**: Exclui um quadro permanentemente.
- **setCurrentBoard(boardId)**: Define o quadro atual a ser exibido.

#### Funções de Gerenciamento de Blocos
- **createBlock(boardId, name)**: Cria um novo bloco em um quadro específico.
- **updateBlock(block)**: Atualiza um bloco existente.
- **archiveBlock(blockId)**: Arquiva um bloco.
- **restoreBlock(blockId)**: Restaura um bloco arquivado.
- **deleteBlock(blockId)**: Exclui um bloco permanentemente.

#### Funções de Gerenciamento de Itens
- **createCard(blockId)**: Cria um novo cartão em um bloco específico.
- **createSpreadsheet(blockId)**: Cria uma nova planilha em um bloco específico.
- **createMarkdownNote(blockId, content)**: Cria uma nota Markdown em um bloco específico.
- **createFileItem(blockId, file)**: Cria um item de arquivo em um bloco específico.
- **updateItem(item)**: Atualiza um item existente.
- **archiveItem(itemId, type)**: Arquiva um item.
- **restoreItem(itemId, type)**: Restaura um item arquivado.
- **deleteItem(itemId, type)**: Exclui um item permanentemente.

#### Funções de Gerenciamento de Pastas
- **createFolder(name)**: Cria uma nova pasta com o nome especificado.
- **updateFolder(folder)**: Atualiza uma pasta existente.
- **archiveFolder(folderId)**: Arquiva uma pasta.
- **restoreFolder(folderId)**: Restaura uma pasta arquivada.
- **deleteFolder(folderId)**: Exclui uma pasta permanentemente.

#### Funções de Gerenciamento de Configurações
- **updateSettings(newSettings)**: Atualiza as configurações do sistema.
- **toggleSidebar()**: Alterna a visibilidade da barra lateral.

#### Funções de Importação/Exportação
- **exportData()**: Exporta todos os dados do sistema em formato JSON.
- **importData(jsonData)**: Importa dados de uma string JSON.

### Componentes de Interface do Usuário

#### Sidebar
Barra lateral que exibe quadros, pastas e opções de navegação.

#### BoardItem
Componente que representa um quadro na barra lateral.

#### FolderItem
Componente que representa uma pasta na barra lateral.

### Hooks Utilitários

#### useDragDrop
Hook personalizado para implementar a funcionalidade de arrastar e soltar.

- **handleDragStart(e, id)**: Inicia a operação de arrastar.
- **handleDragEnd(e)**: Finaliza a operação de arrastar.
- **handleDragOver(e)**: Manipula o evento quando um item arrastado passa sobre um alvo.
- **handleDragLeave()**: Manipula o evento quando um item arrastado sai de um alvo.
- **handleDrop(e, targetId)**: Manipula o evento quando um item arrastado é solto em um alvo.

#### useToast
Hook personalizado para exibir notificações na interface do usuário.

### Utilitários de Armazenamento

#### generateId()
Gera um ID único para objetos do sistema.

#### checkRequiredFields(data, requiredFields)
Verifica se todos os campos obrigatórios estão presentes em um objeto.

#### Funções de Salvamento e Carregamento
- **saveBoards(boards)**: Salva os quadros no armazenamento local.
- **saveFolders(folders)**: Salva as pastas no armazenamento local.
- **saveSettings(settings)**: Salva as configurações no armazenamento local.
- **saveVersion(version)**: Salva uma versão no histórico de versões.
- **saveArchived(archived)**: Salva os itens arquivados no armazenamento local.
- **getBoards()**: Obtém os quadros do armazenamento local.
- **getFolders()**: Obtém as pastas do armazenamento local.
- **getSettings()**: Obtém as configurações do armazenamento local.
- **getVersions()**: Obtém o histórico de versões do armazenamento local.
- **getArchived()**: Obtém os itens arquivados do armazenamento local.

#### Funções de Versionamento
- **saveCurrentStateAsVersion(description)**: Salva o estado atual como uma nova versão com a descrição fornecida.
- **restoreVersion(versionId)**: Restaura o sistema para uma versão específica.

#### initializeDataIfEmpty()
Inicializa dados padrão se o armazenamento estiver vazio.
