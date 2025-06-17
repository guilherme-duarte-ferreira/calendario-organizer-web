import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { cn } from '@/lib/utils';
import { AlignLeft, AlignCenter, AlignRight, Type, MoreVertical, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResizableImageNodeProps extends NodeViewProps {
  node: {
    attrs: {
      src: string;
      alt?: string;
      title?: string;
      width?: number;
      height?: number;
      align?: 'left' | 'center' | 'right';
      caption?: string;
    };
  } & NodeViewProps['node'];
}

/**
 * Componente React customizado para renderizar um nó de imagem no Tiptap.
 * Ele envolve a imagem em um contêiner e adiciona alças para redimensionamento.
 */
export const ResizableImageNode: React.FC<ResizableImageNodeProps> = ({
  node,
  updateAttributes,
  selected,
  deleteNode,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [captionValue, setCaptionValue] = useState(node.attrs.caption || '');
  const [isEditingAlt, setIsEditingAlt] = useState(false);
  const [altValue, setAltValue] = useState(node.attrs.alt || '');

  // Calcula a proporção da imagem quando ela carrega
  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      img.onload = () => {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      };
    }
  }, [node.attrs.src]);

  // Handlers para o redimensionamento
  const handleResizeStart = useCallback((e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    setIsResizing(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setStartWidth(node.attrs.width || imageRef.current?.offsetWidth || 0);
    setStartHeight(node.attrs.height || imageRef.current?.offsetHeight || 0);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      switch (handle) {
        case 'e':
          newWidth = startWidth + deltaX;
          newHeight = newWidth / aspectRatio;
          break;
        case 'w':
          newWidth = startWidth - deltaX;
          newHeight = newWidth / aspectRatio;
          break;
        case 'n':
          newHeight = startHeight - deltaY;
          newWidth = newHeight * aspectRatio;
          break;
        case 's':
          newHeight = startHeight + deltaY;
          newWidth = newHeight * aspectRatio;
          break;
        case 'ne':
          newWidth = startWidth + deltaX;
          newHeight = startHeight - deltaY;
          break;
        case 'nw':
          newWidth = startWidth - deltaX;
          newHeight = startHeight - deltaY;
          break;
        case 'se':
          newWidth = startWidth + deltaX;
          newHeight = startHeight + deltaY;
          break;
        case 'sw':
          newWidth = startWidth - deltaX;
          newHeight = startHeight + deltaY;
          break;
      }

      // Limites mínimos e máximos
      newWidth = Math.max(100, Math.min(newWidth, 800));
      newHeight = Math.max(100, Math.min(newHeight, 800));

      updateAttributes({
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isResizing, startX, startY, startWidth, startHeight, aspectRatio, updateAttributes, node.attrs.width, node.attrs.height]);

  // Handler para o alinhamento
  const handleAlign = useCallback((align: 'left' | 'center' | 'right') => {
    updateAttributes({ align });
  }, [updateAttributes]);

  // Handler para a legenda
  const handleCaptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCaptionValue(e.target.value);
  }, []);

  const handleCaptionSubmit = useCallback(() => {
    updateAttributes({ caption: captionValue });
    setIsEditingCaption(false);
  }, [captionValue, updateAttributes]);

  const handleCaptionKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCaptionSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingCaption(false);
      setCaptionValue(node.attrs.caption || '');
    }
  }, [handleCaptionSubmit, node.attrs.caption]);

  // Handler para o texto alternativo
  const handleAltChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAltValue(e.target.value);
  }, []);

  const handleAltSubmit = useCallback(() => {
    updateAttributes({ alt: altValue });
    setIsEditingAlt(false);
  }, [altValue, updateAttributes]);

  const handleAltKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAltSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingAlt(false);
      setAltValue(node.attrs.alt || '');
    }
  }, [handleAltSubmit, node.attrs.alt]);

  // Handler para remover a imagem
  const handleRemove = useCallback(() => {
    if (deleteNode) {
      deleteNode();
    }
  }, [deleteNode]);

  return (
    <NodeViewWrapper>
      <div className={cn(
        "relative inline-block group",
        selected && "ring-2 ring-primary ring-offset-2",
        node.attrs.align === 'center' && "mx-auto block",
        node.attrs.align === 'right' && "ml-auto block"
      )}>
        <img
          ref={imageRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          title={node.attrs.title || ''}
          width={node.attrs.width}
          height={node.attrs.height}
          className="max-w-full h-auto"
        />
        
        {/* Legenda */}
        {node.attrs.caption && !isEditingCaption && (
          <div className="mt-2 text-sm text-muted-foreground text-center">
            {node.attrs.caption}
          </div>
        )}
        
        {/* Handles de redimensionamento */}
        {selected && (
          <>
            {/* Handles horizontais */}
            <div
              className="absolute top-1/2 -left-1 w-2 h-2 bg-primary rounded-full cursor-ew-resize transform -translate-y-1/2"
              onMouseDown={(e) => handleResizeStart(e, 'w')}
            />
            <div
              className="absolute top-1/2 -right-1 w-2 h-2 bg-primary rounded-full cursor-ew-resize transform -translate-y-1/2"
              onMouseDown={(e) => handleResizeStart(e, 'e')}
            />
            
            {/* Handles verticais */}
            <div
              className="absolute left-1/2 -top-1 w-2 h-2 bg-primary rounded-full cursor-ns-resize transform -translate-x-1/2"
              onMouseDown={(e) => handleResizeStart(e, 'n')}
            />
            <div
              className="absolute left-1/2 -bottom-1 w-2 h-2 bg-primary rounded-full cursor-ns-resize transform -translate-x-1/2"
              onMouseDown={(e) => handleResizeStart(e, 's')}
            />
            
            {/* Handles diagonais */}
            <div
              className="absolute -top-1 -left-1 w-2 h-2 bg-primary rounded-full cursor-nw-resize"
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
            />
            <div
              className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full cursor-ne-resize"
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
            />
            <div
              className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary rounded-full cursor-sw-resize"
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
            <div
              className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full cursor-se-resize"
              onMouseDown={(e) => handleResizeStart(e, 'se')}
            />

            {/* Barra de ferramentas de alinhamento */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-1 bg-background border border-input rounded-md p-1 shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  node.attrs.align === 'left' && "bg-accent"
                )}
                onClick={() => handleAlign('left')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  node.attrs.align === 'center' && "bg-accent"
                )}
                onClick={() => handleAlign('center')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  node.attrs.align === 'right' && "bg-accent"
                )}
                onClick={() => handleAlign('right')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  node.attrs.caption && "bg-accent"
                )}
                onClick={() => setIsEditingCaption(true)}
              >
                <Type className="h-4 w-4" />
              </Button>

              {/* Menu de opções */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditingAlt(true)}>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Editar texto alternativo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRemove} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover imagem
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Editor de legenda */}
            {isEditingCaption && (
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-64 bg-background border border-input rounded-md p-2 shadow-sm">
                <Input
                  value={captionValue}
                  onChange={handleCaptionChange}
                  onKeyDown={handleCaptionKeyDown}
                  onBlur={handleCaptionSubmit}
                  placeholder="Adicionar legenda..."
                  className="h-8"
                  autoFocus
                />
              </div>
            )}

            {/* Editor de texto alternativo */}
            {isEditingAlt && (
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-64 bg-background border border-input rounded-md p-2 shadow-sm">
                <Input
                  value={altValue}
                  onChange={handleAltChange}
                  onKeyDown={handleAltKeyDown}
                  onBlur={handleAltSubmit}
                  placeholder="Adicionar texto alternativo..."
                  className="h-8"
                  autoFocus
                />
              </div>
            )}
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};

ResizableImageNode.displayName = 'ResizableImageNode'; 