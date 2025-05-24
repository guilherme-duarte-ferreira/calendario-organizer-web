
import { useEffect } from "react";
import { useCalendario } from "@/contexts/CalendarioContext";
import { Block, Spreadsheet } from "@/types/calendario";

export function useBlockAutoAdjust(block: Block) {
  const { settings } = useCalendario();

  useEffect(() => {
    if (!settings.blockAutoAdjustToSpreadsheet) {
      return;
    }

    // Get spreadsheets from block items
    const spreadsheets = block.items.filter(item => 
      item.type === 'spreadsheet' && !item.archived
    ) as Spreadsheet[];

    if (!spreadsheets.length) {
      return;
    }

    // Calculate required dimensions based on spreadsheets
    let maxWidth = settings.defaultBlockWidth;
    let maxHeight = settings.defaultBlockHeight;

    spreadsheets.forEach((spreadsheet: Spreadsheet) => {
      // Calculate width: sum of column widths + padding
      const totalWidth = spreadsheet.columns.reduce((sum, col) => sum + (col.width || 120), 0) + 40;
      
      // Calculate height: row count * row height + header + padding
      const totalHeight = (spreadsheet.rows.length * 40) + 80;

      maxWidth = Math.max(maxWidth, totalWidth);
      maxHeight = Math.max(maxHeight, totalHeight);
    });

    // Apply dimensions to the block element if it exists
    const blockElement = document.getElementById(`block-${block.id}`);
    if (blockElement) {
      // Only update if dimensions changed significantly (more than 20px difference)
      const currentWidth = blockElement.offsetWidth;
      const currentHeight = blockElement.offsetHeight;

      if (Math.abs(currentWidth - maxWidth) > 20 || Math.abs(currentHeight - maxHeight) > 20) {
        blockElement.style.width = `${maxWidth}px`;
        blockElement.style.height = `${maxHeight}px`;
      }
    }
  }, [block.items, settings.blockAutoAdjustToSpreadsheet, settings.defaultBlockWidth, settings.defaultBlockHeight, block.id]);

  return {
    adjustedWidth: settings.blockAutoAdjustToSpreadsheet && block.items.some(item => item.type === 'spreadsheet' && !item.archived)
      ? undefined // Let CSS handle it when auto-adjusting
      : settings.defaultBlockWidth,
    adjustedHeight: settings.blockAutoAdjustToSpreadsheet && block.items.some(item => item.type === 'spreadsheet' && !item.archived)
      ? undefined // Let CSS handle it when auto-adjusting
      : settings.defaultBlockHeight,
  };
}
