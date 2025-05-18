
import { Board, Block, Card, Spreadsheet, MarkdownNote, FileItem, BoardFolder, CalendarioSettings, Version } from "@/types/calendario";

// Função para gerar IDs únicos
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Funções de validação
export const checkRequiredFields = (data: any, requiredFields: string[]): boolean => {
  return requiredFields.every(field => {
    if (data[field] === undefined && data[field] !== 0) return false;
    if (typeof data[field] === "string" && data[field].trim() === "") return false;
    return true;
  });
};

// Local Storage Keys
const BOARDS_KEY = "calendario_boards";
const FOLDERS_KEY = "calendario_folders";
const SETTINGS_KEY = "calendario_settings";
const VERSIONS_KEY = "calendario_versions";
const ARCHIVED_KEY = "calendario_archived";

// Funções para salvar dados no localStorage
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

export const saveArchived = (archived: any): void => {
  try {
    localStorage.setItem(ARCHIVED_KEY, JSON.stringify(archived));
  } catch (error) {
    console.error("Erro ao salvar itens arquivados:", error);
  }
};

// Funções para obter dados do localStorage
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

export const getSettings = (): CalendarioSettings => {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    if (settings) {
      return JSON.parse(settings);
    }
  } catch (error) {
    console.error("Erro ao obter configurações:", error);
  }
  
  // Configurações padrão caso não existam ou ocorra erro
  return {
    theme: 'light',
    scrollOrientation: 'horizontal',
    blockAutoAdjustToSpreadsheet: false,
    editSpreadsheetsInWorkspace: true,
    defaultBlockWidth: 280,
    defaultBlockHeight: 400,
    autoSaveInterval: 30,
    horizontalBlockAlignment: true
  };
};

export const getVersions = (): Version[] => {
  try {
    const versions = localStorage.getItem(VERSIONS_KEY);
    return versions ? JSON.parse(versions) : [];
  } catch (error) {
    console.error("Erro ao obter versões:", error);
    return [];
  }
};

export const getArchived = (): any => {
  try {
    const archived = localStorage.getItem(ARCHIVED_KEY);
    return archived ? JSON.parse(archived) : {
      boards: [],
      blocks: [],
      cards: [],
      spreadsheets: [],
      files: [],
      folders: []
    };
  } catch (error) {
    console.error("Erro ao obter itens arquivados:", error);
    return {
      boards: [],
      blocks: [],
      cards: [],
      spreadsheets: [],
      files: [],
      folders: []
    };
  }
};

// Função para salvar o estado atual como uma nova versão
export const saveCurrentStateAsVersion = (description: string): void => {
  const currentState = {
    boards: getBoards(),
    folders: getFolders(),
    settings: getSettings(),
    archived: getArchived()
  };
  
  const version: Version = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    data: JSON.stringify(currentState),
    description
  };
  
  saveVersion(version);
};

// Função para restaurar uma versão
export const restoreVersion = (versionId: string): boolean => {
  try {
    const versions = getVersions();
    const version = versions.find(v => v.id === versionId);
    
    if (!version) return false;
    
    const state = JSON.parse(version.data);
    
    saveBoards(state.boards);
    saveFolders(state.folders);
    saveSettings(state.settings);
    saveArchived(state.archived);
    
    return true;
  } catch (error) {
    console.error("Erro ao restaurar versão:", error);
    return false;
  }
};

// Inicialização de dados
export const initializeDataIfEmpty = (): void => {
  const boards = getBoards();
  const folders = getFolders();
  const settings = getSettings();
  
  if (boards.length === 0) {
    const defaultBoard: Board = {
      id: generateId(),
      name: "Meu Primeiro Quadro",
      blocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false
    };
    
    // Criar alguns blocos de exemplo
    const block1: Block = {
      id: generateId(),
      name: "Para fazer",
      boardId: defaultBoard.id,
      items: [],
      order: 0,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const block2: Block = {
      id: generateId(),
      name: "Em andamento",
      boardId: defaultBoard.id,
      items: [],
      order: 1,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const block3: Block = {
      id: generateId(),
      name: "Concluído",
      boardId: defaultBoard.id,
      items: [],
      order: 2,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Adicionar um cartão de exemplo com a documentação
    const documentationCard: Card = {
      id: generateId(),
      type: "card",
      blockId: block1.id,
      order: 0,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: "Documentação do Sistema Calendario",
      description: `# Documentação do Sistema Calendario

## Estrutura de diretórios e funções

### Diretórios
- /src
  - /components: Componentes React da UI
  - /types: Definições de tipos TypeScript
  - /utils: Funções utilitárias
  - /hooks: Hooks personalizados React
  - /contexts: Contexts da aplicação React
  - /pages: Páginas da aplicação

### Principais funções
- generateId(): Gera IDs únicos para entidades
- checkRequiredFields(): Valida campos obrigatórios
- saveBoards(): Salva quadros no armazenamento
- getBoards(): Obtém quadros do armazenamento
- createBoard(): Cria um novo quadro
- createBlock(): Cria um novo bloco
- createCard(): Cria um novo cartão
- createSpreadsheet(): Cria uma nova planilha
- archiveItem(): Arquiva um item
- restoreItem(): Restaura um item arquivado
- exportData(): Exporta dados em JSON
- importData(): Importa dados de JSON`,
      status: "pending",
      checklist: [
        { id: generateId(), text: "Ler a documentação", completed: false }
      ]
    };
    
    block1.items.push(documentationCard);
    
    defaultBoard.blocks = [block1, block2, block3];
    
    saveBoards([defaultBoard]);
    
    // Salvar versão inicial
    saveCurrentStateAsVersion("Inicialização do sistema");
  }
  
  // Configurações padrão já são criadas pela função getSettings se necessário
};
