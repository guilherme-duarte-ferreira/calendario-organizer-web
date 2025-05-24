
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCalendario } from "@/contexts/CalendarioContext";
import { toast } from "sonner";

interface MoveItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemType: 'card' | 'spreadsheet';
  currentBlockId: string;
}

export default function MoveItemDialog({
  isOpen,
  onClose,
  itemId,
  itemType,
  currentBlockId,
}: MoveItemDialogProps) {
  const { boards, currentBoardId, updateItem } = useCalendario();
  const [selectedBoardId, setSelectedBoardId] = useState(currentBoardId || '');
  const [selectedBlockId, setSelectedBlockId] = useState(currentBlockId);
  const [selectedPosition, setSelectedPosition] = useState('1');

  const selectedBoard = boards.find(board => board.id === selectedBoardId);
  const selectedBlock = selectedBoard?.blocks.find(block => block.id === selectedBlockId);
  const currentBoard = boards.find(board => board.id === currentBoardId);
  const currentBlock = currentBoard?.blocks.find(block => block.id === currentBlockId);
  
  // Get the current item
  const currentItem = currentBlock?.items.find(item => item.id === itemId);

  const handleMove = () => {
    if (!currentItem || !selectedBlockId) {
      toast.error("Erro ao mover o item");
      return;
    }

    if (selectedBlockId === currentBlockId) {
      toast.error("O item já está neste bloco");
      return;
    }

    // Update the item with new blockId
    const updatedItem = {
      ...currentItem,
      blockId: selectedBlockId,
      order: parseInt(selectedPosition) - 1,
      updatedAt: new Date().toISOString(),
    };

    updateItem(updatedItem);
    
    const targetBlockName = selectedBlock?.name || 'Bloco';
    toast.success(`${itemType === 'card' ? 'Cartão' : 'Planilha'} movido para ${targetBlockName}`);
    onClose();
  };

  const getAvailablePositions = () => {
    if (!selectedBlock) return [];
    
    const itemsInBlock = selectedBlock.items.filter(item => !item.archived).length;
    const positions = [];
    
    for (let i = 1; i <= itemsInBlock + 1; i++) {
      positions.push(i.toString());
    }
    
    return positions;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Mover {itemType === 'card' ? 'Cartão' : 'Planilha'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="board-select">Quadro</Label>
            <Select value={selectedBoardId} onValueChange={setSelectedBoardId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um quadro" />
              </SelectTrigger>
              <SelectContent>
                {boards.filter(board => !board.archived).map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="block-select">Bloco</Label>
            <Select 
              value={selectedBlockId} 
              onValueChange={(value) => {
                setSelectedBlockId(value);
                setSelectedPosition('1');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um bloco" />
              </SelectTrigger>
              <SelectContent>
                {selectedBoard?.blocks.filter(block => !block.archived).map((block) => (
                  <SelectItem key={block.id} value={block.id}>
                    {block.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position-select">Posição</Label>
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getAvailablePositions().map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleMove}
            disabled={!selectedBlockId || selectedBlockId === currentBlockId}
          >
            Mover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
