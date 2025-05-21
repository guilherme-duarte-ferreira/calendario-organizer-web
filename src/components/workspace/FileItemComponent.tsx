import React, { useState } from "react";
import { FileItem } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import { Button } from "@/components/ui/button";
import { FileIcon, Image, FileText, Trash2, MoreVertical, Download } from "lucide-react";
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

interface FileItemComponentProps {
  fileItem: FileItem;
}

export default function FileItemComponent({ fileItem }: FileItemComponentProps) {
  const { deleteItem } = useCalendario();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleDelete = () => {
    deleteItem(fileItem.id, "file");
    setShowDeleteDialog(false);
  };

  const getFileIcon = () => {
    if (fileItem.fileType.startsWith('image/')) {
      return <Image size={16} className="text-purple-500" />;
    } else if (fileItem.fileType === 'application/pdf') {
      return <FileIcon size={16} className="text-red-500" />;
    } else if (fileItem.fileType.includes('text/')) {
      return <FileText size={16} className="text-blue-500" />;
    } else {
      return <FileIcon size={16} className="text-gray-500" />;
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileItem.url;
    link.download = fileItem.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="calendario-file bg-white border rounded-md p-3 shadow-sm hover:bg-gray-50 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {getFileIcon()}
            <h4 className="font-medium truncate" title={fileItem.name}>
              {fileItem.name}
            </h4>
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
              {fileItem.fileType.startsWith('image/') && (
                <DropdownMenuItem onClick={() => setShowPreview(true)}>
                  <Image size={14} className="mr-2" />
                  <span>Visualizar</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleDownload}>
                <Download size={14} className="mr-2" />
                <span>Download</span>
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

        {fileItem.fileType.startsWith('image/') && fileItem.thumbnail && (
          <div 
            className="mt-1 rounded border overflow-hidden cursor-pointer" 
            onClick={() => setShowPreview(true)}
          >
            <img 
              src={fileItem.thumbnail} 
              alt={fileItem.name}
              className="w-full h-auto max-h-32 object-cover"
            />
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-2">
          {fileItem.fileType}
        </div>
      </div>

      <Dialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir arquivo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este arquivo? Esta ação não pode ser desfeita.
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

      {/* Preview Dialog for Images */}
      <Dialog
        open={showPreview}
        onOpenChange={setShowPreview}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{fileItem.name}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-2">
            <img 
              src={fileItem.url} 
              alt={fileItem.name}
              className="max-w-full max-h-[60vh] object-contain"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPreview(false)}
            >
              Fechar
            </Button>
            <Button onClick={handleDownload}>
              <Download size={16} className="mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
