import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase-config';
import { toast } from 'sonner';

/**
 * Register a new user with email and password
 */
export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential | null> => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      toast.success('Registration successful! Please check your email to verify your account.');
      return userCredential;
    }
    
    return null;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    let message = 'Failed to register. Please try again.';
    
    if (error.code === 'auth/email-already-in-use') {
      message = 'This email is already registered. Please login or use a different email.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address format.';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password must be at least 6 characters long.';
    } else if (error.code === 'auth/operation-not-allowed') {
      message = 'Email/Password authentication is not enabled in Firebase Console.';
    }
    
    toast.error(message);
    return null;
  }
};

/**
 * Login with email and password
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: any; verified: boolean } | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if email is verified
    if (!user.emailVerified) {
      // Sign out user if email not verified
      await signOut(auth);
      toast.error('Please verify your email before logging in. Check your inbox!');
      return { user: null, verified: false };
    }
    
    toast.success('Login successful!');
    return { user, verified: true };
    
  } catch (error: any) {
    console.error('Login error:', error);
    
    let message = 'Failed to login. Please check your credentials.';
    
    if (error.code === 'auth/user-not-found') {
      message = 'No account found with this email address.';
    } else if (error.code === 'auth/wrong-password') {
      message = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Too many failed attempts. Please try again later.';
    } else if (error.code === 'auth/invalid-credential') {
      message = 'Invalid email or password.';
    }
    
    toast.error(message);
    return null;
  }
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (user: any): Promise<boolean> => {
  try {
    if (!user) {
      toast.error('No user logged in');
      return false;
    }
    
    await sendEmailVerification(user);
    toast.success('Verification email sent! Please check your inbox.');
    return true;
  } catch (error: any) {
    console.error('Error resending verification email:', error);
    toast.error('Failed to send verification email. Please try again.');
    return false;
  }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    toast.success('Logged out successfully');
  } catch (error: any) {
    console.error('Logout error:', error);
    toast.error('Failed to logout');
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
