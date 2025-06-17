import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ResizableImageNode } from './ResizableImageNode';

/**
 * Extensão customizada que estende a funcionalidade de imagem padrão do Tiptap
 * para usar um componente React customizado (NodeView) para renderização.
 */
export const CustomImage = Image.extend({
  // Adiciona a lógica para renderizar o nó usando nosso componente React.
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNode);
  },
  // Garante que a imagem se comporte como um bloco e não permita conteúdo dentro dela.
  // Isso melhora a experiência de seleção e edição.
  addOptions() {
    return {
      ...this.parent?.(),
      inline: false,
      allowBase64: true,
    };
  },
}); 