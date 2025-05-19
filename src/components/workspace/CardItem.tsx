
import React, { useState } from "react";
import { Card, ChecklistItem } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Check } from "lucide-react";
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

interface CardItemProps {
  card: Card;
}

export default function CardItem({ card }: CardItemProps) {
  const { updateItem, deleteItem } = useCalendario();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [status, setStatus] = useState<"pending" | "completed">(card.status);

  const handleSave = () => {
    if (title.trim() === "") return;

    const updatedCard: Card = {
      ...card,
      title,
      description,
      status: status,
      updatedAt: new Date().toISOString()
    };

    updateItem(updatedCard);
    setIsEditing(false);
  };

  const handleToggleStatus = () => {
    const newStatus: "pending" | "completed" = status === "pending" ? "completed" : "pending";
    setStatus(newStatus);
    
    const updatedCard: Card = {
      ...card,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    updateItem(updatedCard);
  };

  const handleDelete = () => {
    deleteItem(card.id, "card");
    setShowDeleteDialog(false);
  };

  if (isEditing) {
    return (
      <div className="calendario-card bg-white border rounded-md p-3 shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded mb-2 px-2 py-1 text-sm"
          placeholder="Título do cartão"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded mb-2 px-2 py-1 text-sm min-h-[60px]"
          placeholder="Descrição (suporta Markdown)"
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
      <div 
        className={`calendario-card bg-white border rounded-md p-3 shadow-sm ${
          status === "completed" ? "border-l-4 border-l-green-500" : ""
        } hover:bg-gray-50 transition-colors cursor-pointer`}
      >
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium">{title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground"
              >
                <Pencil size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil size={14} className="mr-2" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleStatus}>
                <Check size={14} className="mr-2" />
                <span>{status === "pending" ? "Marcar como concluído" : "Marcar como pendente"}</span>
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
        
        {description && (
          <div className="mt-2 text-xs text-muted-foreground line-clamp-2">
            {description}
          </div>
        )}
        
        {card.checklist && card.checklist.length > 0 && (
          <div className="mt-2">
            <div className="text-xs font-medium mb-1">Checklist</div>
            {card.checklist.slice(0, 2).map((item: ChecklistItem) => (
              <div key={item.id} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={item.completed}
                  readOnly
                  className="mr-1 h-3 w-3"
                />
                <span className={`${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {item.text}
                </span>
              </div>
            ))}
            {card.checklist.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{card.checklist.length - 2} mais itens
              </div>
            )}
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
