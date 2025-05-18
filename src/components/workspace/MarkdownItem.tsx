
import { useState } from "react";
import { MarkdownNote } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import { useDragDrop } from "@/hooks/use-drag-drop";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Archive,
  Edit,
  FileText,
  MoreVertical,
  Trash2
} from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface MarkdownItemProps {
  markdownNote: MarkdownNote;
}

// Instalando markdown
<lov-add-dependency>react-markdown@8.0.7</lov-add-dependency>

export default function MarkdownItem({ markdownNote }: MarkdownItemProps) {
  const { updateItem, archiveItem, deleteItem } = useCalendario();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [content, setContent] = useState(markdownNote.content);
  const [isPreview, setIsPreview] = useState(true);
  
  const { isDragging, handlers } = useDragDrop({
    onDragStart: (e, id) => {
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.setData("application/calendario-markdown", JSON.stringify(markdownNote));
    },
  });
  
  const handleSave = () => {
    updateItem({
      ...markdownNote,
      content
    });
    setIsEditing(false);
  };

  return (
    <>
      <div
        className={`calendario-card select-none ${isDragging ? "opacity-50" : ""}`}
        draggable
        onDragStart={(e) => handlers.handleDragStart(e, markdownNote.id)}
        onDragEnd={handlers.handleDragEnd}
        onClick={() => setIsEditing(true)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <FileText size={16} className="mr-2 text-primary" />
            <div className="font-medium truncate">
              {markdownNote.content.split('\n')[0].replace(/^#+\s/, '') || "Nota Markdown"}
            </div>
          </div>
          <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground"
              >
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setShowMenu(false);
              }}>
                <Edit size={16} className="mr-2" />
                <span>Editar</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                archiveItem(markdownNote.id, "markdown");
                setShowMenu(false);
              }}>
                <Archive size={16} className="mr-2" />
                <span>Arquivar</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteDialogOpen(true);
                  setShowMenu(false);
                }}
              >
                <Trash2 size={16} className="mr-2" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-2 text-sm text-muted-foreground overflow-hidden max-h-32">
          <ReactMarkdown className="prose prose-sm max-w-none">
            {markdownNote.content.substring(0, 200)}
          </ReactMarkdown>
          {markdownNote.content.length > 200 && "..."}
        </div>
      </div>

      {/* Diálogo de edição */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Editar Nota Markdown</DialogTitle>
          </DialogHeader>

          <div className="py-4 flex flex-col h-full">
            <div className="flex justify-end mb-2">
              <div className="flex gap-2">
                <Button 
                  variant={isPreview ? "outline" : "default"} 
                  onClick={() => setIsPreview(false)}
                  className="text-xs h-8"
                >
                  Editar
                </Button>
                <Button 
                  variant={isPreview ? "default" : "outline"} 
                  onClick={() => setIsPreview(true)}
                  className="text-xs h-8"
                >
                  Visualizar
                </Button>
              </div>
            </div>
            
            {isPreview ? (
              <div className="border rounded p-4 overflow-y-auto h-[50vh]">
                <ReactMarkdown className="prose max-w-none">
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="font-mono text-sm flex-1 h-[50vh] resize-none"
              />
            )}
            
            <div className="mt-2 text-xs text-muted-foreground">
              <p>Dica: Use Markdown para formatar o texto</p>
              <div className="grid grid-cols-2 mt-1">
                <ul>
                  <li># Título</li>
                  <li>## Subtítulo</li>
                  <li>**negrito**</li>
                  <li>*itálico*</li>
                </ul>
                <ul>
                  <li>- Item de lista</li>
                  <li>1. Lista numerada</li>
                  <li>[link](https://exemplo.com)</li>
                  <li>![descrição](url da imagem)</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 size={16} className="mr-1" /> Excluir
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setContent(markdownNote.content);
                setIsEditing(false);
              }}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir nota</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                deleteItem(markdownNote.id, "markdown");
                setDeleteDialogOpen(false);
                setIsEditing(false);
              }}
            >
              Excluir permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
