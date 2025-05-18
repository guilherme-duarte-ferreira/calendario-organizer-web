
import { useState } from "react";
import { Card, ChecklistItem, Attachment } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import { useDragDrop } from "@/hooks/use-drag-drop";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Archive,
  Check,
  Copy,
  Edit,
  MoreVertical,
  Plus,
  Trash2,
  X,
  FileUp,
} from "lucide-react";
import { generateId } from "@/utils/storage";

interface CardItemProps {
  card: Card;
}

export default function CardItem({ card }: CardItemProps) {
  const { updateItem, archiveItem, deleteItem } = useCalendario();

  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [cardData, setCardData] = useState({ ...card });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { isDragging, isDraggedOver, handlers } = useDragDrop({
    onDragStart: (e, id) => {
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.setData("application/calendario-card", JSON.stringify(card));
    },
  });

  const handleSave = () => {
    updateItem(cardData);
    setIsEditing(false);
  };

  const handleStatusChange = () => {
    const newStatus = card.status === "pending" ? "completed" : "pending";
    const updatedCard = { ...card, status: newStatus };
    updateItem(updatedCard);
  };

  const handleAddChecklistItem = () => {
    const checklist = cardData.checklist || [];
    const newItem: ChecklistItem = {
      id: generateId(),
      text: "",
      completed: false,
    };
    setCardData({
      ...cardData,
      checklist: [...checklist, newItem],
    });
  };

  const handleUpdateChecklistItem = (id: string, field: string, value: any) => {
    if (!cardData.checklist) return;

    const updatedChecklist = cardData.checklist.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });

    setCardData({
      ...cardData,
      checklist: updatedChecklist,
    });
  };

  const handleDeleteChecklistItem = (id: string) => {
    if (!cardData.checklist) return;

    setCardData({
      ...cardData,
      checklist: cardData.checklist.filter(item => item.id !== id),
    });
  };

  const handleAddAttachment = (file: File) => {
    // Em um sistema real, aqui seria feito upload para um servidor
    // Para simplificar, criamos um objeto URL local
    const fileUrl = URL.createObjectURL(file);
    
    const newAttachment: Attachment = {
      id: generateId(),
      name: file.name,
      fileType: file.type,
      url: fileUrl,
      thumbnail: file.type.startsWith("image/") ? fileUrl : undefined
    };
    
    const attachments = cardData.attachments || [];
    
    setCardData({
      ...cardData,
      attachments: [...attachments, newAttachment]
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleAddAttachment(files[0]);
      
      // Limpar o input
      e.target.value = "";
    }
  };

  const statusIcon = card.status === "completed" ? (
    <Check size={16} className="text-green-500" />
  ) : null;

  return (
    <>
      <div
        className={`calendario-card select-none ${
          isDragging ? "opacity-50" : ""
        } ${isDraggedOver ? "calendario-drag-over" : ""}`}
        draggable
        onDragStart={(e) => handlers.handleDragStart(e, card.id)}
        onDragEnd={handlers.handleDragEnd}
        onDragOver={handlers.handleDragOver}
        onDragLeave={handlers.handleDragLeave}
        onDrop={(e) => handlers.handleDrop(e, card.id)}
        onClick={() => setIsEditing(true)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 font-medium truncate mr-2">{card.title}</div>
          <div className="flex items-center gap-1">
            {statusIcon}
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

                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange();
                  setShowMenu(false);
                }}>
                  <Check size={16} className="mr-2" />
                  <span>
                    {card.status === "pending" ? "Marcar como concluído" : "Marcar como pendente"}
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  const newCard = { ...card };
                  newCard.id = generateId();
                  updateItem({ ...newCard, title: `${newCard.title} (Cópia)` });
                  setShowMenu(false);
                }}>
                  <Copy size={16} className="mr-2" />
                  <span>Duplicar</span>
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
        </div>

        {card.description && (
          <div className="text-xs text-muted-foreground mt-1 truncate">
            {card.description.replace(/[#*]/g, "")}
          </div>
        )}

        {card.checklist && card.checklist.length > 0 && (
          <div className="mt-2 text-xs">
            <div className="flex items-center text-muted-foreground">
              <Check size={12} className="mr-1" />
              {card.checklist.filter((item) => item.completed).length} / {card.checklist.length}
            </div>
          </div>
        )}

        {card.attachments && card.attachments.length > 0 && (
          <div className="mt-2 flex gap-1 flex-wrap">
            {card.attachments.map(attachment => (
              attachment.thumbnail ? (
                <div key={attachment.id} className="w-8 h-8 rounded overflow-hidden bg-muted">
                  <img 
                    src={attachment.thumbnail} 
                    alt={attachment.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div key={attachment.id} className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  {attachment.name.split('.').pop()?.toUpperCase()}
                </div>
              )
            ))}
          </div>
        )}
      </div>

      {/* Card editing dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cartão</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Título</label>
              <Input
                value={cardData.title}
                onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
                placeholder="Título do cartão"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Descrição</label>
              <Textarea
                value={cardData.description}
                onChange={(e) => setCardData({ ...cardData, description: e.target.value })}
                placeholder="Descrição (suporta Markdown)"
                className="resize-y"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Suporta formatação Markdown: **negrito**, *itálico*, # título, - lista, etc.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Lista de verificação</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddChecklistItem}
                  className="h-7 text-xs"
                >
                  <Plus size={14} className="mr-1" /> Adicionar item
                </Button>
              </div>

              <div className="space-y-1 max-h-40 overflow-y-auto">
                {cardData.checklist?.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={(checked) => 
                        handleUpdateChecklistItem(item.id, "completed", !!checked)
                      }
                    />
                    <Input
                      value={item.text}
                      onChange={(e) => 
                        handleUpdateChecklistItem(item.id, "text", e.target.value)
                      }
                      className="flex-1 h-7 text-xs"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteChecklistItem(item.id)}
                      className="h-6 w-6 text-muted-foreground"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}

                {(!cardData.checklist || cardData.checklist.length === 0) && (
                  <div className="text-sm text-muted-foreground py-1">
                    Nenhum item na lista de verificação
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Anexos</label>
                <label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => document.getElementById('attachment-input')?.click()}
                  >
                    <FileUp size={14} className="mr-1" /> Anexar
                  </Button>
                  <input
                    id="attachment-input"
                    type="file"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-2 flex-wrap">
                {cardData.attachments?.map(attachment => (
                  <div key={attachment.id} className="relative group">
                    {attachment.thumbnail ? (
                      <div className="w-12 h-12 rounded overflow-hidden bg-muted">
                        <img 
                          src={attachment.thumbnail} 
                          alt={attachment.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-xs">
                        {attachment.name.split('.').pop()?.toUpperCase()}
                      </div>
                    )}
                    <button 
                      className="absolute -top-1 -right-1 bg-white rounded-full shadow w-5 h-5 flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100"
                      onClick={() => setCardData({
                        ...cardData,
                        attachments: cardData.attachments?.filter(a => a.id !== attachment.id)
                      })}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {(!cardData.attachments || cardData.attachments.length === 0) && (
                  <div className="text-sm text-muted-foreground py-1">
                    Nenhum anexo
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <select
                value={cardData.status}
                onChange={(e) => setCardData({ 
                  ...cardData, 
                  status: e.target.value as "pending" | "completed" 
                })}
                className="w-full border rounded px-3 py-1"
              >
                <option value="pending">Pendente</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => archiveItem(card.id, "card")}
              >
                <Archive size={16} className="mr-1" /> Arquivar
              </Button>
              
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 size={16} className="mr-1" /> Excluir
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir cartão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o cartão "{card.title}"? Esta ação não pode ser desfeita.
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
