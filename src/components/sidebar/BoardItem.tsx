
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
import { Calendar, MoreVertical, Pencil, Archive, Trash2, Image } from "lucide-react";
import { Board } from "@/types/calendario";

interface BoardItemProps {
  board: Board;
  isActive: boolean;
  onClick: () => void;
}

export default function BoardItem({ board, isActive, onClick }: BoardItemProps) {
  const { updateBoard, archiveBoard, deleteBoard } = useCalendario();
  
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wallpaperDialogOpen, setWallpaperDialogOpen] = useState(false);
  const [newName, setNewName] = useState(board.name);
  const [wallpaper, setWallpaper] = useState(board.wallpaper || "");
  
  const handleRename = () => {
    updateBoard({ ...board, name: newName });
    setRenameDialogOpen(false);
  };
  
  const handleWallpaperChange = () => {
    updateBoard({ ...board, wallpaper });
    setWallpaperDialogOpen(false);
  };
  
  const handleDelete = () => {
    deleteBoard(board.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div 
        className={`flex items-center justify-between py-1 px-2 rounded text-sm ${
          isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary"
        }`}
      >
        <div className="flex items-center cursor-pointer flex-1" onClick={onClick}>
          <Calendar size={16} className="mr-2" />
          <span className="truncate">{board.name}</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { 
              setNewName(board.name);
              setRenameDialogOpen(true);
            }}>
              <Pencil size={16} className="mr-2" />
              <span>Renomear</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => {
              setWallpaper(board.wallpaper || "");
              setWallpaperDialogOpen(true);
            }}>
              <Image size={16} className="mr-2" />
              <span>Papel de parede</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => archiveBoard(board.id)}>
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
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
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
      
      {/* Diálogo de papel de parede */}
      <Dialog open={wallpaperDialogOpen} onOpenChange={setWallpaperDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar papel de parede</DialogTitle>
            <DialogDescription>Escolha uma cor ou link para uma imagem</DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <div className="mb-2 text-sm">Link da imagem:</div>
              <input
                type="text"
                value={wallpaper}
                onChange={(e) => setWallpaper(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <div className="mb-2 text-sm">Ou selecione uma cor:</div>
              <div className="grid grid-cols-5 gap-2">
                {["#1976D2", "#4CAF50", "#F44336", "#FFC107", "#9C27B0"].map(color => (
                  <div 
                    key={color} 
                    className="w-8 h-8 rounded cursor-pointer border hover:opacity-90"
                    style={{ backgroundColor: color }}
                    onClick={() => setWallpaper(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setWallpaperDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleWallpaperChange}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir quadro</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir permanentemente o quadro "{board.name}"? Esta ação não pode ser desfeita.
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
