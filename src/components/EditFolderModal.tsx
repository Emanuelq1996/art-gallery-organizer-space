
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditFolderModalProps {
  onClose: () => void;
  onEdit: (newName: string) => void;
  currentName: string;
}

export const EditFolderModal: React.FC<EditFolderModalProps> = ({
  onClose,
  onEdit,
  currentName
}) => {
  const [folderName, setFolderName] = useState(currentName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim() && folderName.trim() !== currentName) {
      onEdit(folderName.trim());
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Nombre de Carpeta</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="folderName">Nombre de la carpeta</Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Ej: Paisajes, Retratos, etc."
              autoFocus
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={!folderName.trim() || folderName.trim() === currentName}
              className="flex-1"
            >
              Guardar Cambios
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
