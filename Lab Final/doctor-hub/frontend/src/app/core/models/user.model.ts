export type UserRole = 'patient' | 'doctor' | 'assistant' | 'admin' | 'super_admin';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
