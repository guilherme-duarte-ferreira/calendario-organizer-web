
// Tipos e interfaces para o sistema Calendario

export type ThemeMode = 'light' | 'dark';
export type ScrollOrientation = 'horizontal' | 'vertical';

export interface Board {
  id: string;
  name: string;
  blocks: Block[];
  wallpaper?: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  pinnedOrder?: number; // Se pinado, qual a ordem
}

export interface BoardFolder {
  id: string;
  name: string;
  boardIds: string[];
  subfolders: string[]; // IDs de subpastas
  expanded: boolean;
  archived: boolean;
  pinnedOrder?: number; // Se pinado, qual a ordem
}

export interface Block {
  id: string;
  name: string;
  boardId: string;
  items: Array<Card | Spreadsheet | MarkdownNote | FileItem>;
  order: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ItemType = 'card' | 'spreadsheet' | 'markdown' | 'file';

export interface BaseItem {
  id: string;
  type: ItemType;
  blockId: string;
  order: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Card extends BaseItem {
  type: 'card';
  title: string;
  description: string; // Suporta Markdown
  status: 'pending' | 'completed';
  checklist?: ChecklistItem[];
  attachments?: Attachment[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  fileType: string; // 'pdf', 'image', 'link', etc
  url: string;
  thumbnail?: string;
}

export interface Spreadsheet extends BaseItem {
  type: 'spreadsheet';
  title: string;
  columns: SpreadsheetColumn[];
  rows: SpreadsheetRow[];
  lastEditedAt: string;
}

export interface SpreadsheetColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'time' | 'currency' | 'checkbox' | 'weight' | 'percentage';
  required: boolean;
  width: number; // em pixels
}

export interface SpreadsheetRow {
  id: string;
  cells: Record<string, any>; // key é o id da coluna
}

export interface MarkdownNote extends BaseItem {
  type: 'markdown';
  content: string;
}

export interface FileItem extends BaseItem {
  type: 'file';
  name: string;
  fileType: string; // 'image', 'pdf', 'doc', etc
  url: string;
  thumbnail?: string;
}

export interface CalendarioSettings {
  theme: ThemeMode;
  wallpaper?: string;
  scrollOrientation: ScrollOrientation;
  blockAutoAdjustToSpreadsheet: boolean;
  editSpreadsheetsInWorkspace: boolean;
  defaultBlockWidth: number; // em pixels
  defaultBlockHeight: number; // em pixels
  autoSaveInterval: number; // em segundos
  horizontalBlockAlignment: boolean; // para o parâmetro de novos blocos alinharem horizontalmente
}

export interface Version {
  id: string;
  timestamp: string;
  data: string; // JSON stringified data
  description: string;
}
