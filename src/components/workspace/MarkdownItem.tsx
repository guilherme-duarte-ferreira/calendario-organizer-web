
import React, { useState } from "react";
import { MarkdownNote } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";

interface MarkdownItemProps {
  markdownNote: MarkdownNote;
}

export default function MarkdownItem({ markdownNote }: MarkdownItemProps) {
  // Acesso ao contexto e métodos para atualizar/excluir notas
  const { updateBlock } = useCalendario();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [content, setContent] = useState(markdownNote.content);

  // Função para atualizar a nota Markdown
  const handleSave = () => {
    const updatedNote = {
      ...markdownNote,
      content,
      updatedAt: new Date().toISOString()
    };

    // Atualizar o bloco que contém esta nota
    updateBlock({
      id: markdownNote.blockId,
      items: [updatedNote]
    });
    
    setIsEditing(false);
  };

  // Função para excluir a nota Markdown
  const handleDelete = () => {
    // Buscar o bloco que contém esta nota e atualizar removendo-a
    updateBlock({
      id: markdownNote.blockId,
      items: [] // Vamos filtrar os itens para remover esta nota
    }, true); // O segundo parâmetro indica para remover o item
    
    setShowDeleteDialog(false);
  };

  if (isEditing) {
    return (
      <div className="calendario-markdown bg-white border rounded-md p-3 shadow-sm">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded mb-2 px-2 py-1 text-sm min-h-[100px] font-mono"
          placeholder="Conteúdo Markdown..."
        />
        <div className="flex justify-between mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="calendario-markdown bg-white border rounded-md p-3 shadow-sm hover:bg-gray-50 transition-colors">
        <div className="flex justify-end mb-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground"
              >
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil size={14} className="mr-2" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 size={14} className="mr-2" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{markdownNote.content}</ReactMarkdown>
        </div>
      </div>

      <Dialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir nota Markdown</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Excluir permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
