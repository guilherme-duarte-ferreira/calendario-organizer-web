
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2, Archive, Trash2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  location?: string;
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onHelp?: () => void;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  saveButtonText?: string;
  cancelButtonText?: string;
  showArchive?: boolean;
  showDelete?: boolean;
  showHelp?: boolean;
  showMaximize?: boolean;
  isSaving?: boolean;
  className?: string;
}

export default function BaseDialog({
  isOpen,
  onClose,
  title,
  location,
  children,
  sidebarContent,
  onSave,
  onCancel,
  onArchive,
  onDelete,
  onHelp,
  isMaximized = false,
  onToggleMaximize,
  saveButtonText = "Salvar",
  cancelButtonText = "Cancelar",
  showArchive = true,
  showDelete = true,
  showHelp = true,
  showMaximize = true,
  isSaving = false,
  className,
}: BaseDialogProps) {
  
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-w-4xl w-full h-[85vh] flex flex-col p-0 gap-0",
          isMaximized && "max-w-[95vw] w-[95vw] h-[95vh]",
          className
        )}
        style={{ fontSize: "14px", lineHeight: "1.3" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-background">
          <DialogHeader className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-lg font-semibold">
                <i className="fas fa-check-circle"></i>
              </span>
              <DialogTitle className="text-base font-semibold">
                {title}
              </DialogTitle>
            </div>
            {location && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>na lista</span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-auto py-0.5 px-2 text-xs font-semibold"
                >
                  {location}
                </Button>
              </div>
            )}
          </DialogHeader>
          
          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {showMaximize && onToggleMaximize && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleMaximize}
                className="h-8 w-8"
              >
                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </Button>
            )}
            {showHelp && onHelp && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onHelp}
                className="h-8 w-8"
              >
                <HelpCircle size={16} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
            
            {/* Footer Actions */}
            <DialogFooter className="border-t p-4 bg-background">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {showArchive && onArchive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onArchive}
                      className="text-muted-foreground"
                    >
                      <Archive size={14} className="mr-2" />
                      Arquivar
                    </Button>
                  )}
                  {showDelete && onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onDelete}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Excluir
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    {cancelButtonText}
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Salvando..." : saveButtonText}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </div>

          {/* Sidebar */}
          {sidebarContent && (
            <div className="w-56 border-l bg-muted/30 p-4 overflow-y-auto">
              {sidebarContent}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
