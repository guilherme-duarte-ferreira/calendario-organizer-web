
import { useState } from "react";
import { FileItem } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import { useDragDrop } from "@/hooks/use-drag-drop";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Archive,
  ExternalLink,
  File,
  FileImage,
  FileText,
  MoreVertical,
  Trash2,
  Download
} from "lucide-react";

interface FileItemComponentProps {
  fileItem: FileItem;
}

export default function FileItemComponent({ fileItem }: FileItemComponentProps) {
  const { archiveItem, deleteItem } = useCalendario();
  
  const [showMenu, setShowMenu] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const { isDragging, handlers } = useDragDrop({
    onDragStart: (e, id) => {
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.setData("application/calendario-file", JSON.stringify(fileItem));
    },
  });
  
  const getFileIcon = () => {
    if (fileItem.fileType.startsWith("image/")) {
      return <FileImage size={16} className="mr-2 text-primary" />;
    }
    if (fileItem.fileType === "application/pdf") {
      return <FileText size={16} className="mr-2 text-red-500" />;
    }
    return <File size={16} className="mr-2 text-blue-500" />;
  };
  
  const isPreviewable = () => {
    return fileItem.fileType.startsWith("image/") || fileItem.fileType === "application/pdf";
  };

  return (
    <>
      <div
        className={`calendario-card select-none ${isDragging ? "opacity-50" : ""}`}
        draggable
        onDragStart={(e) => handlers.handleDragStart(e, fileItem.id)}
        onDragEnd={handlers.handleDragEnd}
        onClick={() => isPreviewable() && setPreviewOpen(true)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {getFileIcon()}
            <div className="font-medium truncate">{fileItem.name}</div>
          </div>
          <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground"
              >
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isPreviewable() && (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setPreviewOpen(true);
                  setShowMenu(false);
                }}>
                  <ExternalLink size={16} className="mr-2" />
                  <span>Abrir</span>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                
                // Criar um link para download
                const a = document.createElement('a');
                a.href = fileItem.url;
                a.download = fileItem.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}>
                <Download size={16} className="mr-2" />
                <span>Download</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                archiveItem(fileItem.id, "file");
                setShowMenu(false);
              }}>
                <Archive size={16} className="mr-2" />
                <span>Arquivar</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteDialogOpen(true);
                  setShowMenu(false);
                }}
              >
                <Trash2 size={16} className="mr-2" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {fileItem.thumbnail && (
          <div className="mt-2">
            <img 
              src={fileItem.thumbnail} 
              alt={fileItem.name} 
              className="w-full h-auto max-h-32 object-cover rounded"
            />
          </div>
        )}
      </div>

      {/* Diálogo de visualização */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{fileItem.name}</DialogTitle>
          </DialogHeader>

          <div className="py-4 flex justify-center items-center h-full">
            {fileItem.fileType.startsWith("image/") ? (
              <img 
                src={fileItem.url} 
                alt={fileItem.name} 
                className="max-w-full max-h-[60vh] object-contain"
              />
            ) : fileItem.fileType === "application/pdf" ? (
              <iframe 
                src={fileItem.url} 
                title={fileItem.name}
                className="w-full h-[60vh] border"
              />
            ) : (
              <div className="text-center">
                <File size={64} className="mx-auto mb-4 text-blue-500" />
                <p>Este tipo de arquivo não pode ser visualizado diretamente.</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button asChild>
              <a href={fileItem.url} download={fileItem.name} target="_blank" rel="noopener noreferrer">
                <Download size={16} className="mr-2" /> Download
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir arquivo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o arquivo "{fileItem.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                deleteItem(fileItem.id, "file");
                setDeleteDialogOpen(false);
              }}
            >
              Excluir permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
