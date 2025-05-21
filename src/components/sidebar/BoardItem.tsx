
import React, { useState } from "react";
import { Board } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Archive, 
  Pencil, 
  Trash2,
  Pin
} from "lucide-react";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface BoardItemProps {
  board: Board;
  isActive: boolean;
  onClick: () => void;
}

export default function BoardItem({ board, isActive, onClick }: BoardItemProps) {
  const { updateBoard, archiveBoard, deleteBoard } = useCalendario();
  
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [boardName, setBoardName] = useState(board.name);
  
  const handleRename = () => {
    updateBoard({ ...board, name: boardName });
    setRenameDialogOpen(false);
    toast.success("Quadro renomeado com sucesso");
  };
  
  const handleArchive = () => {
    archiveBoard(board.id);
    toast.success("Quadro arquivado com sucesso");
  };
  
  const handleDelete = () => {
    deleteBoard(board.id);
    setDeleteDialogOpen(false);
    toast.success("Quadro excluído permanentemente");
  };
  
  const togglePin = () => {
    updateBoard({
      ...board,
      pinned: !board.pinned
    });
    toast.success(board.pinned ? "Quadro desafixado" : "Quadro fixado no topo");
  };
  
  // Adicionar atributo draggable e manipuladores de eventos
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", `board-${board.id}`);
    e.dataTransfer.effectAllowed = 'move';
    
    // Adicionar estilo de arrastar
    e.currentTarget.classList.add('opacity-50');
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Remover estilo de arrastar
    e.currentTarget.classList.remove('opacity-50');
  };

  return (
    <>
      <div 
        className={`flex items-center justify-between rounded py-1 px-2 text-sm cursor-pointer group ${
          isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
        }`}
        onClick={onClick}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-center truncate">
          <span className="truncate">{board.name}</span>
          {board.pinned && (
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
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              setBoardName(board.name);
              setRenameDialogOpen(true);
            }}>
              <Pencil size={16} className="mr-2" />
              <span>Renomear</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              togglePin();
            }}>
              <Pin size={16} className="mr-2" />
              <span>{board.pinned ? "Desafixar" : "Fixar no topo"}</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              handleArchive();
            }}>
              <Archive size={16} className="mr-2" />
              <span>Arquivar</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 size={16} className="mr-2" />
              <span>Excluir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Diálogo de renomeação */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear quadro</DialogTitle>
            <DialogDescription>Digite um novo nome para o quadro</DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Nome do quadro"
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
            <DialogTitle>Excluir quadro</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir permanentemente o quadro "{board.name}"? 
              Esta ação não pode ser desfeita.
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
