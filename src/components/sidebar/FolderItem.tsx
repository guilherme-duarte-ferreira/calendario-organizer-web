
import { useState } from "react";
import { useCalendario } from "@/contexts/CalendarioContext";
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
import { ChevronDown, Folder, MoreVertical, Pencil, Archive, Trash2 } from "lucide-react";
import { BoardFolder } from "@/types/calendario";

interface FolderItemProps {
  folder: BoardFolder;
  depth?: number;
}

export default function FolderItem({ folder, depth = 0 }: FolderItemProps) {
  const { folders, boards, updateFolder, archiveFolder, deleteFolder, setCurrentBoard } = useCalendario();
  
  const [expanded, setExpanded] = useState(folder.expanded);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  
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
  };
  
  const handleDelete = () => {
    deleteFolder(folder.id);
    setDeleteDialogOpen(false);
  };

  const marginLeft = depth * 8;

  return (
    <>
      <div className="mb-1">
        <div className="flex items-center justify-between py-1 pr-2 rounded text-sm hover:bg-secondary group">
          <div 
            className="flex items-center cursor-pointer flex-1"
            style={{ paddingLeft: `${marginLeft}px` }}
            onClick={handleExpand}
          >
            <ChevronDown 
              size={16} 
              className={`mr-1 transition-transform ${expanded ? "" : "-rotate-90"}`} 
            />
            <Folder size={16} className="mr-2" />
            <span className="truncate">{folder.name}</span>
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
                className="flex items-center py-1 px-2 rounded text-sm hover:bg-secondary cursor-pointer"
                style={{ marginLeft: `${marginLeft}px` }}
                onClick={() => setCurrentBoard(board.id)}
              >
                <span className="truncate">{board.name}</span>
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
