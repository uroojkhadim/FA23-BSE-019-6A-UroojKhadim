import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore, type AuthUser } from '@/store/authStore';
import { getCurrentUser } from '@/lib/emailAuth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    // Initial check from local storage
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
    
    // In a production app, we would verify the session/JWT with the backend here
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
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