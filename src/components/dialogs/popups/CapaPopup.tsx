import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Image, Trash2, Palette } from "lucide-react";
import CoresCapa from "./CoresCapa";
import { PopoverClose } from "@/components/ui/popover";

interface CapaPopupProps {
  onClosePopup?: () => void;
  onSetCapa: (imageUrl: string) => void;
  onSetCapaColor: (color: string) => void;
  onRemoveCapa: () => void;
  currentCapa?: string;
  currentCapaColor?: string;
}

const capasSugeridas = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop"
];

export default function CapaPopup({
  onClosePopup,
  onSetCapa,
  onSetCapaColor,
  onRemoveCapa,
  currentCapa,
  currentCapaColor
}: CapaPopupProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCoresCapa, setShowCoresCapa] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      onSetCapa(imageUrl);
    }
  };

  const handleSelectColorForCapaPopup = (color: string) => {
    if (color === "") {
      onRemoveCapa();
    } else {
      onSetCapaColor(color);
    }
  };
  
  const handleMainRemoveCapa = () => {
    onRemoveCapa();
  };

  return (
    <>
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Capa</h3>
          <PopoverClose asChild>
            <Button variant="ghost" size="sm" onClick={onClosePopup} className="h-6 w-6 p-0">
              <X size={14} />
            </Button>
          </PopoverClose>
        </div>
      </div>

      <div className="p-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {(currentCapa || currentCapaColor) && (
          <div className="mb-4">
            <div className="relative">
              <div 
                className="w-full h-24 rounded"
                style={{
                  backgroundColor: currentCapaColor || undefined,
                  backgroundImage: currentCapa && !currentCapaColor ? `url(${currentCapa})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={handleMainRemoveCapa} 
                className="absolute top-2 right-2 h-6 w-6 p-0"
              >
                <Trash2 size={12} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Capa atual</p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full text-xs h-8"
          >
            <Upload size={14} className="mr-2" />
            Fazer upload
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowCoresCapa(!showCoresCapa)}
              className="w-full text-xs h-8"
            >
              <Palette size={14} className="mr-2" />
              Cores
            </Button>
            {showCoresCapa && (
              <CoresCapa
                isOpen={showCoresCapa}
                onClose={() => setShowCoresCapa(false)}
                onSelectColor={handleSelectColorForCapaPopup}
              />
            )}
          </div>

          <div>
            <h4 className="text-xs font-medium mb-2">Capas sugeridas</h4>
            <div className="grid grid-cols-2 gap-2">
              {capasSugeridas.map((capaUrl, index) => (
                <button
                  key={index}
                  onClick={() => onSetCapa(capaUrl)}
                  className="relative overflow-hidden rounded hover:opacity-80 transition-opacity"
                >
                  <img 
                    src={capaUrl} 
                    alt={`Capa ${index + 1}`}
                    className="w-full h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
