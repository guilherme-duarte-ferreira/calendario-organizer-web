import React, { useState, useRef, useEffect } from "react";
import { Spreadsheet, SpreadsheetColumn } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import BaseDialog from "./BaseDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Archive, 
  Share, 
  Trash2, 
  Plus, 
  Minus,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
  Download,
  Upload,
  Tag,
  CheckSquare,
  Clock,
  Paperclip,
  ArrowRight,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  List
} from "lucide-react";
import { toast } from "sonner";
import EtiquetaPopup from "./popups/EtiquetaPopup";
import DataPopup from "./popups/DataPopup";
import CapaPopup from "./popups/CapaPopup";
import ChecklistPopup from "./popups/ChecklistPopup";
import MoverPopup from "./popups/MoverPopup";

interface SpreadsheetDialogProps {
  spreadsheet: Spreadsheet;
  isOpen: boolean;
  onClose: () => void;
  blockName?: string;
}

interface Etiqueta {
  id: string;
  name: string;
  color: string;
}

interface ChecklistLocal {
  id: string;
  title: string;
  items: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}

export default function SpreadsheetDialog({ 
  spreadsheet, 
  isOpen, 
  onClose, 
  blockName 
}: SpreadsheetDialogProps) {
  const { updateItem, deleteItem, boards } = useCalendario();
  
  const [title, setTitle] = useState(spreadsheet.title);
  const [columns, setColumns] = useState(spreadsheet.columns);
  const [rows, setRows] = useState(spreadsheet.rows);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [isEditingCell, setIsEditingCell] = useState(false);
  const [cellValue, setCellValue] = useState("");
  const [markdownImport, setMarkdownImport] = useState("");
  const [showActivityDetails, setShowActivityDetails] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Sistema de controle de foco exclusivo para pop-ups
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null);
  
  // Estados para funcionalidades da barra lateral
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([
    { id: "1", name: "Urgente", color: "#ef4444" },
    { id: "2", name: "Importante", color: "#f97316" },
    { id: "3", name: "Bug", color: "#dc2626" },
    { id: "4", name: "Feature", color: "#16a34a" }
  ]);
  const [selectedEtiquetas, setSelectedEtiquetas] = useState<string[]>(spreadsheet.etiquetas || []);
  const [dueDate, setDueDate] = useState<Date | null>(spreadsheet.dueDate ? new Date(spreadsheet.dueDate) : null);
  const [reminderDate, setReminderDate] = useState<Date | null>(spreadsheet.reminderDate ? new Date(spreadsheet.reminderDate) : null);
  const [capa, setCapa] = useState<string | undefined>(spreadsheet.capa);
  const [capaColor, setCapaColor] = useState<string | undefined>(spreadsheet.capaColor);
  const [checklists, setChecklists] = useState<ChecklistLocal[]>([]);
  const [attachments, setAttachments] = useState(spreadsheet.attachments || []);

  const tableRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para abrir um pop-up e salvar o elemento que tinha foco
  const openPopup = (popupName: string, triggerElement?: HTMLElement) => {
    if (document.activeElement && document.activeElement !== document.body) {
      setLastFocusedElement(document.activeElement as HTMLElement);
    } else if (triggerElement) {
      setLastFocusedElement(triggerElement);
    }
    setActivePopup(popupName);
  };

  // Função para fechar o pop-up ativo e restaurar o foco
  const closeActivePopup = () => {
    setActivePopup(null);
    // Atraso pequeno para garantir que o DOM atualizou antes de tentar focar
    setTimeout(() => {
      if (lastFocusedElement && document.body.contains(lastFocusedElement)) {
        lastFocusedElement.focus();
      }
      setLastFocusedElement(null);
    }, 0);
  };

  // Função para lidar com o fechamento do modal
  const handleModalClose = () => {
    if (activePopup) {
      closeActivePopup();
    } else {
      onClose();
    }
  };

  // Função para lidar com interações fora do modal
  const handleDialogInteractOutside = (event: Event) => {
    if (activePopup) {
      event.preventDefault();
      closeActivePopup();
    }
  };

  // Função para lidar com cliques dentro do modal
  const handleModalClick = (event: React.MouseEvent) => {
    if (activePopup) {
      // Verifica se o clique foi fora do pop-up ativo
      const popupElement = document.querySelector(`[data-popup="${activePopup}"]`);
      if (popupElement && !popupElement.contains(event.target as Node)) {
        event.preventDefault();
        closeActivePopup();
      }
    }
  };

  // Efeito para lidar com a tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activePopup) {
          event.stopPropagation();
          closeActivePopup();
        } else if (isOpen) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePopup, isOpen, onClose]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    setIsSaving(true);
    try {
      const updatedSpreadsheet: Spreadsheet = {
        ...spreadsheet,
        title: title.trim(),
        columns,
        rows,
        etiquetas: selectedEtiquetas,
        dueDate: dueDate?.toISOString(),
        reminderDate: reminderDate?.toISOString(),
        capa: capaColor ? undefined : capa,
        capaColor: capaColor,
        attachments,
        lastEditedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      updateItem(updatedSpreadsheet);
      toast.success("Planilha salva com sucesso!");
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar planilha");
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = () => {
    const updatedSpreadsheet: Spreadsheet = {
      ...spreadsheet,
      archived: true,
      updatedAt: new Date().toISOString(),
    };
    updateItem(updatedSpreadsheet);
    toast.success("Planilha arquivada!");
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir a planilha "${spreadsheet.title}"?`)) {
      deleteItem(spreadsheet.id, "spreadsheet");
      toast.success("Planilha excluída!");
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newAttachment = {
        id: Date.now().toString(),
        name: file.name,
        fileType: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file),
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      };
      setAttachments([...attachments, newAttachment]);
      toast.success(`Arquivo "${file.name}" adicionado!`);
    }
  };

  const handleCreateEtiqueta = (name: string, color: string) => {
    const newEtiqueta: Etiqueta = {
      id: Date.now().toString(),
      name,
      color
    };
    setEtiquetas(prev => [...prev, newEtiqueta]);
    setSelectedEtiquetas(prev => [...prev, newEtiqueta.id]);
    toast.success(`Etiqueta "${name}" criada!`);
    closeActivePopup();
  };

  const handleSetDate = (date: Date | null, type: 'due' | 'reminder') => {
    if (type === 'due') {
      setDueDate(date);
    } else {
      setReminderDate(date);
    }
    toast.success(date ? "Data definida!" : "Data removida!");
    closeActivePopup();
  };

  const handleSetCapa = (imageUrl: string) => {
    setCapa(imageUrl);
    setCapaColor(undefined);
    toast.success("Capa definida!");
    closeActivePopup();
  };

  const handleSetCapaColor = (color: string) => {
    setCapaColor(color);
    setCapa(undefined);
    toast.success("Cor da capa definida!");
    closeActivePopup();
  };

  const handleRemoveCapa = () => {
    setCapa(undefined);
    setCapaColor(undefined);
    toast.success("Capa removida!");
    closeActivePopup();
  };

  const handleUpdateChecklists = (newChecklists: ChecklistLocal[]) => {
    setChecklists(newChecklists);
    closeActivePopup();
  };

  const handleMove = (boardId: string, blockId: string, position: number) => {
    toast.success("Planilha movida!");
    closeActivePopup();
  };

  const importMarkdownTable = () => {
    if (!markdownImport.trim()) {
      toast.error("Por favor, cole uma tabela Markdown");
      return;
    }

    try {
      const lines = markdownImport.trim().split('\n');
      if (lines.length < 3) {
        toast.error("Formato de tabela Markdown inválido");
        return;
      }

      const headerLine = lines[0];
      const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);
      
      const dataRows = lines.slice(2).map(line => 
        line.split('|').map(cell => cell.trim()).filter(cell => cell)
      );

      const newColumns: SpreadsheetColumn[] = headers.map((header, index) => ({
        id: `col_${Date.now()}_${index}`,
        name: header,
        type: 'text',
        required: false,
        width: 120
      }));

      const newRows = dataRows.map((rowData, index) => ({
        id: `row_${Date.now()}_${index}`,
        cells: newColumns.reduce((acc, col, colIndex) => {
          acc[col.id] = rowData[colIndex] || '';
          return acc;
        }, {} as Record<string, any>)
      }));

      setColumns(newColumns);
      setRows(newRows);
      setMarkdownImport("");
      toast.success("Tabela Markdown importada com sucesso!");
    } catch (error) {
      toast.error("Erro ao importar tabela Markdown");
    }
  };

  const addColumn = () => {
    const newColumn: SpreadsheetColumn = {
      id: Date.now().toString(),
      name: `Coluna ${columns.length + 1}`,
      type: 'text',
      required: false,
      width: 120
    };
    setColumns([...columns, newColumn]);
    
    setRows(rows.map(row => ({
      ...row,
      cells: { ...row.cells, [newColumn.id]: '' }
    })));
  };

  const removeColumn = (columnId: string) => {
    setColumns(columns.filter(col => col.id !== columnId));
    setRows(rows.map(row => {
      const newCells = { ...row.cells };
      delete newCells[columnId];
      return { ...row, cells: newCells };
    }));
  };

  const addRow = () => {
    const newRow = {
      id: Date.now().toString(),
      cells: columns.reduce((acc, col) => {
        acc[col.id] = '';
        return acc;
      }, {} as Record<string, any>)
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (rowId: string) => {
    setRows(rows.filter(row => row.id !== rowId));
  };

  const updateColumnName = (columnId: string, newName: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, name: newName } : col
    ));
  };

  const updateCellValue = (rowId: string, columnId: string, value: any) => {
    setRows(rows.map(row => 
      row.id === rowId 
        ? { ...row, cells: { ...row.cells, [columnId]: value } }
        : row
    ));
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    const row = rows[rowIndex];
    const column = columns[colIndex];
    if (row && column) {
      setCellValue(row.cells[column.id] || '');
    }
  };

  const handleCellDoubleClick = () => {
    setIsEditingCell(true);
  };

  const handleCellKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (selectedCell) {
        const row = rows[selectedCell.row];
        const column = columns[selectedCell.col];
        if (row && column) {
          updateCellValue(row.id, column.id, cellValue);
        }
      }
      setIsEditingCell(false);
    } else if (e.key === 'Escape') {
      setIsEditingCell(false);
      if (selectedCell) {
        const row = rows[selectedCell.row];
        const column = columns[selectedCell.col];
        if (row && column) {
          setCellValue(row.cells[column.id] || '');
        }
      }
    }
  };

  const handleSelectEtiqueta = (etiquetaId: string) => {
    setSelectedEtiquetas(prev => 
      prev.includes(etiquetaId) 
        ? prev.filter(id => id !== etiquetaId)
        : [...prev, etiquetaId]
    );
  };

  const sidebarContent = (
    <div className="space-y-2">
      <div className="relative">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full justify-start"
          onClick={(e) => {
            e.stopPropagation();
            openPopup('etiquetas', e.currentTarget as HTMLElement);
          }}
        >
          <Tag size={16} className="mr-2" />
          Etiquetas
        </Button>
        <EtiquetaPopup
          isOpen={activePopup === 'etiquetas'}
          onClose={closeActivePopup}
          etiquetas={etiquetas}
          selectedEtiquetas={selectedEtiquetas}
          onToggleEtiqueta={handleSelectEtiqueta}
          onCreateEtiqueta={handleCreateEtiqueta}
        />
      </div>
      
      <div className="relative">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full justify-start"
          onClick={(e) => {
            e.stopPropagation();
            openPopup('checklist', e.currentTarget as HTMLElement);
          }}
        >
          <CheckSquare size={16} className="mr-2" />
          Checklist
        </Button>
        <ChecklistPopup
          isOpen={activePopup === 'checklist'}
          onClose={closeActivePopup}
          checklists={checklists}
          onUpdateChecklists={handleUpdateChecklists}
        />
      </div>
      
      <div className="relative">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full justify-start"
          onClick={(e) => {
            e.stopPropagation();
            openPopup('datas', e.currentTarget as HTMLElement);
          }}
        >
          <Clock size={16} className="mr-2" />
          Datas
        </Button>
        <DataPopup
          isOpen={activePopup === 'datas'}
          onClose={closeActivePopup}
          onSetDate={handleSetDate}
          dueDate={dueDate}
          reminderDate={reminderDate}
        />
      </div>
      
      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full justify-start"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        <Paperclip size={16} className="mr-2" />
        Anexo
      </Button>

      <div className="relative">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full justify-start"
          onClick={(e) => {
            e.stopPropagation();
            openPopup('capa', e.currentTarget as HTMLElement);
          }}
        >
          <ImageIcon size={16} className="mr-2" />
          Capa
        </Button>
        <CapaPopup
          isOpen={activePopup === 'capa'}
          onClose={closeActivePopup}
          onSetCapa={handleSetCapa}
          onSetCapaColor={handleSetCapaColor}
          onRemoveCapa={handleRemoveCapa}
          currentCapa={capa}
          currentCapaColor={capaColor}
        />
      </div>
      
      <Separator className="my-4" />
      
      <div className="relative">
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full justify-start"
          onClick={(e) => {
            e.stopPropagation();
            openPopup('mover', e.currentTarget as HTMLElement);
          }}
        >
          <ArrowRight size={16} className="mr-2" />
          Mover
        </Button>
        <MoverPopup
          isOpen={activePopup === 'mover'}
          onClose={closeActivePopup}
          onMove={handleMove}
          currentBoardId={boards.find(b => b.blocks.some(block => block.items.some(item => item.id === spreadsheet.id)))?.id}
          currentBlockId={boards.flatMap(b => b.blocks).find(block => block.items.some(item => item.id === spreadsheet.id))?.id}
        />
      </div>
      
      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full justify-start"
        onClick={(e) => e.stopPropagation()}
      >
        <Copy size={16} className="mr-2" />
        Copiar
      </Button>
      
      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full justify-start"
        onClick={(e) => e.stopPropagation()}
      >
        <Share size={16} className="mr-2" />
        Compartilhar
      </Button>
      
      <Separator className="my-4" />
      
      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full justify-start"
        onClick={(e) => {
          e.stopPropagation();
          handleArchive();
        }}
      >
        <Archive size={16} className="mr-2" />
        Arquivar
      </Button>
    </div>
  );

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={handleModalClose}
      onInteractOutside={handleDialogInteractOutside}
      title={title || "Nova Planilha"}
      location={blockName}
      onLocationClick={() => openPopup('mover', document.activeElement as HTMLElement)}
      onSave={handleSave}
      onArchive={handleArchive}
      onDelete={handleDelete}
      isMaximized={isMaximized}
      onToggleMaximize={() => setIsMaximized(!isMaximized)}
      isSaving={isSaving}
      sidebarContent={sidebarContent}
      className="max-w-6xl"
      capa={capa}
      capaColor={capaColor}
    >
      <div className="space-y-4" onClick={handleModalClick}>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          multiple
        />

        {/* Título */}
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da planilha..."
            className="text-lg font-semibold border-0 px-0 focus-visible:ring-0"
          />
        </div>

        {/* Etiquetas */}
        {selectedEtiquetas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedEtiquetas.map(etiquetaId => {
              const etiqueta = etiquetas.find(e => e.id === etiquetaId);
              if (!etiqueta) return null;
              return (
                <Badge 
                  variant="default"
                  className="text-white text-xs"
                  style={{ backgroundColor: etiqueta.color }}
                >
                  {etiqueta.name}
                </Badge>
              );
            })}
          </div>
        )}

        {/* Datas */}
        {(dueDate || reminderDate) && (
          <div className="flex flex-wrap gap-2">
            {dueDate && (
              <Badge variant="destructive" className="text-xs">
                <Clock size={12} className="mr-1" />
                Vencimento: {dueDate.toLocaleDateString()}
              </Badge>
            )}
            {reminderDate && (
              <Badge variant="secondary" className="text-xs">
                <Clock size={12} className="mr-1" />
                Lembrete: {reminderDate.toLocaleDateString()}
              </Badge>
            )}
          </div>
        )}

        {/* Importação de Markdown */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Importar Tabela Markdown</h3>
          <div className="flex gap-2">
            <Textarea
              value={markdownImport}
              onChange={(e) => setMarkdownImport(e.target.value)}
              placeholder="Cole sua tabela Markdown aqui..."
              className="flex-1 text-xs h-20"
            />
            <Button onClick={importMarkdownTable} className="self-start">
              <Upload size={14} className="mr-2" />
              Importar
            </Button>
          </div>
        </div>

        {/* Barra de Ferramentas */}
        <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
          <Button variant="ghost" size="sm">
            <Bold size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <Italic size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <Underline size={16} />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" size="sm">
            <AlignLeft size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <AlignCenter size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <AlignRight size={16} />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" size="sm">
            <Type size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <Palette size={16} />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texto</SelectItem>
              <SelectItem value="number">Número</SelectItem>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabela */}
        <div className="border rounded-md overflow-auto max-h-96" ref={tableRef}>
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-8 h-8 border bg-muted"></th>
                {columns.map((column, colIndex) => (
                  <th key={column.id} className="border bg-muted p-0 min-w-[120px]">
                    <div className="flex items-center">
                      <Input
                        value={column.name}
                        onChange={(e) => updateColumnName(column.id, e.target.value)}
                        className="border-0 bg-transparent text-center font-semibold text-xs h-8"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeColumn(column.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Minus size={12} />
                      </Button>
                    </div>
                  </th>
                ))}
                <th className="w-8 border bg-muted">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addColumn}
                    className="h-6 w-6 p-0"
                  >
                    <Plus size={12} />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.id}>
                  <td className="w-8 h-8 border bg-muted text-center text-xs">
                    <div className="flex items-center justify-center">
                      <span>{rowIndex + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRow(row.id)}
                        className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-destructive"
                      >
                        <Minus size={8} />
                      </Button>
                    </div>
                  </td>
                  {columns.map((column, colIndex) => (
                    <td 
                      key={column.id} 
                      className={`border h-8 p-0 cursor-pointer ${
                        selectedCell?.row === rowIndex && selectedCell?.col === colIndex 
                          ? 'bg-blue-100' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      onDoubleClick={handleCellDoubleClick}
                    >
                      {isEditingCell && selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? (
                        <Input
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onKeyDown={handleCellKeyDown}
                          onBlur={() => setIsEditingCell(false)}
                          className="border-0 h-8 text-xs"
                          autoFocus
                        />
                      ) : (
                        <div className="px-2 py-1 h-8 flex items-center text-xs">
                          {row.cells[column.id] || ''}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="w-8 border"></td>
                </tr>
              ))}
              <tr>
                <td className="w-8 h-8 border bg-muted">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addRow}
                    className="h-6 w-6 p-0"
                  >
                    <Plus size={12} />
                  </Button>
                </td>
                {columns.map((column) => (
                  <td key={column.id} className="border h-8"></td>
                ))}
                <td className="w-8 border"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Coordenadas da célula selecionada */}
        {selectedCell && (
          <div className="text-xs text-muted-foreground">
            Célula selecionada: {String.fromCharCode(65 + selectedCell.col)}{selectedCell.row + 1}
          </div>
        )}

        {/* Atividade */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <List size={16} />
              <h3 className="font-semibold text-sm">Atividade</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActivityDetails(!showActivityDetails)}
              className="text-xs"
            >
              {showActivityDetails ? (
                <>
                  <ChevronUp size={14} className="mr-1" />
                  Ocultar Detalhes
                </>
              ) : (
                <>
                  <ChevronDown size={14} className="mr-1" />
                  Mostrar Detalhes
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escrever um comentário..."
              className="border-0 bg-transparent focus-visible:ring-0"
            />
          </div>
          
          {showActivityDetails && (
            <div className="space-y-2">
              <div className="flex items-start gap-3 bg-muted rounded-md px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 mt-1"></div>
                <div>
                  <p className="text-sm">
                    <strong>Sistema</strong> criou esta planilha
                    <br />
                    <span className="text-xs text-muted-foreground">há poucos minutos</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseDialog>
  );
}
