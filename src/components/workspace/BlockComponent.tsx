
import { useState, useRef } from "react";
import { Block, Card, Spreadsheet, MarkdownNote, FileItem, BaseItem } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import { useDragDrop } from "@/hooks/use-drag-drop";
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
import { Button } from "@/components/ui/button";
import { 
  Archive, 
  File, 
  Grid3X3, 
  MoreVertical, 
  Pencil, 
  Plus, 
  Square, 
  Trash2, 
  Text 
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

import CardItem from "./CardItem";
import SpreadsheetItem from "./SpreadsheetItem";
import MarkdownItem from "./MarkdownItem";
import FileItemComponent from "./FileItemComponent";
import { markdownToTable } from "@/utils/markdown";

interface BlockComponentProps {
  block: Block;
}

export default function BlockComponent({ block }: BlockComponentProps) {
  const { 
    updateBlock,
    archiveBlock,
    deleteBlock,
    createCard,
    createSpreadsheet,
    createMarkdownNote,
    createFileItem
  } = useCalendario();
  
  const [isEditing, setIsEditing] = useState(false);
  const [blockName, setBlockName] = useState(block.name);
  const [showDialog, setShowDialog] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ordenar os itens pelo campo order
  const sortedItems = [...block.items].filter(item => !item.archived);
  sortedItems.sort((a, b) => a.order - b.order);
  
  const { isDraggedOver, handlers } = useDragDrop({
    onDrop: (e, targetId) => {
      // Implementaremos a lógica de drop no futuro
      console.log(`Dropped on block ${block.id}`);
    }
  });
  
  const handleNameChange = () => {
    if (blockName.trim()) {
      updateBlock({
        ...block,
        name: blockName
      });
    }
    setIsEditing(false);
  };
  
  const handleCreateCard = () => {
    createCard(block.id);
  };
  
  const handleCreateSpreadsheet = () => {
    createSpreadsheet(block.id);
  };
  
  const handleCreateMarkdownNote = () => {
    createMarkdownNote(block.id);
  };
  
  const handleCreateMarkdownTable = () => {
    try {
      const { columns, rows } = markdownToTable(markdownContent);
      
      const newSpreadsheet: Spreadsheet = {
        id: "",  // Será gerado pelo createSpreadsheet
        type: "spreadsheet",
        blockId: block.id,
        title: "Tabela de Markdown",
        columns,
        rows,
        lastEditedAt: new Date().toISOString(),
        order: 0,  // Será definido pelo createSpreadsheet
        archived: false,
        createdAt: "",  // Será definido pelo createSpreadsheet
        updatedAt: ""   // Será definido pelo createSpreadsheet
      };
      
      const createdSpreadsheet = createSpreadsheet(block.id);
      
      // Atualizar com os dados da tabela markdown
      if (createdSpreadsheet) {
        updateBlock({
          ...block,
          items: block.items.map(item => 
            item.id === createdSpreadsheet.id 
              ? { ...createdSpreadsheet, title: "Tabela de Markdown", columns, rows }
              : item
          )
        });
      }
      
      setMarkdownContent("");
      setShowDialog(null);
    } catch (error) {
      console.error("Erro ao converter Markdown para tabela:", error);
      alert("Erro ao converter Markdown para tabela. Verifique o formato.");
    }
  };
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await createFileItem(block.id, files[0]);
      
      // Limpar o input para permitir enviar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <div 
        className={`calendario-block flex flex-col ${
          isDraggedOver ? "calendario-drag-over" : ""
        }`}
        onDragOver={handlers.handleDragOver}
        onDragLeave={handlers.handleDragLeave}
        onDrop={(e) => handlers.handleDrop(e, block.id)}
      >
        <div className="mb-3">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
                onBlur={handleNameChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNameChange();
                  if (e.key === "Escape") {
                    setBlockName(block.name);
                    setIsEditing(false);
                  }
                }}
                className="flex-1 border rounded px-2 py-1 text-sm font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h3 
                className="text-sm font-medium truncate cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                {block.name}
              </h3>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Pencil size={16} className="mr-2" />
                    <span>Renomear</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => setShowDialog("markdown")}>
                    <Text size={16} className="mr-2" />
                    <span>Inserir texto Markdown</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => setShowDialog("markdownTable")}>
                    <Grid3X3 size={16} className="mr-2" />
                    <span>Criar tabela via Markdown</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => archiveBlock(block.id)}>
                    <Archive size={16} className="mr-2" />
                    <span>Arquivar</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive" 
                    onClick={() => setShowDialog("delete")}
                  >
                    <Trash2 size={16} className="mr-2" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-h-[100px] overflow-y-auto space-y-2">
          {sortedItems.map((item) => {
            switch (item.type) {
              case "card":
                return <CardItem key={item.id} card={item as Card} />;
              case "spreadsheet":
                return <SpreadsheetItem key={item.id} spreadsheet={item as Spreadsheet} />;
              case "markdown":
                return <MarkdownItem key={item.id} markdownNote={item as MarkdownNote} />;
              case "file":
                return <FileItemComponent key={item.id} fileItem={item as FileItem} />;
              default:
                return null;
            }
          })}
          
          {sortedItems.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Este bloco está vazio.
              <br />
              Adicione cartões ou planilhas abaixo.
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleCreateCard}>
            <Square size={14} className="mr-1" />
            Cartão
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleCreateSpreadsheet}>
            <Grid3X3 size={14} className="mr-1" />
            Planilha
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleFileUpload}>
            <File size={14} className="mr-1" />
            Arquivo
          </Button>
        </div>
        
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      {/* Diálogo de exclusão */}
      <Dialog open={showDialog === "delete"} onOpenChange={(open) => !open && setShowDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir bloco</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o bloco "{block.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                deleteBlock(block.id);
                setShowDialog(null);
              }}
            >
              Excluir permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de inserção de Markdown */}
      <Dialog open={showDialog === "markdown"} onOpenChange={(open) => !open && setShowDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inserir texto Markdown</DialogTitle>
            <DialogDescription>
              Digite ou cole o conteúdo Markdown que deseja adicionar ao bloco.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              placeholder="# Título\nParágrafo com **negrito** e *itálico*\n\n* Item 1\n* Item 2"
              className="font-mono text-sm"
              rows={8}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(null)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                createMarkdownNote(block.id, markdownContent);
                setMarkdownContent("");
                setShowDialog(null);
              }}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de inserção de tabela Markdown */}
      <Dialog open={showDialog === "markdownTable"} onOpenChange={(open) => !open && setShowDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar tabela via Markdown</DialogTitle>
            <DialogDescription>
              Digite ou cole uma tabela em formato Markdown para converter em planilha.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              placeholder="| Coluna 1 | Coluna 2 | Coluna 3 |\n| --- | --- | --- |\n| Valor 1 | Valor 2 | Valor 3 |"
              className="font-mono text-sm"
              rows={8}
            />
            
            <p className="text-xs text-muted-foreground mt-2">
              Formato: A primeira linha deve conter os títulos das colunas, a segunda deve ter separadores,
              e as linhas seguintes contêm os dados.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(null)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateMarkdownTable}>
              Converter para planilha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
