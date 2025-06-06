/**
 * @file CardDialog.tsx
 * @description Modal para visualização e edição detalhada de um "Card".
 * Responsável por gerenciar o estado do cartão (título, descrição, etiquetas, datas, capa, etc.)
 * e controlar a abertura/fechamento e funcionalidade de múltiplos sub-pop-ups de ação.
 * Utiliza BaseDialog para a estrutura visual e implementa a lógica específica do cartão.
 */

import React, { useState, useRef, useEffect } from "react";
import { Card, Board, Block, Spreadsheet, MarkdownNote, FileItem } from "@/types/calendario";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EtiquetaPopupContent from "./popups/EtiquetaPopupContent";
import DataPopupContent from "./popups/DataPopupContent";
import CapaPopup from "./popups/CapaPopup";
import TipTapEditor from "../ui/TipTapEditor";
import { Editor } from "@tiptap/react";

/**
 * Props necessárias para renderizar o CardDialog
 */
interface CardDialogProps {
  card: Card;              // Dados do cartão a ser editado
  isOpen: boolean;         // Controla a visibilidade do modal
  onClose: () => void;     // Função chamada ao fechar o modal
  blockName?: string;      // Nome do bloco onde o cartão está localizado
}

/**
 * Representa uma etiqueta que pode ser associada ao cartão
 */
interface Etiqueta {
  id: string;      // Identificador único da etiqueta
  name: string;    // Nome da etiqueta
  color: string;   // Cor da etiqueta em formato hexadecimal
}

/**
 * Representa um item individual de uma checklist
 */
interface ChecklistItemLocal {
  id: string;      // Identificador único do item
  text: string;    // Texto descritivo do item
  completed: boolean; // Estado de conclusão do item
}

/**
 * Representa uma checklist completa com título e lista de itens
 */
interface ChecklistLocal {
  id: string;              // Identificador único da checklist
  title: string;           // Título da checklist
  items: ChecklistItemLocal[]; // Lista de itens da checklist
}

