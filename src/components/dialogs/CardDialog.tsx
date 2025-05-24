
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
  MoreHorizontal
} from "lucide-react";
import { toast } from "sonner";

interface CardDialogProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  blockName?: string;
}

export default function CardDialog({ card, isOpen, onClose, blockName }: CardDialogProps) {
  const { updateItem } = useCalendario();
  
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [status, setStatus] = useState(card.status);
  const [checklist, setChecklist] = useState(card.checklist || []);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newComment, setNewComment] = useState("");

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

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
    // Implementar arquivamento
    toast.info("Funcionalidade de arquivar será implementada");
  };

  const handleDelete = () => {
    // Implementar exclusão
    toast.info("Funcionalidade de excluir será implementada");
  };

  const handleHelp = () => {
    toast.info("Ajuda do Markdown: Use **negrito**, *itálico*, [links](url), ![imagens](url)");
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
      <Button variant="secondary" size="sm" className="w-full justify-start">
        <CheckSquare size={16} className="mr-2" />
        Checklist
      </Button>
      <Button variant="secondary" size="sm" className="w-full justify-start">
        <Clock size={16} className="mr-2" />
        Datas
      </Button>
      <Button variant="secondary" size="sm" className="w-full justify-start">
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
      onHelp={handleHelp}
      isMaximized={isMaximized}
      onToggleMaximize={() => setIsMaximized(!isMaximized)}
      isSaving={isSaving}
      sidebarContent={sidebarContent}
    >
      <div className="space-y-6">
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
              <Button variant="ghost" size="sm" className="h-6 px-1 text-xs ml-auto">
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
