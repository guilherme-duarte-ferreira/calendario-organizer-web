
import React, { useState, useRef, useEffect } from "react";

interface CellPosition {
  row: number;
  col: number;
}

interface CellRange {
  start: CellPosition;
  end: CellPosition;
}

interface CellSelectorProps {
  onSelectionChange: (selection: CellRange | null) => void;
  children: React.ReactNode;
}

export default function CellSelector({ onSelectionChange, children }: CellSelectorProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState<CellRange | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const cellElement = (e.target as Element).closest('[data-cell-position]');
    if (!cellElement) return;

    const position = cellElement.getAttribute('data-cell-position');
    if (!position) return;

    const [row, col] = position.split(',').map(Number);
    const startPosition = { row, col };

    setIsSelecting(true);
    setSelection({
      start: startPosition,
      end: startPosition,
    });

    const handleMouseMove = (e: MouseEvent) => {
      const cellElement = (e.target as Element).closest('[data-cell-position]');
      if (!cellElement) return;

      const position = cellElement.getAttribute('data-cell-position');
      if (!position) return;

      const [row, col] = position.split(',').map(Number);
      
      setSelection(prev => prev ? {
        ...prev,
        end: { row, col }
      } : null);
    };

    const handleMouseUp = () => {
      setIsSelecting(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    onSelectionChange(selection);
  }, [selection, onSelectionChange]);

  const isInSelection = (row: number, col: number): boolean => {
    if (!selection) return false;

    const minRow = Math.min(selection.start.row, selection.end.row);
    const maxRow = Math.max(selection.start.row, selection.end.row);
    const minCol = Math.min(selection.start.col, selection.end.col);
    const maxCol = Math.max(selection.start.col, selection.end.col);

    return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className="select-none"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isInSelection,
            selection,
          } as any);
        }
        return child;
      })}
    </div>
  );
}