export default function CardDialog({ card, isOpen, onClose, blockName: initialBlockName }: CardDialogProps) {
  const { updateItem, deleteItem, boards, updateBlocksOrder } = useCalendario();
  
  // === ESTADOS DO COMPONENTE ===
  // Estados para os dados do cartão (editáveis)
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
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  
  // --- Sistema de Controle de Pop-ups Aninhados ---
  // activePopup: Armazena a string identificadora do pop-up atualmente visível
  const [activePopup, setActivePopup] = useState<string | null>(null);
  // lastFocusedElement: Armazena o elemento DOM que disparou o último pop-up aberto
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
  const [currentBlockName, setCurrentBlockName] = useState(initialBlockName);
  // Estilos CSS calculados para posicionar o MoverPopup do cabeçalho
  const [moverHeaderPopoverStyle, setMoverHeaderPopoverStyle] = useState<React.CSSProperties>({});

  // Refs para elementos do DOM
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === FUNÇÕES DE CONTROLE DE POP-UP ===
  /**
   * Abre um pop-up especificado e salva o elemento que o disparou
   * @param popupName - A string chave que identifica o pop-up a ser aberto
   * @param triggerElement - O elemento HTML que disparou a abertura do pop-up
   */
  const openPopup = (popupName: string, triggerElement?: HTMLElement) => {
    if (document.activeElement && document.activeElement !== document.body) {
      setLastFocusedElement(document.activeElement as HTMLElement);
    } else if (triggerElement) {
      setLastFocusedElement(triggerElement);
    }
    setActivePopup(popupName);
  };

  /**
   * Fecha o pop-up atualmente ativo e restaura o foco
   */
  const closeActivePopup = () => {
    setActivePopup(null);
    setTimeout(() => {
      if (lastFocusedElement && document.body.contains(lastFocusedElement)) {
        lastFocusedElement.focus();
      }
      setLastFocusedElement(null);
    }, 0);
  };

  // === HANDLERS DE EVENTOS DO MODAL ===
  /**
   * Chamado quando o BaseDialog detecta uma tentativa de fechamento
   * Se um pop-up estiver ativo, fecha o pop-up. Caso contrário, fecha o modal principal
   */
  const handleModalClose = () => {
    if (activePopup) {
      closeActivePopup();
    } else {
      onClose();
    }
  };

  /**
   * Chamado quando ocorre um clique fora do conteúdo do Dialog
   * Usado para fechar o pop-up ativo, prevenindo o fechamento do modal principal
   */
  const handleDialogInteractOutside = (event: Event) => {
    if (activePopup) {
      event.preventDefault();
      closeActivePopup();
    }
  };

  /**
   * Chamado por cliques dentro da área principal do modal
   * Tenta fechar um pop-up ativo se o clique foi fora da área específica desse pop-up
   */
  const handleModalClick = (event: React.MouseEvent) => {
    if (activePopup) {
      const popupElement = document.querySelector(`[data-popup="${activePopup}"]`);
      if (popupElement && !popupElement.contains(event.target as Node)) {
        event.preventDefault();
        closeActivePopup();
      }
    }
  };

  // === EFEITOS (useEffect) ===
  /**
   * Efeito para lidar com a tecla Escape
   * Fecha o pop-up ativo ou o modal principal
   */
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

  /**
   * Atualiza o nome do bloco exibido no cabeçalho se o cartão for movido
   */
  useEffect(() => {
    let foundBlockName = initialBlockName;
    for (const board of boards) {
      const block = board.blocks.find(b => b.items.some(item => item.id === card.id));
      if (block) {
        foundBlockName = block.name;
        break;
      }
    }
    setCurrentBlockName(foundBlockName);
  }, [boards, card.id, initialBlockName]);

  /**
   * Calcula e define o estilo de posicionamento para o MoverPopup do cabeçalho
   * Disparado quando 'moverHeader' se torna o activePopup e lastFocusedElement está definido
   */
  useEffect(() => {
    if (activePopup === 'moverHeader' && lastFocusedElement) {
      const triggerRect = lastFocusedElement.getBoundingClientRect();
      const scrollY = window.scrollY;

      console.log("Calculando estilo para moverHeader. TriggerRect:", triggerRect);
      
      setMoverHeaderPopoverStyle({
        position: 'fixed',
        top: `${triggerRect.bottom + scrollY + 5}px`,
        left: `${triggerRect.left}px`,
        width: '320px',
        zIndex: 1300,
      });
    }
  }, [activePopup, lastFocusedElement]);

  // === HANDLERS DE AÇÕES PRINCIPAIS ===
  /**
   * Salva as alterações do cartão no estado global
   */
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

  /**
   * Arquivar o cartão atual
   */
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

  /**
   * Excluir o cartão atual após confirmação
   */
  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o cartão "${card.title}"?`)) {
      deleteItem(card.id, "card");
      toast.success("Cartão excluído!");
      onClose();
    }
  };

  // === HANDLERS PARA AÇÕES DOS POP-UPS ===
  /**
   * Manipula o upload de arquivos para o cartão
   * Cria um novo anexo com URL temporária e thumbnail (se for imagem)
   */
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

  /**
   * Remove um anexo específico do cartão
   */
  const removeAttachment = (attachmentId: string) => {
    setAttachments(attachments.filter(att => att.id !== attachmentId));
    toast.success("Anexo removido!");
  };

  /**
   * Cria uma nova etiqueta e a associa ao cartão
   */
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

  /**
   * Define ou remove uma data (vencimento ou lembrete) do cartão
   */
  const handleSetDate = (date: Date | null, type: 'due' | 'reminder') => {
    if (type === 'due') {
      setDueDate(date);
    } else {
      setReminderDate(date);
    }
    toast.success(date ? "Data definida!" : "Data removida!");
    closeActivePopup();
  };

  // Função para salvar o estado atual do cartão (usada pelas funções de capa)
  const saveCurrentCardState = (updates: Partial<Card>) => {
    const cardToUpdate: Card = {
      ...card,
      title,
      description,
      status,
      checklist: checklistItems,
      attachments,
      etiquetas: selectedEtiquetas,
      dueDate: dueDate?.toISOString(),
      reminderDate: reminderDate?.toISOString(),
      capa,
      capaColor,
      ...updates, // Aplica as atualizações específicas (ex: nova capa)
      updatedAt: new Date().toISOString(),
    };
    updateItem(cardToUpdate);
  };

  /**
   * Define uma imagem como capa do cartão
   */
  const handleSetCapa = (imageUrl: string) => {
    setCapa(imageUrl);
    setCapaColor(undefined);
    saveCurrentCardState({ capa: imageUrl, capaColor: undefined });
    toast.success("Capa definida!");
  };

  /**
   * Define uma cor como capa do cartão
   */
  const handleSetCapaColor = (color: string) => {
    setCapaColor(color);
    setCapa(undefined);
    saveCurrentCardState({ capaColor: color, capa: undefined });
    // O toast para esta ação é tratado no fechamento do CoresCapa.tsx
  };

  /**
   * Remove a capa (imagem ou cor) do cartão
   */
  const handleRemoveCapa = () => {
    setCapa(undefined);
    setCapaColor(undefined);
    saveCurrentCardState({ capa: undefined, capaColor: undefined });
    toast.success("Capa removida!");
  };

  /**
   * Atualiza as checklists do cartão com novos dados
   */
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

  /**
   * Move o cartão para um novo quadro, bloco e posição
   * Contém a lógica de encontrar origem, clonar dados, remover, adicionar e reordenar
   */
  const handleMoveCard = (targetBoardId: string, targetBlockId: string, newOrderInTarget: number) => {
    const cardToMoveId = card.id;
    const cardType = card.type; // 'card'

    let sourceBoard: Board | undefined;
    let sourceBlock: Block | undefined;
    let itemIndexInSourceBlock = -1;
    let originalItem: Card | Spreadsheet | MarkdownNote | FileItem | undefined;

    // 1. Encontrar o quadro e bloco de origem e o item
    for (const b of boards) {
      for (const bl of b.blocks) {
        const index = bl.items.findIndex(it => it.id === cardToMoveId);
        if (index !== -1) {
          sourceBoard = b;
          sourceBlock = bl;
          itemIndexInSourceBlock = index;
          originalItem = bl.items[index];
          break;
        }
      }
      if (sourceBoard) break;
    }

    if (!sourceBoard || !sourceBlock || !originalItem) {
      toast.error("Erro ao localizar o cartão de origem.");
      return;
    }

    const targetBoard = boards.find(b => b.id === targetBoardId);
    if (!targetBoard) {
      toast.error("Quadro de destino não encontrado.");
      return;
    }
    const targetBlock = targetBoard.blocks.find(b => b.id === targetBlockId);
    if (!targetBlock) {
      toast.error("Bloco de destino não encontrado.");
      return;
    }

    // Se movendo para o mesmo bloco e mesma posição (newOrderInTarget é 0-indexado)
    if (sourceBlock.id === targetBlock.id && sourceBoard.id === targetBoard.id && itemIndexInSourceBlock === newOrderInTarget) {
      toast.info("O cartão já está na posição desejada.");
      return;
    }

    let newBoardsState = JSON.parse(JSON.stringify(boards)) as Board[]; // Deep clone para evitar mutação direta

    // 2. Remover o item do bloco de origem
    const srcBoardIndex = newBoardsState.findIndex(b => b.id === sourceBoard!.id);
    const srcBlockIndex = newBoardsState[srcBoardIndex].blocks.findIndex(b => b.id === sourceBlock!.id);
    const [movedItem] = newBoardsState[srcBoardIndex].blocks[srcBlockIndex].items.splice(itemIndexInSourceBlock, 1);

    // Reordenar itens no bloco de origem
    newBoardsState[srcBoardIndex].blocks[srcBlockIndex].items.forEach((it, idx) => {
      it.order = idx;
    });
    newBoardsState[srcBoardIndex].updatedAt = new Date().toISOString();

    // 3. Atualizar o item e adicionar ao bloco de destino
    movedItem.blockId = targetBlockId;
    movedItem.updatedAt = new Date().toISOString();

    const tgtBoardIndex = newBoardsState.findIndex(b => b.id === targetBoardId);
    const tgtBlockIndex = newBoardsState[tgtBoardIndex].blocks.findIndex(b => b.id === targetBlockId);
    
    // Garantir que newOrderInTarget está dentro dos limites
    const targetItemsCount = newBoardsState[tgtBoardIndex].blocks[tgtBlockIndex].items.length;
    const insertAtIndex = Math.max(0, Math.min(newOrderInTarget, targetItemsCount));
    
    newBoardsState[tgtBoardIndex].blocks[tgtBlockIndex].items.splice(insertAtIndex, 0, movedItem);

    // Reordenar itens no bloco de destino
    newBoardsState[tgtBoardIndex].blocks[tgtBlockIndex].items.forEach((it, idx) => {
      it.order = idx;
    });
    newBoardsState[tgtBoardIndex].updatedAt = new Date().toISOString();

    // 4. Atualizar o estado global dos quadros
    updateBlocksOrder(newBoardsState);

    const itemTitle = movedItem.type === 'card' || movedItem.type === 'spreadsheet' 
      ? (movedItem as Card | Spreadsheet).title 
      : 'Item';
    
    toast.success(`${itemTitle} movido para "${targetBlock.name}" no quadro "${targetBoard.name}".`);
  };

  // Encontrar sourceBoard e sourceBlock para passar como props para MoverPopup
  let sourceBoard, sourceBlock;
  for (const b of boards) {
    const blk = b.blocks.find(block => block.items.some(item => item.id === card.id));
    if (blk) {
      sourceBoard = b;
      sourceBlock = blk;
      break;
    }
  }

  const handleSelectEtiqueta = (etiquetaId: string) => {
    setSelectedEtiquetas(prev => 
      prev.includes(etiquetaId) 
        ? prev.filter(id => id !== etiquetaId)
        : [...prev, etiquetaId]
    );
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

  const getChecklistProgress = () => {
    if (checklistItems.length === 0) return 0;
    return (checklistItems.filter(item => item.completed).length / checklistItems.length) * 100;
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
              currentBoardId={sourceBoard?.id}
              currentBlockId={sourceBlock?.id}
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

  /**
   * Handler para o clique no "botão variável" (nome do bloco) no cabeçalho
   * Abre diretamente o MoverPopup ('moverHeader'), passando o botão clicado como referência
   * para o cálculo de posicionamento
   */
  const handleLocationClick = () => {
    const triggerBtn = document.querySelector('[data-testid="location-trigger-button"]') as HTMLElement;
    if (triggerBtn) {
      console.log("Botão de localização clicado, abrindo moverHeader com trigger:", triggerBtn);
      openPopup('moverHeader', triggerBtn);
    } else {
      console.error("Botão de localização (location-trigger-button) não encontrado!");
      openPopup('moverHeader');
    }
  };

  const handleSaveDescription = (newContent: string) => {
    if (card.description !== newContent) {
        const updatedCard = { ...card, description: newContent, updatedAt: new Date().toISOString() };
        updateItem(updatedCard);
        setDescription(newContent);
        toast.success("Descrição salva!");
    }
    setIsEditingDescription(false);
  }

  const handleCancelDescription = () => {
    setDescription(card.description || "");
    setIsEditingDescription(false);
  }

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={handleModalClose}
      onInteractOutside={handleDialogInteractOutside}
      title={title || "Novo Cartão"}
      location={currentBlockName}
      onSave={handleSave}
      onArchive={handleArchive}
      onDelete={handleDelete}
      isMaximized={isMaximized}
      onToggleMaximize={() => setIsMaximized(!isMaximized)}
      showMaximize={true}
      isSaving={isSaving}
      sidebarContent={sidebarContent}
      capa={capa}
      capaColor={capaColor}
      onLocationClick={handleLocationClick}
    >
      <div className="space-y-6" onClick={handleModalClick}>
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
          <TipTapEditor
            content={description}
            onSave={handleSaveDescription}
            onCancel={handleCancelDescription}
            placeholder="Adicione uma descrição mais detalhada..."
          />
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

      {/* Popover para Mover Cartão (acionado pelo clique no nome do bloco no cabeçalho) */}
      {/* Este Popover usa o estilo manual para posicionamento */}
      <Popover 
        open={activePopup === 'moverHeader'} 
        onOpenChange={(open) => {
          if (!open) {
            closeActivePopup();
          } else {
            // Se está abrindo, e o trigger foi o botão de localização, recalcula o estilo
            if (lastFocusedElement && lastFocusedElement.dataset.testid === "location-trigger-button") {
              const triggerRect = lastFocusedElement.getBoundingClientRect();
              const scrollY = window.scrollY;
              setMoverHeaderPopoverStyle({
                position: 'fixed',
                top: `${triggerRect.bottom + scrollY + 5}px`,
                left: `${triggerRect.left}px`,
                width: '320px',
                zIndex: 1300,
              });
            }
            setActivePopup('moverHeader');
          }
        }}
      >
        <PopoverTrigger asChild> 
          <button style={{ display: 'none' }} aria-hidden="true" /> 
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 w-80"
          style={moverHeaderPopoverStyle}
          data-popup="moverHeader"
          onOpenAutoFocus={(e) => e.preventDefault()} 
          onPointerDownOutside={(e) => {
            if (lastFocusedElement && lastFocusedElement.contains(e.target as Node)) {
              e.preventDefault();
            }
          }}
        >
          <MoverPopup
            onClosePopup={closeActivePopup}
            onMove={handleMoveCard}
            currentBoardId={sourceBoard?.id}
            currentBlockId={sourceBlock?.id}
          />
        </PopoverContent>
      </Popover>
    </BaseDialog>
  );
}
