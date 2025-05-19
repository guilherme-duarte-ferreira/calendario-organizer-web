
import { useState } from "react";
import { useCalendario } from "@/contexts/CalendarioContext";
import { useDragDrop } from "@/hooks/use-drag-drop";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";

import BlockComponent from "./workspace/BlockComponent";

export default function WorkArea() {
  const { 
    boards, 
    currentBoardId, 
    settings,
    createBlock 
  } = useCalendario();
  
  const [newBlockDialogOpen, setNewBlockDialogOpen] = useState(false);
  const [blockName, setBlockName] = useState("Novo bloco");
  
  // Encontrar o quadro atual
  const currentBoard = boards.find(board => board.id === currentBoardId);
  
  // Ordenar os blocos pelo campo order
  const sortedBlocks = currentBoard?.blocks.filter(b => !b.archived) || [];
  sortedBlocks.sort((a, b) => a.order - b.order);
  
  const { isDraggedOver, handlers } = useDragDrop({
    onDrop: (e, targetId) => {
      // Aqui implementaremos a lógica de drop para blocos no futuro
      console.log("Drop on workspace", targetId);
    }
  });
  
  const handleCreateBlock = () => {
    if (currentBoardId) {
      createBlock(currentBoardId, blockName);
      setNewBlockDialogOpen(false);
      setBlockName("Novo bloco");
    }
  };
  
  // Estilo baseado na orientação de rolagem
  const workspaceStyle = {
    flexDirection: settings.scrollOrientation === 'vertical' ? 'column' : 'row',
    overflowX: settings.scrollOrientation === 'vertical' ? 'hidden' : 'auto',
    overflowY: settings.scrollOrientation === 'vertical' ? 'auto' : 'hidden',
  } as React.CSSProperties;
  
  // Estilo do fundo baseado no wallpaper do quadro
  const wallpaperStyle = {
    backgroundColor: currentBoard?.wallpaper && currentBoard.wallpaper.startsWith('#') 
      ? currentBoard.wallpaper 
      : undefined,
    backgroundImage: currentBoard?.wallpaper && !currentBoard.wallpaper.startsWith('#')
      ? `url(${currentBoard.wallpaper})` 
      : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div 
      className={`flex-1 h-screen ${
        isDraggedOver ? 'calendario-drag-over' : ''
      }`}
      style={wallpaperStyle}
      onDragOver={handlers.handleDragOver}
      onDragLeave={handlers.handleDragLeave}
      onDrop={(e) => handlers.handleDrop(e, "workspace")}
    >
      {!currentBoard && (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="text-2xl font-bold mb-4">Bem-vindo ao Calendario</div>
          <p className="text-muted-foreground mb-6">Selecione um quadro na barra lateral ou crie um novo</p>
        </div>
      )}
      
      {currentBoard && (
        <div className="flex flex-col h-full">
          <div className="p-4 bg-white/90 backdrop-blur-sm border-b shadow-sm flex items-center">
            <h1 className="text-xl font-bold">{currentBoard.name}</h1>
            <div className="ml-auto">
              <Button 
                variant="outline" 
                onClick={() => setNewBlockDialogOpen(true)}
              >
                <Plus size={18} className="mr-1" />
                Adicionar Bloco
              </Button>
            </div>
          </div>
          
          <div 
            className="flex flex-1 p-4 gap-4 overflow-auto"
            style={workspaceStyle}
          >
            {sortedBlocks.map(block => (
              <BlockComponent key={block.id} block={block} />
            ))}
            
            {sortedBlocks.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Nenhum bloco neste quadro ainda.
                  </p>
                  <Button onClick={() => setNewBlockDialogOpen(true)}>
                    <Plus size={18} className="mr-1" />
                    Adicionar Bloco
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Diálogo para criar novo bloco */}
      <Dialog open={newBlockDialogOpen} onOpenChange={setNewBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar novo bloco</DialogTitle>
            <DialogDescription>
              Digite um nome para o novo bloco
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              placeholder="Nome do bloco"
              className="resize-none"
              rows={1}
              autoFocus
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewBlockDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateBlock}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
