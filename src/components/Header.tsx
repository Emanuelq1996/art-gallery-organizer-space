
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FolderPlus, Home, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  currentPath: string[];
  onNavigateBack: () => void;
  onNavigateToRoot: () => void;
  onUpload: () => void;
  onCreateFolder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigateBack,
  onNavigateToRoot,
  onUpload,
  onCreateFolder
}) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Galería de Arte
            </h1>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateToRoot}
                className="flex items-center space-x-1 hover:bg-gray-100"
              >
                <Home size={16} />
                <span>Inicio</span>
              </Button>
              
              {currentPath.map((segment, index) => (
                <React.Fragment key={index}>
                  <span className="text-gray-400">/</span>
                  <span className="font-medium">{segment}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {currentPath.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNavigateBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft size={16} />
                <span>Atrás</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateFolder}
              className="flex items-center space-x-2"
            >
              <FolderPlus size={16} />
              <span>Nueva Carpeta</span>
            </Button>
            
            <Button
              onClick={onUpload}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Upload size={16} />
              <span>Subir Obra</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
