import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';

import { cn } from "@/lib/utils";
import Toolbar from './Toolbar';
import Actionbar from './Actionbar';

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
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      FontFamily,
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
        class: 'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none min-h-[150px]',
      },
    },
  });

  // --- Handlers de Ação ---
  const handleSave = () => {
    // A prop onSave é chamada, e o editor sai do modo de edição.
    onSave(editableContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Restaura o conteúdo original e sai do modo de edição
    setEditableContent(content);
    editor?.commands.setContent(content, false);
    onCancel();
    setIsEditing(false);
  };

  const handleEnterEditMode = () => {
    setIsEditing(true);
    // Foca o editor quando o modo de edição é ativado
    // Usamos um setTimeout para garantir que o editor esteja visível no DOM
    setTimeout(() => {
      editor?.commands.focus();
    }, 0);
  };

  // Atualiza o conteúdo do editor se a prop externa mudar
  useEffect(() => {
    if (editor && content !== editableContent) {
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
        <div className="p-4">
            <EditorContent editor={editor} />
        </div>

        {/* A Actionbar agora é renderizada aqui, passando as funções de callback */}
        <Actionbar onSave={handleSave} onCancel={handleCancel} />
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
            "prose dark:prose-invert prose-sm sm:prose-base p-4 min-h-[150px]",
            !content && "text-muted-foreground"
        )}
        dangerouslySetInnerHTML={{ __html: content || `<p>${placeholder || "Adicione uma descrição..."}</p>` }}
      />
    </div>
  );
} 