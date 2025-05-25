
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Trash2, Clock } from "lucide-react";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ChecklistPopupProps {
  isOpen: boolean;
  onClose: () => void;
  checklist: ChecklistItem[];
  onUpdateChecklist: (checklist: ChecklistItem[]) => void;
  checklistTitle?: string;
  onUpdateTitle?: (title: string) => void;
}

export default function ChecklistPopup({
  isOpen,
  onClose,
  checklist,
  onUpdateChecklist,
  checklistTitle = "Checklist",
  onUpdateTitle
}: ChecklistPopupProps) {
  const [title, setTitle] = useState(checklistTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  if (!isOpen) return null;

  const completedCount = checklist.filter(item => item.completed).length;
  const progress = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

  const handleTitleSave = () => {
    if (onUpdateTitle) {
      onUpdateTitle(title);
    }
    setIsEditingTitle(false);
  };

  const addItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: "",
      completed: false
    };
    onUpdateChecklist([...checklist, newItem]);
  };

  const updateItem = (id: string, updates: Partial<ChecklistItem>) => {
    onUpdateChecklist(checklist.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeItem = (id: string) => {
    onUpdateChecklist(checklist.filter(item => item.id !== id));
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          {isEditingTitle ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              className="text-sm font-medium"
              autoFocus
            />
          ) : (
            <h3 
              className="font-medium text-sm cursor-pointer hover:bg-muted px-1 py-0.5 rounded"
              onClick={() => setIsEditingTitle(true)}
            >
              {title}
            </h3>
          )}
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X size={14} />
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{completedCount}/{checklist.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="p-3 max-h-60 overflow-y-auto">
        <div className="space-y-2">
          {checklist.map((item) => (
            <div key={item.id} className="group flex items-center gap-2 p-2 hover:bg-muted rounded">
              <Checkbox
                checked={item.completed}
                onCheckedChange={(checked) => 
                  updateItem(item.id, { completed: !!checked })
                }
              />
              <Input
                value={item.text}
                onChange={(e) => updateItem(item.id, { text: e.target.value })}
                placeholder="Item do checklist..."
                className="flex-1 text-sm border-0 bg-transparent focus-visible:ring-0"
              />
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-muted-foreground"
                >
                  <Clock size={12} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="h-6 w-6 p-0 text-red-500"
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={addItem}
          className="w-full mt-3 text-xs h-8"
        >
          Adicionar item
        </Button>

        <div className="mt-4 pt-3 border-t">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onUpdateChecklist([])}
            className="w-full text-xs h-8"
            disabled={checklist.length === 0}
          >
            <Trash2 size={14} className="mr-2" />
            Excluir checklist
          </Button>
        </div>
      </div>
    </div>
  );
}
