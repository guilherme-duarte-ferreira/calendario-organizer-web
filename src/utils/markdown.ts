
import { generateId } from "./storage";
import { SpreadsheetColumn, SpreadsheetRow } from "@/types/calendario";

/**
 * Converte uma tabela em Markdown para uma estrutura de dados de planilha
 * @param markdown Texto em formato Markdown
 * @returns Objeto com colunas e linhas para uma planilha
 */
export const markdownToTable = (markdown: string): { 
  columns: SpreadsheetColumn[],
  rows: SpreadsheetRow[] 
} => {
  // Dividir o markdown em linhas
  const lines = markdown.trim().split("\n");
  
  if (lines.length < 2) {
    throw new Error("Formato de tabela Markdown inválido: precisa de pelo menos uma linha de cabeçalho e uma linha de separador");
  }
  
  // Extrair cabeçalhos (primeira linha)
  const headers = lines[0]
    .trim()
    .replace(/^\||\|$/g, "") // Remover pipes do início e fim
    .split("|")
    .map(header => header.trim());
  
  // Verificar se a segunda linha é um separador
  const secondLine = lines[1].trim();
  const isSeparator = /^\|?([-:]+\|)+[-:]+\|?$/.test(secondLine);
  
  if (!isSeparator) {
    throw new Error("Formato de tabela Markdown inválido: a segunda linha deve ser um separador");
  }
  
  // Criar colunas
  const columns: SpreadsheetColumn[] = headers.map((header, index) => ({
    id: generateId(),
    name: header,
    type: "text", // Por padrão, todas as colunas são texto
    required: false,
    width: 150
  }));
  
  // Criar linhas, começando da terceira linha (índice 2)
  const rows: SpreadsheetRow[] = [];
  
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const cells: Record<string, any> = {};
    const values = line
      .replace(/^\||\|$/g, "") // Remover pipes do início e fim
      .split("|")
      .map(cell => cell.trim());
    
    // Mapear valores para as colunas correspondentes
    values.forEach((value, index) => {
      if (index < columns.length) {
        cells[columns[index].id] = value;
      }
    });
    
    rows.push({
      id: generateId(),
      cells
    });
  }
  
  return { columns, rows };
};

/**
 * Converte uma estrutura de dados de planilha para Markdown
 * @param columns Definições das colunas
 * @param rows Dados das linhas
 * @returns Texto em formato Markdown
 */
export const tableToMarkdown = (
  columns: SpreadsheetColumn[],
  rows: SpreadsheetRow[]
): string => {
  if (columns.length === 0) {
    return "";
  }
  
  // Criar cabeçalho
  const headerRow = `| ${columns.map(col => col.name).join(" | ")} |`;
  
  // Criar separador
  const separator = `| ${columns.map(() => "---").join(" | ")} |`;
  
  // Criar linhas de dados
  const dataRows = rows.map(row => {
    return `| ${columns.map(col => {
      const value = row.cells[col.id];
      return value !== undefined ? value : "";
    }).join(" | ")} |`;
  });
  
  // Juntar tudo
  return [headerRow, separator, ...dataRows].join("\n");
};
