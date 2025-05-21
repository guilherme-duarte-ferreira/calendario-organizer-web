
import React, { useState, useEffect, useRef } from "react";
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
  onResize?: () => void;
}

export default function MarkdownItem({ markdownNote, onResize }: MarkdownItemProps) {
  const { updateItem, deleteItem } = useCalendario();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [content, setContent] = useState(markdownNote.content);
  const [originalContent, setOriginalContent] = useState(markdownNote.content);
  const [wasModified, setWasModified] = useState(false);
  
  // Reference to the textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Function to adjust textarea height automatically without animation
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height temporarily to get the correct scrollHeight
      textarea.style.height = "auto";
      textarea.style.transition = "none";
      // Set the height to match the content
      textarea.style.height = `${Math.max(100, textarea.scrollHeight)}px`;
      
      // Notify parent block about size change
      if (onResize) {
        onResize();
      }
    }
  };
  
  // Set up initial state and focus when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.transition = "none";
      adjustTextareaHeight();
      setOriginalContent(content);
      
      // Control flag for new items
      if (content === "Novo texto markdown") {
        setContent("");
        setWasModified(false);
      }
    }
  }, [isEditing]);
  
  // Monitor content changes
  useEffect(() => {
    if (content !== originalContent && content !== "Novo texto markdown" && content.trim() !== "") {
      setWasModified(true);
    }
  }, [content, originalContent]);
  
  // Adjust textarea height when content changes, without animation
  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight();
    }
  }, [content]);
  
  // Click outside to save/cancel - only enabled when editing
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // If modified or has content, save
        if (wasModified || (content !== "Novo texto markdown" && content.trim() !== "")) {
          handleSave();
        } else {
          // If not modified and is a new item or empty, discard
          if (markdownNote.content === "Novo texto markdown" || content.trim() === "") {
            deleteItem(markdownNote.id, "markdown");
          } else {
            handleCancel();
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, content, wasModified]);

  const handleSave = () => {
    // Don't save if it's default text and not modified
    if (content === "Novo texto markdown" && !wasModified) {
      handleCancel();
      return;
    }

    // Don't save if empty
    if (content.trim() === "") {
      if (markdownNote.content === "Novo texto markdown") {
        // If new and empty, delete
        deleteItem(markdownNote.id, "markdown");
      } else {
        handleCancel();
      }
      return;
    }

    const updatedNote: MarkdownNote = {
      ...markdownNote,
      content,
      updatedAt: new Date().toISOString()
    };

    updateItem(updatedNote);
    setIsEditing(false);
    setWasModified(false);
    
    // Notify parent component about size change
    if (onResize) {
      setTimeout(onResize, 0);
    }
  };

  const handleCancel = () => {
    setContent(originalContent);
    setIsEditing(false);
    setWasModified(false);
  };

  const handleDelete = () => {
    deleteItem(markdownNote.id, "markdown");
    setShowDeleteDialog(false);
  };

  // Start editing when created with empty or default content, only on initial creation
  useEffect(() => {
    if (markdownNote.content === "Novo texto markdown") {
      setIsEditing(true);
    }
  }, []);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (e.target.value !== originalContent && e.target.value !== "Novo texto markdown") {
      setWasModified(true);
    }
  };

  if (isEditing) {
    return (
      <div ref={containerRef} className="calendario-markdown bg-white border rounded-md p-3 shadow-sm">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          className="w-full border rounded mb-2 px-2 py-1 text-sm font-mono resize-none overflow-hidden"
          placeholder="Conteúdo Markdown..."
          autoFocus
          style={{ transition: "none" }}
          onInput={adjustTextareaHeight}
        />
        <div className="flex justify-between mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
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
        
        <div 
          className="prose prose-sm max-w-none" 
          onClick={() => setIsEditing(true)}
        >
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
