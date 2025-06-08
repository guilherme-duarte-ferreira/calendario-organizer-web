import React from 'react';
import { NodeViewWrapper, NodeViewProps, ReactNodeViewRenderer } from '@tiptap/react';
import { cn } from '@/lib/utils';

// Componente base sem forwardRef
const ResizableImageComponent = (props: NodeViewProps) => {
  const { node, updateAttributes, selected } = props;

  const handleResize = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startWidth = (node.attrs as any).width || (event.target as HTMLElement).closest('img')?.offsetWidth || 0;

    const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
      const newWidth = startWidth + (mouseMoveEvent.clientX - startX);
      updateAttributes({
        width: Math.max(50, newWidth),
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [updateAttributes, node.attrs]);

  return (
    <NodeViewWrapper
      className={cn(
        'resizable-image-wrapper inline-block m-2 relative',
        selected ? 'ProseMirror-selectednode' : ''
      )}
      draggable="true"
      data-drag-handle
    >
      <img
        src={(node.attrs as any).src}
        alt={(node.attrs as any).alt}
        title={(node.attrs as any).title}
        className="m-0"
        style={{
          width: (node.attrs as any).width ? `${(node.attrs as any).width}px` : 'auto',
          height: 'auto',
        }}
      />
      {selected && (
        <div
          className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-nwse-resize border-2 border-white shadow-md"
          onMouseDown={handleResize}
        />
      )}
    </NodeViewWrapper>
  );
};

ResizableImageComponent.displayName = 'ResizableImageComponent';

export const ResizableImageExtension = (ImageExtension: any) => ImageExtension.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.style.width || null,
        renderHTML: attributes => {
          if (!attributes.width) {
            return {};
          }
          return { style: `width: ${attributes.width}px` };
        },
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
}); 