import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';

import { cn } from "@/lib/utils";
import Toolbar from './Toolbar';
import { Button } from './button';

// --- Props do Componente ---
interface TipTapEditorProps {
  content: string;
  onSave: (newContent: string) => void;
  onCancel: () => void;
  placeholder?: string;
}

/**
 * Um editor de texto rico que alterna entre o modo de visualização e edição.
 * Encapsula a lógica do TipTap, a renderização e as ações de salvar/cancelar.
 */
export default function TipTapEditor({ content, onSave, onCancel, placeholder }: TipTapEditorProps) {
  // --- Estados do Componente ---
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content);

  // --- Configuração do Editor TipTap ---
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 my-4',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4 my-2',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4 my-2',
          },
        },
      }),
      Underline,
      TextAlign.configure({ 
        types: ['heading', 'paragraph', 'list_item'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      TextStyle.configure(),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Color.configure({ types: ['textStyle'] }),
      Placeholder.configure({ 
        placeholder: placeholder || 'Adicione uma descrição mais detalhada...',
        emptyEditorClass: 'cursor-text before:content-[attr(data-placeholder)] before:absolute before:opacity-50 before:pointer-events-none',
      }),
      Link.configure({ 
        openOnClick: false, 
        autolink: true,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4',
        },
      }),
    ],
    // Conteúdo inicial
    content: editableContent,
    // Atualiza o estado interno sempre que o conteúdo do editor muda
    onUpdate: ({ editor }) => {
      setEditableContent(editor.getHTML());
    },
    // Propriedades para estilização do campo de edição
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none prose-sm sm:prose-base focus:outline-none min-h-[150px] w-full',
      },
    },
  });

  // --- Handlers de Ação ---
  const handleEnterEditMode = useCallback(() => {
    setIsEditing(true);
    editor?.commands.setContent(editableContent, false);
    setTimeout(() => editor?.commands.focus('end'), 100);
  }, [editor, editableContent]);

  const handleSave = () => {
    // A prop onSave é chamada, e o editor sai do modo de edição.
    onSave(editableContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Restaura o conteúdo original e sai do modo de edição
    setEditableContent(content);
    setIsEditing(false);
    onCancel();
  };

  // Atualiza o conteúdo do editor se a prop externa mudar
  useEffect(() => {
    setEditableContent(content);
    if(editor && !editor.isDestroyed) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);
  
  // Renderização do Componente
  if (isEditing) {
    // --- MODO DE EDIÇÃO ---
    return (
      <div className="rich-text-editor-wrapper edit-mode rounded-md border border-primary ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {/* A Toolbar agora é renderizada aqui, passando a instância do editor */}
        <Toolbar editor={editor} />
        
        {/* Área de conteúdo editável */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)'}}>
          <EditorContent editor={editor} />
        </div>

        <div className="editor-actions flex justify-end items-center gap-2 p-2 border-t border-input">
          <Button variant="ghost" onClick={handleCancel}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </div>
    );
  }

  // --- MODO DE VISUALIZAÇÃO ---
  return (
    <div
      className="rich-text-editor-wrapper view-mode cursor-text rounded-md border border-transparent hover:border-input transition-colors"
      onClick={handleEnterEditMode}
    >
      <div
        className={cn(
            "prose dark:prose-invert max-w-none prose-sm sm:prose-base p-4 min-h-[150px]",
            !content && "text-muted-foreground"
        )}
        dangerouslySetInnerHTML={{ __html: content || `<p>${placeholder || "Adicione uma descrição..."}</p>` }}
      />
    </div>
  );
} 