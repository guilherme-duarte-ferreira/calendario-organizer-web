
import { useState, useEffect } from "react";
import { useCalendario } from "@/contexts/CalendarioContext";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Archive,
  Settings,
  ChevronDown,
  MoreVertical,
  Folder, 
  FolderPlus
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";

import BoardItem from "./sidebar/BoardItem";
import FolderItem from "./sidebar/FolderItem";
import SettingsDialog from "./dialogs/SettingsDialog";

export default function Sidebar() {
  const { 
    boards,
    folders,
    isCollapsed,
    toggleSidebar,
    currentBoardId,
    setCurrentBoard,
    createBoard,
    createFolder
  } = useCalendario();
  
  const [showBoards, setShowBoards] = useState(true);
  const [showFolders, setShowFolders] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [createBoardDialogOpen, setCreateBoardDialogOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("Novo Quadro");
  
  // Filtra apenas boards não arquivados
  const activeBoards = boards.filter(board => !board.archived);
  const activeFolders = folders.filter(folder => !folder.archived);
  
  const handleCreateBoard = () => {
    createBoard(newBoardName);
    setCreateBoardDialogOpen(false);
    setNewBoardName("Novo Quadro");
  };
  
  const handleCreateFolder = () => {
    createFolder("Nova Pasta");
  };

  return (
    <>
      <div 
        className={`h-screen bg-sidebar border-r flex flex-col transition-all duration-300 ${
          isCollapsed ? "w-[60px]" : "w-[260px]"
        }`}
      >
        <div className="flex items-center p-2 border-b">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-muted-foreground">
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
          
          {!isCollapsed && (
            <div className="ml-2 text-sm font-medium">Calendário</div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    onClick={() => {}} 
                    className={`w-full justify-${isCollapsed ? "center" : "start"} mb-1`}
                  >
                    <Calendar size={20} />
                    {!isCollapsed && <span className="ml-2">Calendário</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className={isCollapsed ? "" : "hidden"}>
                  Calendário
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSettingsOpen(true)} 
                    className={`w-full justify-${isCollapsed ? "center" : "start"} mb-1`}
                  >
                    <Settings size={20} />
                    {!isCollapsed && <span className="ml-2">Configurações</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className={isCollapsed ? "" : "hidden"}>
                  Configurações
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    onClick={() => {}} 
                    className={`w-full justify-${isCollapsed ? "center" : "start"} mb-1`}
                  >
                    <Archive size={20} />
                    {!isCollapsed && <span className="ml-2">Arquivados</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className={isCollapsed ? "" : "hidden"}>
                  Arquivados
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Separator />
          
          {!isCollapsed && (
            <div className="flex-1 overflow-y-auto p-2">
              <div className="mb-4">
                <div 
                  className="flex items-center justify-between mb-2 cursor-pointer" 
                  onClick={() => setShowBoards(!showBoards)}
                >
                  <div className="flex items-center">
                    <ChevronDown size={16} className={`mr-1 transition-transform ${showBoards ? "" : "-rotate-90"}`} />
                    <span className="text-sm font-medium">Quadros</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setCreateBoardDialogOpen(true); 
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                {showBoards && (
                  <div className="pl-2 space-y-1">
                    {activeBoards.map((board) => (
                      <BoardItem 
                        key={board.id}
                        board={board}
                        isActive={board.id === currentBoardId}
                        onClick={() => setCurrentBoard(board.id)} 
                      />
                    ))}
                    
                    {activeBoards.length === 0 && (
                      <div className="text-sm text-muted-foreground py-1 px-2">
                        Nenhum quadro disponível
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mb-2">
                <div 
                  className="flex items-center justify-between mb-2 cursor-pointer" 
                  onClick={() => setShowFolders(!showFolders)}
                >
                  <div className="flex items-center">
                    <ChevronDown size={16} className={`mr-1 transition-transform ${showFolders ? "" : "-rotate-90"}`} />
                    <span className="text-sm font-medium">Pastas</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => { 
                      e.stopPropagation();
                      handleCreateFolder();  
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                {showFolders && (
                  <div className="pl-2 space-y-1">
                    {activeFolders.map((folder) => (
                      <FolderItem 
                        key={folder.id} 
                        folder={folder} 
                      />
                    ))}
                    
                    {activeFolders.length === 0 && (
                      <div className="text-sm text-muted-foreground py-1 px-2">
                        Nenhuma pasta criada
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Diálogo de criação de quadro */}
      <Dialog open={createBoardDialogOpen} onOpenChange={setCreateBoardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar novo quadro</DialogTitle>
            <DialogDescription>
              Digite um nome para o novo quadro
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Nome do quadro"
              className="w-full border rounded px-3 py-2"
              autoFocus
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateBoardDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateBoard}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de configurações */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
