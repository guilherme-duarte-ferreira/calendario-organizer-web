
import { useState, useRef, DragEvent } from "react";

interface DragDropOptions {
  onDragStart?: (e: DragEvent<HTMLElement>, id: string) => void;
  onDragOver?: (e: DragEvent<HTMLElement>) => void;
  onDrop?: (e: DragEvent<HTMLElement>, targetId: string) => void;
}

export function useDragDrop(options: DragDropOptions = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const draggedItemRef = useRef<string | null>(null);
  
  const handleDragStart = (e: DragEvent<HTMLElement>, id: string) => {
    draggedItemRef.current = id;
    setIsDragging(true);
    
    // Adicionar efeito visual
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add("opacity-50");
    }
    
    // Definir dados para transferência
    e.dataTransfer.setData("text/plain", id);
    
    if (options.onDragStart) {
      options.onDragStart(e, id);
    }
  };
  
  const handleDragEnd = (e: DragEvent<HTMLElement>) => {
    setIsDragging(false);
    draggedItemRef.current = null;
    
    // Remover efeito visual
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove("opacity-50");
    }
  };
  
  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDraggedOver(true);
    
    if (options.onDragOver) {
      options.onDragOver(e);
    }
  };
  
  const handleDragLeave = () => {
    setIsDraggedOver(false);
  };
  
  const handleDrop = (e: DragEvent<HTMLElement>, targetId: string) => {
    e.preventDefault();
    setIsDraggedOver(false);
    
    const draggedId = draggedItemRef.current || e.dataTransfer.getData("text/plain");
    
    if (options.onDrop) {
      options.onDrop(e, targetId);
    }
  };
  
  return {
    isDragging,
    isDraggedOver,
    draggedItemRef,
    handlers: {
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragLeave,
      handleDrop
    }
  };
}
