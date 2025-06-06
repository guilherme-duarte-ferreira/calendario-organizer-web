import React from 'react';
import { Button } from '@/components/ui/button';

// Ações que a barra pode executar, passadas como props.
interface ActionbarProps {
  onSave: () => void;
  onCancel: () => void;
  // Futuramente, podemos adicionar onCopy aqui.
}

/**
 * Barra de Ações para o rodapé do editor TipTap.
 * Fornece os controles para confirmar ou descartar as alterações.
 */
const Actionbar: React.FC<ActionbarProps> = ({ onSave, onCancel }) => {
  return (
    <div className="editor-actions flex justify-end items-center gap-2 p-2 border-t border-input">
      <Button variant="ghost" onClick={onCancel}>
        Cancelar
      </Button>
      <Button onClick={onSave}>
        Salvar
      </Button>
    </div>
  );
};

export default Actionbar; 