
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Type,
  RotateCcw,
  WrapText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SpreadsheetToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onAlignLeft: () => void;
  onAlignCenter: () => void;
  onAlignRight: () => void;
  onTextColor: (color: string) => void;
  onBackgroundColor: (color: string) => void;
  onFontSize: (size: string) => void;
  onCellType: (type: string) => void;
  onWrapText: () => void;
  onResetSizes: () => void;
  currentCellType?: string;
  isWrapTextEnabled?: boolean;
}

export default function SpreadsheetToolbar({
  onBold,
  onItalic,
  onUnderline,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onTextColor,
  onBackgroundColor,
  onFontSize,
  onCellType,
  onWrapText,
  onResetSizes,
  currentCellType = 'text',
  isWrapTextEnabled = false,
}: SpreadsheetToolbarProps) {
  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#808080'
  ];

  const cellTypes = [
    { value: 'text', label: 'Texto' },
    { value: 'number', label: 'Número' },
    { value: 'date', label: 'Data' },
    { value: 'time', label: 'Hora' },
    { value: 'currency', label: 'Moeda' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'weight', label: 'Peso' },
    { value: 'percentage', label: 'Porcentagem' },
  ];

  return (
    <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
      {/* Formatting buttons */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onBold}>
          <Bold size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onItalic}>
          <Italic size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onUnderline}>
          <Underline size={16} />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment buttons */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onAlignLeft}>
          <AlignLeft size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onAlignCenter}>
          <AlignCenter size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={onAlignRight}>
          <AlignRight size={16} />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Color pickers */}
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Type size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: color }}
                  onClick={() => onTextColor(color)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Palette size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: color }}
                  onClick={() => onBackgroundColor(color)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Font size and cell type */}
      <div className="flex items-center gap-2">
        <Select onValueChange={onFontSize}>
          <SelectTrigger className="w-20 h-8">
            <SelectValue placeholder="12" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="14">14</SelectItem>
            <SelectItem value="16">16</SelectItem>
            <SelectItem value="18">18</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currentCellType} onValueChange={onCellType}>
          <SelectTrigger className="w-32 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cellTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text wrap and reset */}
      <div className="flex items-center gap-1">
        <Button 
          variant={isWrapTextEnabled ? "default" : "ghost"} 
          size="sm" 
          onClick={onWrapText}
          title="Alternar quebra de linha"
        >
          <WrapText size={16} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onResetSizes}
          title="Redefinir tamanhos de colunas e linhas"
        >
          <RotateCcw size={16} />
        </Button>
      </div>
    </div>
  );
}
