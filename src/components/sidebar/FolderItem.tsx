
import { useState, DragEvent } from "react";
import { useCalendario } from "@/contexts/CalendarioContext";
import { useDragDrop } from "@/hooks/use-drag-drop";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, Folder, MoreVertical, Pencil, Archive, Trash2, Pin } from "lucide-react";
import { BoardFolder, Board } from "@/types/calendario";
import { toast } from "sonner";

interface FolderItemProps {
  folder: BoardFolder;
  depth?: number;
}

export default function FolderItem({ folder, depth = 0 }: FolderItemProps) {
  const { 
    folders, 
    boards, 
    updateFolder, 
    archiveFolder, 
    deleteFolder, 
    setCurrentBoard,
    updateBoard
  } = useCalendario();
  
  const [expanded, setExpanded] = useState(folder.expanded);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  
  // Encontrar todos os quadros nesta pasta
  const folderBoards = boards.filter(board => 
    folder.boardIds.includes(board.id) && !board.archived
  );
  
  // Encontrar todas as subpastas
  const subfolders = folders.filter(f => 
    folder.subfolders.includes(f.id) && !f.archived
  );
  
  const handleExpand = () => {
    setExpanded(!expanded);
    updateFolder({ ...folder, expanded: !expanded });
  };
  
  const handleRename = () => {
    updateFolder({ ...folder, name: newName });
    setRenameDialogOpen(false);
    toast.success("Pasta renomeada com sucesso");
  };
  
  const handleDelete = () => {
    deleteFolder(folder.id);
    setDeleteDialogOpen(false);
    toast.success("Pasta excluída com sucesso");
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggedOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggedOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggedOver(false);
    
    // Obter o ID do quadro arrastado
    const boardId = e.dataTransfer.getData("text/plain");
    if (!boardId.startsWith('board-')) return;
    
    const cleanBoardId = boardId.replace('board-', '');
    const board = boards.find(b => b.id === cleanBoardId);
    
    if (board) {
      // Verificar se o quadro já está nesta pasta
      if (folder.boardIds.includes(board.id)) {
        toast.info("O quadro já está nesta pasta");
        return;
      }
      
      // Remover o quadro de qualquer outra pasta
      const updatedFolders = folders.map(f => {
        if (f.boardIds.includes(board.id)) {
          return {
            ...f,
            boardIds: f.boardIds.filter(id => id !== board.id)
          };
        }
        return f;
      });
      
      // Atualizar outras pastas primeiro
      updatedFolders.forEach(f => {
        if (f.id !== folder.id && f.boardIds.join(',') !== folders.find(orig => orig.id === f.id)?.boardIds.join(',')) {
          updateFolder(f);
        }
      });
      
      // Adicionar o quadro a esta pasta
      const updatedFolder = {
        ...folder,
        boardIds: [...folder.boardIds, board.id],
        expanded: true // Expandir a pasta ao receber um quadro
      };
      
      updateFolder(updatedFolder);
      setExpanded(true);
      toast.success(`Quadro "${board.name}" movido para a pasta "${folder.name}"`);
    }
  };

  const handlePinFolder = () => {
    updateFolder({ 
      ...folder, 
      pinned: !folder.pinned 
    });
    toast.success(folder.pinned ? "Pasta desafixada" : "Pasta fixada no topo");
  };

  const togglePinBoard = (board: Board) => {
    updateBoard({
      ...board,
      pinned: !board.pinned
    });
    toast.success(board.pinned ? "Quadro desafixado" : "Quadro fixado no topo");
  };

  const marginLeft = depth * 8;

  return (
    <>
      <div className="mb-1">
        <div 
          className={`flex items-center justify-between py-1 pr-2 rounded text-sm hover:bg-secondary group ${
            isDraggedOver ? 'bg-secondary/50 border border-dashed border-blue-400' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div 
            className="flex items-center cursor-pointer flex-1"
            style={{ paddingLeft: `${marginLeft}px` }}
            onClick={handleExpand}
          >
            <ChevronDown 
              size={16} 
              className={`mr-1 transition-transform ${expanded ? "" : "-rotate-90"}`} 
            />
            <Folder size={16} className={`mr-2 ${folder.pinned ? 'text-amber-500' : ''}`} />
            <span className="truncate">{folder.name}</span>
            {folder.pinned && (
              <Pin size={12} className="ml-1 text-amber-500" />
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { 
                setNewName(folder.name);
                setRenameDialogOpen(true);
              }}>
                <Pencil size={16} className="mr-2" />
                <span>Renomear</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handlePinFolder}>
                <Pin size={16} className="mr-2" />
                <span>{folder.pinned ? "Desafixar" : "Fixar no topo"}</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => archiveFolder(folder.id)}>
                <Archive size={16} className="mr-2" />
                <span>Arquivar</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive" 
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 size={16} className="mr-2" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {expanded && (
          <div className="pl-4">
            {/* Mostrar quadros na pasta */}
            {folderBoards.map(board => (
              <div 
                key={board.id}
                className="flex items-center justify-between py-1 px-2 rounded text-sm hover:bg-secondary cursor-pointer group"
                style={{ marginLeft: `${marginLeft}px` }}
                onClick={() => setCurrentBoard(board.id)}
              >
                <div className="flex items-center flex-1">
                  <span className="truncate">{board.name}</span>
                  {board.pinned && (
                    <Pin size={12} className="ml-1 text-amber-500" />
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePinBoard(board);
                  }}
                >
                  <Pin size={12} className={board.pinned ? "text-amber-500" : ""} />
                </Button>
              </div>
            ))}
            
            {/* Mostrar subpastas */}
            {subfolders.map(subfolder => (
              <FolderItem 
                key={subfolder.id} 
                folder={subfolder} 
                depth={depth + 1}
              />
            ))}
            
            {folderBoards.length === 0 && subfolders.length === 0 && (
              <div 
                className="text-sm text-muted-foreground py-1 px-2"
                style={{ marginLeft: `${marginLeft}px` }}
              >
                Pasta vazia
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Diálogo de renomeação */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear pasta</DialogTitle>
            <DialogDescription>Digite um novo nome para a pasta</DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome da pasta"
              className="w-full border rounded px-3 py-2"
              autoFocus
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRename}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir pasta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir permanentemente a pasta "{folder.name}"? 
              Esta ação não exclui os quadros dentro dela, apenas a pasta.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Excluir permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
