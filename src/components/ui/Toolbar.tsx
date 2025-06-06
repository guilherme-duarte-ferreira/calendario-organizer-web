import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, List, ListOrdered, Strikethrough } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

// A barra de ferramentas precisa da instância do editor para aplicar os comandos.
interface ToolbarProps {
  editor: Editor | null;
}

/**
 * A barra de ferramentas para o editor TipTap.
 * Contém botões para aplicar formatações básicas de texto.
 * O estado de cada botão (pressionado/não pressionado) é sincronizado
 * com o estado atual da seleção no editor.
 */
const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 rounded-t-md border-b border-input bg-transparent p-1">
      {/* Botão de Negrito */}
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      {/* Botão de Itálico */}
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      {/* Botão de Riscado */}
      <Toggle
        size="sm"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Toggle strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export default Toolbar; 