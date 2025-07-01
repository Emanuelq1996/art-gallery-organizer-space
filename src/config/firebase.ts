
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración mock de Firebase
const firebaseConfig = {
  apiKey: "mock-api-key-123456789",
  authDomain: "artist-gallery-mock.firebaseapp.com",
  projectId: "artist-gallery-mock",
  storageBucket: "artist-gallery-mock.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Storage
export const storage = getStorage(app);

export default app;
