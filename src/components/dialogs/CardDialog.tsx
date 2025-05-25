
import React, { useState, useRef } from "react";
import { Card } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import BaseDialog from "./BaseDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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
  ImageIcon
} from "lucide-react";
import { toast } from "sonner";

interface CardDialogProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  blockName?: string;
}

export default function CardDialog({ card, isOpen, onClose, blockName }: CardDialogProps) {
  const { updateItem, deleteItem, createFileItem } = useCalendario();
  
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [status, setStatus] = useState(card.status);
  const [checklist, setChecklist] = useState(card.checklist || []);
  const [attachments, setAttachments] = useState(card.attachments || []);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newComment, setNewComment] = useState("");

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
        checklist,
        attachments,
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

  const addChecklistItem = () => {
    const newItem = {
      id: Date.now().toString(),
      text: "",
      completed: false
    };
    setChecklist([...checklist, newItem]);
  };

  const updateChecklistItem = (id: string, updates: Partial<{ text: string; completed: boolean }>) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
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
      <Button variant="secondary" size="sm" className="w-full justify-start">
        <Tag size={16} className="mr-2" />
        Etiquetas
      </Button>
      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full justify-start"
        onClick={addChecklistItem}
      >
        <CheckSquare size={16} className="mr-2" />
        Checklist
      </Button>
      <Button variant="secondary" size="sm" className="w-full justify-start">
        <Clock size={16} className="mr-2" />
        Datas
      </Button>
      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full justify-start"
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip size={16} className="mr-2" />
        Anexo
      </Button>
      
      <Separator className="my-4" />
      
      <Button variant="secondary" size="sm" className="w-full justify-start">
        <ArrowRight size={16} className="mr-2" />
        Mover
      </Button>
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
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title || "Novo Cartão"}
      location={blockName || "A FAZER"}
      onSave={handleSave}
      onArchive={handleArchive}
      onDelete={handleDelete}
      isMaximized={isMaximized}
      onToggleMaximize={() => setIsMaximized(!isMaximized)}
      isSaving={isSaving}
      sidebarContent={sidebarContent}
    >
      <div className="space-y-6">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
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

        {/* Descrição */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <List size={16} />
            <h3 className="font-semibold text-sm">Descrição</h3>
          </div>
          
          <div className="border rounded-md">
            {/* Barra de formatação */}
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
              <Button variant="ghost" size="sm" className="h-6 px-1 text-xs">
                M+
              </Button>
              <Button variant="ghost" size="sm" className="h-6 px-1 text-xs">
                ?
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
        {checklist.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckSquare size={16} />
              <h3 className="font-semibold text-sm">Checklist</h3>
            </div>
            
            <div className="space-y-2">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={(checked) => 
                      updateChecklistItem(item.id, { completed: !!checked })
                    }
                  />
                  <Input
                    value={item.text}
                    onChange={(e) => updateChecklistItem(item.id, { text: e.target.value })}
                    placeholder="Item do checklist..."
                    className="flex-1 text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeChecklistItem(item.id)}
                    className="text-muted-foreground"
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addChecklistItem}
                className="w-full"
              >
                <Plus size={14} className="mr-2" />
                Adicionar item
              </Button>
            </div>
          </div>
        )}

        {/* Atividade */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <List size={16} />
            <h3 className="font-semibold text-sm">Atividade</h3>
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
      </div>
    </BaseDialog>
  );
}
