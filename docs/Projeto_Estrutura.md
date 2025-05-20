
# Estrutura do Projeto Calendario

A estrutura abaixo representa a organização completa do projeto Calendario, com uma breve explicação sobre cada arquivo e pasta.

```
📁 ./ (Raiz do Projeto)
├── 📄 .gitignore                     # Define arquivos e pastas a serem ignorados pelo Git
├── 📄 bun.lockb                      # Arquivo de lock do gerenciador de pacotes Bun
├── 📄 components.json                # Configuração dos componentes shadcn/ui
├── 📄 eslint.config.js               # Configuração do ESLint para linting do código
├── 📄 index.html                     # Página HTML de entrada da aplicação
├── 📄 package-lock.json              # Bloqueio de versões das dependências (npm)
├── 📄 package.json                   # Define dependências, scripts e metadados do projeto
├── 📄 postcss.config.js              # Configuração do PostCSS para processamento CSS
├── 📄 README.md                      # Documentação geral do projeto
├── 📄 tailwind.config.ts             # Configuração do Tailwind CSS
├── 📄 tsconfig.app.json              # Configuração TypeScript específica para a aplicação
├── 📄 tsconfig.json                  # Configuração principal do TypeScript
├── 📄 tsconfig.node.json             # Configuração TypeScript específica para o Node
├── 📄 vite.config.ts                 # Configuração do Vite (bundler)
│  
├── 📁 docs/                          # Documentação do projeto
│   ├── 📄 documentacao.md            # Documentação geral do sistema
│   ├── 📄 documentação_completa_do_sistema.md # Documentação detalhada do sistema
│   ├── 📄 fase2_implementacao.md     # Documentação da fase 2 (implementações atuais)
│   ├── 📄 implementacao_fase1.md     # Documentação da fase 1
│   ├── 📄 implementacao_fase2.md     # Documentação da fase 2 completa
│   ├── 📄 Projeto_Estrutura.md       # Este arquivo - estrutura do projeto
│   ├── 📄 Fase2.md                   # Visão geral da Fase 2
│   ├── 📄 Fase2_Quadros.md           # Detalhes de implementação dos quadros e pastas
│   ├── 📄 Fase2_Blocos.md            # Detalhes de implementação dos blocos
│   └── 📄 Fase2_Salvamento.md        # Detalhes de implementação do salvamento em JSON
│
├── 📁 public/                        # Arquivos públicos que serão servidos diretamente
│   ├── 📄 favicon.ico                # Ícone da aplicação exibido na aba do navegador
│   ├── 📄 placeholder.svg            # Imagem de placeholder para uso na aplicação
│   └── 📄 robots.txt                 # Instruções para robôs de busca
│
└── 📁 src/                           # Código fonte da aplicação
    ├── 📄 App.css                    # Estilos globais específicos da aplicação
    ├── 📄 App.tsx                    # Componente raiz da aplicação React
    ├── 📄 index.css                  # Estilos globais carregados inicialmente
    ├── 📄 main.tsx                   # Ponto de entrada da aplicação React
    ├── 📄 vite-env.d.ts              # Declarações de tipos para o ambiente Vite
    │
    ├── 📁 components/                # Componentes React reutilizáveis
    │   ├── 📄 Header.tsx             # Componente do cabeçalho da aplicação
    │   ├── 📄 Sidebar.tsx            # Componente da barra lateral com navegação
    │   ├── 📄 WorkArea.tsx           # Componente principal da área de trabalho
    │   │
    │   ├── 📁 dialogs/               # Componentes de diálogos/modais
    │   │   └── 📄 SettingsDialog.tsx # Diálogo de configurações da aplicação
    │   │
    │   ├── 📁 sidebar/               # Componentes relacionados à barra lateral
    │   │   ├── 📄 BoardItem.tsx      # Item de quadro na barra lateral
    │   │   └── 📄 FolderItem.tsx     # Item de pasta na barra lateral
    │   │
    │   ├── 📁 ui/                    # Componentes de UI reutilizáveis (shadcn)
    │   │   ├── 📄 accordion.tsx      # Componente accordion
    │   │   ├── 📄 alert-dialog.tsx   # Diálogo de alerta
    │   │   └── ... (outros componentes UI)
    │   │
    │   └── 📁 workspace/             # Componentes da área de trabalho
    │       ├── 📄 BlockComponent.tsx # Componente de bloco principal
    │       ├── 📄 CardItem.tsx       # Componente de cartão dentro do bloco
    │       ├── 📄 FileItemComponent.tsx # Componente de arquivo dentro do bloco
    │       ├── 📄 MarkdownItem.tsx   # Componente de nota Markdown
    │       └── 📄 SpreadsheetItem.tsx # Componente de planilha
    │
    ├── 📁 contexts/                  # Contextos React para gerenciamento de estado
    │   └── 📄 CalendarioContext.tsx  # Contexto principal da aplicação
    │
    ├── 📁 hooks/                     # Hooks personalizados React
    │   ├── 📄 use-drag-drop.tsx      # Hook para funcionalidade de arrastar e soltar
    │   ├── 📄 use-mobile.tsx         # Hook para detecção de dispositivos móveis
    │   └── 📄 use-toast.ts           # Hook para notificações toast
    │
    ├── 📁 lib/                       # Biblioteca de funções utilitárias
    │   └── 📄 utils.ts               # Funções utilitárias gerais
    │
    ├── 📁 pages/                     # Páginas da aplicação
    │   ├── 📄 Index.tsx              # Página inicial
    │   └── 📄 NotFound.tsx           # Página 404 (não encontrado)
    │
    ├── 📁 types/                     # Definições de tipos TypeScript
    │   └── 📄 calendario.ts          # Tipos para a aplicação Calendario
    │
    └── 📁 utils/                     # Funções utilitárias específicas
        ├── 📄 markdown.ts            # Funções para processamento de Markdown
        └── 📄 storage.ts             # Funções para armazenamento e persistência
```

