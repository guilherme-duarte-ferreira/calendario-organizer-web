import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { X, Trash2, Plus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

interface ChecklistPopupProps {
  isOpen: boolean;
  onClose: () => void;
  checklists: Checklist[];
  onUpdateChecklists: (checklists: Checklist[]) => void;
}

export default function ChecklistPopup({
  isOpen,
  onClose,
  checklists = [], // Default to empty array
  onUpdateChecklists
}: ChecklistPopupProps) {
  const [newChecklistTitle, setNewChecklistTitle] = useState("");

  if (!isOpen) return null;

  // Safely handle checklists array
  const safeChecklists = Array.isArray(checklists) ? checklists : [];
  
  const totalItems = safeChecklists.reduce((acc, checklist) => acc + (checklist.items?.length || 0), 0);
  const completedItems = safeChecklists.reduce((acc, checklist) => 
    acc + (checklist.items?.filter(item => item.completed).length || 0), 0);
  const overallProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleCreateChecklist = () => {
    if (!newChecklistTitle.trim()) return;

    const newChecklist: Checklist = {
      id: Date.now().toString(),
      title: newChecklistTitle.trim(),
      items: []
    };

    onUpdateChecklists([...safeChecklists, newChecklist]);
    setNewChecklistTitle("");
    onClose(); // Fecha a telinha após criar
  };

  const handleDeleteChecklist = (checklistId: string) => {
    onUpdateChecklists(safeChecklists.filter(c => c.id !== checklistId));
  };

  const getChecklistProgress = (checklist: Checklist) => {
    if (!checklist.items || checklist.items.length === 0) return 0;
    return (checklist.items.filter(item => item.completed).length / checklist.items.length) * 100;
  };

  return (
    <>
      {/* Overlay para fechar ao clicar fora */}
      <div 
        className="fixed inset-0 z-[9998]" 
        onClick={onClose}
      />
      
      <div className="absolute top-full left-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-[9999]" data-popup="checklist">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Checklist</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X size={14} />
            </Button>
          </div>
        </div>

        <div className="p-3">
          {/* Criação de novo checklist */}
          <div className="mb-4">
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Criar novo checklist
            </label>
            <div className="flex gap-2">
              <Input
                value={newChecklistTitle}
                onChange={(e) => setNewChecklistTitle(e.target.value)}
                placeholder="Nome do checklist..."
                className="text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateChecklist();
                  }
                }}
              />
              <Button 
                size="sm" 
                onClick={handleCreateChecklist}
                disabled={!newChecklistTitle.trim()}
              >
                <Plus size={14} className="mr-1" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Visão geral */}
          {safeChecklists.length > 0 && (
            <div className="mb-4">
              <label className="text-xs font-medium text-muted-foreground block mb-2">
                Visão geral
              </label>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Progresso geral:</span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {completedItems} de {totalItems} itens concluídos
                </div>
              </div>
            </div>
          )}

          {/* Lista de checklists existentes */}
          {safeChecklists.length > 0 && (
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-2">
                Checklists existentes
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {safeChecklists.map((checklist) => (
                  <div 
                    key={checklist.id} 
                    className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{checklist.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(getChecklistProgress(checklist))}% • {checklist.items?.filter(i => i.completed).length || 0}/{checklist.items?.length || 0} itens
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal size={12} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={() => handleDeleteChecklist(checklist.id)}
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

          {safeChecklists.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Nenhum checklist criado ainda.
              <br />
              Crie seu primeiro checklist acima.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
