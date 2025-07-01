
import { signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '@/config/firebase';

// Usuario mock para pruebas
const MOCK_USER = {
  email: 'artist@mock.com',
  password: 'password123'
};

export const authService = {
  // Login con Firebase
  async signIn(email: string, password: string): Promise<User> {
    try {
      console.log('Attempting Firebase login:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase login successful');
      return result.user;
    } catch (error) {
      console.error('Firebase login failed:', error);
      throw error;
    }
  },

  // Login mock para pruebas
  async signInMock(email: string, password: string): Promise<any> {
    try {
      console.log('Attempting mock login:', email);
      
      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        const mockUser = {
          uid: 'mock-user-123',
          email: MOCK_USER.email,
          displayName: 'Artista Mock',
          photoURL: null,
          emailVerified: false
        };
        
        console.log('Mock login successful');
        return mockUser;
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Mock login failed:', error);
      throw error;
    }
  },

  // Cerrar sesión
  async signOut(): Promise<void> {
    try {
      console.log('Signing out');
      await signOut(auth);
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  },

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
};
