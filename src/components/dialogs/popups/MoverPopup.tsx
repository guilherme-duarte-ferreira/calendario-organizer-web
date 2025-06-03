import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useCalendario } from "@/contexts/CalendarioContext";
import { PopoverClose } from "@/components/ui/popover";

interface MoverPopupProps {
  onClosePopup?: () => void;
  onMove: (boardId: string, blockId: string, position: number) => void;
  currentBoardId?: string;
  currentBlockId?: string;
}

export default function MoverPopup({
  onClosePopup,
  onMove,
  currentBoardId,
  currentBlockId,
}: MoverPopupProps) {
  const { boards } = useCalendario();
  
  const initialBoardId = currentBoardId || boards.find(b => !b.archived)?.id || "";
  const [selectedBoard, setSelectedBoard] = useState<string>(initialBoardId);

  const getInitialBlockId = (boardId: string, cBlockId?: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return "";
    if (cBlockId && board.blocks.some(b => b.id === cBlockId && !b.archived)) {
      return cBlockId;
    }
    return board.blocks.find(b => !b.archived)?.id || "";
  };

  const [selectedBlock, setSelectedBlock] = useState<string>(getInitialBlockId(initialBoardId, currentBlockId));
  const [selectedPosition, setSelectedPosition] = useState<string>("0");

  useEffect(() => {
    console.log('MoverPopup - selectedBoard changed:', selectedBoard);
    const boardData = boards.find(b => b.id === selectedBoard);
    let newInitialBlock = "";
    if (boardData) {
      const activeBlocks = boardData.blocks.filter(b => !b.archived);
      if (activeBlocks.length > 0) {
        newInitialBlock = (currentBlockId && activeBlocks.some(b => b.id === currentBlockId))
          ? currentBlockId
          : activeBlocks[0].id;
      }
    }
    console.log('MoverPopup - setting new block:', newInitialBlock);
    setSelectedBlock(newInitialBlock);
    setSelectedPosition("0");
  }, [selectedBoard, boards, currentBlockId]);

  useEffect(() => {
    console.log('MoverPopup - selectedBlock changed:', selectedBlock);
    setSelectedPosition("0");
  }, [selectedBlock]);

  const selectedBoardData = boards.find(board => board.id === selectedBoard);
  const activeBlocksInSelectedBoard = selectedBoardData?.blocks.filter(b => !b.archived) || [];
  const selectedBlockData = activeBlocksInSelectedBoard.find(block => block.id === selectedBlock);
  const itemCountInSelectedBlock = selectedBlockData?.items.filter(item => !item.archived).length || 0;

  const handleInternalMove = () => {
    if (selectedBoard && selectedBlock) {
      console.log('MoverPopup - moving card to:', {
        board: selectedBoard,
        block: selectedBlock,
        position: parseInt(selectedPosition)
      });
      onMove(selectedBoard, selectedBlock, parseInt(selectedPosition));
      if (onClosePopup) onClosePopup();
    }
  };

  return (
    <>
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Mover cartão</h3>
          <PopoverClose asChild>
            <Button variant="ghost" size="sm" onClick={onClosePopup} className="h-6 w-6 p-0">
              <X size={14} />
            </Button>
          </PopoverClose>
        </div>
      </div>

      <div className="p-3 space-y-4">
        <div>
          <label htmlFor="mover-board-select" className="text-xs font-medium text-muted-foreground">Quadro</label>
          <Select 
            value={selectedBoard} 
            onValueChange={(value) => {
              console.log('MoverPopup - board selected:', value);
              setSelectedBoard(value);
            }}
          >
            <SelectTrigger id="mover-board-select" className="w-full mt-1">
              <SelectValue placeholder="Selecione um quadro" />
            </SelectTrigger>
            <SelectContent>
              {boards.filter(b => !b.archived).map((board) => (
                <SelectItem key={board.id} value={board.id}>
                  {board.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedBoardData && (
          <div>
            <label htmlFor="mover-block-select" className="text-xs font-medium text-muted-foreground">Lista</label>
            <Select 
              value={selectedBlock} 
              onValueChange={(value) => {
                console.log('MoverPopup - block selected:', value);
                setSelectedBlock(value);
              }}
              disabled={activeBlocksInSelectedBoard.length === 0}
            >
              <SelectTrigger id="mover-block-select" className="w-full mt-1">
                <SelectValue placeholder={activeBlocksInSelectedBoard.length === 0 ? "Nenhuma lista disponível" : "Selecione uma lista"} />
              </SelectTrigger>
              <SelectContent>
                {activeBlocksInSelectedBoard.map((block) => (
                  <SelectItem key={block.id} value={block.id}>
                    {block.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedBlockData && (
          <div>
            <label htmlFor="mover-position-select" className="text-xs font-medium text-muted-foreground">Posição</label>
            <Select 
              value={selectedPosition} 
              onValueChange={(value) => {
                console.log('MoverPopup - position selected:', value);
                setSelectedPosition(value);
              }}
            >
              <SelectTrigger id="mover-position-select" className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: itemCountInSelectedBlock + 1 }, (_, i) => (
                  <SelectItem key={i.toString()} value={i.toString()}>
                    {i + 1}
                    {i === 0 ? " (Primeira)" : ""}
                    {i === itemCountInSelectedBlock ? ` (${itemCountInSelectedBlock + 1} - Última)` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button 
          onClick={handleInternalMove} 
          disabled={
            !selectedBoard || 
            !selectedBlock || 
            (selectedBlock === currentBlockId && 
             selectedBoard === currentBoardId && 
             parseInt(selectedPosition) === 0)
          }
          className="w-full"
        >
          Mover
        </Button>
      </div>
    </>
  );
}
