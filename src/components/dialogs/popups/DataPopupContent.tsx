import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PopoverClose } from "@/components/ui/popover";

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(dueDate || reminderDate || new Date());

  const handleSetDueDate = () => {
    if (selectedDate) {
      onSetDate(selectedDate, 'due');
    }
  };

  const handleSetReminder = () => {
    if (selectedDate) {
      onSetDate(selectedDate, 'reminder');
    }
  };

  const handleRemoveDate = (type: 'due' | 'reminder') => {
    onSetDate(null, type);
  };

  return (
    <>
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
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={ptBR}
          className="rounded-md border"
        />

        <div className="space-y-3 mt-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Data de Vencimento</span>
              {dueDate && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveDate('due')}
                  className="h-6 text-xs text-red-600"
                >
                  Remover
                </Button>
              )}
            </div>
            {dueDate ? (
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded border">
                <CalendarIcon size={14} className="text-red-600" />
                <span className="text-sm">{format(dueDate, "dd 'de' MMMM", { locale: ptBR })}</span>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSetDueDate}
                className="w-full text-xs h-8"
                disabled={!selectedDate}
              >
                Definir Vencimento
              </Button>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Lembrete</span>
              {reminderDate && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveDate('reminder')}
                  className="h-6 text-xs text-red-600"
                >
                  Remover
                </Button>
              )}
            </div>
            {reminderDate ? (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded border">
                <Clock size={14} className="text-yellow-600" />
                <span className="text-sm">{format(reminderDate, "dd 'de' MMMM", { locale: ptBR })}</span>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSetReminder}
                className="w-full text-xs h-8"
                disabled={!selectedDate}
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