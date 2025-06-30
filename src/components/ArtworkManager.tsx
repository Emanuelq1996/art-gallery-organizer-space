
import React, { useState } from 'react';
import { Header } from './Header';
import { FolderView } from './FolderView';
import { GalleryView } from './GalleryView';
import { UploadModal } from './UploadModal';
import { CreateFolderModal } from './CreateFolderModal';
import { Folder, Artwork } from '@/types/artwork';

export const ArtworkManager = () => {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
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
    },
    {
      id: '3',
      name: 'Retratos',
      path: ['Pinturas', 'Retratos'],
      artworks: [
        {
          id: '1',
          title: 'Retrato de una Dama',
          description: 'Óleo sobre lienzo, técnica clásica con influencias renacentistas',
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
          folderPath: ['Pinturas', 'Retratos']
        }
      ]
    }
  ]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);

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

  const createFolder = (name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      path: [...currentPath, name],
      artworks: []
    };
    setFolders([...folders, newFolder]);
  };

  const deleteFolder = (folderId: string) => {
    setFolders(folders.filter(folder => folder.id !== folderId));
  };

  const addArtwork = (artwork: Omit<Artwork, 'id' | 'folderPath'>) => {
    const newArtwork: Artwork = {
      ...artwork,
      id: Date.now().toString(),
      folderPath: currentPath
    };

    const folderIndex = folders.findIndex(folder => 
      folder.path.length === currentPath.length &&
      folder.path.every((segment, index) => segment === currentPath[index])
    );

    if (folderIndex !== -1) {
      const updatedFolders = [...folders];
      updatedFolders[folderIndex].artworks.push(newArtwork);
      setFolders(updatedFolders);
    }
  };

  const updateArtwork = (artworkId: string, updates: Partial<Artwork>) => {
    const updatedFolders = folders.map(folder => ({
      ...folder,
      artworks: folder.artworks.map(artwork => 
        artwork.id === artworkId ? { ...artwork, ...updates } : artwork
      )
    }));
    setFolders(updatedFolders);
  };

  const deleteArtwork = (artworkId: string) => {
    const updatedFolders = folders.map(folder => ({
      ...folder,
      artworks: folder.artworks.filter(artwork => artwork.id !== artworkId)
    }));
    setFolders(updatedFolders);
  };

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
