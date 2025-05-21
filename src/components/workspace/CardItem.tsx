
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
  
  // Referências para os campos de input
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Ajustar altura do textarea automaticamente - sem animação
  const adjustTextareaHeight = () => {
    const textarea = descriptionTextareaRef.current;
    if (textarea) {
      textarea.style.transition = "none";
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(80, textarea.scrollHeight)}px`;
      
      // Notificar componente pai sobre mudança de tamanho
      if (onResize) {
        onResize();
      }
    }
  };
  
  // Configurar foco e estado original ao iniciar edição
  useEffect(() => {
    if (isEditing) {
      // Foco no título primeiro
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
      
      // Ajustar altura do textarea de descrição sem animação
      if (descriptionTextareaRef.current) {
        descriptionTextareaRef.current.style.transition = "none";
      }
      adjustTextareaHeight();
      
      // Salvar estado original para possível cancelamento
      setOriginalTitle(title);
      setOriginalDescription(description);
      
      // Flag de controle para novos itens
      if (title === "Novo cartão" && !description) {
        setTitle("");
        setWasModified(false);
      }
    }
  }, [isEditing]);
  
  // Monitorar mudanças no conteúdo
  useEffect(() => {
    if ((title !== originalTitle && title !== "Novo cartão") || 
        (description !== originalDescription && description.trim() !== "")) {
      setWasModified(true);
    }
  }, [title, description, originalTitle, originalDescription]);
  
  // Ajustar altura quando a descrição mudar - sem animação
  useEffect(() => {
    if (isEditing) {
      adjustTextareaHeight();
    }
  }, [description]);

  // Tratar cliques fora do cartão para salvar ou cancelar
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        // Se foi modificado ou tem título, salva
        if (wasModified || (title !== "Novo cartão" && title.trim() !== "")) {
          handleSave();
        } else {
          // Se não foi modificado e é um novo cartão ou está vazio, descarta
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
    // Não salvar se for o texto padrão e não foi modificado
    if (title === "Novo cartão" && description === "" && !wasModified) {
      handleCancel();
      return;
    }

    // Não salvar se título estiver vazio
    if (title.trim() === "") {
      if (card.title === "Novo cartão" && !wasModified) {
        // Se for novo e vazio, exclui
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
    
    // Notificar o componente pai sobre a alteração de tamanho - sem animação
    if (onResize) {
      setTimeout(onResize, 0);
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
  
  // Iniciar edição automaticamente apenas para cartões novos
  useEffect(() => {
    if (card.title === "Novo cartão") {
      setIsEditing(true);
    }
  }, []);
  
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
                e.stopPropagation(); // Evitar propagação do clique para o cartão
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
                  onClick={(e) => e.stopPropagation()} // Evitar propagação do clique
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
                    e.stopPropagation(); // Evitar propagação do clique
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
