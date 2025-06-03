/**
 * @file EtiquetaPopupContent.tsx
 * @description Componente para gerenciar etiquetas dentro de um pop-up.
 * Permite pesquisar, selecionar/desselecionar etiquetas existentes e criar novas.
 * Este componente é projetado para ser usado dentro de um PopoverContent.
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Search } from "lucide-react";
import { Popover, PopoverClose } from "@/components/ui/popover";

/**
 * Representa uma etiqueta que pode ser associada ao cartão
 */
interface Etiqueta {
  id: string;      // Identificador único da etiqueta
  name: string;    // Nome da etiqueta
  color: string;   // Cor da etiqueta em formato hexadecimal
}

/**
 * Props necessárias para o componente EtiquetaPopupContent
 */
interface EtiquetaPopupContentProps {
  etiquetas: Etiqueta[];           // Lista de etiquetas disponíveis
  selectedEtiquetas: string[];     // IDs das etiquetas já selecionadas
  onToggleEtiqueta: (id: string) => void;  // Callback para selecionar/desselecionar etiqueta
  onCreateEtiqueta: (name: string, color: string) => void;  // Callback para criar nova etiqueta
}

// Lista de cores predefinidas para novas etiquetas
const cores = [
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

export default function EtiquetaPopupContent({
  etiquetas,
  selectedEtiquetas,
  onToggleEtiqueta,
  onCreateEtiqueta
}: EtiquetaPopupContentProps) {
  // Estado para o termo de pesquisa de etiquetas
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para o nome da nova etiqueta
  const [newEtiquetaName, setNewEtiquetaName] = useState("");
  // Estado para a cor selecionada para a nova etiqueta
  const [selectedColor, setSelectedColor] = useState(cores[0]);
  // Controla a visibilidade da UI de criação de etiqueta
  const [isCreating, setIsCreating] = useState(false);

  // Filtra as etiquetas com base no termo de pesquisa
  const filteredEtiquetas = etiquetas.filter(etiqueta =>
    etiqueta.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handler para criar uma nova etiqueta
   * Reseta os campos após a criação e volta para a visualização de lista
   */
  const handleCreateEtiqueta = () => {
    if (newEtiquetaName.trim()) {
      onCreateEtiqueta(newEtiquetaName.trim(), selectedColor);
      setNewEtiquetaName("");
      setIsCreating(false);
    }
  };

  return (
    <div className="w-72">
      {/* Cabeçalho do pop-up com título e botão de fechar */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">Etiquetas</h3>
          <PopoverClose asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <X size={14} />
            </Button>
          </PopoverClose>
        </div>
        
        {/* Campo de pesquisa de etiquetas */}
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

      {/* Área de conteúdo rolável para lista de etiquetas e criação */}
      <div className="max-h-60 overflow-y-auto p-3">
        <div className="space-y-1">
          {/* Lista de etiquetas filtradas */}
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

        {/* Seção para criar uma nova etiqueta */}
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