
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  writeBatch 
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Folder } from '@/types/artwork';

const FOLDERS_COLLECTION = 'folders';

export const folderService = {
  // Crear nueva carpeta
  async createFolder(folderData: Omit<Folder, 'id'>): Promise<string> {
    try {
      console.log('Creating folder:', folderData);
      const docRef = await addDoc(collection(db, FOLDERS_COLLECTION), {
        name: folderData.name,
        path: folderData.path,
        artworks: folderData.artworks || [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Folder created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  },

  // Obtener todas las carpetas
  async getAllFolders(): Promise<Folder[]> {
    try {
      console.log('Fetching all folders');
      const querySnapshot = await getDocs(collection(db, FOLDERS_COLLECTION));
      const folders: Folder[] = [];
      
      querySnapshot.forEach((doc) => {
        folders.push({
          id: doc.id,
          ...doc.data()
        } as Folder);
      });
      
      console.log('Folders fetched:', folders.length);
      return folders;
    } catch (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }
  },

  // Actualizar carpeta
  async updateFolder(folderId: string, updates: Partial<Folder>): Promise<void> {
    try {
      console.log('Updating folder:', folderId, updates);
      const folderRef = doc(db, FOLDERS_COLLECTION, folderId);
      await updateDoc(folderRef, {
        ...updates,
        updatedAt: new Date()
      });
      console.log('Folder updated successfully');
    } catch (error) {
      console.error('Error updating folder:', error);
      throw error;
    }
  },

  // Eliminar carpeta
  async deleteFolder(folderId: string): Promise<void> {
    try {
      console.log('Deleting folder:', folderId);
      await deleteDoc(doc(db, FOLDERS_COLLECTION, folderId));
      console.log('Folder deleted successfully');
    } catch (error) {
      console.error('Error deleting folder:', error);
      throw error;
    }
  },

  // Actualizar múltiples carpetas (para cambios de path en lote)
  async updateMultipleFolders(updates: Array<{ id: string, data: Partial<Folder> }>): Promise<void> {
    try {
      console.log('Batch updating folders:', updates.length);
      const batch = writeBatch(db);
      
      updates.forEach(({ id, data }) => {
        const folderRef = doc(db, FOLDERS_COLLECTION, id);
        batch.update(folderRef, {
          ...data,
          updatedAt: new Date()
        });
      });
      
      await batch.commit();
      console.log('Batch update completed');
    } catch (error) {
      console.error('Error in batch update:', error);
      throw error;
    }
  }
};
