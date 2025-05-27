
import React, { useState, useCallback } from "react";
import { Block, Card, MarkdownNote, Spreadsheet, FileItem } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import CardItem from "./CardItem";
import MarkdownItem from "./MarkdownItem";
import SpreadsheetItem from "./SpreadsheetItem";
import FileItemComponent from "./FileItemComponent";
import { toast } from "sonner";

interface BlockComponentProps {
  block: Block;
}

export default function BlockComponent({ block }: BlockComponentProps) {
  const { updateBlock, createItem } = useCalendario();
  const [isEditingName, setIsEditingName] = useState(false);
  const [blockName, setBlockName] = useState(block.name);

  const onResize = useCallback(() => {
    window.dispatchEvent(new Event('resize'));
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBlockName(e.target.value);
  };

  const handleNameSave = () => {
    if (blockName.trim() === "") {
      toast.error("O nome do bloco não pode estar vazio.");
      return;
    }

    const updatedBlock: Block = {
      ...block,
      name: blockName,
      updatedAt: new Date().toISOString()
    };
    updateBlock(updatedBlock);
    setIsEditingName(false);
    toast.success("Nome do bloco atualizado!");
  };

  const handleAddNewCard = () => {
    createItem(block.id, "card", { title: "Novo cartão" });
    toast.message("Novo cartão adicionado. Edite para customizar.");
  };

  return (
    <div className="calendar-block bg-white border rounded-lg shadow-sm p-4 min-w-80 max-w-80">
      <div className="flex items-center justify-between mb-4">
        {isEditingName ? (
          <Input
            type="text"
            value={blockName}
            onChange={handleNameChange}
            onBlur={handleNameSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleNameSave();
              }
            }}
            className="w-full text-sm font-semibold border-none focus:ring-0 focus:outline-none"
          />
        ) : (
          <h3
            className="text-sm font-semibold cursor-pointer hover:underline"
            onClick={() => setIsEditingName(true)}
          >
            {block.name}
          </h3>
        )}
      </div>

      <div className="space-y-2">
        {block.items.map((item) => {
          if (item.type === 'card') {
            return <CardItem key={item.id} card={item as Card} onResize={onResize} />;
          }
          
          if (item.type === 'markdown') {
            return <MarkdownItem key={item.id} markdown={item as MarkdownNote} />;
          }
          
          if (item.type === 'spreadsheet') {
            return <SpreadsheetItem key={item.id} spreadsheet={item as Spreadsheet} />;
          }
          
          if (item.type === 'file') {
            return <FileItemComponent key={item.id} fileItem={item as FileItem} />;
          }
          
          return null;
        })}
        
        <Button variant="ghost" className="w-full h-8 justify-start text-sm" onClick={handleAddNewCard}>
          <Plus size={16} className="mr-2" />
          Adicionar novo cartão
        </Button>
      </div>
    </div>
  );
}
