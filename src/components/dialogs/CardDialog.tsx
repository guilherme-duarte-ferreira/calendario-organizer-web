import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import BaseDialog from "./BaseDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Tag, 
  CheckSquare, 
  Clock, 
  Paperclip, 
  ArrowRight, 
  Copy, 
  Archive, 
  Share,
  Bold,
  Italic,
  List,
  Link,
  Image,
  Plus,
  MoreHorizontal,
  X,
  FileText,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import EtiquetaPopup from "./popups/EtiquetaPopup";
import DataPopup from "./popups/DataPopup";
import ChecklistPopup from "./popups/ChecklistPopup";
import MoverPopup from "./popups/MoverPopup";
import LocalizacaoCartao from "./popups/LocalizacaoCartao";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EtiquetaPopupContent from "./popups/EtiquetaPopupContent";
import DataPopupContent from "./popups/DataPopupContent";
import CapaPopupContent from "./popups/CapaPopupContent";
import CapaPopup from "./popups/CapaPopup";

interface CardDialogProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  blockName?: string;
}

interface Etiqueta {
  id: string;
  name: string;
  color: string;
}

interface ChecklistItemLocal {
  id: string;
  text: string;
  completed: boolean;
}

interface ChecklistLocal {
  id: string;
  title: string;
  items: ChecklistItemLocal[];
}

