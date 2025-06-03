import React from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";
import { useCalendario } from "@/contexts/CalendarioContext";
import { PopoverClose } from "@/components/ui/popover";

interface LocalizacaoCartaoProps {
  onClosePopup?: () => void;
  cardId: string;
  onMover: () => void;
}

export default function LocalizacaoCartao({
  onClosePopup,
  cardId,
  onMover,
}: LocalizacaoCartaoProps) {
  const { boards } = useCalendario();

  // Encontrar a localização atual do cartão
  let currentBoard = null;
  let currentBlock = null;
  let cardPosition = 0;

  for (const board of boards) {
    for (const block of board.blocks) {
      const cardIndex = block.items.findIndex(item => item.id === cardId);
      if (cardIndex !== -1) {
        currentBoard = board;
        currentBlock = block;
        cardPosition = cardIndex + 1; // +1 para posição humana-legível
        break;
      }
    }
    if (currentBoard) break;
  }

  return (
    <>
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Localização do Cartão</h3>
          <PopoverClose asChild>
            <Button variant="ghost" size="sm" onClick={onClosePopup} className="h-6 w-6 p-0">
              <X size={14} />
            </Button>
          </PopoverClose>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {currentBoard && currentBlock ? (
          <>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Quadro atual</label>
              <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                {currentBoard.name}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Bloco atual</label>
              <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                {currentBlock.name}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Posição</label>
              <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                {cardPosition}° cartão na lista
              </div>
            </div>

            <Button
              onClick={onMover}
              className="w-full"
            >
              <ArrowRight size={14} className="mr-2" />
              Mover para outro local
            </Button>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            Localização não encontrada
          </div>
        )}
      </div>
    </>
  );
}
