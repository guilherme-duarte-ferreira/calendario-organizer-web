
import React, { useState } from "react";
import { Card } from "@/types/calendario";
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
  CheckSquare,
  Edit,
  MoreVertical,
  Square,
  Trash2
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CardProps {
  card: Card;
}

export default function CardItem({ card }: CardProps) {
  const { updateItem, archiveItem, deleteItem } = useCalendario();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [status, setStatus] = useState<"pending" | "completed">(card.status as "pending" | "completed");
  
  const { isDragging, handlers } = useDragDrop({
    onDragStart: (e, id) => {
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.setData("application/calendario-card", JSON.stringify(card));
    },
  });
  
  const handleStatusChange = () => {
    const newStatus: "pending" | "completed" = status === "pending" ? "completed" : "pending";
    setStatus(newStatus);
    updateItem({
      ...card,
      status: newStatus
    });
  };
  
  const handleSave = () => {
    updateItem({
      ...card,
      title,
      description,
      status
    });
    setIsEditing(false);
  };
  
  const toggleChecklistItem = (itemId: string) => {
    if (!card.checklist) return;
    
    const updatedChecklist = card.checklist.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    
    updateItem({
      ...card,
      checklist: updatedChecklist
    });
  };

  return (
    <>
      <div
        className={`calendario-card select-none ${isDragging ? "opacity-50" : ""}`}
        draggable
        onDragStart={(e) => handlers.handleDragStart(e, card.id)}
        onDragEnd={handlers.handleDragEnd}
        onClick={() => setIsEditing(true)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {status === "completed" ? (
              <CheckSquare size={16} className="mr-2 text-green-600" />
            ) : (
              <Square size={16} className="mr-2 text-muted-foreground" />
            )}
            <div className="font-medium truncate">{card.title}</div>
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
                archiveItem(card.id, "card");
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

        {card.description && (
          <div className="mt-2 text-sm text-muted-foreground overflow-hidden max-h-24">
            {card.description.substring(0, 100)}
            {card.description.length > 100 && "..."}
          </div>
        )}

        {card.checklist && card.checklist.length > 0 && (
          <div className="mt-2">
            <div className="text-xs font-medium mb-1">Tarefas:</div>
            <div className="space-y-1">
              {card.checklist.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center text-sm">
                  <Checkbox
                    id={`checklist-${item.id}`}
                    checked={item.completed}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChecklistItem(item.id);
                    }}
                    className="mr-2 h-3 w-3"
                  />
                  <label
                    htmlFor={`checklist-${item.id}`}
                    className={`text-xs ${item.completed ? "line-through text-muted-foreground" : ""}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.text}
                  </label>
                </div>
              ))}
              {card.checklist.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{card.checklist.length - 3} mais
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Diálogo de edição */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cartão</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Descrição (Suporte a Markdown)</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="status"
                checked={status === "completed"}
                onCheckedChange={() => setStatus(status === "pending" ? "completed" : "pending")}
              />
              <label htmlFor="status" className="text-sm font-medium">
                Marcar como concluído
              </label>
            </div>

            {card.checklist && card.checklist.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Checklist:</h4>
                <div className="space-y-2">
                  {card.checklist.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={item.completed}
                        onCheckedChange={() => toggleChecklistItem(item.id)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`item-${item.id}`}
                        className={`text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {item.text}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                setTitle(card.title);
                setDescription(card.description);
                setStatus(card.status as "pending" | "completed");
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
            <DialogTitle>Excluir cartão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este cartão? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                deleteItem(card.id, "card");
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
