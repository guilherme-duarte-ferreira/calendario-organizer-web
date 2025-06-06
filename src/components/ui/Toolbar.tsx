import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold, Italic, Strikethrough, Underline, List, ListOrdered,
  Quote, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const handleFontFamilyChange = (font: string) => {
    if (font === 'default') {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(font).run();
    }
  };

  const handleFontSizeChange = (size: string) => {
    if (size === 'default') {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(`${size}px`).run();
    }
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    editor.chain().focus().setColor(event.target.value).run();
  };

  return (
    <div className="flex items-center gap-1 flex-wrap rounded-t-md border-b border-input bg-transparent p-1">
      {/* Grupo: Fonte e Tamanho */}
      <Select onValueChange={handleFontFamilyChange} defaultValue="default">
        <SelectTrigger className="w-[120px] h-8 text-xs">
          <SelectValue placeholder="Fonte" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Padrão</SelectItem>
          <SelectItem value="Inter">Inter</SelectItem>
          <SelectItem value="Arial">Arial</SelectItem>
          <SelectItem value="Georgia">Georgia</SelectItem>
          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
          <SelectItem value="Verdana">Verdana</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={handleFontSizeChange} defaultValue="default">
        <SelectTrigger className="w-[80px] h-8 text-xs">
          <SelectValue placeholder="Tamanho" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Padrão</SelectItem>
          <SelectItem value="12">12px</SelectItem>
          <SelectItem value="14">14px</SelectItem>
          <SelectItem value="16">16px</SelectItem>
          <SelectItem value="18">18px</SelectItem>
          <SelectItem value="24">24px</SelectItem>
        </SelectContent>
      </Select>
      
      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Grupo: Estilos Básicos e Cor */}
      <Toggle size="sm" pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()} aria-label="Negrito">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()} aria-label="Itálico">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('underline')} onPressedChange={() => editor.chain().focus().toggleUnderline().run()} aria-label="Sublinhado">
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()} aria-label="Riscado">
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <input
        type="color"
        onInput={handleColorChange}
        value={editor.getAttributes('textStyle').color || '#000000'}
        className="w-8 h-8 p-1 border-none cursor-pointer"
        aria-label="Cor do texto"
      />

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Grupo: Alinhamento */}
      <Toggle size="sm" pressed={editor.isActive({ textAlign: 'left' })} onPressedChange={() => editor.chain().focus().setTextAlign('left').run()} aria-label="Alinhar à esquerda">
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive({ textAlign: 'center' })} onPressedChange={() => editor.chain().focus().setTextAlign('center').run()} aria-label="Centralizar">
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive({ textAlign: 'right' })} onPressedChange={() => editor.chain().focus().setTextAlign('right').run()} aria-label="Alinhar à direita">
        <AlignRight className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Grupo: Listas e Blocos */}
      <Toggle size="sm" pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()} aria-label="Lista com marcadores">
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Lista numerada">
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()} aria-label="Citação">
        <Quote className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export default Toolbar; 