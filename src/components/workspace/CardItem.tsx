
import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckSquare, MoreVertical } from "lucide-react";
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
import { Input } from "@/components/ui/input";

interface CardItemProps {
  card: Card;
  onResize?: () => void;
}

export default function CardItem({ card, onResize }: CardItemProps) {
  const { updateItem, deleteItem } = useCalendario();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [originalTitle, setOriginalTitle] = useState(card.title);
  const [originalDescription, setOriginalDescription] = useState(card.description);
  const [wasModified, setWasModified] = useState(false);
  
  // References for inputs
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Check if this is a new card that should be focused
  const isNewCard = card.title === "Novo cartão";
  
  // Adjust textarea height immediately without animation
  const adjustTextareaHeight = () => {
    const textarea = descriptionTextareaRef.current;
    if (textarea) {
      textarea.style.transition = "none";
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(80, textarea.scrollHeight)}px`;
      
      // Notify parent about size change immediately
      if (onResize) {
        onResize(); // Removed setTimeout to make it instant
      }
    }
  };
  
  // Set up focus and initial state only for new cards
  useEffect(() => {
    // Only auto-focus and enter edit mode if this is a new card
    if (isNewCard && !isEditing) {
      setIsEditing(true);
    }
    
    if (isEditing) {
      // Focus on title first
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
      
      // Adjust textarea height immediately
      if (descriptionTextareaRef.current) {
        descriptionTextareaRef.current.style.transition = "none";
      }
      adjustTextareaHeight();
      
      // Save original state for possible cancel
      setOriginalTitle(title);
      setOriginalDescription(description);
      
      // For new cards, clear default title
      if (isNewCard && title === "Novo cartão") {
        setTitle("");
        setWasModified(false);
      }
    }
  }, [isEditing, isNewCard]);
  
  // Monitor content changes
  useEffect(() => {
    if ((title !== originalTitle && title !== "Novo cartão") || 
        (description !== originalDescription && description.trim() !== "")) {
      setWasModified(true);
    }
  }, [title, description, originalTitle, originalDescription]);
  
  // Adjust textarea height when description changes
  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight();
    }
  }, [description]);

  // Handle clicks outside the card to save or cancel
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        // If modified or has content, save
        if (wasModified || (title !== "Novo cartão" && title.trim() !== "")) {
          handleSave();
        } else {
          // If not modified and is a new card or empty, discard
          if (card.title === "Novo cartão" && !description) {
            deleteItem(card.id, "card");
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
  }, [isEditing, title, description, wasModified]);

  const handleSave = () => {
    // Don't save if it's default text and not modified
    if (title === "Novo cartão" && description === "" && !wasModified) {
      handleCancel();
      return;
    }

    // Don't save if title is empty
    if (title.trim() === "") {
      if (card.title === "Novo cartão" && !wasModified) {
        // If new and empty, delete
        deleteItem(card.id, "card");
      } else {
        handleCancel();
      }
      return;
    }

    const updatedCard: Card = {
      ...card,
      title: title.trim() || "Sem título",
      description,
      updatedAt: new Date().toISOString()
    };

    updateItem(updatedCard);
    setIsEditing(false);
    setWasModified(false);
    
    // Notify parent about size change immediately
    if (onResize) {
      onResize(); // Removed setTimeout to make it instant
    }
  };
  
  const handleCancel = () => {
    setTitle(originalTitle);
    setDescription(originalDescription);
    setIsEditing(false);
    setWasModified(false);
  };

  const handleDelete = () => {
    deleteItem(card.id, "card");
    setShowDeleteDialog(false);
  };

  const handleStatusToggle = () => {
    const updatedCard: Card = {
      ...card,
      status: card.status === "pending" ? "completed" : "pending",
      updatedAt: new Date().toISOString()
    };

    updateItem(updatedCard);
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (e.target.value !== originalTitle && e.target.value !== "Novo cartão") {
      setWasModified(true);
    }
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (e.target.value !== originalDescription) {
      setWasModified(true);
    }
  };

  if (isEditing) {
    return (
      <div 
        ref={cardRef}
        className="calendario-card bg-white border rounded-md p-3 shadow-sm"
      >
        <Input
          ref={titleInputRef}
          value={title}
          onChange={handleTitleChange}
          className="w-full mb-2 font-medium"
          placeholder="Título do cartão..."
          autoFocus
          style={{ transition: "none" }}
        />
        <Textarea
          ref={descriptionTextareaRef}
          value={description}
          onChange={handleDescriptionChange}
          className="w-full border rounded mb-2 px-2 py-1 text-sm resize-none overflow-hidden"
          placeholder="Descrição do cartão..."
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
      <div 
        className={`calendario-card bg-white border rounded-md p-3 shadow-sm hover:bg-gray-50 transition-colors ${card.status === 'completed' ? 'border-green-500 bg-green-50' : ''}`}
        onClick={() => setIsEditing(true)}
      >
        <div className="flex justify-between items-start mb-1">
          <h4 className={`font-medium ${card.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
            {card.title}
          </h4>
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground"
              onClick={(e) => {
                e.stopPropagation(); // Prevent click propagation to card
                handleStatusToggle();
              }}
            >
              <CheckSquare size={14} className={card.status === 'completed' ? 'text-green-500' : ''} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground"
                  onClick={(e) => e.stopPropagation()} // Prevent click propagation
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
                  className="text-red-500 focus:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click propagation
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 size={14} className="mr-2" />
                  <span>Excluir</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {card.description && (
          <p className="text-sm text-gray-600 mt-1">
            {card.description}
          </p>
        )}
        
        {card.checklist && card.checklist.length > 0 && (
          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
            <div className="text-xs font-medium text-gray-500 mb-1">Checklist:</div>
            <ul className="text-sm space-y-1">
              {card.checklist.map((item) => (
                <li key={item.id} className="flex items-center gap-1">
                  <input 
                    type="checkbox" 
                    checked={item.completed}
                    className="rounded" 
                    onChange={() => {
                      const updatedChecklist = card.checklist?.map(i => 
                        i.id === item.id ? { ...i, completed: !i.completed } : i
                      );
                      updateItem({
                        ...card,
                        checklist: updatedChecklist,
                        updatedAt: new Date().toISOString()
                      });
                    }} 
                  />
                  <span className={item.completed ? 'line-through text-gray-400' : ''}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Dialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir cartão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este cartão? Esta ação não pode ser desfeita.
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
