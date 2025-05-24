
import React, { useState, useRef } from "react";
import { Card } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import { Button } from "@/components/ui/button";
import { CheckSquare, MoreVertical, Pencil, ExternalLink, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import CardDialog from "@/components/dialogs/CardDialog";

interface CardItemProps {
  card: Card;
  onResize?: () => void;
}

const NEW_CARD_PLACEHOLDER_TITLE = "Novo cartão";

export default function CardItem({ card, onResize }: CardItemProps) {
  const { updateItem, deleteItem } = useCalendario();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(card.title);
  const [currentDescription, setCurrentDescription] = useState(card.description || "");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const initialIsNewCardRef = useRef(card.title === NEW_CARD_PLACEHOLDER_TITLE);
  
  const [showCardDialog, setShowCardDialog] = useState(false);

  const handleStatusToggle = () => {
    const updatedCard: Card = {
      ...card,
      status: card.status === 'pending' ? 'completed' : 'pending',
      updatedAt: new Date().toISOString()
    };
    updateItem(updatedCard);
  };

  const handleSave = () => {
    if (currentTitle.trim() === "") {
      toast.error("O título não pode estar vazio.");
      return;
    }

    const updatedCard: Card = {
      ...card,
      title: currentTitle,
      description: currentDescription,
      updatedAt: new Date().toISOString()
    };
    updateItem(updatedCard);
    setIsEditing(false);
    initialIsNewCardRef.current = false;
    toast.success("Cartão atualizado!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (initialIsNewCardRef.current) {
      deleteItem(card.id, "card");
      toast.message("Novo cartão descartado.");
    }
  };

  const handleDeleteConfirmation = () => {
    deleteItem(card.id, "card");
    setShowDeleteDialog(false);
    toast.success("Cartão excluído permanentemente.");
  };

  const handleOpenModal = () => {
    setShowCardDialog(true);
  };

  if (isEditing) {
    return (
      <div className="calendario-card bg-white border rounded-md p-3 shadow-sm">
        <input
          type="text"
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
          placeholder="Título do cartão"
          className="w-full font-medium text-sm border-none focus:ring-0 focus:outline-none mb-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave();
            }
          }}
        />
        <textarea
          value={currentDescription}
          onChange={(e) => setCurrentDescription(e.target.value)}
          placeholder="Descrição do cartão"
          className="w-full text-xs text-gray-600 border-none focus:ring-0 focus:outline-none resize-none"
        />
        <div className="flex justify-end mt-2">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </div>
    );
  }

  // Visualização normal do Card
  return (
    <>
      <div
        className={`calendario-card bg-white border rounded-md p-3 shadow-sm hover:shadow-md transition-shadow ${card.status === 'completed' ? 'border-green-500 bg-green-50 opacity-75' : ''}`}
        onClick={handleOpenModal}
      >
        <div className="flex justify-between items-start mb-1">
          <h4 className={`font-medium text-sm ${card.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
            {card.title === NEW_CARD_PLACEHOLDER_TITLE && initialIsNewCardRef.current ? <em>Novo cartão (sem título)</em> : card.title}
          </h4>
          <div className="flex items-center">
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation(); 
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
                  onClick={(e) => e.stopPropagation()} 
                >
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setCurrentTitle(card.title);
                  setCurrentDescription(card.description || "");
                  setIsEditing(true);
                }}>
                  <Pencil size={14} className="mr-2" />
                  <span>Editar</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal();
                }}>
                  <ExternalLink size={14} className="mr-2" />
                  <span>Ver Cartão</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation(); 
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
          <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
            {card.description}
          </p>
        )}
        
        {/* Checklist preview */}
        {card.checklist && card.checklist.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            <CheckSquare size={12} className="inline mr-1" />
            {card.checklist.filter(item => item.completed).length}/{card.checklist.length} concluídos
          </div>
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir cartão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o cartão "{card.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmation}>
              Excluir permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardDialog
        card={card}
        isOpen={showCardDialog}
        onClose={() => setShowCardDialog(false)}
        blockName="A FAZER"
      />
    </>
  );
}
