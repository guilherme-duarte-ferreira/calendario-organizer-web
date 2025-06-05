/**
 * @file CoresCapa.tsx
 * @description Sub-pop-up para selecionar uma cor predefinida ou personalizada para a capa.
 * É renderizado e posicionado dentro do CapaPopup.tsx.
 * Seu fechamento é local (não fecha o CapaPopup principal).
 * Dispara uma notificação única ao ser fechado, apenas se uma nova cor foi selecionada.
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

/**
 * Props necessárias para o componente CoresCapa
 */
interface CoresCapaProps {
  isOpen: boolean;  // Controla a visibilidade do sub-pop-up
  onClose: () => void;  // Função para fechar este sub-pop-up
  onSelectColor: (color: string) => void;  // Callback para enviar a cor selecionada para o CapaPopup
}

// Lista de cores predefinidas para a capa
const CORES_PREDEFINIDAS = [
  "#ef4444", // vermelho
  "#f97316", // laranja
  "#f59e0b", // amarelo
  "#84cc16", // verde claro
  "#16a34a", // verde
  "#0ea5e9", // azul claro
  "#3b82f6", // azul
  "#8b5cf6", // roxo
  "#d946ef", // rosa
  "#ec4899", // magenta
];

export default function CoresCapa({
  isOpen,
  onClose,
  onSelectColor
}: CoresCapaProps) {
  // Estado para rastrear se o usuário fez alguma alteração de cor
  const [hasChanged, setHasChanged] = useState(false);

  // Efeito que executa uma função de limpeza quando o componente é desmontado (fechado).
  // É aqui que a notificação será disparada.
  useEffect(() => {
    return () => {
      if (hasChanged) {
        toast.success("Cor da capa personalizada definida!");
      }
    };
  }, [hasChanged]); // A função de limpeza será recriada se o estado 'hasChanged' mudar.

  // Não renderiza nada se não estiver aberto
  if (!isOpen) return null;

  // Handler para o seletor de cor (<input type="color">)
  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasChanged(true); // Marca que uma alteração ocorreu
    onSelectColor(e.target.value); // Atualiza a cor para o preview em tempo real
  };

  // Handler para os botões de cores predefinidas
  const handleSwatchClick = (cor: string) => {
    setHasChanged(true); // Marca que uma alteração ocorreu
    onSelectColor(cor); // Atualiza a cor para o preview
  };

  // Handler para o botão de remover cor
  const handleRemoveClick = () => {
    setHasChanged(true);
    onSelectColor("");
  };

  return (
    // Este div usa posicionamento absoluto para se posicionar em relação ao seu contêiner no CapaPopup
    <div className="absolute top-full left-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-[9999]">
      {/* Cabeçalho do Sub-pop-up */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Cores da Capa</h3>
          {/* Botão 'X' local para fechar apenas este sub-pop-up */}
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X size={14} />
          </Button>
        </div>
      </div>

      <div className="p-3">
        {/* Grid de Cores Predefinidas */}
        <div className="grid grid-cols-6 gap-2">
          {CORES_PREDEFINIDAS.map((cor) => (
            <button
              key={cor}
              className="w-8 h-8 rounded hover:ring-2 hover:ring-offset-2 hover:ring-primary transition-all"
              style={{ backgroundColor: cor }}
              onClick={() => handleSwatchClick(cor)}
            />
          ))}
        </div>

        {/* Seletor de Cor Personalizada */}
        <div className="mt-4">
          <label className="text-xs font-medium text-muted-foreground block mb-2">
            Cor Personalizada
          </label>
          <input
            type="color"
            className="w-full h-8 rounded cursor-pointer"
            onChange={handleColorInputChange}
          />
        </div>

        {/* Botão Remover Cor */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRemoveClick}
          className="w-full mt-4 text-xs h-8"
        >
          Remover cor
        </Button>
      </div>
    </div>
  );
}
