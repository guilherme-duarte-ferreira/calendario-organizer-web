
import { useEffect } from "react";
import { useCalendario } from "@/contexts/CalendarioContext";
import { Block, Spreadsheet } from "@/types/calendario";

export function useBlockAutoAdjust(block: Block) {
  const { settings, updateBlock } = useCalendario();

  useEffect(() => {
    if (!settings.blockAutoAdjustToSpreadsheet || !block.spreadsheets?.length) {
      return;
    }

    // Calculate required dimensions based on spreadsheets
    let maxWidth = settings.defaultBlockWidth;
    let maxHeight = settings.defaultBlockHeight;

    block.spreadsheets.forEach((spreadsheet: Spreadsheet) => {
      if (spreadsheet.archived) return;

      // Calculate width: sum of column widths + padding
      const totalWidth = spreadsheet.columns.reduce((sum, col) => sum + (col.width || 120), 0) + 40;
      
      // Calculate height: row count * row height + header + padding
      const totalHeight = (spreadsheet.rows.length * 40) + 80;

      maxWidth = Math.max(maxWidth, totalWidth);
      maxHeight = Math.max(maxHeight, totalHeight);
    });

    // Only update if dimensions changed significantly (more than 20px difference)
    const currentWidth = block.width || settings.defaultBlockWidth;
    const currentHeight = block.height || settings.defaultBlockHeight;

    if (Math.abs(currentWidth - maxWidth) > 20 || Math.abs(currentHeight - maxHeight) > 20) {
      updateBlock(block.id, {
        width: maxWidth,
        height: maxHeight,
      });
    }
  }, [block.spreadsheets, settings.blockAutoAdjustToSpreadsheet, settings.defaultBlockWidth, settings.defaultBlockHeight, block.id, block.width, block.height, updateBlock]);

  return {
    adjustedWidth: settings.blockAutoAdjustToSpreadsheet && block.spreadsheets?.length 
      ? block.width 
      : settings.defaultBlockWidth,
    adjustedHeight: settings.blockAutoAdjustToSpreadsheet && block.spreadsheets?.length 
      ? block.height 
      : settings.defaultBlockHeight,
  };
}
