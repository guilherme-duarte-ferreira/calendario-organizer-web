/**
 * @file ChecklistPopup.tsx
 * @description Componente para gerenciar múltiplos checklists (com título e itens) dentro de um pop-up.
 * Permite criar novos checklists, visualizar progresso geral e individual, e excluir checklists.
 * Projetado para ser usado como conteúdo de um Popover.
 */

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
import { PopoverClose } from "@/components/ui/popover";

/**
 * Representa um item individual de uma checklist
 */
interface ChecklistItem {
  id: string;      // Identificador único do item
  text: string;    // Texto descritivo do item
  completed: boolean; // Estado de conclusão do item
  dueDate?: string;
}

/**
 * Representa uma checklist completa com título e lista de itens
 */
interface Checklist {
  id: string;              // Identificador único da checklist
  title: string;           // Título da checklist
  items: ChecklistItem[];  // Lista de itens da checklist
}

/**
 * Props necessárias para o componente ChecklistPopup
 */
interface ChecklistPopupProps {
  onClosePopup?: () => void;  // Função para fechar o pop-up principal
  checklists: Checklist[];    // Lista de checklists existentes
  onUpdateChecklists: (checklists: Checklist[]) => void;  // Callback para atualizar a lista de checklists
}

export default function ChecklistPopup({
  onClosePopup,
  checklists = [],
  onUpdateChecklists
}: ChecklistPopupProps) {
  // Estado para o título do novo checklist
  const [newChecklistTitle, setNewChecklistTitle] = useState("");

  // Garante que 'checklists' seja sempre um array para evitar erros em 'reduce' e 'map'
  const safeChecklists = Array.isArray(checklists) ? checklists : [];
  
  // Calcula o total de itens e itens concluídos em todos os checklists
  const totalItems = safeChecklists.reduce((acc, checklist) => acc + (checklist.items?.length || 0), 0);
  const completedItems = safeChecklists.reduce((acc, checklist) => 
    acc + (checklist.items?.filter(item => item.completed).length || 0), 0);
  const overallProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  /**
   * Handler para criar um novo checklist
   * Cria uma nova checklist vazia e atualiza a lista no componente pai
   */
  const handleCreateChecklist = () => {
    if (!newChecklistTitle.trim()) return;

    const newChecklist: Checklist = {
      id: Date.now().toString(),
      title: newChecklistTitle.trim(),
      items: []
    };

    onUpdateChecklists([...safeChecklists, newChecklist]);
    setNewChecklistTitle("");
    if (onClosePopup) onClosePopup();
  };

  /**
   * Handler para excluir um checklist específico
   * Remove a checklist da lista e atualiza o componente pai
   */
  const handleDeleteChecklist = (checklistId: string) => {
    onUpdateChecklists(safeChecklists.filter(c => c.id !== checklistId));
  };

  /**
   * Calcula o progresso de um checklist individual
   * Retorna a porcentagem de itens concluídos
   */
  const getChecklistProgress = (checklist: Checklist) => {
    if (!checklist.items || checklist.items.length === 0) return 0;
    return (checklist.items.filter(item => item.completed).length / checklist.items.length) * 100;
  };

  return (
    <>
      {/* Cabeçalho do Pop-up */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Checklist</h3>
          <PopoverClose asChild>
            <Button variant="ghost" size="sm" onClick={onClosePopup} className="h-6 w-6 p-0">
              <X size={14} />
            </Button>
          </PopoverClose>
        </div>
      </div>

      <div className="p-3">
        {/* Seção para Criação de Novo Checklist */}
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
        
        {/* Seção de Visão Geral do Progresso */}
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

        {/* Lista de Checklists Existentes */}
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

        {/* Mensagem se não houver checklists */}
        {safeChecklists.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            Nenhum checklist criado ainda.
            <br />
            Crie seu primeiro checklist acima.
          </div>
        )}
      </div>
    </>
  );
}
