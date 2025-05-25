
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Search } from "lucide-react";

interface Etiqueta {
  id: string;
  name: string;
  color: string;
}

interface EtiquetaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  etiquetas: Etiqueta[];
  selectedEtiquetas: string[];
  onToggleEtiqueta: (etiquetaId: string) => void;
  onCreateEtiqueta: (name: string, color: string) => void;
}

const cores = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", 
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"
];

export default function EtiquetaPopup({
  isOpen,
  onClose,
  etiquetas,
  selectedEtiquetas,
  onToggleEtiqueta,
  onCreateEtiqueta
}: EtiquetaPopupProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [newEtiquetaName, setNewEtiquetaName] = useState("");
  const [selectedColor, setSelectedColor] = useState(cores[0]);
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const filteredEtiquetas = etiquetas.filter(etiqueta =>
    etiqueta.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEtiqueta = () => {
    if (newEtiquetaName.trim()) {
      onCreateEtiqueta(newEtiquetaName.trim(), selectedColor);
      setNewEtiquetaName("");
      setIsCreating(false);
    }
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">Etiquetas</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X size={14} />
          </Button>
        </div>
        
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar etiquetas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs h-8"
          />
        </div>
      </div>

      <div className="max-h-60 overflow-y-auto p-3">
        <div className="space-y-1">
          {filteredEtiquetas.map((etiqueta) => (
            <div
              key={etiqueta.id}
              className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
              onClick={() => onToggleEtiqueta(etiqueta.id)}
            >
              <div 
                className="w-8 h-4 rounded"
                style={{ backgroundColor: etiqueta.color }}
              />
              <span className="text-sm flex-1">{etiqueta.name}</span>
              {selectedEtiquetas.includes(etiqueta.id) && (
                <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-sm" />
                </div>
              )}
            </div>
          ))}
        </div>

        {isCreating ? (
          <div className="mt-3 pt-3 border-t space-y-2">
            <Input
              placeholder="Nome da etiqueta"
              value={newEtiquetaName}
              onChange={(e) => setNewEtiquetaName(e.target.value)}
              className="text-xs h-8"
            />
            <div className="flex items-center gap-1 mb-2">
              {cores.map((cor) => (
                <button
                  key={cor}
                  className={`w-6 h-6 rounded ${selectedColor === cor ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                  style={{ backgroundColor: cor }}
                  onClick={() => setSelectedColor(cor)}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateEtiqueta} className="text-xs h-7">
                Criar
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsCreating(false)} className="text-xs h-7">
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="w-full mt-3 text-xs h-8"
          >
            <Plus size={14} className="mr-2" />
            Criar nova etiqueta
          </Button>
        )}
      </div>
    </div>
  );
}