export default function CardDialog({ card, isOpen, onClose, blockName }: CardDialogProps) {
  const { updateItem, deleteItem, boards } = useCalendario();
  
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [status, setStatus] = useState(card.status);
  const [checklistItems, setChecklistItems] = useState(card.checklist || []);
  const [checklists, setChecklists] = useState<ChecklistLocal[]>([]);
  const [attachments, setAttachments] = useState(card.attachments || []);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showActivityDetails, setShowActivityDetails] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  
  // Sistema de controle de foco exclusivo para pop-ups
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null);
  
  // Estados para funcionalidades
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([
    { id: "1", name: "Urgente", color: "#ef4444" },
    { id: "2", name: "Importante", color: "#f97316" },
    { id: "3", name: "Bug", color: "#dc2626" },
    { id: "4", name: "Feature", color: "#16a34a" }
  ]);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState<string[]>(card.etiquetas || []);
  const [dueDate, setDueDate] = useState<Date | null>(card.dueDate ? new Date(card.dueDate) : null);
  const [reminderDate, setReminderDate] = useState<Date | null>(card.reminderDate ? new Date(card.reminderDate) : null);
  const [capa, setCapa] = useState<string | undefined>(card.capa);
  const [capaColor, setCapaColor] = useState<string | undefined>(card.capaColor);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para abrir um pop-up e salvar o elemento que tinha foco
  const openPopup = (popupName: string, triggerElement?: HTMLElement) => {
    if (document.activeElement && document.activeElement !== document.body) {
      setLastFocusedElement(document.activeElement as HTMLElement);
    } else if (triggerElement) {
      setLastFocusedElement(triggerElement);
    }
    setActivePopup(popupName);
  };

  // Função para fechar o pop-up ativo e restaurar o foco
  const closeActivePopup = () => {
    setActivePopup(null);
    // Atraso pequeno para garantir que o DOM atualizou antes de tentar focar
    setTimeout(() => {
      if (lastFocusedElement && document.body.contains(lastFocusedElement)) {
        lastFocusedElement.focus();
      }
      setLastFocusedElement(null);
    }, 0);
  };

  // Função para lidar com o fechamento do modal
  const handleModalClose = () => {
    if (activePopup) {
      closeActivePopup();
    } else {
      onClose();
    }
  };

  // Função para lidar com interações fora do modal
  const handleDialogInteractOutside = (event: Event) => {
    if (activePopup) {
      event.preventDefault();
      closeActivePopup();
    }
  };

  // Função para lidar com cliques dentro do modal
  const handleModalClick = (event: React.MouseEvent) => {
    if (activePopup) {
      // Verifica se o clique foi fora do pop-up ativo
      const popupElement = document.querySelector(`[data-popup="${activePopup}"]`);
      if (popupElement && !popupElement.contains(event.target as Node)) {
        event.preventDefault();
        closeActivePopup();
      }
    }
  };

  // Efeito para lidar com a tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activePopup) {
          event.stopPropagation();
          closeActivePopup();
        } else if (isOpen) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePopup, isOpen, onClose]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    setIsSaving(true);
    try {
      const updatedCard: Card = {
        ...card,
        title: title.trim(),
        description: description.trim(),
        status,
        checklist: checklistItems,
        attachments,
        etiquetas: selectedEtiquetas,
        dueDate: dueDate?.toISOString(),
        reminderDate: reminderDate?.toISOString(),
        capa: capaColor ? undefined : capa,
        capaColor: capaColor,
        updatedAt: new Date().toISOString(),
      };

      updateItem(updatedCard);
      toast.success("Cartão salvo com sucesso!");
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar cartão");
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = () => {
    const updatedCard: Card = {
      ...card,
      archived: true,
      updatedAt: new Date().toISOString(),
    };
    updateItem(updatedCard);
    toast.success("Cartão arquivado!");
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o cartão "${card.title}"?`)) {
      deleteItem(card.id, "card");
      toast.success("Cartão excluído!");
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newAttachment = {
        id: Date.now().toString(),
        name: file.name,
        fileType: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file),
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      };
      setAttachments([...attachments, newAttachment]);
      toast.success(`Arquivo "${file.name}" adicionado!`);
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(attachments.filter(att => att.id !== attachmentId));
    toast.success("Anexo removido!");
  };

  const handleCreateEtiqueta = (name: string, color: string) => {
    const newEtiqueta: Etiqueta = {
      id: Date.now().toString(),
      name,
      color
    };
    setEtiquetas(prev => [...prev, newEtiqueta]);
    setSelectedEtiquetas(prev => [...prev, newEtiqueta.id]);
    toast.success(`Etiqueta "${name}" criada!`);
    closeActivePopup();
  };

  const handleSetDate = (date: Date | null, type: 'due' | 'reminder') => {
    if (type === 'due') {
      setDueDate(date);
    } else {
      setReminderDate(date);
    }
    toast.success(date ? "Data definida!" : "Data removida!");
    closeActivePopup();
  };

  const handleSetCapa = (imageUrl: string) => {
    setCapa(imageUrl);
    setCapaColor(undefined);
    toast.success("Capa definida!");
    closeActivePopup();
  };

  const handleSetCapaColor = (color: string) => {
    setCapaColor(color);
    setCapa(undefined);
    toast.success("Cor da capa definida!");
    closeActivePopup();
  };

  const handleRemoveCapa = () => {
    setCapa(undefined);
    setCapaColor(undefined);
    toast.success("Capa removida!");
    closeActivePopup();
  };

  const handleUpdateChecklists = (newChecklists: ChecklistLocal[]) => {
    setChecklists(newChecklists);
    // Converter checklists para o formato do card
    const allItems: ChecklistItemLocal[] = newChecklists.flatMap(checklist => 
      checklist.items.map(item => ({
        id: item.id,
        text: `${checklist.title}: ${item.text}`,
        completed: item.completed
      }))
    );
    setChecklistItems(allItems);
    closeActivePopup();
  };

  const handleMoveCard = (boardId: string, blockId: string, position: number) => {
    const currentItem = boards.flatMap(b => b.blocks).flatMap(bl => bl.items).find(it => it.id === card.id);
    if (currentItem) {
      const updatedItem = { ...currentItem, blockId, order: position, updatedAt: new Date().toISOString() };
      updateItem(updatedItem);
      toast.success("Cartão movido!");
    }
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;

    const newItem: ChecklistItemLocal = {
      id: Date.now().toString(),
      text: newChecklistItem.trim(),
      completed: false
    };

    setChecklistItems([...checklistItems, newItem]);
    setNewChecklistItem("");
    toast.success("Item adicionado ao checklist!");
  };

  const toggleChecklistItem = (itemId: string) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const removeChecklistItem = (itemId: string) => {
    setChecklistItems(prev => prev.filter(item => item.id !== itemId));
    toast.success("Item removido!");
  };

  const getChecklistProgress = () => {
    if (checklistItems.length === 0) return 0;
    return (checklistItems.filter(item => item.completed).length / checklistItems.length) * 100;
  };

  const formatText = (format: string) => {
    const textarea = descriptionRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end);
    
    let formattedText = selectedText;
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'list':
        formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        break;
    }

    const newDescription = description.substring(0, start) + formattedText + description.substring(end);
    setDescription(newDescription);
  };

  const handleSelectEtiqueta = (etiquetaId: string) => {
    setSelectedEtiquetas(prev => 
      prev.includes(etiquetaId) 
        ? prev.filter(id => id !== etiquetaId)
        : [...prev, etiquetaId]
    );
  };

  const sidebarContent = (
    <div className="space-y-2">
      <div className="relative">
        <Popover open={activePopup === 'etiquetas'} onOpenChange={(open) => setActivePopup(open ? 'etiquetas' : null)}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              <Tag size={14} className="mr-2" />
              Etiquetas
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <EtiquetaPopupContent
              etiquetas={etiquetas}
              selectedEtiquetas={selectedEtiquetas}
              onToggleEtiqueta={handleSelectEtiqueta}
              onCreateEtiqueta={handleCreateEtiqueta}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="relative">
        <Popover open={activePopup === 'checklist'} onOpenChange={(open) => setActivePopup(open ? 'checklist' : null)}>
          <PopoverTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full justify-start"
              onClick={(e) => {
                e.stopPropagation();
                openPopup('checklist', e.currentTarget as HTMLElement);
              }}
            >
              <CheckSquare size={16} className="mr-2" />
              Checklist
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-80" align="start" data-popup="checklist">
            <ChecklistPopup
              checklists={checklists}
              onUpdateChecklists={handleUpdateChecklists}
              onClosePopup={closeActivePopup}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="relative">
        <Popover open={activePopup === 'datas'} onOpenChange={(open) => setActivePopup(open ? 'datas' : null)}>
          <PopoverTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full justify-start"
              onClick={(e) => {
                e.stopPropagation();
                openPopup('datas', e.currentTarget as HTMLElement);
              }}
            >
              <Clock size={16} className="mr-2" />
              Datas
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-80" align="start" data-popup="datas">
            <DataPopupContent
              onClosePopup={closeActivePopup}
              onSetDate={handleSetDate}
              dueDate={dueDate}
              reminderDate={reminderDate}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full justify-start"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        <Paperclip size={16} className="mr-2" />
        Anexo
      </Button>

      <div className="relative">
        <Popover open={activePopup === 'capa'} onOpenChange={(open) => setActivePopup(open ? 'capa' : null)}>
          <PopoverTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full justify-start"
              onClick={(e) => {
                e.stopPropagation();
                openPopup('capa', e.currentTarget as HTMLElement);
              }}
            >
              <ImageIcon size={16} className="mr-2" />
              Capa
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-80" align="start" data-popup="capa">
            <CapaPopup
              onClosePopup={closeActivePopup}
              onSetCapa={handleSetCapa}
              onSetCapaColor={handleSetCapaColor}
              onRemoveCapa={handleRemoveCapa}
              currentCapa={capa}
              currentCapaColor={capaColor}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Separator className="my-4" />
      
      <div className="relative">
        <Popover open={activePopup === 'moverAction'} onOpenChange={(open) => setActivePopup(open ? 'moverAction' : null)}>
          <PopoverTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full justify-start"
              onClick={(e) => {
                e.stopPropagation();
                openPopup('moverAction', e.currentTarget as HTMLElement);
              }}
            >
              <ArrowRight size={16} className="mr-2" />
              Mover
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-80" align="start" data-popup="moverAction">
            <MoverPopup
              onClosePopup={closeActivePopup}
              onMove={handleMoveCard}
              currentBoardId={boards.find(b => b.blocks.some(block => block.items.some(item => item.id === card.id)))?.id}
              currentBlockId={boards.flatMap(b => b.blocks).find(block => block.items.some(item => item.id === card.id))?.id}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full justify-start"
        onClick={(e) => e.stopPropagation()}
      >
        <Copy size={16} className="mr-2" />
        Copiar
      </Button>
      
      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full justify-start"
        onClick={(e) => e.stopPropagation()}
      >
        <Share size={16} className="mr-2" />
        Compartilhar
      </Button>
      
      <Separator className="my-4" />
      
      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full justify-start"
        onClick={(e) => {
          e.stopPropagation();
          handleArchive();
        }}
      >
        <Archive size={16} className="mr-2" />
        Arquivar
      </Button>
    </div>
  );

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={handleModalClose}
      onInteractOutside={handleDialogInteractOutside}
      title={title || "Novo Cartão"}
      location={blockName}
      onLocationClick={() => openPopup('localizacao', document.activeElement as HTMLElement)}
      onSave={handleSave}
      onArchive={handleArchive}
      onDelete={handleDelete}
      isMaximized={isMaximized}
      onToggleMaximize={() => setIsMaximized(!isMaximized)}
      isSaving={isSaving}
      sidebarContent={sidebarContent}
      capa={capa}
      capaColor={capaColor}
    >
      <div className="space-y-6" onClick={handleModalClick}>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          multiple
        />

        {/* Localização */}
        {activePopup === 'localizacao' && (
          <LocalizacaoCartao
            isOpen={true}
            onClose={closeActivePopup}
            cardId={card.id}
            onMover={() => {
              closeActivePopup();
              const moverButton = document.querySelector<HTMLElement>('[aria-label="Mover"]');
              openPopup('moverAction', moverButton || undefined);
            }}
          />
        )}

        {/* Título */}
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do cartão..."
            className="text-lg font-semibold border-0 px-0 focus-visible:ring-0"
          />
        </div>

        {/* Etiquetas */}
        {selectedEtiquetas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedEtiquetas.map(etiquetaId => {
              const etiqueta = etiquetas.find(e => e.id === etiquetaId);
              if (!etiqueta) return null;
              return (
                <Badge 
                  key={etiquetaId}
                  variant="default"
                  className="text-white text-xs"
                  style={{ backgroundColor: etiqueta.color }}
                >
                  {etiqueta.name}
                </Badge>
              );
            })}
          </div>
        )}

        {/* Datas */}
        {(dueDate || reminderDate) && (
          <div className="flex flex-wrap gap-2">
            {dueDate && (
              <Badge 
                key="dueDate"
                variant="destructive" 
                className="text-xs"
              >
                <Clock size={12} className="mr-1" />
                Vencimento: {dueDate.toLocaleDateString()}
              </Badge>
            )}
            {reminderDate && (
              <Badge 
                key="reminderDate"
                variant="secondary" 
                className="text-xs"
              >
                <Clock size={12} className="mr-1" />
                Lembrete: {reminderDate.toLocaleDateString()}
              </Badge>
            )}
          </div>
        )}

        {/* Descrição */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <List size={16} />
            <h3 className="font-semibold text-sm">Descrição</h3>
          </div>
          
          <div className="border rounded-md">
            <div className="flex items-center gap-2 border-b px-3 py-2 text-sm">
              <Button variant="ghost" size="sm" className="h-6 px-1 text-xs">
                Aa ▼
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-1 font-bold text-xs"
                onClick={() => formatText('bold')}
              >
                <Bold size={12} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-1 italic text-xs"
                onClick={() => formatText('italic')}
              >
                <Italic size={12} />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 px-1 text-xs">
                <MoreHorizontal size={12} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-1 text-xs"
                onClick={() => formatText('list')}
              >
                <List size={12} />
                ▼
              </Button>
              <Button variant="ghost" size="sm" className="h-6 px-1 text-xs">
                <Link size={12} />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 px-1 text-xs">
                <Image size={12} />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 px-1 text-xs">
                <Plus size={12} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-1 text-xs ml-auto"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={12} />
              </Button>
            </div>
            
            <Textarea
              ref={descriptionRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Precisa de ajuda com a formatação? Digite /help."
              className="border-0 resize-none min-h-[200px] focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Anexos */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Paperclip size={16} />
              <h3 className="font-semibold text-sm">Anexos</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="relative group border rounded-md p-2">
                  {attachment.fileType === 'image' && attachment.thumbnail ? (
                    <div className="aspect-video bg-muted rounded overflow-hidden">
                      <img 
                        src={attachment.thumbnail} 
                        alt={attachment.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded flex items-center justify-center">
                      <FileText size={24} className="text-muted-foreground" />
                    </div>
                  )}
                  <p className="text-xs mt-1 truncate">{attachment.name}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checklist */}
        {checklistItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare size={16} />
                <h3 className="font-semibold text-sm">Checklist</h3>
                <div className="text-xs text-muted-foreground">
                  {checklistItems.filter(item => item.completed).length}/{checklistItems.length}
                </div>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(getChecklistProgress())}% concluído</span>
              </div>
              <Progress value={getChecklistProgress()} className="h-2" />
            </div>

            {/* Adicionar Item */}
            <div className="flex gap-2">
              <Input
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Adicionar item..."
                className="text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addChecklistItem();
                  }
                }}
              />
              <Button 
                size="sm" 
                onClick={addChecklistItem}
                disabled={!newChecklistItem.trim()}
              >
                <Plus size={14} className="mr-1" />
                Adicionar
              </Button>
            </div>
            
            {/* Lista de Itens */}
            <div className="space-y-2">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleChecklistItem(item.id)}
                  />
                  <span className={`text-sm flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {item.text}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal size={12} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onClick={() => removeChecklistItem(item.id)}
                      >
                        <Trash2 size={12} className="mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Atividade */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <List size={16} />
              <h3 className="font-semibold text-sm">Atividade</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActivityDetails(!showActivityDetails)}
              className="text-xs"
            >
              {showActivityDetails ? (
                <>
                  <ChevronUp size={14} className="mr-1" />
                  Ocultar Detalhes
                </>
              ) : (
                <>
                  <ChevronDown size={14} className="mr-1" />
                  Mostrar Detalhes
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escrever um comentário..."
              className="border-0 bg-transparent focus-visible:ring-0"
            />
          </div>
          
          {showActivityDetails && (
            <div className="space-y-2">
              <div className="flex items-start gap-3 bg-muted rounded-md px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 mt-1"></div>
                <div>
                  <p className="text-sm">
                    <strong>Sistema</strong> criou este cartão
                    <br />
                    <span className="text-xs text-muted-foreground">há poucos minutos</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseDialog>
  );
}
