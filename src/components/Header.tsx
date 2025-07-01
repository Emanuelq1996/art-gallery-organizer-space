
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FolderPlus, Home, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive"
      });
    }
  };

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
            <div className="flex items-center space-x-2 text-sm text-gray-600 mr-4">
              <span>Bienvenido,</span>
              <span className="font-medium">
                {user?.displayName || user?.email || 'Usuario'}
              </span>
              {user?.email === 'artist@mock.com' && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                  MOCK
                </span>
              )}
            </div>

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

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut size={16} />
              <span>Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
