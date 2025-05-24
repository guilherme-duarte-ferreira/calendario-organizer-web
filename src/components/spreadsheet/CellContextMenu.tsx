
import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { SpreadsheetColumn } from "@/types/calendario";

interface CellContextMenuProps {
  children: React.ReactNode;
  columnId: string;
  rowId: string;
  currentType: SpreadsheetColumn['type'];
  onChangeType: (type: SpreadsheetColumn['type']) => void;
  onInsertRowAbove: () => void;
  onInsertRowBelow: () => void;
  onDeleteRow: () => void;
  onInsertColumnLeft: () => void;
  onInsertColumnRight: () => void;
  onDeleteColumn: () => void;
}

export default function CellContextMenu({
  children,
  columnId,
  rowId,
  currentType,
  onChangeType,
  onInsertRowAbove,
  onInsertRowBelow,
  onDeleteRow,
  onInsertColumnLeft,
  onInsertColumnRight,
  onDeleteColumn,
}: CellContextMenuProps) {
  const cellTypes: Array<{ value: SpreadsheetColumn['type']; label: string }> = [
    { value: 'text', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'date', label: 'Data' },
    { value: 'time', label: 'Hora' },
    { value: 'currency', label: 'Moeda' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'weight', label: 'Peso' },
    { value: 'percentage', label: 'Porcentagem' },
  ];

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48 bg-white border shadow-md">
        <ContextMenuSub>
          <ContextMenuSubTrigger>Alterar Tipo da Coluna</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-40 bg-white border shadow-md">
            {cellTypes.map((type) => (
              <ContextMenuItem
                key={type.value}
                onClick={() => onChangeType(type.value)}
                className={currentType === type.value ? 'bg-blue-50 text-blue-600' : ''}
              >
                {type.label}
                {currentType === type.value && ' ✓'}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={onInsertRowAbove}>
          Inserir Linha Acima
        </ContextMenuItem>
        <ContextMenuItem onClick={onInsertRowBelow}>
          Inserir Linha Abaixo
        </ContextMenuItem>
        <ContextMenuItem onClick={onDeleteRow} className="text-red-600">
          Excluir Linha
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={onInsertColumnLeft}>
          Inserir Coluna à Esquerda
        </ContextMenuItem>
        <ContextMenuItem onClick={onInsertColumnRight}>
          Inserir Coluna à Direita
        </ContextMenuItem>
        <ContextMenuItem onClick={onDeleteColumn} className="text-red-600">
          Excluir Coluna
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
