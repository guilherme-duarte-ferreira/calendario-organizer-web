
# Sistema de Salvamento - Fase 2

## Introdução

O sistema de salvamento do Calendario permite a persistência de dados de quadros, pastas, blocos e seus itens entre sessões. Na Fase 2, foi implementado o armazenamento completo em localStorage, com estruturas JSON otimizadas para manter a integridade dos dados e permitir operações de arquivamento e restauração.

## Requisitos Funcionais

### 1. Persistência de Dados

- **Salvamento de Estrutura**:
  - Salvar dados de pastas (estrutura e conteúdo) em JSON
  - Salvar dados de blocos (nomes, ordem, relacionamentos) em JSON
  - Salvar quadros completos com todos os seus componentes
  - Manter histórico de versões para possível recuperação

- **Gerenciamento de Arquivados**:
  - Salvar itens arquivados separadamente
  - Permitir recuperação de itens arquivados
  - Manter integridade referencial entre itens arquivados e ativos

- **Performance e Segurança**:
  - Otimização do tamanho dos dados salvos
  - Validação de integridade antes do salvamento
  - Mecanismo de fallback para recuperação de dados em caso de erro

## Implementação

### Estrutura de Armazenamento

O sistema utiliza chaves específicas no localStorage para separar os diferentes tipos de dados:

```typescript
// Local Storage Keys
const BOARDS_KEY = "calendario_boards";
const FOLDERS_KEY = "calendario_folders";
const SETTINGS_KEY = "calendario_settings";
const VERSIONS_KEY = "calendario_versions";
const ARCHIVED_KEY = "calendario_archived";
```

### Funções de Salvamento

O salvamento é realizado através de funções específicas para cada tipo de dado:

```typescript
export const saveBoards = (boards: Board[]): void => {
  try {
    localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
  } catch (error) {
    console.error("Erro ao salvar quadros:", error);
  }
};

export const saveFolders = (folders: BoardFolder[]): void => {
  try {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  } catch (error) {
    console.error("Erro ao salvar pastas:", error);
  }
};

export const saveSettings = (settings: CalendarioSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
  }
};
```

### Versionamento

O sistema mantém um histórico de versões para possível recuperação:

```typescript
export const saveVersion = (version: Version): void => {
  const versions = getVersions();
  
  // Manter apenas as últimas 5 versões
  if (versions.length >= 5) {
    versions.pop(); // Remove a versão mais antiga
  }
  
  versions.unshift(version); // Adiciona a nova versão no início
  
  try {
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
  } catch (error) {
    console.error("Erro ao salvar versão:", error);
  }
};
```

### Recuperação de Dados

A recuperação é realizada através de funções específicas:

```typescript
export const getBoards = (): Board[] => {
  try {
    const boards = localStorage.getItem(BOARDS_KEY);
    return boards ? JSON.parse(boards) : [];
  } catch (error) {
    console.error("Erro ao obter quadros:", error);
    return [];
  }
};

export const getFolders = (): BoardFolder[] => {
  try {
    const folders = localStorage.getItem(FOLDERS_KEY);
    return folders ? JSON.parse(folders) : [];
  } catch (error) {
    console.error("Erro ao obter pastas:", error);
    return [];
  }
};
```

### Inicialização de Dados

Um sistema para inicializar dados padrão quando o aplicativo é aberto pela primeira vez:

```typescript
export const initializeDataIfEmpty = (): void => {
  const boards = getBoards();
  const folders = getFolders();
  
  if (boards.length === 0) {
    // Criar dados de exemplo
    const defaultBoard: Board = {
      id: generateId(),
      name: "Meu Primeiro Quadro",
      blocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false
    };
    
    saveBoards([defaultBoard]);
    
    // Salvar versão inicial
    saveCurrentStateAsVersion("Inicialização do sistema");
  }
};
```

## Exemplos de Uso

### Salvar o Estado Atual como Nova Versão

```typescript
// No código da aplicação
import { saveCurrentStateAsVersion } from '@/utils/storage';

// Após uma operação importante
function handleImportantChange() {
  // Fazer mudanças...
  
  // Salvar versão
  saveCurrentStateAsVersion("Alteração de estrutura da pasta X");
}
```

### Restaurar uma Versão Anterior

```typescript
// No código da aplicação
import { restoreVersion, getVersions } from '@/utils/storage';

function handleRestoreVersion(versionId: string) {
  const success = restoreVersion(versionId);
  
  if (success) {
    // Atualizar a interface ou notificar o usuário
    showToast("Versão restaurada com sucesso");
    reloadApplication();
  } else {
    showToast("Erro ao restaurar versão", { type: "error" });
  }
}

// Em um componente de histórico
function VersionHistoryComponent() {
  const versions = getVersions();
  
  return (
    <div>
      {versions.map(version => (
        <div key={version.id}>
          {version.description} - {new Date(version.timestamp).toLocaleString()}
          <button onClick={() => handleRestoreVersion(version.id)}>
            Restaurar
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Exportar Dados para Backup

```typescript
function exportDataForBackup() {
  const boards = getBoards();
  const folders = getFolders();
  const settings = getSettings();
  const archived = getArchived();
  
  const fullData = {
    boards,
    folders,
    settings,
    archived,
    exportDate: new Date().toISOString()
  };
  
  const jsonData = JSON.stringify(fullData, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  
  // Criar link para download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `calendario_backup_${new Date().toISOString()}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}
```

## Testes

### Testes de Salvamento

1. **Persistência de Quadros**:
   - Crie um novo quadro e recarregue a página
   - Verifique se o quadro permanece visível após recarregar
   - Verifique se todas as propriedades do quadro foram mantidas

2. **Persistência de Pastas**:
   - Crie uma estrutura de pastas com quadros
   - Recarregue a página e verifique se a estrutura hierárquica foi mantida
   - Verifique se o estado expandido/recolhido foi preservado

3. **Persistência de Blocos e Itens**:
   - Adicione vários tipos de itens a blocos diferentes
   - Recarregue a página e verifique se todos os itens permanecem
   - Verifique especialmente formatos complexos como Markdown e planilhas

4. **Gerenciamento de Versões**:
   - Realize várias alterações importantes e verifique o histórico de versões
   - Tente restaurar uma versão anterior e verifique se os dados voltam ao estado esperado

## Considerações sobre Armazenamento

### Limitações do LocalStorage

- O localStorage tem limite de aproximadamente 5MB por domínio
- Para projetos grandes, pode ser necessário implementar uma solução mais robusta
- Para lidar com o limite, o sistema:
  1. Armazena arquivos grandes como Base64, mas com otimização
  2. Mantém um número limitado de versões (máximo 5)
  3. Implementa funções de exportação/importação para backup manual

### Possíveis Melhorias Futuras

1. Migração para IndexedDB para maior capacidade de armazenamento
2. Sincronização com backend para armazenamento em nuvem
3. Implementação de compressão de dados para reduzir o tamanho do armazenamento
4. Sistema de backup automático para evitar perda de dados
