import React, { useState, useRef } from "react";
import { Card } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import BaseDialog from "./BaseDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
  ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import EtiquetaPopup from "./popups/EtiquetaPopup";
import DataPopup from "./popups/DataPopup";
import CapaPopup from "./popups/CapaPopup";
import ChecklistPopup from "./popups/ChecklistPopup";
import MoverPopup from "./popups/MoverPopup";
import LocalizacaoCartao from "./popups/LocalizacaoCartao";

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

interface Checklist {
  id: string;
  title: string;
  items: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}

export default function CardDialog({ card, isOpen, onClose, blockName }: CardDialogProps) {
  const { updateItem, deleteItem, boards } = useCalendario();
  
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [status, setStatus] = useState(card.status);
  const [checklistItems, setChecklistItems] = useState(card.checklist || []);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [attachments, setAttachments] = useState(card.attachments || []);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showActivityDetails, setShowActivityDetails] = useState(false);
  
  // Estados dos popups
  const [showEtiquetaPopup, setShowEtiquetaPopup] = useState(false);
  const [showDataPopup, setShowDataPopup] = useState(false);
  const [showCapaPopup, setShowCapaPopup] = useState(false);
  const [showChecklistPopup, setShowChecklistPopup] = useState(false);
  const [showMoverPopup, setShowMoverPopup] = useState(false);
  const [showLocalizacaoPopup, setShowLocalizacaoPopup] = useState(false);
  
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

  const handleToggleEtiqueta = (etiquetaId: string) => {
    setSelectedEtiquetas(prev => 
      prev.includes(etiquetaId) 
        ? prev.filter(id => id !== etiquetaId)
        : [...prev, etiquetaId]
    );
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
  };

  const handleSetDate = (date: Date | null, type: 'due' | 'reminder') => {
    if (type === 'due') {
      setDueDate(date);
    } else {
      setReminderDate(date);
    }
    toast.success(date ? "Data definida!" : "Data removida!");
  };

  const handleSetCapa = (imageUrl: string) => {
    setCapa(imageUrl);
    setCapaColor(undefined); // Remove cor se definir imagem
    toast.success("Capa definida!");
  };

  const handleSetCapaColor = (color: string) => {
    setCapaColor(color);
    setCapa(undefined); // Remove imagem se definir cor
    toast.success("Cor da capa definida!");
  };

  const handleRemoveCapa = () => {
    setCapa(undefined);
    setCapaColor(undefined);
    toast.success("Capa removida!");
  };

  const handleMove = (boardId: string, blockId: string, position: number) => {
    // Implementar lógica de mover
    toast.success("Cartão movido!");
  };

  const handleLocationClick = () => {
    setShowLocalizacaoPopup(true);
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

  const sidebarContent = (
    <div className="space-y-2">
      <div className="relative">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full justify-start"
          onClick={() => setShowEtiquetaPopup(!showEtiquetaPopup)}
        >
          <Tag size={16} className="mr-2" />
          Etiquetas
        </Button>
        <EtiquetaPopup
          isOpen={showEtiquetaPopup}
          onClose={() => setShowEtiquetaPopup(false)}
          etiquetas={etiquetas}
          selectedEtiquetas={selectedEtiquetas}
          onToggleEtiqueta={(etiquetaId: string) => {
            setSelectedEtiquetas(prev => 
              prev.includes(etiquetaId) 
                ? prev.filter(id => id !== etiquetaId)
                : [...prev, etiquetaId]
            );
          }}
          onCreateEtiqueta={(name: string, color: string) => {
            const newEtiqueta: Etiqueta = {
              id: Date.now().toString(),
              name,
              color
            };
            setEtiquetas(prev => [...prev, newEtiqueta]);
            setSelectedEtiquetas(prev => [...prev, newEtiqueta.id]);
            toast.success(`Etiqueta "${name}" criada!`);
          }}
        />
      </div>
      
      <div className="relative">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full justify-start"
          onClick={() => setShowChecklistPopup(!showChecklistPopup)}
        >
          <CheckSquare size={16} className="mr-2" />
          Checklist
        </Button>
        <ChecklistPopup
          isOpen={showChecklistPopup}
          onClose={() => setShowChecklistPopup(false)}
          checklists={checklists}
          onUpdateChecklists={setChecklists}
        />
      </div>
      
      <div className="relative">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full justify-start"
          onClick={() => setShowDataPopup(!showDataPopup)}
        >
          <Clock size={16} className="mr-2" />
          Datas
        </Button>
        <DataPopup
          isOpen={showDataPopup}
          onClose={() => setShowDataPopup(false)}
          onSetDate={(date: Date | null, type: 'due' | 'reminder') => {
            if (type === 'due') {
              setDueDate(date);
            } else {
              setReminderDate(date);
            }
            toast.success(date ? "Data definida!" : "Data removida!");
          }}
          dueDate={dueDate}
          reminderDate={reminderDate}
        />
      </div>
      
      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full justify-start"
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip size={16} className="mr-2" />
        Anexo
      </Button>

      <div className="relative">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full justify-start"
          onClick={() => setShowCapaPopup(!showCapaPopup)}
        >
          <ImageIcon size={16} className="mr-2" />
          Capa
        </Button>
        <CapaPopup
          isOpen={showCapaPopup}
          onClose={() => setShowCapaPopup(false)}
          onSetCapa={handleSetCapa}
          onSetCapaColor={handleSetCapaColor}
          onRemoveCapa={handleRemoveCapa}
          currentCapa={capa}
          currentCapaColor={capaColor}
        />
      </div>
      
      <Separator className="my-4" />
      
      <div className="relative">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full justify-start"
          onClick={() => setShowMoverPopup(!showMoverPopup)}
        >
          <ArrowRight size={16} className="mr-2" />
          Mover
        </Button>
        <MoverPopup
          isOpen={showMoverPopup}
          onClose={() => setShowMoverPopup(false)}
          onMove={handleMove}
          currentBoardId={boards.find(b => b.blocks.some(block => block.items.some(item => item.id === card.id)))?.id}
          currentBlockId={boards.flatMap(b => b.blocks).find(block => block.items.some(item => item.id === card.id))?.id}
        />
      </div>
      
      <Button variant="secondary" size="sm" className="w-full justify-start">
        <Copy size={16} className="mr-2" />
        Copiar
      </Button>
      
      <Separator className="my-4" />
      
      <Button variant="secondary" size="sm" className="w-full justify-start">
        <Archive size={16} className="mr-2" />
        Arquivar
      </Button>
      <Button variant="secondary" size="sm" className="w-full justify-start">
        <Share size={16} className="mr-2" />
        Compartilhar
      </Button>
    </div>
  );

  return (
    <>
      <LocalizacaoCartao
        isOpen={showLocalizacaoPopup}
        onClose={() => setShowLocalizacaoPopup(false)}
        cardId={card.id}
        onMover={() => setShowMoverPopup(true)}
      />

      <BaseDialog
        isOpen={isOpen}
        onClose={onClose}
        title={title || "Novo Cartão"}
        location={blockName || "A FAZER"}
        onLocationClick={() => setShowLocalizacaoPopup(true)}
        onSave={handleSave}
        onArchive={() => {
          const updatedCard: Card = {
            ...card,
            archived: true,
            updatedAt: new Date().toISOString(),
          };
          updateItem(updatedCard);
          toast.success("Cartão arquivado!");
          onClose();
        }}
        onDelete={() => {
          if (window.confirm(`Tem certeza que deseja excluir o cartão "${card.title}"?`)) {
            deleteItem(card.id, "card");
            toast.success("Cartão excluído!");
            onClose();
          }
        }}
        isMaximized={isMaximized}
        onToggleMaximize={() => setIsMaximized(!isMaximized)}
        isSaving={isSaving}
        sidebarContent={sidebarContent}
        capa={capa}
        capaColor={capaColor}
      >
        <div className="space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
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
            }}
            multiple
          />

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
                    key={etiqueta.id} 
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
                <Badge variant="destructive" className="text-xs">
                  <Clock size={12} className="mr-1" />
                  Vencimento: {dueDate.toLocaleDateString()}
                </Badge>
              )}
              {reminderDate && (
                <Badge variant="secondary" className="text-xs">
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
                  onClick={() => {
                    const textarea = descriptionRef.current;
                    if (!textarea) return;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const selectedText = description.substring(start, end);
                    const formattedText = `**${selectedText}**`;
                    const newDescription = description.substring(0, start) + formattedText + description.substring(end);
                    setDescription(newDescription);
                  }}
                >
                  <Bold size={12} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-1 italic text-xs"
                  onClick={() => {
                    const textarea = descriptionRef.current;
                    if (!textarea) return;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const selectedText = description.substring(start, end);
                    const formattedText = `*${selectedText}*`;
                    const newDescription = description.substring(0, start) + formattedText + description.substring(end);
                    setDescription(newDescription);
                  }}
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
                  onClick={() => {
                    const textarea = descriptionRef.current;
                    if (!textarea) return;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const selectedText = description.substring(start, end);
                    const formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
                    const newDescription = description.substring(0, start) + formattedText + description.substring(end);
                    setDescription(newDescription);
                  }}
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
                      onClick={() => {
                        setAttachments(attachments.filter(att => att.id !== attachment.id));
                        toast.success("Anexo removido!");
                      }}
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
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckSquare size={16} />
                <h3 className="font-semibold text-sm">Checklist</h3>
                <div className="text-xs text-muted-foreground">
                  {checklistItems.filter(item => item.completed).length}/{checklistItems.length}
                </div>
              </div>
              
              <div className="space-y-2">
                {checklistItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={(checked) => {
                        const updatedChecklist = checklistItems.map(checkItem => 
                          checkItem.id === item.id ? { ...checkItem, completed: !!checked } : checkItem
                        );
                        setChecklistItems(updatedChecklist);
                      }}
                    />
                    <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {item.text || 'Item sem texto'}
                    </span>
                  </div>
                ))}
                {checklistItems.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    ... e mais {checklistItems.length - 3} itens
                  </p>
                )}
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
    </>
  );
}
