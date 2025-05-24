
import { useState } from "react";
import { useCalendario } from "@/contexts/CalendarioContext";
import { Card, Spreadsheet } from "@/types/calendario";
import { toast } from "sonner";

export function useDragBetweenBlocks() {
  const { boards, currentBoardId, updateItem } = useCalendario();
  const [draggedItem, setDraggedItem] = useState<{
    item: Card | Spreadsheet;
    sourceBlockId: string;
    type: 'card' | 'spreadsheet';
  } | null>(null);

  const currentBoard = boards.find(board => board.id === currentBoardId);

  const moveItemBetweenBlocks = (
    itemId: string,
    sourceBlockId: string,
    targetBlockId: string,
    itemType: 'card' | 'spreadsheet'
  ) => {
    if (!currentBoard || sourceBlockId === targetBlockId) return;

    const sourceBlock = currentBoard.blocks.find(b => b.id === sourceBlockId);
    const targetBlock = currentBoard.blocks.find(b => b.id === targetBlockId);

    if (!sourceBlock || !targetBlock) return;

    // Find the item in source block
    let item: Card | Spreadsheet | undefined;
    let sourceItems: (Card | Spreadsheet)[];
    let targetItems: (Card | Spreadsheet)[];

    if (itemType === 'card') {
      sourceItems = sourceBlock.cards || [];
      targetItems = targetBlock.cards || [];
      item = sourceItems.find(c => c.id === itemId);
    } else {
      sourceItems = sourceBlock.spreadsheets || [];
      targetItems = targetBlock.spreadsheets || [];
      item = sourceItems.find(s => s.id === itemId);
    }

    if (!item) return;

    // Update item's blockId
    const updatedItem = {
      ...item,
      blockId: targetBlockId,
      updatedAt: new Date().toISOString(),
    };

    updateItem(updatedItem);
    toast.success(`${itemType === 'card' ? 'Cartão' : 'Planilha'} movido para ${targetBlock.name}`);
  };

  return {
    draggedItem,
    setDraggedItem,
    moveItemBetweenBlocks,
  };
}
