
import { useState, useEffect } from "react";
import { useCalendario } from "@/contexts/CalendarioContext";
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
import BlockComponent from "@/components/workspace/BlockComponent";
import { Block } from "@/types/calendario";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy 
} from "@dnd-kit/sortable";

export default function WorkArea() {
  const { 
    boards, 
    currentBoardId, 
    settings,
    createBlock,
    updateBlock,
    updateBlocksOrder
  } = useCalendario();
  
  const [newBlockDialogOpen, setNewBlockDialogOpen] = useState(false);
  const [blockName, setBlockName] = useState("Novo bloco");
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Encontrar o quadro atual
  const currentBoard = boards.find(board => board.id === currentBoardId);
  
  // Ordenar os blocos pelo campo order
  const sortedBlocks = currentBoard?.blocks.filter(b => !b.archived) || [];
  sortedBlocks.sort((a, b) => a.order - b.order);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance required before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    console.log("Started dragging block:", active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over || active.id === over.id) return;
    
    console.log("Drag ended:", active.id, "over", over.id);
    
    const oldIndex = sortedBlocks.findIndex(block => block.id === active.id);
    const newIndex = sortedBlocks.findIndex(block => block.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      console.log("Reordering blocks from", oldIndex, "to", newIndex);
      
      // Create new array for the updated order
      const newBlocks = arrayMove(sortedBlocks, oldIndex, newIndex);
      
      // Update the order field for each block
      const updatedBlocks = newBlocks.map((block, index) => ({
        ...block,
        order: index
      }));
      
      // Update the blocks in the current board
      if (currentBoard) {
        // Filter out blocks that were reordered (non-archived ones)
        const archivedBlocks = currentBoard.blocks.filter(b => b.archived);
        
        // Create the new board blocks array with updated orders
        const newBoardBlocks = [...archivedBlocks, ...updatedBlocks];
        
        // Update the board with the new blocks order
        const updatedBoard = {
          ...currentBoard,
          blocks: newBoardBlocks
        };
        
        // Update all boards, replacing the current one
        const updatedBoards = boards.map(board => 
          board.id === currentBoardId ? updatedBoard : board
        );
        
        // Call the appropriate context function to update the boards
        if (typeof updateBlocksOrder === 'function') {
          updateBlocksOrder(updatedBoards);
          toast.success("Blocos reordenados com sucesso");
        } else {
          console.error("updateBlocksOrder function is not available in context");
        }
      }
    }
  };
  
  const handleCreateBlock = () => {
    if (currentBoardId) {
      createBlock(currentBoardId, blockName);
      setNewBlockDialogOpen(false);
      setBlockName("Novo bloco");
      toast.success("Bloco criado com sucesso");
    }
  };

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
      id="workspace"
      className="flex-1 h-screen overflow-auto p-4"
      style={wallpaperStyle}
    >
      {!currentBoard && (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="text-2xl font-bold mb-4">Bem-vindo ao Calendario</div>
          <p className="text-muted-foreground mb-6">Selecione um quadro na barra lateral ou crie um novo</p>
        </div>
      )}
      
      {currentBoard && (
        <div className="flex flex-col h-full">
          <div className="p-4 mb-4 bg-white/90 backdrop-blur-sm border-b shadow-sm flex items-center rounded-lg">
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

          <div className="flex-1">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={sortedBlocks.map(block => block.id)}
                strategy={settings.scrollOrientation === 'vertical' ? verticalListSortingStrategy : horizontalListSortingStrategy}
              >
                <div className="flex gap-4" style={{
                  flexDirection: settings.scrollOrientation === 'vertical' ? 'column' : 'row',
                  minHeight: settings.scrollOrientation === 'vertical' ? 'fit-content' : '100%',
                  minWidth: settings.scrollOrientation === 'horizontal' ? 'fit-content' : '100%',
                }}>
                  {sortedBlocks.map(block => (
                    <BlockComponent 
                      key={block.id} 
                      block={block}
                    />
                  ))}
                  
                  {sortedBlocks.length === 0 && (
                    <div className="flex items-center justify-center p-10 bg-white/30 backdrop-blur-sm rounded-lg">
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
              </SortableContext>
            </DndContext>
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
