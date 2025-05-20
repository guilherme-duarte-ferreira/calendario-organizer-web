
# Blocos e Itens - Fase 2

## Introdução

Os blocos são os componentes fundamentais da área de trabalho do Calendario. Cada bloco funciona como um contêiner que pode armazenar diferentes tipos de itens: cartões, planilhas, notas de markdown e arquivos. A implementação dos blocos segue o modelo do Trello, com design responsivo que permite crescimento dinâmico conforme o conteúdo e arrastar/soltar para reorganização.

## Requisitos Funcionais

### 1. Gerenciamento de Blocos

- **Operações Básicas**:
  - Adicionar blocos com nome personalizável a um quadro
  - Editar nome de blocos existentes
  - Remover blocos (com confirmação)
  - Arquivar blocos temporariamente

- **Manipulação de Layout**:
  - Arrastar e soltar blocos para reorganização
  - Crescimento dinâmico do bloco conforme conteúdo
  - Exibir prévia visual ao arrastar (sombra/contorno)

### 2. Funcionalidades de Item

- **Tipos de Itens Suportados**:
  - Cartões: notas simples com título
  - Planilhas: tabelas com dados estruturados
  - Notas Markdown: texto formatado com suporte a Markdown
  - Arquivos: anexos de documentos

- **Adição de Itens**:
  - Três botões no rodapé do bloco:
    - "Cartão": Adiciona um novo cartão
    - "Planilha": Adiciona uma nova planilha vazia
    - "Arquivo": Abre seletor de arquivos do sistema

- **Funcionalidades Avançadas**:
  - Inserção de texto em Markdown (via menu de três pontos)
  - Criação de tabela via sintaxe Markdown (via menu de três pontos)

## Implementação

### Estrutura de Dados

Os blocos são implementados através da interface `Block`:

```typescript
interface Block {
  id: string;
  name: string;
  boardId: string;
  items: Item[];
  order: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}
```

Os itens dentro dos blocos seguem o padrão base `Item` com tipos específicos:

```typescript
interface Item {
  id: string;
  type: string; // "card", "spreadsheet", "markdown" ou "file"
  blockId: string;
  order: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipos específicos de itens
interface Card extends Item {
  type: "card";
  title: string;
  description: string;
  status?: string;
  checklist?: ChecklistItem[];
}

interface Spreadsheet extends Item {
  type: "spreadsheet";
  title: string;
  columns: string[];
  rows: string[][];
}

interface MarkdownNote extends Item {
  type: "markdown";
  content: string;
}

interface FileItem extends Item {
  type: "file";
  name: string;
  size: number;
  type: "file";
  mimeType: string;
  data: string; // Base64
}
```

### Componentes Principais

- **BlockComponent.tsx**: Renderiza um bloco completo com cabeçalho, conteúdo e botões de ação
- **CardItem.tsx**: Renderiza um cartão dentro do bloco
- **SpreadsheetItem.tsx**: Renderiza uma planilha dentro do bloco
- **MarkdownItem.tsx**: Renderiza uma nota Markdown dentro do bloco
- **FileItemComponent.tsx**: Renderiza um arquivo anexado dentro do bloco

### Lógica de Interação

#### Criação de Blocos
```typescript
const handleCreateBlock = () => {
  if (currentBoardId) {
    createBlock(currentBoardId, blockName);
    setNewBlockDialogOpen(false);
    setBlockName("Novo bloco");
  }
};
```

#### Edição de Nome de Bloco
```typescript
const handleNameChange = () => {
  if (blockName.trim()) {
    updateBlock({
      ...block,
      name: blockName
    });
  }
  setIsEditing(false);
};
```

#### Criação de Nota Markdown
```typescript
const handleCreateMarkdownNote = () => {
  createMarkdownNote(block.id, markdownContent);
  setMarkdownContent("");
  setShowDialog(null);
};
```

#### Criação de Planilha a partir de Markdown
```typescript
const handleCreateMarkdownTable = () => {
  try {
    const { columns, rows } = markdownToTable(markdownContent);
    createSpreadsheet(block.id, "Tabela de Markdown", columns, rows);
    setMarkdownContent("");
    setShowDialog(null);
  } catch (error) {
    console.error("Erro ao converter Markdown para tabela:", error);
    alert("Erro ao converter Markdown para tabela. Verifique o formato.");
  }
};
```

## Exemplos de Uso

### Adicionar um Novo Bloco

1. Clicar no botão "Adicionar Bloco" no cabeçalho do quadro
2. Digite um nome para o bloco (ex.: "Em Progresso")
3. Clique em "Criar"
4. O novo bloco será adicionado ao quadro atual

### Inserir uma Nota Markdown

1. No bloco desejado, clique no ícone de três pontos
2. Selecione "Inserir texto Markdown" no menu
3. Digite ou cole conteúdo Markdown
4. Clique em "Adicionar"
5. A nota será renderizada com formatação Markdown no bloco

### Criar uma Planilha via Markdown

1. No bloco desejado, clique no ícone de três pontos
2. Selecione "Criar tabela via Markdown"
3. Digite uma tabela em formato Markdown:
```
| Nome | Idade | Cargo |
| --- | --- | --- |
| João | 32 | Desenvolvedor |
| Maria | 28 | Designer |
```
4. Clique em "Converter para planilha"
5. Uma nova planilha será criada com os dados estruturados

## Testes

### Testes de Blocos

1. **Criar Bloco**:
   - Verifique se o bloco é criado com o nome especificado
   - Confirme se o bloco aparece na área de trabalho do quadro atual
   - Verifique que blocos vazios mostram a mensagem "Este bloco está vazio"

2. **Editar Nome do Bloco**:
   - Teste clicar no nome do bloco para editar
   - Verifique se o nome é atualizado após pressionar Enter ou clicar fora

3. **Excluir Bloco**:
   - Teste se o diálogo de confirmação aparece ao tentar excluir
   - Verifique se o bloco e todos os seus itens são removidos após confirmação

### Testes de Itens

1. **Adicionar Cartão**:
   - Clique no botão "Cartão" no rodapé do bloco
   - Verifique se um novo cartão é adicionado com título padrão

2. **Inserir Markdown**:
   - Teste inserir texto Markdown com vários formatos (títulos, listas, negrito, etc.)
   - Verifique se a renderização mostra corretamente a formatação

3. **Criar Tabela via Markdown**:
   - Teste converter uma tabela Markdown em uma planilha
   - Verifique se colunas e linhas são processadas corretamente

4. **Upload de Arquivo**:
   - Teste enviar diferentes tipos de arquivos (PDF, imagens, etc.)
   - Verifique se o arquivo é exibido corretamente no bloco

## Funcionalidades Pendentes

- Implementação completa de arrastar e soltar para reorganização de blocos
- Previsualização ao arrastar blocos
- Ajustes finos no dimensionamento automático dos blocos conforme conteúdo
- Melhorias na renderização de planilhas complexas
