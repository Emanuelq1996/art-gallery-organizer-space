
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | any | null;
  loading: boolean;
  signIn: (email: string, password: string, useMock?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user?.email || 'No user');
      setUser(user);
      setLoading(false);
    });

    // También verificar si hay un usuario mock en localStorage
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser && !user) {
      setUser(JSON.parse(mockUser));
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, useMock = false) => {
    try {
      if (useMock) {
        const mockUser = await authService.signInMock(email, password);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        setUser(mockUser);
      } else {
        const user = await authService.signIn(email, password);
        localStorage.removeItem('mockUser');
        setUser(user);
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      localStorage.removeItem('mockUser');
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
