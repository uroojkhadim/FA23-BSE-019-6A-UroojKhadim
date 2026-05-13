import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

/**
 * Register a new user with SQLite backend
 */
export const registerUser = async (
  email: string,
  password: string,
  fullName: string,
  role: 'student' | 'teacher' | 'admin' | 'super_admin' = 'student'
): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName, role })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');

    toast.success('Registration successful!');
    return data;
  } catch (error: any) {
    console.error('Registration error:', error);
    toast.error(error.message);
    return null;
  }
};

/**
 * Login with email and password using SQLite backend
 */
export const loginUser = async (
  email: string,
  password: string,
  role: string = 'student'
): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');

    toast.success('Login successful!');
    // Store user in local storage for session persistence
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    toast.error(error.message);
    return null;
  }
};

/**
 * Logout
 */
export const logoutUser = async () => {
  try {
    localStorage.removeItem('auth_user');
    toast.success('Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Failed to logout');
  }
};

/**
 * Get current authenticated user from local storage
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('auth_user');
  return user ? JSON.parse(user) : null;
};
