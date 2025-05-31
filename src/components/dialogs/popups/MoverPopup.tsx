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
  currentBlockId
}: MoverPopupProps) {
  const { boards } = useCalendario();
  
  // Inicializa selectedBoard com currentBoardId ou o primeiro quadro ativo
  const initialBoardId = currentBoardId || boards.find(b => !b.archived)?.id || "";
  const [selectedBoard, setSelectedBoard] = useState(initialBoardId);

  // Encontra o primeiro bloco ativo no quadro inicial ou currentBlockId se estiver no quadro inicial
  const getInitialBlockId = () => {
    const board = boards.find(b => b.id === initialBoardId);
    if (!board) return "";
    if (currentBlockId && board.blocks.some(b => b.id === currentBlockId && !b.archived)) {
      return currentBlockId;
    }
    return board.blocks.find(b => !b.archived)?.id || "";
  };
  const [selectedBlock, setSelectedBlock] = useState(getInitialBlockId());
  
  const [selectedPosition, setSelectedPosition] = useState("0");

  const selectedBoardData = boards.find(board => board.id === selectedBoard);
  const activeBlocksInSelectedBoard = selectedBoardData?.blocks.filter(b => !b.archived) || [];
  const selectedBlockData = activeBlocksInSelectedBoard.find(block => block.id === selectedBlock);
  const itemCountInSelectedBlock = selectedBlockData?.items.filter(item => !item.archived).length || 0;

  const handleInternalMove = () => {
    if (selectedBoard && selectedBlock) {
      onMove(selectedBoard, selectedBlock, parseInt(selectedPosition));
      if (onClosePopup) onClosePopup();
    }
  };

  // Ajustar selectedBlock e selectedPosition quando selectedBoard mudar
  useEffect(() => {
    const board = boards.find(b => b.id === selectedBoard);
    if (board) {
      const activeBlocks = board.blocks.filter(b => !b.archived);
      if (activeBlocks.length > 0) {
        const newInitialBlock = (currentBlockId && activeBlocks.some(b => b.id === currentBlockId))
                               ? currentBlockId
                               : activeBlocks[0].id;
        setSelectedBlock(newInitialBlock);
      } else {
        setSelectedBlock("");
      }
      setSelectedPosition("0");
    } else {
      setSelectedBlock("");
      setSelectedPosition("0");
    }
  }, [selectedBoard, boards, currentBlockId]);

  // Resetar posição quando o bloco selecionado mudar
  useEffect(() => {
    setSelectedPosition("0");
  }, [selectedBlock]);

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
          <Select value={selectedBoard} onValueChange={setSelectedBoard}>
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
            <Select value={selectedBlock} onValueChange={setSelectedBlock} disabled={activeBlocksInSelectedBoard.length === 0}>
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
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger id="mover-position-select" className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: itemCountInSelectedBlock + 1 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
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
          disabled={!selectedBoard || !selectedBlock || (selectedBlock === currentBlockId && selectedBoard === currentBoardId)}
          className="w-full"
        >
          Mover
        </Button>
      </div>
    </>
  );
}
