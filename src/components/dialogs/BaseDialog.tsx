import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2, Archive, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInteractOutside?: (event: Event) => void;
  title: string;
  location?: string;
  onLocationClick?: () => void;
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  saveButtonText?: string;
  cancelButtonText?: string;
  showArchive?: boolean;
  showDelete?: boolean;
  showMaximize?: boolean;
  isSaving?: boolean;
  className?: string;
  capa?: string;
  capaColor?: string;
}

export default function BaseDialog({
  isOpen,
  onClose,
  onInteractOutside,
  title,
  location,
  onLocationClick,
  children,
  sidebarContent,
  onSave,
  onCancel,
  onArchive,
  onDelete,
  isMaximized = false,
  onToggleMaximize,
  saveButtonText = "Salvar",
  cancelButtonText = "Cancelar",
  showArchive = true,
  showDelete = true,
  showMaximize = true,
  isSaving = false,
  className,
  capa,
  capaColor,
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
        hideDefaultCloseButton={true}
        className={cn(
          "max-w-4xl w-full flex flex-col p-0 gap-0",
          !isMaximized && "min-h-[400px] max-h-[90vh]",
          isMaximized ? "max-w-full w-full h-full max-h-full rounded-none border-0" : "sm:rounded-lg",
          "overflow-hidden",
          className
        )}
        style={{ 
          fontSize: "14px", 
          lineHeight: "1.3"
        }}
        onInteractOutside={onInteractOutside}
      >
        {/* Capa - se existir */}
        {(capa || capaColor) && (
          <div 
            className="w-full h-32 rounded-t-lg"
            style={{
              backgroundColor: capaColor || undefined,
              backgroundImage: capa && !capaColor ? `url(${capa})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        )}

        {/* Header Fixo */}
        <div className="flex items-center justify-between p-4 border-b bg-background shrink-0">
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
                <span>No bloco</span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-auto py-0.5 px-2 text-xs font-semibold hover:bg-secondary/80"
                  onClick={onLocationClick}
                >
                  {location}
                </Button>
              </div>
            )}
          </DialogHeader>
          
          <div className="flex items-center gap-2">
            {showMaximize && onToggleMaximize && (
              <Button variant="ghost" size="icon" onClick={onToggleMaximize} className="h-8 w-8">
                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Content Area (Main + Sidebar) */}
        <div className={cn(
          "flex flex-1 min-h-0",
          isMaximized ? "overflow-y-auto" : "overflow-visible"
        )}>
          {/* Main Content Scrollable */}
          <div className={cn(
            "flex-1 p-6 space-y-6",
            isMaximized && "overflow-y-auto"
          )}>
            {children}
          </div>

          {/* Sidebar Content */}
          {sidebarContent && (
            <div className={cn(
              "w-56 border-l bg-muted/30 p-4 shrink-0",
              isMaximized && "sticky top-0 h-full"
            )}>
              {sidebarContent}
            </div>
          )}
        </div>

        {/* Footer Fixo */}
        <DialogFooter className="border-t p-4 bg-background shrink-0">
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
      </DialogContent>
    </Dialog>
  );
}
