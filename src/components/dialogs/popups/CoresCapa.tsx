
import React from "react";
import { Button } from "@/components/ui/button";
import { X, Palette } from "lucide-react";

interface CoresCapaProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectColor: (color: string) => void;
}

const CORES_PREDEFINIDAS = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#22c55e", // green-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
  "#f59e0b", // amber-500
  "#6366f1", // indigo-500
  "#14b8a6", // teal-500
];

export default function CoresCapa({
  isOpen,
  onClose,
  onSelectColor,
}: CoresCapaProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-[9999]">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Cores da Capa</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X size={14} />
          </Button>
        </div>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-6 gap-2">
          {CORES_PREDEFINIDAS.map((cor, index) => (
            <button
              key={index}
              onClick={() => onSelectColor(cor)}
              className="w-12 h-8 rounded hover:opacity-80 transition-opacity border-2 border-gray-200 hover:border-gray-400"
              style={{ backgroundColor: cor }}
              title={`Cor ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-muted-foreground block mb-2">
            Cor personalizada
          </label>
          <input
            type="color"
            onChange={(e) => onSelectColor(e.target.value)}
            className="w-full h-8 rounded border cursor-pointer"
            title="Escolher cor personalizada"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectColor("")}
          className="w-full mt-3"
        >
          <Palette size={14} className="mr-2" />
          Remover cor
        </Button>
      </div>
    </div>
  );
}
