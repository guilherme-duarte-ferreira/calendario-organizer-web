import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, Link } from 'lucide-react';
import { toast } from 'sonner';

// Props que o modal receberá
interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (attrs: { src: string }) => void;
}

/**
 * Modal para upload de imagens, com opções para inserir via URL ou upload de arquivo.
 */
export default function ImageUploadDialog({ isOpen, onClose, onInsertImage }: ImageUploadDialogProps) {
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Insere a imagem a partir da URL fornecida e fecha o modal.
   */
  const handleInsertFromUrl = () => {
    if (url.trim()) {
      onInsertImage({ src: url.trim() });
      onClose();
      setUrl('');
    } else {
      toast.error('Por favor, insira uma URL válida.');
    }
  };

  /**
   * Processa o arquivo selecionado pelo usuário.
   * Converte o arquivo para uma URL de objeto e a insere no editor.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione um arquivo de imagem válido.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        onInsertImage({ src });
        onClose();
      };
      reader.readAsDataURL(file); // Converte para base64
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inserir Imagem</DialogTitle>
          <DialogDescription>
            Adicione uma imagem a partir de uma URL ou faça o upload de um arquivo.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">
              <Link className="mr-2 h-4 w-4" />
              Inserir via URL
            </TabsTrigger>
            <TabsTrigger value="upload">
              <UploadCloud className="mr-2 h-4 w-4" />
              Fazer Upload
            </TabsTrigger>
          </TabsList>
          {/* Aba para Inserir via URL */}
          <TabsContent value="url" className="mt-4">
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">
                URL da Imagem
              </label>
              <Input
                id="imageUrl"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.png"
              />
            </div>
          </TabsContent>
          {/* Aba para Fazer Upload */}
          <TabsContent value="upload" className="mt-4">
            <div
              className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-8 text-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="mb-2 h-10 w-10 text-gray-400" />
              <p className="text-sm text-gray-500">
                Arraste um arquivo ou clique para selecionar
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleInsertFromUrl}>
            Inserir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 