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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  
  // Props para o Popover de Localização
  showLocationPopover?: boolean;
  isLocationPopoverOpen?: boolean;
  onLocationPopoverOpenChange?: (open: boolean) => void;
  locationPopoverContent?: React.ReactNode;
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
  showLocationPopover = false,
  isLocationPopoverOpen,
  onLocationPopoverOpenChange,
  locationPopoverContent,
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

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
          lineHeight: "1.3",
          backgroundImage: capa && !capaColor ? `url(${capa})` : undefined,
          backgroundColor: capaColor || undefined,
          backgroundSize: capa ? 'cover' : undefined,
          backgroundPosition: capa ? 'center' : undefined,
        }}
        onInteractOutside={onInteractOutside}
      >
        {/* Capa - se existir */}
        {(capa || capaColor) && (
          <div 
            className="w-full h-32 rounded-t-lg shrink-0"
            style={{
              backgroundColor: capaColor || undefined,
              backgroundImage: capa && !capaColor ? `url(${capa})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        )}

        {/* Header Fixo */}
        <div className="flex items-center p-4 border-b bg-background shrink-0 relative">
          <div className="flex-1 min-w-0">
            <DialogTitle className={cn("text-lg font-semibold truncate", { "text-white": capa || capaColor })}>
              {title}
            </DialogTitle>
            {location && (
              <div className="text-xs mt-1">
                <span className={cn({ "text-gray-200": capa || capaColor, "text-muted-foreground": !capa && !capaColor })}>
                  No bloco
                </span>
                {showLocationPopover && isLocationPopoverOpen !== undefined && onLocationPopoverOpenChange && locationPopoverContent ? (
                  <Popover open={isLocationPopoverOpen} onOpenChange={onLocationPopoverOpenChange}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="link"
                        className={cn(
                          "h-auto p-0 ml-1 text-xs font-semibold underline",
                          { 
                            "text-white hover:text-gray-300": capa || capaColor,
                            "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300": !capa && !capaColor 
                          }
                        )}
                        data-testid="location-trigger-button"
                      >
                        {location}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0 w-80"
                      align="start"
                      side="bottom"
                    >
                      {locationPopoverContent}
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Button
                    variant="link"
                    className={cn(
                      "h-auto p-0 ml-1 text-xs font-semibold underline",
                      { 
                        "text-white hover:text-gray-300": capa || capaColor,
                        "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300": !capa && !capaColor 
                      }
                    )}
                    onClick={onLocationClick}
                    data-testid="location-trigger-button"
                  >
                    {location}
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Botões de Ação (Fechar e Maximizar/Minimizar) */}
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
        <div className="flex flex-1 min-h-0 overflow-y-auto">
          {/* Main Content */}
          <div className="flex-1 p-6 space-y-6">
            {children}
          </div>

          {/* Sidebar Content */}
          {sidebarContent && (
            <div className="w-56 border-l bg-muted/30 p-4 shrink-0">
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
