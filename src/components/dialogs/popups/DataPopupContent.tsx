/**
 * @file DataPopupContent.tsx
 * @description Componente para selecionar datas de vencimento e lembretes usando um calendário.
 * Permite definir ou remover essas datas.
 * Projetado para ser usado como conteúdo de um Popover.
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PopoverClose } from "@/components/ui/popover";

/**
 * Props necessárias para o componente DataPopupContent
 */
interface DataPopupContentProps {
  onClosePopup?: () => void;
  onSetDate: (date: Date | null, type: 'due' | 'reminder') => void;
  dueDate?: Date | null;
  reminderDate?: Date | null;
}

export default function DataPopupContent({
  onClosePopup,
  onSetDate,
  dueDate,
  reminderDate
}: DataPopupContentProps) {
  // Estado para a data selecionada no calendário
  // Inicializa com dueDate, reminderDate, ou a data atual como fallback
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dueDate || reminderDate || new Date()
  );

  /**
   * Define a data de vencimento usando a data selecionada no calendário
   * NOTA: Este pop-up NÃO fecha automaticamente ao definir uma data
   */
  const handleSetDueDate = () => {
    if (selectedDate) {
      onSetDate(selectedDate, 'due');
    }
  };

  /**
   * Define a data de lembrete usando a data selecionada no calendário
   * NOTA: Este pop-up NÃO fecha automaticamente ao definir uma data
   */
  const handleSetReminder = () => {
    if (selectedDate) {
      onSetDate(selectedDate, 'reminder');
    }
  };

  /**
   * Remove uma data (vencimento ou lembrete)
   * NOTA: Este pop-up NÃO fecha automaticamente ao remover uma data
   */
  const handleRemoveDate = (type: 'due' | 'reminder') => {
    onSetDate(null, type);
  };

  return (
    <>
      {/* Cabeçalho do Pop-up */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Datas</h3>
          <PopoverClose asChild>
            <Button variant="ghost" size="sm" onClick={onClosePopup} className="h-6 w-6 p-0">
              <X size={14} />
            </Button>
          </PopoverClose>
        </div>
      </div>

      <div className="p-3">
        {/* Componente Calendário para seleção de data */}
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={ptBR}
          className="rounded-md border"
        />

        <div className="space-y-3 mt-4">
          {/* Seção Data de Vencimento */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span className="text-sm font-medium">Data de Vencimento</span>
              </div>
              {dueDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDate('due')}
                  className="h-6 text-xs"
                >
                  Remover
                </Button>
              )}
            </div>
            {dueDate ? (
              <div className="text-sm text-muted-foreground">
                {dueDate.toLocaleDateString()}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetDueDate}
                className="w-full text-xs h-8"
              >
                Definir Data de Vencimento
              </Button>
            )}
          </div>

          {/* Seção Lembrete */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span className="text-sm font-medium">Lembrete</span>
              </div>
              {reminderDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDate('reminder')}
                  className="h-6 text-xs"
                >
                  Remover
                </Button>
              )}
            </div>
            {reminderDate ? (
              <div className="text-sm text-muted-foreground">
                {reminderDate.toLocaleDateString()}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetReminder}
                className="w-full text-xs h-8"
              >
                Definir Lembrete
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 