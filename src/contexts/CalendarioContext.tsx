import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Board, Block, Card, Spreadsheet, MarkdownNote, FileItem, BoardFolder, CalendarioSettings, ItemType, BaseItem } from "@/types/calendario";
import { 
  saveBoards, 
  saveFolders, 
  saveSettings, 
  saveArchived, 
  getBoards, 
  getFolders, 
  getSettings, 
  getArchived, 
  generateId, 
  initializeDataIfEmpty,
  saveCurrentStateAsVersion
} from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

interface CalendarioContextType {
  // Estado
  boards: Board[];
  folders: BoardFolder[];
  settings: CalendarioSettings;
  archived: any;
  currentBoardId: string | null;
  isCollapsed: boolean;
  isLoading: boolean;
  
  // Funções de manipulação de quadros
  createBoard: (name: string) => Board;
  updateBoard: (board: Board) => void;
  archiveBoard: (boardId: string) => void;
  restoreBoard: (boardId: string) => void;
  deleteBoard: (boardId: string) => void;
  setCurrentBoard: (boardId: string) => void;
  
  // Funções de manipulação de blocos
  createBlock: (boardId: string, name: string) => Block;
  updateBlock: (block: Block) => void;
  archiveBlock: (blockId: string) => void;
  restoreBlock: (blockId: string) => void;
  deleteBlock: (blockId: string) => void;
  updateBlocksOrder: (updatedBoards: Board[]) => void;
  
  // Funções para manipulação de itens
  createCard: (blockId: string) => Card;
  createSpreadsheet: (blockId: string) => Spreadsheet;
  createMarkdownNote: (blockId: string, content: string) => MarkdownNote;
  createFileItem: (blockId: string, file: File) => Promise<FileItem | null>;
  createItem: (blockId: string, type: ItemType, data?: any) => void;
  updateItem: (item: Card | Spreadsheet | MarkdownNote | FileItem) => void;
  archiveItem: (itemId: string, type: ItemType) => void;
  restoreItem: (itemId: string, type: ItemType) => void;
  deleteItem: (itemId: string, type: ItemType) => void;
  
  // Funções para manipulação de pastas
  createFolder: (name: string) => BoardFolder;
  updateFolder: (folder: BoardFolder) => void;
  archiveFolder: (folderId: string) => void;
  restoreFolder: (folderId: string) => void;
  deleteFolder: (folderId: string) => void;
  
  // Funções para configurações
  updateSettings: (newSettings: Partial<CalendarioSettings>) => void;
  