## Detalhes das Principais Pastas

### 📁 src/
Contém todo o código-fonte da aplicação Calendario. É onde a lógica principal, componentes e funcionalidades são desenvolvidos.

### 📁 src/components/
Armazena todos os componentes React reutilizáveis da aplicação, organizados por função:
- **components/ui/**: Componentes da biblioteca shadcn/ui, altamente reutilizáveis em toda a aplicação
- **components/workspace/**: Componentes específicos para a área de trabalho principal
- **components/sidebar/**: Componentes utilizados na barra lateral de navegação
- **components/dialogs/**: Componentes para diálogos e modais

### 📁 src/contexts/
Contém os contextos React que gerenciam o estado global da aplicação:
- **CalendarioContext.tsx**: Gerencia todos os dados dos quadros, blocos, pastas e suas operações

### 📁 src/hooks/
Hooks personalizados React que encapsulam lógica reutilizável:
- **use-drag-drop.tsx**: Implementa a funcionalidade de arrastar e soltar para quadros, pastas e blocos
- **use-mobile.tsx**: Detecta dispositivos móveis para ajustar a interface
- **use-toast.ts**: Fornece funcionalidade de notificações toast

### 📁 src/types/
Definições de tipos TypeScript para toda a aplicação:
- **calendario.ts**: Define interfaces para Quadros, Blocos, Cartões, etc.

### 📁 src/utils/
Funções utilitárias específicas para operações comuns:
- **markdown.ts**: Processamento e conversão de texto Markdown
- **storage.ts**: Funções de armazenamento para salvar e recuperar dados do localStorage

### 📁 docs/
Contém toda a documentação do projeto, incluindo implementações passadas, atuais e planejadas.

### 📁 public/
Arquivos estáticos que são servidos diretamente, como o favicon e imagens.
