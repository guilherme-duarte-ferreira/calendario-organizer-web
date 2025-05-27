
import React, { useState } from "react";
import { Card } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, MoreVertical, ExternalLink, Clock, Paperclip, CheckSquare } from "lucide-react";
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
import CardDialog from "@/components/dialogs/CardDialog";

interface CardItemProps {
  card: Card;
  onResize?: (width: number) => void;
}

export default function CardItem({ card, onResize }: CardItemProps) {
  const { updateItem, deleteItem } = useCalendario();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [status, setStatus] = useState(card.status);

  // Auto-open modal for new cards
  React.useEffect(() => {
    if (card.title === "Novo cartão" && (!card.description || card.description.trim() === "")) {
      setShowCardDialog(true);
    }
  }, [card]);

  const handleSave = () => {
    const updatedCard: Card = {
      ...card,
      title,
      description,
      status,
      updatedAt: new Date().toISOString()
    };

    updateItem(updatedCard);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteItem(card.id, "card");
    setShowDeleteDialog(false);
  };

  const handleOpenModal = () => {
    setShowCardDialog(true);
  };

  const totalChecklistItems = card.checklist?.length || 0;
  const completedChecklistItems = card.checklist?.filter(item => item.completed).length || 0;

  if (isEditing) {
    return (
      <div className="bg-white border rounded-md p-3 shadow-sm space-y-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full font-medium"
          placeholder="Título do cartão..."
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-sm min-h-[80px]"
          placeholder="Descrição do cartão..."
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex justify-between">
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
      <div className="bg-white border rounded-md shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Capa do cartão */}
        {(card.capa || card.capaColor) && (
          <div 
            className="card-cover h-8 w-full"
            style={{
              backgroundColor: card.capaColor,
              backgroundImage: card.capa ? `url(${card.capa})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        
        <div className="p-3 space-y-2">
          {/* Etiquetas */}
          {card.etiquetas && card.etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {card.etiquetas.slice(0, 3).map((etiquetaId) => (
                <div
                  key={etiquetaId}
                  className="w-8 h-2 rounded-full"
                  style={{ backgroundColor: '#' + etiquetaId }}
                />
              ))}
              {card.etiquetas.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{card.etiquetas.length - 3}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-start">
            <h4 
              className="font-medium text-sm cursor-pointer hover:text-blue-600"
              onClick={handleOpenModal}
            >
              {card.title}
            </h4>
            
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
                <DropdownMenuItem onClick={() => {
                  setTitle(card.title);
                  setDescription(card.description || "");
                  setStatus(card.status);
                  setIsEditing(true);
                }}>
                  <Pencil size={14} className="mr-2" />
                  <span>Editar</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleOpenModal}>
                  <ExternalLink size={14} className="mr-2" />
                  <span>Ver Cartão</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 size={14} className="mr-2" />
                  <span>Excluir</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {card.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {card.description}
            </p>
          )}

          {/* Indicadores */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {/* Data de vencimento */}
            {card.dueDate && (
              <Badge variant="destructive" className="text-xs">
                <Clock size={10} className="mr-1" />
                {new Date(card.dueDate).toLocaleDateString()}
              </Badge>
            )}
            
            {/* Anexos */}
            {card.attachments && card.attachments.length > 0 && (
              <div className="flex items-center">
                <Paperclip size={10} className="mr-1" />
                <span>{card.attachments.length}</span>
              </div>
            )}
            
            {/* Checklist */}
            {totalChecklistItems > 0 && (
              <div className="flex items-center">
                <CheckSquare size={10} className="mr-1" />
                <span className={completedChecklistItems === totalChecklistItems ? "text-green-600" : ""}>
                  {completedChecklistItems}/{totalChecklistItems}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <Badge variant={status === 'completed' ? 'default' : 'secondary'} className="text-xs">
              {status === 'pending' ? 'Pendente' : 'Concluído'}
            </Badge>
            
            <div className="text-xs text-right text-muted-foreground">
              {new Date(card.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
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

      <CardDialog
        card={card}
        isOpen={showCardDialog}
        onClose={() => setShowCardDialog(false)}
        blockName="Lista"
      />
    </>
  );
}
