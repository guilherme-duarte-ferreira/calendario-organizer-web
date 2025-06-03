/**
 * @file MoverPopup.tsx
 * @description Pop-up para selecionar um novo destino (Quadro, Bloco, Posição) para um cartão/item.
 * Contém selects interdependentes e aciona a lógica de movimentação.
 * Projetado para ser usado como conteúdo de um Popover, tanto pela barra lateral quanto pelo cabeçalho do modal.
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { PopoverClose } from "@/components/ui/popover";
import { useCalendario } from "@/contexts/CalendarioContext";

/**
 * Props necessárias para o componente MoverPopup
 */
interface MoverPopupProps {
  onClosePopup: () => void;  // Função para fechar o Popover
  onMove: (boardId: string, blockId: string, position: number) => void;  // Callback para executar a movimentação
  currentBoardId?: string;   // ID do quadro atual do item (para seleção inicial)
  currentBlockId?: string;   // ID do bloco atual do item (para seleção inicial)
}

export default function MoverPopup({
  onClosePopup,
  onMove,
  currentBoardId,
  currentBlockId
}: MoverPopupProps) {
  const { boards } = useCalendario();

  // --- ESTADOS INTERNOS ---
  // Estado para o quadro selecionado
  const initialBoardId = currentBoardId || boards.find(b => !b.archived)?.id || "";
  const [selectedBoard, setSelectedBoard] = useState<string>(initialBoardId);
  
  /**
   * Função para determinar o bloco inicial com base no quadro e no bloco atual
   * Se o bloco atual estiver no quadro selecionado, usa ele
   * Caso contrário, usa o primeiro bloco do quadro
   */
  const getInitialBlockId = (boardId: string, cBlockId?: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return "";
    
    // Se o bloco atual está neste quadro, usa ele
    if (cBlockId && board.blocks.some(b => b.id === cBlockId)) {
      return cBlockId;
    }
    
    // Caso contrário, usa o primeiro bloco não arquivado
    return board.blocks.find(b => !b.archived)?.id || "";
  };

  // Estado para o bloco selecionado
  const [selectedBlock, setSelectedBlock] = useState<string>(getInitialBlockId(initialBoardId, currentBlockId));
  
  // Estado para a posição selecionada (0-indexed)
  const [selectedPosition, setSelectedPosition] = useState<string>("0");

  // --- EFEITOS (useEffect) ---
  /**
   * Atualiza a seleção de bloco e reseta a posição quando o quadro muda
   */
  useEffect(() => {
    const newBlockId = getInitialBlockId(selectedBoard, currentBlockId);
    setSelectedBlock(newBlockId);
    setSelectedPosition("0");
  }, [selectedBoard, boards, currentBlockId]);

  /**
   * Reseta a posição quando o bloco muda
   */
  useEffect(() => {
    setSelectedPosition("0");
  }, [selectedBlock]);

  // --- DADOS DERIVADOS PARA OS SELECTS ---
  // Dados do quadro selecionado
  const selectedBoardData = boards.find(board => board.id === selectedBoard);
  
  // Lista de blocos ativos no quadro selecionado
  const activeBlocksInSelectedBoard = selectedBoardData?.blocks.filter(b => !b.archived) || [];
  
  // Dados do bloco selecionado
  const selectedBlockData = activeBlocksInSelectedBoard.find(b => b.id === selectedBlock);
  
  // Quantidade de itens no bloco selecionado
  const itemCountInSelectedBlock = selectedBlockData?.items.length || 0;

  /**
   * Handler para o botão "Mover"
   * Chama a prop onMove e depois onClosePopup
   */
  const handleInternalMove = () => {
    if (selectedBoard && selectedBlock) {
      onMove(selectedBoard, selectedBlock, parseInt(selectedPosition));
      if (onClosePopup) onClosePopup();
    }
  };

  return (
    <>
      {/* Cabeçalho do Pop-up */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Mover Cartão</h3>
          <PopoverClose asChild>
            <Button variant="ghost" size="sm" onClick={onClosePopup} className="h-6 w-6 p-0">
              <X size={14} />
            </Button>
          </PopoverClose>
        </div>
      </div>

      <div className="p-3 space-y-4">
        {/* Seletor de Quadro */}
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-2">
            Quadro
          </label>
          <Select value={selectedBoard} onValueChange={setSelectedBoard}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um quadro" />
            </SelectTrigger>
            <SelectContent>
              {boards
                .filter(board => !board.archived)
                .map(board => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Seletor de Bloco/Lista */}
        {selectedBoardData && (
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Bloco
            </label>
            <Select value={selectedBlock} onValueChange={setSelectedBlock}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um bloco" />
              </SelectTrigger>
              <SelectContent>
                {activeBlocksInSelectedBoard.map(block => (
                  <SelectItem key={block.id} value={block.id}>
                    {block.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Seletor de Posição */}
        {selectedBlockData && (
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Posição
            </label>
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma posição" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: itemCountInSelectedBlock + 1 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i === 0 ? "No topo" : `Após o ${i}° item`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Botão de Ação "Mover" */}
        <Button
          onClick={handleInternalMove}
          disabled={!selectedBoard || !selectedBlock}
          className="w-full"
        >
          Mover
        </Button>
      </div>
    </>
  );
}
