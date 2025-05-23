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
import { toast } from "sonner";

interface CardItemProps {
  card: Card;
  onResize?: () => void;
}

// Define the placeholder text for new cards
const NEW_CARD_TITLE = "Novo cartão";

export default function CardItem({ card, onResize }: CardItemProps) {
  const { updateItem, deleteItem } = useCalendario();
  
  // Track if the card is being edited
  const [isEditing, setIsEditing] = useState(false);
  
  // Track if the delete confirmation dialog is open
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Current values for editing
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  
  // Original values to compare against for determining if changes were made
  const [originalTitle, setOriginalTitle] = useState(card.title);
  const [originalDescription, setOriginalDescription] = useState(card.description || "");
  
  // Track if the content was modified during this editing session
  const [wasModified, setWasModified] = useState(false);
  
  // Reference to track if this is a newly created card
  const isNewCardRef = useRef(card.title === NEW_CARD_TITLE);
  
  // References for DOM elements
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Check if this is a new card that should be focused
  const isNewCard = card.title === NEW_CARD_TITLE;
  
  // Adjust textarea height immediately without animation
  const adjustTextareaHeight = () => {
    const textarea = descriptionTextareaRef.current;
    if (textarea) {
      textarea.style.transition = "none";
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(80, textarea.scrollHeight)}px`;
      
      // Notify parent about size change immediately
      if (onResize) {
        onResize();
      }
    }
  };
  
  // Set up focus and initial state for new cards
  useEffect(() => {
    // Only auto-focus and enter edit mode if this is a new card
    if (isNewCard && !isEditing) {
      setIsEditing(true);
    }
    
    // When entering edit mode
    if (isEditing) {
      // Save original state for possible cancel
      setOriginalTitle(title);
      setOriginalDescription(description);
      
      // For new cards, clear default title
      if (isNewCard && title === NEW_CARD_TITLE) {
        setTitle("");
        setWasModified(false);
      }
      
      // Focus on title first
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
      
      // Adjust textarea height immediately
      adjustTextareaHeight();
    }
  }, [isEditing, isNewCard, title, description]);
  
  // Monitor content changes
  useEffect(() => {
    const titleChanged = title !== originalTitle && title !== NEW_CARD_TITLE;
    const descriptionChanged = description !== originalDescription && description.trim() !== "";
    
    if (titleChanged || descriptionChanged) {
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
        const trimmedTitle = title.trim();
        
        // If title is empty but description has content, don't save or cancel - show error
        if (trimmedTitle === "" && description.trim() !== "") {
          toast.error("O título não pode estar vazio quando há descrição");
          titleInputRef.current?.focus();
          return;
        }
        
        // If this is a new card and no content was added, discard it
        if (isNewCardRef.current && trimmedTitle === "" && description.trim() === "") {
          deleteItem(card.id, "card");
          return;
        }
        
        // If title is empty (and also no description based on previous check)
        if (trimmedTitle === "") {
          if (isNewCardRef.current) {
            // Discard new empty card
            deleteItem(card.id, "card");
          } else {
            // For existing cards, cancel edits if title was removed
            handleCancel();
          }
          return;
        }
        
        // If we have a valid title and either description or it was modified
        if (wasModified || (trimmedTitle !== NEW_CARD_TITLE && trimmedTitle !== "")) {
          handleSave();
        } else {
          // If not modified and not new or empty, just exit edit mode
          handleCancel();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, title, description, wasModified]);

  const handleSave = () => {
    const trimmedTitle = title.trim();
    
    // Don't save with empty title
    if (trimmedTitle === "") {
      toast.error("O título não pode estar vazio");
      titleInputRef.current?.focus();
      return;
    }

    // Update the card
    const updatedCard: Card = {
      ...card,
      title: trimmedTitle,
      description,
      updatedAt: new Date().toISOString()
    };

    updateItem(updatedCard);
    setIsEditing(false);
    setWasModified(false);
    
    // After first save, this is no longer a "new card"
    isNewCardRef.current = false;
    
    // Notify parent about size change immediately
    if (onResize) {
      onResize();
    }
  };
  
  const handleCancel = () => {
    // If this is a new card that was never saved, delete it
    if (isNewCardRef.current && originalTitle === NEW_CARD_TITLE) {
      deleteItem(card.id, "card");
    } else {
      // Otherwise just revert to original state
      setTitle(originalTitle);
      setDescription(originalDescription);
      setIsEditing(false);
      setWasModified(false);
    }
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
    if (e.target.value !== originalTitle && e.target.value !== NEW_CARD_TITLE) {
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
