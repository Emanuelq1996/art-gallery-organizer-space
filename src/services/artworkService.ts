
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import { Artwork } from '@/types/artwork';

const ARTWORKS_COLLECTION = 'artworks';

export const artworkService = {
  // Subir imagen a Firebase Storage
  async uploadImage(file: File, folderPath: string[]): Promise<string> {
    try {
      console.log('Uploading image:', file.name, 'to path:', folderPath);
      const imagePath = `artworks/${folderPath.join('/')}/${Date.now()}_${file.name}`;
      const imageRef = ref(storage, imagePath);
      
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('Image uploaded successfully:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Crear nueva obra de arte
  async createArtwork(artworkData: Omit<Artwork, 'id'>): Promise<string> {
    try {
      console.log('Creating artwork:', artworkData);
      const docRef = await addDoc(collection(db, ARTWORKS_COLLECTION), {
        ...artworkData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Artwork created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating artwork:', error);
      throw error;
    }
  },

  // Obtener obras de arte por carpeta
  async getArtworksByFolder(folderPath: string[]): Promise<Artwork[]> {
    try {
      console.log('Fetching artworks for folder:', folderPath);
      const q = query(
        collection(db, ARTWORKS_COLLECTION),
        where('folderPath', '==', folderPath)
      );
      
      const querySnapshot = await getDocs(q);
      const artworks: Artwork[] = [];
      
      querySnapshot.forEach((doc) => {
        artworks.push({
          id: doc.id,
          ...doc.data()
        } as Artwork);
      });
      
      console.log('Artworks fetched:', artworks.length);
      return artworks;
    } catch (error) {
      console.error('Error fetching artworks:', error);
      throw error;
    }
  },

  // Obtener todas las obras de arte
  async getAllArtworks(): Promise<Artwork[]> {
    try {
      console.log('Fetching all artworks');
      const querySnapshot = await getDocs(collection(db, ARTWORKS_COLLECTION));
      const artworks: Artwork[] = [];
      
      querySnapshot.forEach((doc) => {
        artworks.push({
          id: doc.id,
          ...doc.data()
        } as Artwork);
      });
      
      console.log('All artworks fetched:', artworks.length);
      return artworks;
    } catch (error) {
      console.error('Error fetching artworks:', error);
      throw error;
    }
  },

  // Actualizar obra de arte
  async updateArtwork(artworkId: string, updates: Partial<Artwork>): Promise<void> {
    try {
      console.log('Updating artwork:', artworkId, updates);
      const artworkRef = doc(db, ARTWORKS_COLLECTION, artworkId);
      await updateDoc(artworkRef, {
        ...updates,
        updatedAt: new Date()
      });
      console.log('Artwork updated successfully');
    } catch (error) {
      console.error('Error updating artwork:', error);
      throw error;
    }
  },

  // Eliminar obra de arte
  async deleteArtwork(artworkId: string, imageUrl?: string): Promise<void> {
    try {
      console.log('Deleting artwork:', artworkId);
      
      // Eliminar imagen de Storage si existe
      if (imageUrl && imageUrl.includes('firebase')) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
          console.log('Image deleted from storage');
        } catch (storageError) {
          console.warn('Could not delete image from storage:', storageError);
        }
      }
      
      // Eliminar documento de Firestore
      await deleteDoc(doc(db, ARTWORKS_COLLECTION, artworkId));
      console.log('Artwork deleted successfully');
    } catch (error) {
      console.error('Error deleting artwork:', error);
      throw error;
    }
  }
};
