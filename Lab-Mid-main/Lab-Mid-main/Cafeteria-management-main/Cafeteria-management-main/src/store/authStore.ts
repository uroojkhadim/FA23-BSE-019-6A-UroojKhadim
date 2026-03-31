import { create } from 'zustand';
import { Students, Teachers, Administrators } from '@/entities';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface AuthUser {
  _id: string;
  fullName?: string;
  email?: string;
  role: UserRole;
  registrationNumber?: string;
  department?: string;
  cnicNumber?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  whatsappVerified?: boolean;
  universityName?: string;
  profilePicture?: string;
  adminRole?: string;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: (() => {
    if (typeof window === 'undefined') return null;
    const stored = sessionStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
  })(),
  isAuthenticated: (() => {
    if (typeof window === 'undefined') return false;
    return !!sessionStorage.getItem('authUser');
  })(),

  setUser: (user: AuthUser | null) => {
    if (user) {
      sessionStorage.setItem('authUser', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('authUser');
    }
    set({ user, isAuthenticated: !!user });
  },

  logout: () => {
    sessionStorage.removeItem('authUser');
    set({ user: null, isAuthenticated: false });
  },

  hasPermission: (requiredRole: UserRole | UserRole[]) => {
    const { user } = get();
    if (!user) return false;
    
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(user.role);
  },
}));
