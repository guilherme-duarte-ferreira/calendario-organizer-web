import React, { useState } from "react";
import BaseDialog from "./BaseDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageInsert: (imageUrl: string) => void;
}

export default function ImageUploadDialog({
  isOpen,
  onClose,
  onImageInsert,
}: ImageUploadDialogProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl("");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setFile(null);
  };

  const handleInsert = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onImageInsert(base64);
        onClose();
      };
      reader.readAsDataURL(file);
    } else if (imageUrl) {
      onImageInsert(imageUrl);
      onClose();
    }
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Inserir Imagem"
      description="Adicione uma imagem ao seu conteúdo. Você pode inserir uma URL ou fazer upload de um arquivo."
      onSave={handleInsert}
      onCancel={onClose}
      saveButtonText="Inserir"
      cancelButtonText="Cancelar"
      showArchive={false}
      showDelete={false}
      showMaximize={false}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image-url">URL da Imagem</Label>
          <Input
            id="image-url"
            type="url"
            placeholder="https://exemplo.com/imagem.jpg"
            value={imageUrl}
            onChange={handleUrlChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image-upload">Ou faça upload de um arquivo</Label>
          <div className="flex items-center gap-2">
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button variant="outline" size="icon" onClick={() => document.getElementById("image-upload")?.click()}>
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {(imageUrl || file) && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              {file ? `Arquivo selecionado: ${file.name}` : "URL da imagem inserida"}
            </p>
          </div>
        )}
      </div>
    </BaseDialog>
  );
} 