  // Utilitários
  toggleSidebar: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

const CalendarioContext = createContext<CalendarioContextType | undefined>(undefined);

export const CalendarioProvider = ({ children }: { children: ReactNode }) => {
  const initialSettings: CalendarioSettings = {
    theme: 'light',
    scrollOrientation: 'horizontal',
    blockAutoAdjustToSpreadsheet: false,
    editSpreadsheetsInWorkspace: true,
    defaultBlockWidth: 280,
    defaultBlockHeight: 400,
    autoSaveInterval: 30,
    horizontalBlockAlignment: true
  };

  const [boards, setBoards] = useState<Board[]>([]);
  const [folders, setFolders] = useState<BoardFolder[]>([]);
  const [settings, setSettings] = useState<CalendarioSettings>(initialSettings);
  const [archived, setArchived] = useState<any>({
    boards: [],
    blocks: [],
    cards: [],
    spreadsheets: [],
    files: [],
    folders: []
  });
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { toast } = useToast();

  // Inicialização
  useEffect(() => {
    initializeDataIfEmpty();
    loadData();
    
    // Configurar salvamento automático
    const autoSaveInterval = setInterval(() => {
      saveData();
    }, settings.autoSaveInterval * 1000);
    
    return () => clearInterval(autoSaveInterval);
  }, []);
  
  // Efeito para aplicar tema
  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.theme]);

  const loadData = () => {
    setIsLoading(true);
    try {
      const loadedBoards = getBoards();
      const loadedFolders = getFolders();
      const loadedSettings = getSettings();
      const loadedArchived = getArchived();
      
      setBoards(loadedBoards);
      setFolders(loadedFolders);
      const validTheme = loadedSettings.theme === 'dark' ? 'dark' : 'light';
      setSettings({...loadedSettings, theme: validTheme});
      setArchived(loadedArchived);
      
      if (loadedBoards.length > 0 && !currentBoardId) {
        setCurrentBoardId(loadedBoards[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do sistema.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveData = () => {
    try {
      saveBoards(boards);
      saveFolders(folders);
      saveSettings(settings);
      saveArchived(archived);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      toast({
        title: "Erro ao salvar dados",
        description: "Não foi possível salvar os dados automaticamente.",
        variant: "destructive"
      });
    }
  };

  const createBoard = (name: string): Board => {
    const newBoard: Board = {
      id: generateId(),
      name,
      blocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false
    };
    
    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    setCurrentBoardId(newBoard.id);
    
    saveCurrentStateAsVersion(`Criação do quadro "${name}"`);
    
    toast({
      title: "Quadro criado",
      description: `O quadro "${name}" foi criado com sucesso.`
    });
    
    return newBoard;
  };
  
  const updateBoard = (board: Board) => {
    const updatedBoards = boards.map(b => b.id === board.id ? { ...board, updatedAt: new Date().toISOString() } : b);
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    toast({
      title: "Quadro atualizado",
      description: `O quadro "${board.name}" foi atualizado.`
    });
  };
  
  const archiveBoard = (boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return;
    
    const updatedBoards = boards.map(b => b.id === boardId ? { ...b, archived: true } : b);
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    const updatedArchived = {
      ...archived,
      boards: [...archived.boards, { ...board, archived: true }]
    };
    setArchived(updatedArchived);
    saveArchived(updatedArchived);
    
    if (currentBoardId === boardId) {
      const activeBoards = updatedBoards.filter(b => !b.archived);
      if (activeBoards.length > 0) {
        setCurrentBoardId(activeBoards[0].id);
      } else {
        setCurrentBoardId(null);
      }
    }
    
    saveCurrentStateAsVersion(`Arquivamento do quadro "${board.name}"`);
    
    toast({
      title: "Quadro arquivado",
      description: `O quadro "${board.name}" foi arquivado.`
    });
  };
  
  const restoreBoard = (boardId: string) => {
    const board = archived.boards.find((b: Board) => b.id === boardId);
    if (!board) return;
    
    const updatedArchived = {
      ...archived,
      boards: archived.boards.filter((b: Board) => b.id !== boardId)
    };
    setArchived(updatedArchived);
    saveArchived(updatedArchived);
    
    const restoredBoard = { ...board, archived: false };
    const boardExists = boards.some(b => b.id === boardId);
    
    let updatedBoards;
    if (boardExists) {
      updatedBoards = boards.map(b => b.id === boardId ? restoredBoard : b);
    } else {
      updatedBoards = [...boards, restoredBoard];
    }
    
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    toast({
      title: "Quadro restaurado",
      description: `O quadro "${board.name}" foi restaurado.`
    });
  };
  
  const deleteBoard = (boardId: string) => {
    const board = boards.find(b => b.id === boardId) || 
                 archived.boards.find((b: Board) => b.id === boardId);
    
    if (!board) return;
    
    const updatedBoards = boards.filter(b => b.id !== boardId);
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    const updatedArchived = {
      ...archived,
      boards: archived.boards.filter((b: Board) => b.id !== boardId)
    };
    setArchived(updatedArchived);
    saveArchived(updatedArchived);
    
    if (currentBoardId === boardId) {
      if (updatedBoards.length > 0) {
        setCurrentBoardId(updatedBoards[0].id);
      } else {
        setCurrentBoardId(null);
      }
    }
    
    saveCurrentStateAsVersion(`Remoção do quadro "${board.name}"`);
    
    toast({
      title: "Quadro removido",
      description: `O quadro "${board.name}" foi removido permanentemente.`
    });
  };
  
  const setCurrentBoard = (boardId: string) => {
    setCurrentBoardId(boardId);
  };

  const createBlock = (boardId: string, name: string): Block => {
    const boardBlocks = boards.find(b => b.id === boardId)?.blocks || [];
    const maxOrder = boardBlocks.length > 0 
      ? Math.max(...boardBlocks.map(block => block.order))
      : -1;
    
    const newBlock: Block = {
      id: generateId(),
      name,
      boardId,
      items: [],
      order: maxOrder + 1,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          blocks: [...board.blocks, newBlock],
          updatedAt: new Date().toISOString()
        };
      }
      return board;
    });
    
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    toast({
      title: "Bloco criado",
      description: `O bloco "${name}" foi criado com sucesso.`
    });
    
    return newBlock;
  };
  
  const updateBlock = (block: Block) => {
    const updatedBoards = boards.map(board => {
      if (board.id === block.boardId) {
        const updatedBlocks = board.blocks.map(b => 
          b.id === block.id ? { ...block, updatedAt: new Date().toISOString() } : b
        );
        return { 
          ...board, 
          blocks: updatedBlocks,
          updatedAt: new Date().toISOString()
        };
      }
      return board;
    });
    
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
  };
  
  const archiveBlock = (blockId: string) => {
    let blockToArchive: Block | undefined;
    let boardId: string = "";
    
    for (const board of boards) {
      const block = board.blocks.find(b => b.id === blockId);
      if (block) {
        blockToArchive = block;
        boardId = board.id;
        break;
      }
    }
    
    if (!blockToArchive) return;
    
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        const updatedBlocks = board.blocks.map(block => 
          block.id === blockId ? { ...block, archived: true } : block
        );
        return { 
          ...board, 
          blocks: updatedBlocks,
          updatedAt: new Date().toISOString()
        };
      }
      return board;
    });
    
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    const updatedArchived = {
      ...archived,
      blocks: [...archived.blocks, { ...blockToArchive, archived: true }]
    };
    setArchived(updatedArchived);
    saveArchived(updatedArchived);
    
    toast({
      title: "Bloco arquivado",
      description: `O bloco "${blockToArchive.name}" foi arquivado.`
    });
  };
  
  const restoreBlock = (blockId: string) => {
    const block = archived.blocks.find((b: Block) => b.id === blockId);
    if (!block) return;
    
    const boardExists = boards.some(b => b.id === block.boardId);
    if (!boardExists) {
      toast({
        title: "Erro ao restaurar",
        description: "O quadro ao qual este bloco pertencia não existe mais.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedArchived = {
      ...archived,
      blocks: archived.blocks.filter((b: Block) => b.id !== blockId)
    };
    setArchived(updatedArchived);
    saveArchived(updatedArchived);
    
    const updatedBoards = boards.map(board => {
      if (board.id === block.boardId) {
        const blockExists = board.blocks.some(b => b.id === blockId);
        let updatedBlocks;
        
        if (blockExists) {
          updatedBlocks = board.blocks.map(b => 
            b.id === blockId ? { ...block, archived: false } : b
          );
        } else {
          updatedBlocks = [...board.blocks, { ...block, archived: false }];
        }
        
        return { 
          ...board, 
          blocks: updatedBlocks,
          updatedAt: new Date().toISOString()
        };
      }
      return board;
    });
    
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    toast({
      title: "Bloco restaurado",
      description: `O bloco "${block.name}" foi restaurado.`
    });
  };
  
  const deleteBlock = (blockId: string) => {
    let blockName = "";
    let boardId = "";
    
    for (const board of boards) {
      const block = board.blocks.find(b => b.id === blockId);
      if (block) {
        blockName = block.name;
        boardId = board.id;
        break;
      }
    }
    
    if (!blockName) {
      const archivedBlock = archived.blocks.find((b: Block) => b.id === blockId);
      if (archivedBlock) {
        blockName = archivedBlock.name;
        boardId = archivedBlock.boardId;
      }
    }
    
    if (!blockName) return;
    
    if (boardId) {
      const updatedBoards = boards.map(board => {
        if (board.id === boardId) {
          return {
            ...board,
            blocks: board.blocks.filter(block => block.id !== blockId),
            updatedAt: new Date().toISOString()
          };
        }
        return board;
      });
      
      setBoards(updatedBoards);
      saveBoards(updatedBoards);
    }
    
    const updatedArchived = {
      ...archived,
      blocks: archived.blocks.filter((b: Block) => b.id !== blockId)
    };
    setArchived(updatedArchived);
    saveArchived(updatedArchived);
    
    toast({
      title: "Bloco removido",
      description: `O bloco "${blockName}" foi removido permanentemente.`
    });
  };

  const updateBlocksOrder = (updatedBoards: Board[]) => {
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    // Find and update the currentBoardId if needed
    if (currentBoardId) {
      const updatedCurrentBoard = updatedBoards.find(board => board.id === currentBoardId);
      if (updatedCurrentBoard) {
        console.log("Current board updated with new block order");
      }
    }
  };

  const createCard = (blockId: string): Card => {
    let targetBlock: Block | undefined;
    let boardId = "";
    
    for (const board of boards) {
      const block = board.blocks.find(b => b.id === blockId);
      if (block) {
        targetBlock = block;
        boardId = board.id;
        break;
      }
    }
    
    if (!targetBlock) {
      throw new Error("Bloco não encontrado");
    }
    
    const maxOrder = targetBlock.items.length > 0 
      ? Math.max(...targetBlock.items.map(item => item.order))
      : -1;
    
    const newCard: Card = {
      id: generateId(),
      type: "card",
      blockId,
      title: "Novo cartão",
      description: "",
      status: "pending",
      order: maxOrder + 1,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        const updatedBlocks = board.blocks.map(block => {
          if (block.id === blockId) {
            return {
              ...block,
              items: [...block.items, newCard],
              updatedAt: new Date().toISOString()
            };
          }
          return block;
        });
        
        return {
          ...board,
          blocks: updatedBlocks,
          updatedAt: new Date().toISOString()
        };
      }
      return board;
    });
    
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    toast({
      title: "Cartão criado",
      description: "Um novo cartão foi adicionado."
    });
    
    return newCard;
  };
  
  const createSpreadsheet = (blockId: string): Spreadsheet => {
    let targetBlock: Block | undefined;
    let boardId = "";
    
    for (const board of boards) {
      const block = board.blocks.find(b => b.id === blockId);
      if (block) {
        targetBlock = block;
        boardId = board.id;
        break;
      }
    }
    
    if (!targetBlock) {
      throw new Error("Bloco não encontrado");
    }
    
    const maxOrder = targetBlock.items.length > 0 
      ? Math.max(...targetBlock.items.map(item => item.order))
      : -1;
    
    const newSpreadsheet: Spreadsheet = {
      id: generateId(),
      type: "spreadsheet",
      blockId,
      title: "Nova planilha",
      columns: [
        { id: generateId(), name: "Coluna 1", type: "text", required: false, width: 150 },
        { id: generateId(), name: "Coluna 2", type: "text", required: false, width: 150 }
      ],
      rows: [
        { id: generateId(), cells: {} }
      ],
      lastEditedAt: new Date().toISOString(),
      order: maxOrder + 1,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        const updatedBlocks = board.blocks.map(block => {
          if (block.id === blockId) {
            return {
              ...block,
              items: [...block.items, newSpreadsheet],
              updatedAt: new Date().toISOString()
            };
          }
          return block;
        });
        
        return {
          ...board,
          blocks: updatedBlocks,
          updatedAt: new Date().toISOString()
        };
      }
      return board;
    });
    
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    toast({
      title: "Planilha criada",
      description: "Uma nova planilha foi adicionada."
    });
    
    return newSpreadsheet;
  };
  
  const createMarkdownNote = (blockId: string, content: string = "Novo texto markdown"): MarkdownNote => {
    let targetBlock: Block | undefined;
    let boardId = "";
    
    for (const board of boards) {
      const block = board.blocks.find(b => b.id === blockId);
      if (block) {
        targetBlock = block;
        boardId = board.id;
        break;
      }
    }
    
    if (!targetBlock) {
      throw new Error("Bloco não encontrado");
    }
    
    const maxOrder = targetBlock.items.length > 0 
      ? Math.max(...targetBlock.items.map(item => item.order))
      : -1;
    
    const newNote: MarkdownNote = {
      id: generateId(),
      type: "markdown",
      blockId,
      content: content || "# Nova nota\nDigite seu conteúdo aqui...",
      order: maxOrder + 1,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        const updatedBlocks = board.blocks.map(block => {
          if (block.id === blockId) {
            return {
              ...block,
              items: [...block.items, newNote],
              updatedAt: new Date().toISOString()
            };
          }
          return block;
        });
        
        return {
          ...board,
          blocks: updatedBlocks,
          updatedAt: new Date().toISOString()
        };
      }
      return board;
    });
    
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    toast({
      title: "Nota criada",
      description: "Uma nova nota Markdown foi adicionada."
    });
    
    return newNote;
  };
  
  const createFileItem = async (blockId: string, file: File): Promise<FileItem | null> => {
    let targetBlock: Block | undefined;
    let boardId = "";
    
    for (const board of boards) {
      const block = board.blocks.find(b => b.id === blockId);
      if (block) {
        targetBlock = block;
        boardId = board.id;
        break;
      }
    }
    
    if (!targetBlock) {
      toast({
        title: "Erro",
        description: "Bloco não encontrado.",
        variant: "destructive"
      });
      return null;
    }
    
    const maxOrder = targetBlock.items.length > 0 
      ? Math.max(...targetBlock.items.map(item => item.order))
      : -1;
    
    try {
      const fileUrl = URL.createObjectURL(file);
      let thumbnail = "";
      
      if (file.type.startsWith("image/")) {
        thumbnail = fileUrl;
      }
      
      const newFile: FileItem = {
        id: generateId(),
        type: "file",
        blockId,
        name: file.name,
        fileType: file.type,
        url: fileUrl,
        thumbnail,
        order: maxOrder + 1,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedBoards = boards.map(board => {
        if (board.id === boardId) {
          const updatedBlocks = board.blocks.map(block => {
            if (block.id === blockId) {
              return {
                ...block,
                items: [...block.items, newFile],
                updatedAt: new Date().toISOString()
              };
            }
            return block;
          });
          
          return {
            ...board,
            blocks: updatedBlocks,
            updatedAt: new Date().toISOString()
          };
        }
        return board;
      });
      
      setBoards(updatedBoards);
      saveBoards(updatedBoards);
      
      toast({
        title: "Arquivo adicionado",
        description: `O arquivo "${file.name}" foi adicionado.`
      });
      
      return newFile;
    } catch (error) {
      console.error("Erro ao criar item de arquivo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o arquivo.",
        variant: "destructive"
      });
      return null;
    }
  };
  
  const createItem = (blockId: string, type: ItemType, data?: any) => {
    switch (type) {
      case 'card':
        createCard(blockId);
        break;
      case 'spreadsheet':
        createSpreadsheet(blockId);
        break;
      case 'markdown':
        createMarkdownNote(blockId, data?.content || "Novo texto markdown");
        break;
      default:
        break;
    }
  };

  const updateItem = (item: Card | Spreadsheet | MarkdownNote | FileItem) => {
    let targetBlock: Block | undefined;
    let boardId = "";
    
    for (const board of boards) {
      const block = board.blocks.find(b => b.id === item.blockId);
      if (block) {
        targetBlock = block;
        boardId = board.id;
        break;
      }
    }
    
    if (!targetBlock) {
      toast({
        title: "Erro",
        description: "Bloco não encontrado.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        const updatedBlocks = board.blocks.map(block => {
          if (block.id === item.blockId) {
            const updatedItems = block.items.map(i => 
              i.id === item.id ? { ...item, updatedAt: new Date().toISOString() } : i
            );
            
            return {
              ...block,
              items: updatedItems,
              updatedAt: new Date().toISOString()
            };
          }
          return block;
        });
        
        return {
          ...board,
          blocks: updatedBlocks,
          updatedAt: new Date().toISOString()
        };
      }
      return board;
    });
    
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    if (item.type === "spreadsheet") {
      const spreadsheet = item as Spreadsheet;
      const updatedSpreadsheet = {
        ...spreadsheet,
        lastEditedAt: new Date().toISOString()
      };
      
      updateItem(updatedSpreadsheet);
    }
  };
  
  const archiveItem = (itemId: string, type: ItemType) => {
    let itemToArchive: BaseItem | undefined;
    let blockId = "";
    let boardId = "";
    
    for (const board of boards) {
      for (const block of board.blocks) {
        const item = block.items.find(i => i.id === itemId);
        if (item) {
          itemToArchive = item;
          blockId = block.id;
          boardId = board.id;
          break;
        }
      }
      if (itemToArchive) break;
    }
    
    if (!itemToArchive) {
      toast({
        title: "Erro",
        description: "Item não encontrado.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        const updatedBlocks = board.blocks.map(block => {
          if (block.id === blockId) {
            const updatedItems = block.items.map(item => 
              item.id === itemId ? { ...item, archived: true } : item
            );
            
            return {
              ...block,
              items: updatedItems,
              updatedAt: new Date().toISOString()
            };
          }
          return block;
        });
        
        return {
          ...board,
          blocks: updatedBlocks,
          updatedAt: new Date().toISOString()
        };
      }
      return board;
    });
    
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    const updatedArchived = {
      ...archived,
      [type + "s"]: [...(archived[type + "s"] || []), { ...itemToArchive, archived: true }]
    };
    setArchived(updatedArchived);
    saveArchived(updatedArchived);
    
    toast({
      title: "Item arquivado",
      description: "O item foi arquivado com sucesso."
    });
  };
  
  const restoreItem = (itemId: string, type: ItemType) => {
    const archivedItems = archived[type + "s"] || [];
    const item = archivedItems.find((i: BaseItem) => i.id === itemId);
    
    if (!item) {
      toast({
        title: "Erro",
        description: "Item não encontrado nos arquivados.",
        variant: "destructive"
      });
      return;
    }
    
    let blockExists = false;
    let boardId = "";
    
    for (const board of boards) {
      const block = board.blocks.find(b => b.id === item.blockId);
      if (block) {
        blockExists = true;
        boardId = board.id;
        break;
      }
    }
    
    if (!blockExists) {
      toast({
        title: "Erro",
        description: "O bloco ao qual este item pertencia não existe mais.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedArchived = {
      ...archived,
      [type + "s"]: archivedItems.filter((i: BaseItem) => i.id !== itemId)
    };
    setArchived(updatedArchived);
    saveArchived(updatedArchived);
    
    const restoredItem = { ...item, archived: false };
    
    const updatedBoards = boards.map(board => {
      if (board.id === boardId) {
        const updatedBlocks = board.blocks.map(block => {
          if (block.id === item.blockId) {
            const itemExists = block.items.some(i => i.id === itemId);
            let updatedItems;
            
            if (itemExists) {
              updatedItems = block.items.map(i => 
                i.id === itemId ? restoredItem : i
              );
            } else {
              updatedItems = [...block.items, restoredItem];
            }
            
            return {
              ...block,
              items: updatedItems,
              updatedAt: new Date().toISOString()
            };
          }
          return block;
        });
        
        return {
          ...board,
          blocks: updatedBlocks,
          updatedAt: new Date().toISOString()
        };
      }
      return board;
    });
    
    setBoards(updatedBoards);
    saveBoards(updatedBoards);
    
    toast({
      title: "Item restaurado",
      description: "O item foi restaurado com sucesso."
    });
  };
  
  const deleteItem = (itemId: string, type: ItemType) => {
    let found = false;
    const updatedBoards = boards.map(board => {
      const updatedBlocks = board.blocks.map(block => {
        const itemIndex = block.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          found = true;
          return {
            ...block,
            items: block.items.filter(item => item.id !== itemId),
            updatedAt: new Date().toISOString()
          };
        }
        return block;
      });
      
      return {
        ...board,
        blocks: updatedBlocks,
        updatedAt: found ? new Date().toISOString() : board.updatedAt
      };
    });
    
    if (found) {
      setBoards(updatedBoards);
      saveBoards(updatedBoards);
    }
    
    const archivedItems = archived[type + "s"] || [];
    const updatedArchived = {
      ...archived,
      [type + "s"]: archivedItems.filter((item: BaseItem) => item.id !== itemId)
    };
    
    setArchived(updatedArchived);
    saveArchived(updatedArchived);
    
    toast({
      title: "Item removido",
      description: "O item foi removido permanentemente."
    });
  };

  const createFolder = (name: string): BoardFolder => {
    const newFolder: BoardFolder = {
      id: generateId(),
      name,
      boardIds: [],
      subfolders: [],
      expanded: true,
      archived: false
    };
    
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    saveFolders(updatedFolders);
    
    toast({
      title: "Pasta criada",
      description: `A pasta "${name}" foi criada com sucesso.`
    });
    
    return newFolder;
  };
  
  const updateFolder = (folder: BoardFolder) => {
    const updatedFolders = folders.map(f => f.id === folder.id ? folder : f);
    setFolders(updatedFolders);
    saveFolders(updatedFolders);
  };
  
  const archiveFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;
    
    const updatedFolders = folders.map(f => f.id === folderId ? { ...f, archived: true } : f);
    setFolders(updatedFolders);
    saveFolders(updatedFolders);
    
    const updatedArchived = {
      ...archived,
      folders: [...archived.folders, { ...folder, archived: true }]
    };
    setArchived(updatedArchived);
    saveArchived(updatedArchived);
    
    toast({
      title: "Pasta arquivada",
      description: `A pasta "${folder.name}" foi arquivada.`
    });
  };
  
  const restoreFolder = (folderId: string) => {
    const folder = archived.folders.find((f: BoardFolder) => f.id === folderId);
    if (!folder) return;
    
    const updatedArchived = {
      ...archived,
      folders: archived.folders.filter((f: BoardFolder) => f.id !== folderId)
    };
    setArchived(updatedArchived);
    saveArchived(updatedArchived);
    
    const restoredFolder = { ...folder, archived: false };
    const folderExists = folders.some(f => f.id === folderId);
    
    let updatedFolders;
    if (folderExists) {
      updatedFolders = folders.map(f => f.id === folderId ? restoredFolder : f);
    } else {
      updatedFolders = [...folders, restoredFolder];
    }
    
    setFolders(updatedFolders);
    saveFolders(updatedFolders);
    
    toast({
      title: "Pasta restaurada",
      description: `A pasta "${folder.name}" foi restaurada.`
    });
  };
  
  const deleteFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId) || 
                 archived.folders.find((f: BoardFolder) => f.id === folderId);
    
    if (!folder) return;
    
    const updatedFolders = folders.filter(f => f.id !== folderId);
    setFolders(updatedFolders);
    saveFolders(updatedFolders);
    
    const updatedArchived = {
      ...archived,
      folders: archived.folders.filter((f: BoardFolder) => f.id !== folderId)
    };
    setArchived(updatedArchived);
    saveArchived(updatedArchived);
    
    toast({
      title: "Pasta removida",
      description: `A pasta "${folder.name}" foi removida permanentemente.`
    });
  };

  const updateSettings = (newSettings: Partial<CalendarioSettings>) => {
    if (newSettings.theme && newSettings.theme !== 'light' && newSettings.theme !== 'dark') {
      newSettings.theme = 'light';
    }
    
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const exportData = (): string => {
    const data = {
      boards,
      folders,
      settings,
      archived,
      version: "1.0.0",
      exportDate: new Date().toISOString()
    };
    
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive"
      });
      return "";
    }
  };
  
  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.boards || !Array.isArray(data.boards) ||
          !data.folders || !Array.isArray(data.folders) ||
          !data.settings || typeof data.settings !== 'object') {
        throw new Error("Formato de dados inválido");
      }
      
      saveCurrentStateAsVersion("Backup antes da importação");
      
      setBoards(data.boards);
      saveBoards(data.boards);
      
      setFolders(data.folders);
      saveFolders(data.folders);
      
      setSettings(data.settings);
      saveSettings(data.settings);
      
      if (data.archived) {
        setArchived(data.archived);
        saveArchived(data.archived);
      }
      
      if (data.boards.length > 0) {
        setCurrentBoardId(data.boards[0].id);
      }
      
      toast({
        title: "Importação concluída",
        description: "Os dados foram importados com sucesso."
      });
      
      saveCurrentStateAsVersion("Importação de dados");
      
      return true;
    } catch (error) {
      console.error("Erro ao importar dados:", error);
      toast({
        title: "Erro na importação",
        description: "Não foi possível importar os dados. Verifique o formato do arquivo.",
        variant: "destructive"
      });
      return false;
    }
  };

  const contextValue: CalendarioContextType = {
    boards, 
    folders,
    settings,
    archived,
    currentBoardId,
    isCollapsed,
    isLoading,
    
    createBoard,
    updateBoard,
    archiveBoard,
    restoreBoard,
    deleteBoard,
    setCurrentBoard,
    
    createBlock,
    updateBlock,
    archiveBlock,
    restoreBlock,
    deleteBlock,
    updateBlocksOrder,
    
    createCard,
    createSpreadsheet,
    createMarkdownNote,
    createFileItem,
    createItem,
    updateItem,
    archiveItem,
    restoreItem,
    deleteItem,
    
    createFolder,
    updateFolder,
    archiveFolder,
    restoreFolder,
    deleteFolder,
    
    updateSettings,
    
    toggleSidebar,
    exportData,
    importData
  };

  return (
    <CalendarioContext.Provider value={contextValue}>
      {children}
    </CalendarioContext.Provider>
  );
};

export const useCalendario = (): CalendarioContextType => {
  const context = useContext(CalendarioContext);
  if (context === undefined) {
    throw new Error("useCalendario deve ser usado dentro de um CalendarioProvider");
  }
  return context;
};
