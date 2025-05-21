
import React, { useState } from "react";
import { Spreadsheet } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import { Button } from "@/components/ui/button";
import { Table2, Pencil, Trash2, MoreVertical } from "lucide-react";
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
import { Input } from "@/components/ui/input";

interface SpreadsheetItemProps {
  spreadsheet: Spreadsheet;
}

export default function SpreadsheetItem({ spreadsheet }: SpreadsheetItemProps) {
  const { updateItem, deleteItem } = useCalendario();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [title, setTitle] = useState(spreadsheet.title);

  const handleSave = () => {
    const updatedSpreadsheet: Spreadsheet = {
      ...spreadsheet,
      title,
      updatedAt: new Date().toISOString(),
      lastEditedAt: new Date().toISOString()
    };

    updateItem(updatedSpreadsheet);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteItem(spreadsheet.id, "spreadsheet");
    setShowDeleteDialog(false);
  };

  if (isEditing) {
    return (
      <div className="calendario-spreadsheet bg-white border rounded-md p-3 shadow-sm">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 font-medium"
          placeholder="Título da planilha..."
        />
        <div className="flex justify-between mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="calendario-spreadsheet bg-white border rounded-md p-3 shadow-sm hover:bg-gray-50 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Table2 size={16} className="text-blue-500" />
            <h4 className="font-medium">{spreadsheet.title}</h4>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground"
              >
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil size={14} className="mr-2" />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 size={14} className="mr-2" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="border rounded text-xs">
          <div className="bg-gray-100 p-1 font-medium border-b flex">
            {spreadsheet.columns.map((col, index) => (
              <div 
                key={col.id}
                className="px-2 flex-1 truncate" 
                style={{maxWidth: col.width}}
              >
                {col.name}
              </div>
            ))}
          </div>
          
          {spreadsheet.rows.map((row) => (
            <div key={row.id} className="flex border-b last:border-0">
              {spreadsheet.columns.map((col) => (
                <div 
                  key={`${row.id}-${col.id}`}
                  className="px-2 py-1 flex-1 truncate"
                  style={{maxWidth: col.width}}
                >
                  {row.cells[col.id] || ''}
                </div>
              ))}
            </div>
          ))}
          
          {spreadsheet.rows.length === 0 && (
            <div className="p-2 text-center text-muted-foreground">
              Planilha vazia
            </div>
          )}
        </div>
        
        <div className="text-xs text-right mt-1 text-muted-foreground">
          Modificado: {new Date(spreadsheet.lastEditedAt).toLocaleString()}
        </div>
      </div>

      <Dialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir planilha</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta planilha? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Excluir permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
