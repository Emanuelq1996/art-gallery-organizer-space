import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { FolderView } from './FolderView';
import { GalleryView } from './GalleryView';
import { UploadModal } from './UploadModal';
import { CreateFolderModal } from './CreateFolderModal';
import { Folder, Artwork } from '@/types/artwork';
import { folderService } from '@/services/folderService';
import { artworkService } from '@/services/artworkService';
import { useToast } from '@/hooks/use-toast';

export const ArtworkManager = () => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const { toast } = useToast();

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log('Loading initial data...');
      
      // Cargar carpetas y obras desde Firebase
      const [foldersData, artworksData] = await Promise.all([
        folderService.getAllFolders(),
        artworkService.getAllArtworks()
      ]);

      // Organizar obras dentro de las carpetas correspondientes
      const foldersWithArtworks = foldersData.map(folder => ({
        ...folder,
        artworks: artworksData.filter(artwork => 
          artwork.folderPath.length === folder.path.length &&
          artwork.folderPath.every((segment, index) => segment === folder.path[index])
        )
      }));

      setFolders(foldersWithArtworks);
      console.log('Initial data loaded successfully');
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos. Usando datos locales.",
        variant: "destructive"
      });
      
      // Fallback a datos locales si Firebase falla
      setFolders([
        {
          id: '1',
          name: 'Pinturas',
          path: ['Pinturas'],
          artworks: []
        },
        {
          id: '2',
          name: 'Esculturas',
          path: ['Esculturas'],
          artworks: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentFolder = () => {
    if (currentPath.length === 0) return null;
    return folders.find(folder => 
      folder.path.length === currentPath.length &&
      folder.path.every((segment, index) => segment === currentPath[index])
    );
  };

  const getCurrentSubfolders = () => {
    return folders.filter(folder => 
      folder.path.length === currentPath.length + 1 &&
      folder.path.every((segment, index) => 
        index < currentPath.length ? segment === currentPath[index] : true
      )
    );
  };

  const getRootFolders = () => {
    return folders.filter(folder => folder.path.length === 1);
  };

  const navigateToFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName]);
  };

  const navigateBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const navigateToRoot = () => {
    setCurrentPath([]);
  };

  const createFolder = async (name: string) => {
    try {
      const newFolder: Omit<Folder, 'id'> = {
        name,
        path: [...currentPath, name],
        artworks: []
      };

      const folderId = await folderService.createFolder(newFolder);
      
      const folderWithId: Folder = {
        ...newFolder,
        id: folderId
      };

      setFolders([...folders, folderWithId]);
      
      toast({
        title: "Éxito",
        description: "Carpeta creada correctamente"
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la carpeta",
        variant: "destructive"
      });
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      await folderService.deleteFolder(folderId);
      setFolders(folders.filter(folder => folder.id !== folderId));
      
      toast({
        title: "Éxito",
        description: "Carpeta eliminada correctamente"
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la carpeta",
        variant: "destructive"
      });
    }
  };

  const editFolder = async (folderId: string, newName: string) => {
    try {
      const folderToEdit = folders.find(f => f.id === folderId);
      if (!folderToEdit) return;

      const oldPath = folderToEdit.path;
      const newPath = [...folderToEdit.path];
      newPath[newPath.length - 1] = newName;

      // Actualizar la carpeta principal
      await folderService.updateFolder(folderId, {
        name: newName,
        path: newPath
      });

      // Encontrar y actualizar carpetas hijas
      const childFolders = folders.filter(folder => 
        folder.path.length > oldPath.length &&
        folder.path.slice(0, oldPath.length).every((segment, index) => segment === oldPath[index])
      );

      const batchUpdates = childFolders.map(folder => ({
        id: folder.id,
        data: {
          path: folder.path.map((segment, index) => 
            index === oldPath.length - 1 ? newName : segment
          )
        }
      }));

      if (batchUpdates.length > 0) {
        await folderService.updateMultipleFolders(batchUpdates);
      }

      // Actualizar estado local
      setFolders(prevFolders => {
        return prevFolders.map(folder => {
          if (folder.id === folderId) {
            return { ...folder, name: newName, path: newPath };
          }
          
          if (folder.path.length > oldPath.length &&
              folder.path.slice(0, oldPath.length).every((segment, index) => segment === oldPath[index])) {
            const updatedPath = [...folder.path];
            updatedPath[oldPath.length - 1] = newName;
            return { ...folder, path: updatedPath };
          }
          
          return folder;
        });
      });

      toast({
        title: "Éxito",
        description: "Carpeta editada correctamente"
      });
    } catch (error) {
      console.error('Error editing folder:', error);
      toast({
        title: "Error",
        description: "No se pudo editar la carpeta",
        variant: "destructive"
      });
    }
  };

  const addArtwork = async (artwork: Omit<Artwork, 'id' | 'folderPath'>, imageFile?: File) => {
    try {
      let imageUrl = artwork.imageUrl;

      // Si hay un archivo de imagen, subirlo a Firebase Storage
      if (imageFile) {
        imageUrl = await artworkService.uploadImage(imageFile, currentPath);
      }

      const newArtwork: Omit<Artwork, 'id'> = {
        ...artwork,
        imageUrl,
        folderPath: currentPath
      };

      const artworkId = await artworkService.createArtwork(newArtwork);

      // Actualizar estado local
      const artworkWithId: Artwork = {
        ...newArtwork,
        id: artworkId
      };

      const folderIndex = folders.findIndex(folder => 
        folder.path.length === currentPath.length &&
        folder.path.every((segment, index) => segment === currentPath[index])
      );

      if (folderIndex !== -1) {
        const updatedFolders = [...folders];
        updatedFolders[folderIndex].artworks.push(artworkWithId);
        setFolders(updatedFolders);
      }

      toast({
        title: "Éxito",
        description: "Obra agregada correctamente"
      });
    } catch (error) {
      console.error('Error adding artwork:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la obra",
        variant: "destructive"
      });
    }
  };

  const updateArtwork = async (artworkId: string, updates: Partial<Artwork>) => {
    try {
      await artworkService.updateArtwork(artworkId, updates);

      const updatedFolders = folders.map(folder => ({
        ...folder,
        artworks: folder.artworks.map(artwork => 
          artwork.id === artworkId ? { ...artwork, ...updates } : artwork
        )
      }));
      setFolders(updatedFolders);

      toast({
        title: "Éxito",
        description: "Obra actualizada correctamente"
      });
    } catch (error) {
      console.error('Error updating artwork:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la obra",
        variant: "destructive"
      });
    }
  };

  const deleteArtwork = async (artworkId: string) => {
    try {
      // Encontrar la obra para obtener la URL de la imagen
      const artwork = folders
        .flatMap(folder => folder.artworks)
        .find(art => art.id === artworkId);

      await artworkService.deleteArtwork(artworkId, artwork?.imageUrl);

      const updatedFolders = folders.map(folder => ({
        ...folder,
        artworks: folder.artworks.filter(artwork => artwork.id !== artworkId)
      }));
      setFolders(updatedFolders);

      toast({
        title: "Éxito",
        description: "Obra eliminada correctamente"
      });
    } catch (error) {
      console.error('Error deleting artwork:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la obra",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎨</div>
          <p className="text-lg text-gray-600">Cargando galería...</p>
        </div>
      </div>
    );
  }

  const currentFolder = getCurrentFolder();
  const subfolders = currentPath.length === 0 ? getRootFolders() : getCurrentSubfolders();
  const artworks = currentFolder?.artworks || [];

  return (
    <div className="min-h-screen">
      <Header 
        currentPath={currentPath}
        onNavigateBack={navigateBack}
        onNavigateToRoot={navigateToRoot}
        onUpload={() => setShowUploadModal(true)}
        onCreateFolder={() => setShowCreateFolderModal(true)}
      />
      
      <main className="container mx-auto px-6 py-8">
        {subfolders.length > 0 && (
          <FolderView 
            folders={subfolders}
            onFolderClick={navigateToFolder}
            onDeleteFolder={deleteFolder}
            onEditFolder={editFolder}
          />
        )}
        
        {artworks.length > 0 && (
          <GalleryView 
            artworks={artworks}
            onUpdateArtwork={updateArtwork}
            onDeleteArtwork={deleteArtwork}
          />
        )}

        {subfolders.length === 0 && artworks.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {currentPath.length === 0 ? 'Bienvenido a tu galería' : 'Carpeta vacía'}
            </h3>
            <p className="text-gray-500">
              {currentPath.length === 0 
                ? 'Comienza creando carpetas para organizar tus obras'
                : 'Sube algunas obras o crea subcarpetas'
              }
            </p>
          </div>
        )}
      </main>

      {showUploadModal && (
        <UploadModal 
          onClose={() => setShowUploadModal(false)}
          onUpload={addArtwork}
          currentPath={currentPath}
        />
      )}

      {showCreateFolderModal && (
        <CreateFolderModal 
          onClose={() => setShowCreateFolderModal(false)}
          onCreate={createFolder}
        />
      )}
    </div>
  );
};
