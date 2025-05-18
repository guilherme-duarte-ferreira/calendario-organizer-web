
import { useState } from "react";
import { Spreadsheet, SpreadsheetColumn, SpreadsheetRow } from "@/types/calendario";
import { useCalendario } from "@/contexts/CalendarioContext";
import { useDragDrop } from "@/hooks/use-drag-drop";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  Copy,
  Edit,
  Grid3X3,
  MoreVertical,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { generateId } from "@/utils/storage";
import { tableToMarkdown } from "@/utils/markdown";

interface SpreadsheetItemProps {
  spreadsheet: Spreadsheet;
}

export default function SpreadsheetItem({ spreadsheet }: SpreadsheetItemProps) {
  const { updateItem, archiveItem, deleteItem } = useCalendario();
  const { isDragging, handlers } = useDragDrop({
    onDragStart: (e, id) => {
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.setData("application/calendario-spreadsheet", JSON.stringify(spreadsheet));
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [spreadsheetData, setSpreadsheetData] = useState({ ...spreadsheet });
  const [exportText, setExportText] = useState("");
  const [activeTab, setActiveTab] = useState<"data" | "columns">("data");

  const handleSave = () => {
    updateItem(spreadsheetData);
    setIsEditing(false);
  };

  const handleAddColumn = () => {
    const newColumn: SpreadsheetColumn = {
      id: generateId(),
      name: "Nova coluna",
      type: "text",
      required: false,
      width: 150,
    };
    
    setSpreadsheetData({
      ...spreadsheetData,
      columns: [...spreadsheetData.columns, newColumn],
    });
  };

  const handleUpdateColumn = (id: string, field: string, value: any) => {
    const updatedColumns = spreadsheetData.columns.map(col => {
      if (col.id === id) {
        return { ...col, [field]: value };
      }
      return col;
    });
    
    setSpreadsheetData({
      ...spreadsheetData,
      columns: updatedColumns,
    });
  };

  const handleDeleteColumn = (id: string) => {
    // Remover a coluna
    const updatedColumns = spreadsheetData.columns.filter(col => col.id !== id);
    
    // Remover os dados desta coluna de todas as linhas
    const updatedRows = spreadsheetData.rows.map(row => {
      const updatedCells = { ...row.cells };
      delete updatedCells[id];
      return {
        ...row,
        cells: updatedCells
      };
    });
    
    setSpreadsheetData({
      ...spreadsheetData,
      columns: updatedColumns,
      rows: updatedRows
    });
  };

  const handleAddRow = () => {
    const newRow: SpreadsheetRow = {
      id: generateId(),
      cells: {}
    };
    
    setSpreadsheetData({
      ...spreadsheetData,
      rows: [...spreadsheetData.rows, newRow]
    });
  };

  const handleDeleteRow = (id: string) => {
    const updatedRows = spreadsheetData.rows.filter(row => row.id !== id);
    
    setSpreadsheetData({
      ...spreadsheetData,
      rows: updatedRows
    });
  };

  const handleCellChange = (rowId: string, columnId: string, value: any) => {
    const updatedRows = spreadsheetData.rows.map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          cells: {
            ...row.cells,
            [columnId]: value
          }
        };
      }
      return row;
    });
    
    setSpreadsheetData({
      ...spreadsheetData,
      rows: updatedRows
    });
  };

  const handleExport = () => {
    const markdown = tableToMarkdown(spreadsheet.columns, spreadsheet.rows);
    setExportText(markdown);
    setExportDialogOpen(true);
  };

  // Visualização simplificada para o item no bloco
  return (
    <>
      <div
        className={`calendario-card select-none ${isDragging ? "opacity-50" : ""}`}
        draggable
        onDragStart={(e) => handlers.handleDragStart(e, spreadsheet.id)}
        onDragEnd={handlers.handleDragEnd}
        onClick={() => setIsEditing(true)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Grid3X3 size={16} className="mr-2 text-primary" />
            <div className="font-medium truncate">{spreadsheet.title}</div>
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
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setShowMenu(false);
              }}>
                <Edit size={16} className="mr-2" />
                <span>Editar</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                handleExport();
                setShowMenu(false);
              }}>
                <Copy size={16} className="mr-2" />
                <span>Exportar como Markdown</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                archiveItem(spreadsheet.id, "spreadsheet");
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

        <div className="mt-2 border rounded overflow-hidden">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted">
                {spreadsheet.columns.slice(0, 3).map((col) => (
                  <th key={col.id} className="p-1 text-left font-medium truncate border-b">
                    {col.name}
                  </th>
                ))}
                {spreadsheet.columns.length > 3 && (
                  <th className="p-1 border-b">...</th>
                )}
              </tr>
            </thead>
            <tbody>
              {spreadsheet.rows.slice(0, 2).map((row) => (
                <tr key={row.id}>
                  {spreadsheet.columns.slice(0, 3).map((col) => (
                    <td key={col.id} className="p-1 truncate border-b">
                      {row.cells[col.id] || ""}
                    </td>
                  ))}
                  {spreadsheet.columns.length > 3 && (
                    <td className="p-1 border-b">...</td>
                  )}
                </tr>
              ))}
              {spreadsheet.rows.length > 2 && (
                <tr>
                  <td 
                    colSpan={Math.min(spreadsheet.columns.length, 4)} 
                    className="text-center p-1 text-muted-foreground"
                  >
                    ...
                  </td>
                </tr>
              )}
              {spreadsheet.rows.length === 0 && (
                <tr>
                  <td 
                    colSpan={Math.min(spreadsheet.columns.length, 4)} 
                    className="text-center p-1 text-muted-foreground"
                  >
                    Sem dados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diálogo de edição da planilha */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Editar Planilha</DialogTitle>
          </DialogHeader>

          <div className="py-4 flex flex-col h-full max-h-[70vh]">
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={spreadsheetData.title}
                onChange={(e) => setSpreadsheetData({ ...spreadsheetData, title: e.target.value })}
                className="border px-2 py-1 rounded"
                placeholder="Título da planilha"
              />
              
              <div className="flex gap-2">
                <Button 
                  variant={activeTab === "data" ? "default" : "outline"} 
                  onClick={() => setActiveTab("data")}
                  className="text-xs h-8"
                >
                  Dados
                </Button>
                <Button 
                  variant={activeTab === "columns" ? "default" : "outline"} 
                  onClick={() => setActiveTab("columns")}
                  className="text-xs h-8"
                >
                  Colunas
                </Button>
              </div>
            </div>
            
            {activeTab === "columns" ? (
              <div className="overflow-y-auto flex-1">
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-medium">Configuração de colunas</h3>
                  <Button 
                    size="sm" 
                    onClick={handleAddColumn}
                    className="h-8"
                  >
                    <Plus size={16} className="mr-1" /> Adicionar coluna
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {spreadsheetData.columns.map((col, index) => (
                    <div key={col.id} className="flex items-center gap-2 p-2 border rounded">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={col.name}
                          onChange={(e) => handleUpdateColumn(col.id, "name", e.target.value)}
                          className="border px-2 py-1 rounded text-sm"
                          placeholder="Nome da coluna"
                        />
                        
                        <select
                          value={col.type}
                          onChange={(e) => handleUpdateColumn(col.id, "type", e.target.value)}
                          className="border px-2 py-1 rounded text-sm"
                        >
                          <option value="text">Texto</option>
                          <option value="number">Número</option>
                          <option value="date">Data</option>
                          <option value="time">Hora</option>
                          <option value="currency">Moeda</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="weight">Peso</option>
                          <option value="percentage">Porcentagem</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <label className="text-xs flex items-center gap-1">
                          <input 
                            type="checkbox" 
                            checked={col.required}
                            onChange={(e) => handleUpdateColumn(col.id, "required", e.target.checked)}
                          />
                          Obrigatório
                        </label>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteColumn(col.id)}
                          className="h-6 w-6 text-destructive"
                          disabled={spreadsheetData.columns.length <= 1}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-auto flex-1 border rounded">
                {/* Tabela de dados */}
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="w-8 p-1 border-r text-center">#</th>
                      {spreadsheetData.columns.map((col) => (
                        <th key={col.id} className="p-1 text-left font-medium border-r">
                          {col.name}
                        </th>
                      ))}
                      <th className="w-8 p-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {spreadsheetData.rows.map((row, rowIndex) => (
                      <tr key={row.id} className="border-t hover:bg-muted/30">
                        <td className="p-1 border-r text-center text-muted-foreground">
                          {rowIndex + 1}
                        </td>
                        {spreadsheetData.columns.map((col) => (
                          <td key={col.id} className="p-1 border-r">
                            {col.type === "checkbox" ? (
                              <input 
                                type="checkbox"
                                checked={!!row.cells[col.id]}
                                onChange={(e) => 
                                  handleCellChange(row.id, col.id, e.target.checked)
                                }
                              />
                            ) : (
                              <input
                                type={getInputType(col.type)}
                                value={row.cells[col.id] || ""}
                                onChange={(e) => 
                                  handleCellChange(row.id, col.id, e.target.value)
                                }
                                className="w-full border-none p-0 focus:outline-none focus:ring-1 focus:ring-primary rounded"
                              />
                            )}
                          </td>
                        ))}
                        <td className="p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRow(row.id)}
                            className="h-6 w-6 text-destructive"
                          >
                            <X size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    
                    {/* Linha para adicionar nova linha */}
                    <tr className="border-t">
                      <td colSpan={spreadsheetData.columns.length + 2}>
                        <Button
                          variant="ghost"
                          className="w-full h-8 text-xs"
                          onClick={handleAddRow}
                        >
                          <Plus size={14} className="mr-1" /> Adicionar linha
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => archiveItem(spreadsheet.id, "spreadsheet")}
              >
                <Archive size={16} className="mr-1" /> Arquivar
              </Button>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 size={16} className="mr-1" /> Excluir
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setSpreadsheetData({ ...spreadsheet });
                setIsEditing(false);
              }}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir planilha</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a planilha "{spreadsheet.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                deleteItem(spreadsheet.id, "spreadsheet");
                setDeleteDialogOpen(false);
                setIsEditing(false);
              }}
            >
              Excluir permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar como Markdown</DialogTitle>
            <DialogDescription>
              Copie o texto abaixo para usar a tabela em formato Markdown.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <pre className="bg-muted p-2 rounded overflow-auto max-h-[300px] text-xs font-mono">
              {exportText}
            </pre>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(exportText);
              }}
            >
              Copiar para área de transferência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Função auxiliar para determinar o tipo de input HTML com base no tipo de coluna
function getInputType(columnType: string): string {
  switch (columnType) {
    case "number":
    case "percentage":
    case "weight":
      return "number";
    case "date":
      return "date";
    case "time":
      return "time";
    default:
      return "text";
  }
}
