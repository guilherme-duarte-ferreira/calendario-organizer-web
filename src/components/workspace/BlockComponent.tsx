import { useState, useEffect, useRef, useCallback } from "react";
import { useCalendario } from "@/contexts/CalendarioContext";
import { Button } from "@/components/ui/button";
import { Block } from "@/types/calendario";
import { 
  MoreVertical,
  FileText,
  Plus,
  ListTodo,
  Table2,
  GripVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MarkdownItem from "./MarkdownItem";
import CardItem from "./CardItem";
import FileItemComponent from "./FileItemComponent";
import SpreadsheetItem from "./SpreadsheetItem";
import SpreadsheetDialog from "@/components/dialogs/SpreadsheetDialog";
import { toast } from "sonner";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface BlockComponentProps {
  block: Block;
}

export default function BlockComponent({ block }: BlockComponentProps) {
  const { 
    currentBoardId, 
    updateBlock,
    deleteBlock,
    createCard, 
    createMarkdownNote,
    createSpreadsheet,
    createFileItem
  } = useCalendario();
  
  const [editing, setEditing] = useState(false);
  const [blockName, setBlockName] = useState(block.name);
  const [showSpreadsheetDialog, setShowSpreadsheetDialog] = useState(false);
  const [newSpreadsheetId, setNewSpreadsheetId] = useState<string | null>(null);
  
  // Refs for dynamic height calculation without animation
  const contentRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  
  // Setup sortable functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });
  
  // Separate dndStyle from other styles for clarity
  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : "none",
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.8 : 1,
  };
  
  // Function to recalculate block height based on content - without animation
  const recalculateHeight = () => {
    if (contentRef.current && blockRef.current) {
      if (blockRef.current) {
        blockRef.current.style.setProperty('transition', 'none', 'important');
      }
      
      const headerHeight = 40;
      const footerHeight = 60;
      const padding = 32;
      
      const contentHeight = contentRef.current.scrollHeight;
      const newHeight = headerHeight + contentHeight + footerHeight + padding;
      
      if (blockRef.current) {
        blockRef.current.style.height = `${Math.max(200, newHeight)}px`;
      }
    }
  };
  
  // Recalculate height when content changes
  useEffect(() => {
    if (blockRef.current) {
      blockRef.current.style.setProperty('transition', 'none', 'important');
    }
    
    recalculateHeight();
    
    const resizeObserver = new ResizeObserver(() => {
      if (blockRef.current) {
        blockRef.current.style.setProperty('transition', 'none', 'important');
      }
      recalculateHeight();
    });
    
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [block.items]);
  
  useEffect(() => {
    if (blockRef.current) {
      blockRef.current.style.setProperty('transition', 'none', 'important');
    }
    
    recalculateHeight();
    
    const handleResize = () => {
      if (blockRef.current) {
        blockRef.current.style.setProperty('transition', 'none', 'important');
      }
      recalculateHeight();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const handleUpdateName = () => {
    if (blockName.trim() !== "") {
      updateBlock({ ...block, name: blockName });
      setEditing(false);
    }
  };
  
  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja deletar o bloco "${block.name}"?`)) {
      deleteBlock(block.id);
      toast.success("Bloco deletado com sucesso");
    }
  };

  const handleCreateMarkdown = () => {
    if (currentBoardId) {
      createMarkdownNote(block.id, "Novo texto markdown");
      if (blockRef.current) {
        blockRef.current.style.transition = "none";
      }
      recalculateHeight();
    }
  };

  const handleCreateCard = () => {
    if (currentBoardId) {
      createCard(block.id, "Novo cartão");
      if (blockRef.current) {
        blockRef.current.style.transition = "none";
      }
      recalculateHeight();
    }
  };

  const handleCreateSpreadsheet = () => {
    if (currentBoardId) {
      const newSpreadsheet = createSpreadsheet(block.id, "Nova planilha");
      setNewSpreadsheetId(newSpreadsheet.id);
      setShowSpreadsheetDialog(true);
      if (blockRef.current) {
        blockRef.current.style.transition = "none";
      }
      recalculateHeight();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      createFileItem(block.id, e.target.files[0]);
      if (blockRef.current) {
        blockRef.current.style.transition = "none";
      }
      recalculateHeight();
    }
  };

  const newSpreadsheet = newSpreadsheetId ? 
    block.items.find(item => item.id === newSpreadsheetId && item.type === 'spreadsheet') as any :
    null;
  
  return (
    <>
      <div 
        ref={(node) => {
          setNodeRef(node);
          if (node) {
            blockRef.current = node as HTMLDivElement;
            node.style.setProperty('transition', 'none', 'important');
          }
        }}
        id={`block-${block.id}`}
        className={`bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm min-w-[280px] max-w-[280px] flex flex-col ${
          isDragging ? 'shadow-lg border-2 border-blue-500' : ''
        }`}
        style={{ 
          ...dndStyle,
          minHeight: '200px',
          height: 'auto',
          transitionProperty: isDragging ? undefined : 'none',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div {...attributes} {...listeners}>
              <GripVertical size={16} className="mr-2 cursor-grab text-muted-foreground" />
            </div>
            {editing ? (
              <input
                type="text"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
                onBlur={handleUpdateName}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                className="border-none bg-transparent outline-none focus:ring-1 focus:ring-blue-500 rounded p-1 flex-1 font-medium"
                autoFocus
              />
            ) : (
              <h3 
                className="font-medium truncate cursor-pointer flex-1" 
                onClick={() => setEditing(true)}
                title={block.name}
              >
                {block.name}
              </h3>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Opções</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditing(true)}>
                Renomear
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCreateMarkdown}>
                Inserir texto Markdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => document.getElementById(`file-upload-${block.id}`)?.click()}>
                Inserir Arquivo
                <input 
                  type="file" 
                  id={`file-upload-${block.id}`} 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div 
          ref={contentRef}
          className="flex-1 overflow-visible"
          style={{ transition: "none" }}
        >
          {block.items.length === 0 && (
            <div className="flex items-center justify-center h-20">
              <p className="text-muted-foreground text-sm">Vazio</p>
            </div>
          )}
          
          <div className="space-y-2" style={{ transition: "none" }}>
            {block.items.map((item) => {
              switch (item.type) {
                case 'markdown':
                  return <MarkdownItem key={item.id} markdownNote={item} onResize={recalculateHeight} />;
                case 'card':
                  return <CardItem key={item.id} card={item} onResize={recalculateHeight} />;
                case 'spreadsheet':
                  return <SpreadsheetItem key={item.id} spreadsheet={item} />;
                case 'file':
                  return <FileItemComponent key={item.id} fileItem={item} />;
                default:
                  return null;
              }
            })}
          </div>
        </div>
        
        <div className="mt-3 flex gap-2 justify-center border-t pt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleCreateCard}
          >
            <ListTodo size={14} className="mr-1" />
            Cartão
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
            onClick={handleCreateMarkdown}
          >
            <FileText size={14} className="mr-1" />
            Texto
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1" 
            onClick={handleCreateSpreadsheet}
          >
            <Table2 size={14} className="mr-1" />
            Planilha
          </Button>
        </div>
      </div>

      {/* Modal para nova planilha */}
      {newSpreadsheet && (
        <SpreadsheetDialog
          spreadsheet={newSpreadsheet}
          isOpen={showSpreadsheetDialog}
          onClose={() => {
            setShowSpreadsheetDialog(false);
            setNewSpreadsheetId(null);
          }}
          blockName={block.name}
        />
      )}
    </>
  );
}
