import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useCalendario } from "@/contexts/CalendarioContext";

interface MoverPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (boardId: string, blockId: string, position: number) => void;
  currentBoardId?: string;
  currentBlockId?: string;
}

export default function MoverPopup({
  isOpen,
  onClose,
  onMove,
  currentBoardId,
  currentBlockId
}: MoverPopupProps) {
  const { boards } = useCalendario();
  const [selectedBoard, setSelectedBoard] = useState(currentBoardId || "");
  const [selectedBlock, setSelectedBlock] = useState(currentBlockId || "");
  const [selectedPosition, setSelectedPosition] = useState("0");

  if (!isOpen) return null;

  const selectedBoardData = boards.find(board => board.id === selectedBoard);
  const selectedBlockData = selectedBoardData?.blocks.find(block => block.id === selectedBlock);
  const itemCount = selectedBlockData?.items.length || 0;

  const handleMove = () => {
    if (selectedBoard && selectedBlock) {
      onMove(selectedBoard, selectedBlock, parseInt(selectedPosition));
      onClose();
    }
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-[9999]" data-popup="mover">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Mover cartão</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X size={14} />
          </Button>
        </div>
      </div>

      <div className="p-3 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Quadro</label>
          <Select value={selectedBoard} onValueChange={setSelectedBoard}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Selecione um quadro" />
            </SelectTrigger>
            <SelectContent>
              {boards.map((board) => (
                <SelectItem key={board.id} value={board.id}>
                  {board.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedBoard && (
          <div>
            <label className="text-xs font-medium text-muted-foreground">Lista</label>
            <Select value={selectedBlock} onValueChange={setSelectedBlock}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Selecione uma lista" />
              </SelectTrigger>
              <SelectContent>
                {selectedBoardData?.blocks.map((block) => (
                  <SelectItem key={block.id} value={block.id}>
                    {block.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedBlock && (
          <div>
            <label className="text-xs font-medium text-muted-foreground">Posição</label>
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: itemCount + 1 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i === 0 ? "1 (topo)" : i === itemCount ? `${i + 1} (final)` : (i + 1).toString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button 
          onClick={handleMove} 
          disabled={!selectedBoard || !selectedBlock}
          className="w-full"
        >
          Mover
        </Button>
      </div>
    </div>
  );
}
