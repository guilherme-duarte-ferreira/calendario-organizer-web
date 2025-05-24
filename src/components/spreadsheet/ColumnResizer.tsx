
import React, { useState, useRef } from "react";

interface ColumnResizerProps {
  onResize: (newWidth: number) => void;
  initialWidth: number;
  minWidth?: number;
}

export default function ColumnResizer({ 
  onResize, 
  initialWidth, 
  minWidth = 50 
}: ColumnResizerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(initialWidth);
  const resizerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
    setStartWidth(initialWidth);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(minWidth, startWidth + deltaX);
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={resizerRef}
      className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 ${
        isDragging ? 'bg-blue-500' : 'bg-transparent'
      }`}
      onMouseDown={handleMouseDown}
      style={{ zIndex: 10 }}
    />
  );
}
