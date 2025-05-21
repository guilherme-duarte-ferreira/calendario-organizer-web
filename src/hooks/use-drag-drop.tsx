
import { useState, useRef, DragEvent } from "react";

interface DragDropOptions {
  onDragStart?: (e: DragEvent<HTMLElement>, id: string) => void;
  onDragOver?: (e: DragEvent<HTMLElement>) => void;
  onDragEnter?: (e: DragEvent<HTMLElement>, targetId: string) => void;
  onDragLeave?: (e: DragEvent<HTMLElement>) => void;
  onDrop?: (e: DragEvent<HTMLElement>, targetId: string, sourceId: string) => void;
  canDrop?: (sourceId: string, targetId: string) => boolean;
}

export function useDragDrop(options: DragDropOptions = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const draggedItemRef = useRef<string | null>(null);
  
  const handleDragStart = (e: DragEvent<HTMLElement>, id: string) => {
    console.log("Drag start", id);
    draggedItemRef.current = id;
    setIsDragging(true);
    
    // Aplicar efeito visual somente no elemento arrastado
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add("opacity-50");
    }
    
    // Definir dados para transferência
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Criar uma imagem "fantasma" para a prévia de arrastar
    try {
      // Criar um elemento clone para usar como fantasma
      const ghostElement = e.currentTarget.cloneNode(true) as HTMLElement;
      ghostElement.style.opacity = "0.6";
      ghostElement.style.position = "absolute";
      ghostElement.style.top = "-1000px"; // Fora da tela
      ghostElement.style.transform = "scale(0.8)"; // Um pouco menor
      
      document.body.appendChild(ghostElement);
      
      // Configurar o elemento fantasma para o arrasto
      e.dataTransfer.setDragImage(ghostElement, 20, 20);
      
      // Remover o elemento fantasma após o início do arrasto
      setTimeout(() => {
        document.body.removeChild(ghostElement);
      }, 0);
    } catch (err) {
      console.error("Erro ao criar imagem fantasma:", err);
    }
    
    if (options.onDragStart) {
      options.onDragStart(e, id);
    }
  };
  
  const handleDragEnd = (e: DragEvent<HTMLElement>) => {
    console.log("Drag end", draggedItemRef.current);
    setIsDragging(false);
    
    // Remover efeito visual
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove("opacity-50");
    }
    
    // Remover efeitos visuais de qualquer elemento que possa ter sido alvo
    const dropTargets = document.querySelectorAll('.calendario-block-drag-over');
    dropTargets.forEach(target => {
      target.classList.remove('calendario-block-drag-over');
    });
    
    draggedItemRef.current = null;
  };
  
  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault(); // Permite o drop
    e.dataTransfer.dropEffect = 'move';
    
    // Verificar se pode soltar neste alvo
    const sourceId = draggedItemRef.current;
    const targetId = e.currentTarget.id.replace('block-', '');
    
    if (sourceId && options.canDrop && !options.canDrop(sourceId, targetId)) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    
    if (!isDraggedOver) {
      setIsDraggedOver(true);
      
      // Aplicar estilo apenas para os blocos, não para a área de trabalho geral
      if (e.currentTarget.id !== "workspace" && !e.currentTarget.classList.contains('calendario-block-drag-over')) {
        e.currentTarget.classList.add('calendario-block-drag-over');
      }
    }
    
    if (options.onDragOver) {
      options.onDragOver(e);
    }
  };
  
  const handleDragEnter = (e: DragEvent<HTMLElement>, targetId: string) => {
    e.preventDefault();
    console.log("Drag enter", targetId, "from", draggedItemRef.current);
    
    const sourceId = draggedItemRef.current;
    
    // Verificar se pode soltar neste alvo
    if (sourceId && options.canDrop && !options.canDrop(sourceId, targetId)) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    
    // Aplicar estilo apenas para os blocos, não para a área de trabalho geral
    if (e.currentTarget.id !== "workspace") {
      e.currentTarget.classList.add('calendario-block-drag-over');
    }
    
    if (options.onDragEnter) {
      options.onDragEnter(e, targetId);
    }
  };
  
  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    setIsDraggedOver(false);
    
    // Remover estilo apenas para os blocos
    if (e.currentTarget.id !== "workspace") {
      e.currentTarget.classList.remove('calendario-block-drag-over');
    }
    
    if (options.onDragLeave) {
      options.onDragLeave(e);
    }
  };
  
  const handleDrop = (e: DragEvent<HTMLElement>, targetId: string) => {
    e.preventDefault();
    setIsDraggedOver(false);
    
    console.log("Drop on", targetId, "from", draggedItemRef.current || e.dataTransfer.getData("text/plain"));
    
    // Remover estilo apenas para os blocos
    if (e.currentTarget.id !== "workspace") {
      e.currentTarget.classList.remove('calendario-block-drag-over');
    }
    
    const sourceId = draggedItemRef.current || e.dataTransfer.getData("text/plain");
    
    if (sourceId && options.onDrop) {
      options.onDrop(e, targetId, sourceId);
    }
    
    // Limpar a referência após o drop completo
    draggedItemRef.current = null;
  };
  
  return {
    isDragging,
    isDraggedOver,
    draggedItemRef,
    handlers: {
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragEnter,
      handleDragLeave,
      handleDrop
    }
  };
}
