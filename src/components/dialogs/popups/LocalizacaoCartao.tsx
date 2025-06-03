/**
 * @file LocalizacaoCartao.tsx
 * @description Pop-up para exibir a localização atual de um cartão (Quadro, Bloco, Posição)
 * e oferecer a opção de movê-lo para outro local (que acionaria o MoverPopup).
 * Projetado para ser usado como conteúdo de um Popover.
 * NOTA: No fluxo atual de "Mover pelo Cabeçalho", este pop-up foi contornado para
 * abrir o MoverPopup diretamente, mas o componente ainda existe.
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";
import { useCalendario } from "@/contexts/CalendarioContext";
import { PopoverClose } from "@/components/ui/popover";

/**
 * Props necessárias para o componente LocalizacaoCartao
 */
interface LocalizacaoCartaoProps {
  onClosePopup: () => void;  // Função para fechar o Popover
  cardId: string;            // ID do cartão para encontrar sua localização
  onMover: () => void;       // Callback para iniciar o processo de mover (ex: abrir MoverPopup)
}

export default function LocalizacaoCartao({
  onClosePopup,
  cardId,
  onMover
}: LocalizacaoCartaoProps) {
  const { boards } = useCalendario();

  // Lógica para encontrar a localização atual do cartão
  let currentBoard = null;
  let currentBlock = null;
  let cardPosition = -1;

  // Procura o cartão em todos os quadros e blocos
  for (const board of boards) {
    for (const block of board.blocks) {
      const position = block.items.findIndex(item => item.id === cardId);
      if (position !== -1) {
        currentBoard = board;
        currentBlock = block;
        cardPosition = position;
        break;
      }
    }
    if (currentBoard) break;
  }

  return (
    <>
      {/* Cabeçalho do Pop-up */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Localização</h3>
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
            {/* Exibição da localização atual */}
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Quadro
              </div>
              <div className="text-sm">
                {currentBoard.name}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Bloco
              </div>
              <div className="text-sm">
                {currentBlock.name}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Posição
              </div>
              <div className="text-sm">
                {cardPosition + 1} de {currentBlock.items.length}
              </div>
            </div>

            {/* Botão para iniciar a ação de mover */}
            <Button
              onClick={onMover}
              className="w-full"
            >
              <ArrowRight size={14} className="mr-2" />
              Mover para outro local
            </Button>
          </>
        ) : (
          // Mensagem quando a localização não é encontrada
          <div className="text-center py-4 text-muted-foreground text-sm">
            Localização não encontrada.
            <br />
            O cartão pode ter sido movido ou excluído.
          </div>
        )}
      </div>
    </>
  );
}
