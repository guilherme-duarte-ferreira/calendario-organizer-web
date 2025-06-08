import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (url: string) => void;
}

export default function ImageUploadDialog({ isOpen, onClose, onInsertImage }: ImageUploadDialogProps) {
  const [url, setUrl] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleInsertFromUrl = () => {
    if (url.trim()) {
      onInsertImage(url);
      onClose();
    } else {
      toast.error("Por favor, insira uma URL válida.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione um arquivo de imagem válido.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        onInsertImage(reader.result as string);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inserir Imagem</DialogTitle>
          <DialogDescription>
            Adicione uma imagem a partir de uma URL ou faça o upload do seu computador.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="url" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url"><Link className="mr-2 h-4 w-4"/>Inserir via URL</TabsTrigger>
            <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4"/>Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="url" className="mt-4">
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">URL da Imagem</label>
              <Input
                id="imageUrl"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.png"
              />
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleInsertFromUrl}>Inserir Imagem</Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="upload" className="mt-4">
            <div className="flex flex-col items-center justify-center space-y-4 p-6 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">Clique no botão para selecionar uma imagem</p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
                <Button onClick={handleUploadClick}>
                    <Upload className="mr-2 h-4 w-4" />
                    Carregar do Computador
                </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 