import React, { useState, useRef, useEffect } from "react";
import { Spreadsheet, SpreadsheetColumn } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import BaseDialog from "./BaseDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
  Upload
} from "lucide-react";
import { toast } from "sonner";

interface SpreadsheetDialogProps {
  spreadsheet: Spreadsheet;
  isOpen: boolean;
  onClose: () => void;
  blockName?: string;
}

export default function SpreadsheetDialog({ 
  spreadsheet, 
  isOpen, 
  onClose, 
  blockName 
}: SpreadsheetDialogProps) {
  const { updateItem, deleteItem } = useCalendario();
  
  const [title, setTitle] = useState(spreadsheet.title);
  const [columns, setColumns] = useState(spreadsheet.columns);
  const [rows, setRows] = useState(spreadsheet.rows);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [isEditingCell, setIsEditingCell] = useState(false);
  const [cellValue, setCellValue] = useState("");
  const [markdownImport, setMarkdownImport] = useState("");

  const tableRef = useRef<HTMLDivElement>(null);

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

      // Parse header
      const headerLine = lines[0];
      const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);
      
      // Parse data rows (skip separator line)
      const dataRows = lines.slice(2).map(line => 
        line.split('|').map(cell => cell.trim()).filter(cell => cell)
      );

      // Create columns
      const newColumns: SpreadsheetColumn[] = headers.map((header, index) => ({
        id: `col_${Date.now()}_${index}`,
        name: header,
        type: 'text',
        required: false,
        width: 120
      }));

      // Create rows
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
    
    // Adicionar célula vazia para cada linha existente
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

  const updateColumnType = (columnId: string, newType: SpreadsheetColumn['type']) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, type: newType } : col
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

  const sidebarContent = (
    <div className="space-y-2">
      <Button variant="secondary" size="sm" className="w-full justify-start">
        <Copy size={16} className="mr-2" />
        Copiar Planilha
      </Button>
      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full justify-start"
        onClick={handleArchive}
      >
        <Archive size={16} className="mr-2" />
        Arquivar Planilha
      </Button>
      <Button variant="secondary" size="sm" className="w-full justify-start">
        <Share size={16} className="mr-2" />
        Compartilhar
      </Button>
      <Button 
        variant="secondary" 
        size="sm" 
        className="w-full justify-start text-destructive"
        onClick={handleDelete}
      >
        <Trash2 size={16} className="mr-2" />
        Excluir Planilha
      </Button>
    </div>
  );

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title || "Nova Planilha"}
      location={blockName}
      onSave={handleSave}
      onArchive={handleArchive}
      onDelete={handleDelete}
      isMaximized={isMaximized}
      onToggleMaximize={() => setIsMaximized(!isMaximized)}
      isSaving={isSaving}
      sidebarContent={sidebarContent}
      className="max-w-6xl"
    >
      <div className="space-y-4">
        {/* Título */}
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da planilha..."
            className="text-lg font-semibold border-0 px-0 focus-visible:ring-0"
          />
        </div>

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
      </div>
    </BaseDialog>
  );
}
