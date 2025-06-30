
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder, MoreVertical, Trash2, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Folder as FolderType } from '@/types/artwork';
import { EditFolderModal } from './EditFolderModal';

interface FolderViewProps {
  folders: FolderType[];
  onFolderClick: (folderName: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onEditFolder: (folderId: string, newName: string) => void;
}

export const FolderView: React.FC<FolderViewProps> = ({
  folders,
  onFolderClick,
  onDeleteFolder,
  onEditFolder
}) => {
  const [editingFolder, setEditingFolder] = useState<FolderType | null>(null);

  const handleEditFolder = (newName: string) => {
    if (editingFolder) {
      onEditFolder(editingFolder.id, newName);
      setEditingFolder(null);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Carpetas</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {folders.map((folder) => (
          <Card 
            key={folder.id}
            className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
          >
            <CardContent className="p-4 relative">
              <div 
                className="flex flex-col items-center text-center"
                onClick={() => onFolderClick(folder.name)}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                  <Folder size={32} className="text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-800 text-sm truncate w-full">
                  {folder.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {folder.artworks.length} obra{folder.artworks.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setEditingFolder(folder)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit size={16} className="mr-2" />
                    Editar nombre
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDeleteFolder(folder.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingFolder && (
        <EditFolderModal
          onClose={() => setEditingFolder(null)}
          onEdit={handleEditFolder}
          currentName={editingFolder.name}
        />
      )}
    </div>
  );
};
