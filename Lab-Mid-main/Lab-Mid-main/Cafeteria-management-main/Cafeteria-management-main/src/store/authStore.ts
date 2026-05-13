import { create } from 'zustand';

export type UserRole = 'student' | 'teacher' | 'admin' | 'super_admin' | 'staff' | 'university_staff';


export interface AuthUser {
  _id: string;
  uid: string; // Added to match Firestore document structure
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
  balance?: number; // For Udhar system
  isVerified?: boolean;
  createdAt?: any;
  status?: string;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: (() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('authUser');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  isAuthenticated: (() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authUser');
  })(),

  setUser: (user: AuthUser | null) => {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }
    set({ user, isAuthenticated: !!user });
  },

  logout: () => {
    localStorage.removeItem('authUser');
    set({ user: null, isAuthenticated: false });
  },
}));