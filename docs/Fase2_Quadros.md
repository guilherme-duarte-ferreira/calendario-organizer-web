
# Quadros e Pastas - Fase 2

## Introdução

O sistema de quadros e pastas do Calendario permite aos usuários organizar seu trabalho em diferentes contextos visuais. Cada quadro representa uma área de trabalho distinta que pode conter diversos blocos. As pastas, por sua vez, permitem agrupar quadros relacionados, criando uma estrutura hierárquica para melhor organização.

## Requisitos Funcionais

### 1. Quadros

- **Criação de Quadros**:
  - Botão "+" para criar novos quadros na seção "Quadros" da barra lateral
  - Criação de quadros vazios (sem blocos pré-definidos)
  - Salvamento automático de novos quadros

- **Gerenciamento de Quadros**:
  - Hover funcional em cada item de quadro (feedback visual)
  - Ícone de três pontos com opções contextuais
  - Funcionalidade de renomear quadros
  - Funcionalidade de deletar quadros (com diálogo de confirmação)
  - Funcionalidade de arquivar quadros

### 2. Pastas

- **Criação e Gerenciamento de Pastas**:
  - Criação de novas pastas
  - Renomeação de pastas existentes
  - Exclusão de pastas (com tratamento para os quadros contidos)
  - Arquivamento de pastas

- **Visualização em Árvore**:
  - Sistema expandir/recolher para pastas
  - Indicador visual do estado atual (expandido/recolhido)
  - Visualização hierárquica de pastas e subpastas

- **Drag & Drop** (em implementação):
  - Interface para arrastar quadros entre pastas
  - Reordenação de quadros dentro de pastas
  - Reordenação de pastas na estrutura

## Implementação

### Estrutura de Dados

Os quadros são implementados através da interface `Board`:

```typescript
interface Board {
  id: string;
  name: string;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  wallpaper?: string; // Cor ou URL de imagem
}
```

As pastas são implementadas através da interface `BoardFolder`:

```typescript
interface BoardFolder {
  id: string;
  name: string;
  boardIds: string[]; // IDs dos quadros contidos
  subfolders: string[]; // IDs das pastas filhas
  expanded: boolean; // Estado visual (expandido/recolhido)
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Componentes Principais

- **BoardItem.tsx**: Renderiza um item de quadro na barra lateral com todas as interações necessárias
- **FolderItem.tsx**: Renderiza uma pasta com sua estrutura hierárquica e interações
- **Sidebar.tsx**: Coordena a exibição de quadros e pastas na barra lateral

### Lógica de Interação

#### Criação de Quadros
```typescript
const handleCreateBoard = () => {
  createBoard(newBoardName);
  setCreateBoardDialogOpen(false);
  setNewBoardName("Novo Quadro");
};
```

#### Renomeação de Quadros
```typescript
const handleRename = () => {
  updateBoard({ ...board, name: newName });
  setRenameDialogOpen(false);
};
```

#### Visualização em Árvore de Pastas
```typescript
const handleExpand = () => {
  setExpanded(!expanded);
  updateFolder({ ...folder, expanded: !expanded });
};
```

## Exemplos de Uso

### Criar um Novo Quadro

1. Clicar no botão "+" na seção "Quadros" da barra lateral
2. Digite um nome para o novo quadro (ex.: "Projeto Website")
3. Clique em "Criar"
4. O novo quadro será adicionado à lista e automaticamente selecionado

### Mover um Quadro para uma Pasta

1. Localize o quadro na barra lateral
2. Arraste-o sobre a pasta desejada
3. Solte o quadro quando a pasta estiver destacada visualmente
4. O quadro agora aparece dentro da estrutura hierárquica da pasta

### Renomear uma Pasta

1. Passe o mouse sobre a pasta para revelar o ícone de três pontos
2. Clique no ícone para abrir o menu de opções
3. Selecione "Renomear"
4. Digite o novo nome na caixa de diálogo
5. Clique em "Salvar" para confirmar a alteração

## Testes

### Testes de Quadros

1. **Criar Quadro**:
   - Verifique se o quadro é criado ao clicar em "Criar" no diálogo
   - Confirme se o quadro aparece na lista de quadros
   - Verifique se o quadro é criado vazio (sem blocos pré-definidos)

2. **Renomear Quadro**:
   - Teste se o quadro pode ser renomeado através do menu de três pontos
   - Verifique se o nome é atualizado em todos os lugares após salvamento

3. **Excluir Quadro**:
   - Teste se o diálogo de confirmação aparece ao tentar excluir
   - Verifique se o quadro é removido da lista após confirmação
   - Confirme que todos os blocos associados também são removidos

### Testes de Pastas

1. **Criar Pasta**:
   - Verifique se uma nova pasta é criada ao clicar no botão "+"
   - Confirme se a pasta aparece na seção de pastas

2. **Expandir/Recolher Pasta**:
   - Teste clicar na seta para expandir/recolher a pasta
   - Verifique se o estado é persistente após atualizar a página

3. **Hierarquia de Pastas**:
   - Crie uma estrutura com pastas e subpastas
   - Verifique se a visualização em árvore reflete corretamente a hierarquia

## Funcionalidades Pendentes

- Implementação completa de arrastar e soltar para reorganização de quadros/pastas
- Fixação de quadros/pastas favoritos no topo
- Personalização de cores e ícones para quadros/pastas
