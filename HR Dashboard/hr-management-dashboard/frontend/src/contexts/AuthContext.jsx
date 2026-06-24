import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// Helper function to get user-friendly Firebase error messages
const getFirebaseErrorMessage = (error) => {
  const errorMessages = {
    'auth/configuration-not-found': 'Firebase config not found, using demo mode.',
    'auth/invalid-email': 'The email address is invalid.',
    'auth/user-disabled': 'This user account has been disabled.',
    'auth/user-not-found': 'No user found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'This account already exists. Please sign in.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
  };

  return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 [AuthProvider] Starting auth listener');

    try {
      const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        console.log('👤 [AuthProvider] Auth state changed:', authUser ? 'User logged in' : 'No user');
        
        try {
          if (authUser) {
            setUser(authUser);
            
            try {
              // Try to fetch user role from Firestore
              console.log('📋 [AuthProvider] Fetching user role');
              const userDocRef = doc(db, 'hrUsers', authUser.uid);
              const userDoc = await getDoc(userDocRef);
              
              if (userDoc.exists()) {
                console.log('✅ [AuthProvider] User role found:', userDoc.data().role);
                setUserRole(userDoc.data());
              } else {
                console.warn('⚠️ [AuthProvider] No user document, creating default');
                const defaultUserData = {
                  uid: authUser.uid,
                  email: authUser.email,
                  name: authUser.email?.split('@')[0] || 'User',
                  role: 'HR',
                  createdAt: serverTimestamp(),
                };
                await setDoc(userDocRef, defaultUserData);
                setUserRole(defaultUserData);
                console.log('✅ [AuthProvider] Created default user document');
              }
            } catch (roleError) {
              console.error('❌ [AuthProvider] Failed to fetch user role:', roleError);
              // Fallback to default role if anything goes wrong!
              setUserRole({
                uid: authUser.uid,
                email: authUser.email,
                name: authUser.email?.split('@')[0] || 'User',
                role: 'HR',
              });
            }
          } else {
            setUser(null);
            setUserRole(null);
          }
        } catch (error) {
          console.error('❌ [AuthProvider] Error in auth state change:', error);
        } finally {
          // ALWAYS set loading to false NO MATTER WHAT!
          console.log('🔄 [AuthProvider] Setting loading to FALSE');
          setLoading(false);
        }
      });

      return unsubscribe;
    } catch (e) {
      console.warn('⚠️ [AuthProvider] Firebase auth not available, using demo mode');
      // In demo mode, don't auto-login, just set loading to false
      setLoading(false);
      return () => {};
    }
  }, []);

  const login = async (email, password) => {
    console.log('🔐 [AuthProvider] Attempting login');
    try {
      // Demo login
      if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'your_api_key_here') {
        const demoUser = {
          uid: 'demo-user-123',
          email,
          displayName: email.split('@')[0]
        };
        setUser(demoUser);
        setUserRole({
          uid: 'demo-user-123',
          email,
          name: email.split('@')[0],
          role: 'HR',
        });
        toast.success('Welcome back!');
        return { user: demoUser };
      }
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ [AuthProvider] Login successful');
      toast.success('Welcome back!');
      return result;
    } catch (error) {
      console.error('❌ [AuthProvider] Login failed:', error.code, error.message);
      const errorMsg = getFirebaseErrorMessage(error);
      toast.error(errorMsg);
      throw error;
    }
  };

  const signup = async (email, password, name) => {
    console.log('📝 [AuthProvider] Attempting signup');
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const userData = {
        uid: result.user.uid,
        email,
        name,
        role: 'HR',
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'hrUsers', result.user.uid), userData);
      console.log('✅ [AuthProvider] Signup successful');
      toast.success('Account created successfully!');
      return result;
    } catch (error) {
      console.error('❌ [AuthProvider] Signup failed:', error.code, error.message);
      const errorMsg = getFirebaseErrorMessage(error);
      toast.error(errorMsg);
      throw error;
    }
  };

  const logout = async () => {
    console.log('🚪 [AuthProvider] Logging out');
    try {
      // Demo logout
      if (user?.uid === 'demo-user-123') {
        setUser(null);
        setUserRole(null);
        toast.success('Logged out successfully');
        return;
      }
      
      await signOut(auth);
      console.log('✅ [AuthProvider] Logout successful');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('❌ [AuthProvider] Logout failed:', error);
      toast.error('Failed to logout');
      throw error;
    }
  };

  const resetPassword = async (email) => {
    console.log('📧 [AuthProvider] Sending password reset');
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('✅ [AuthProvider] Password reset email sent');
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('❌ [AuthProvider] Password reset failed:', error.code, error.message);
      const errorMsg = getFirebaseErrorMessage(error);
      toast.error(errorMsg);
      throw error;
    }
  };

  const value = {
    user,
    userRole,
    login,
    logout,
    resetPassword,
    signup,
    loading,
  };

  console.log('🔍 [AuthProvider] Current state:', { loading, user: !!user, userRole: userRole?.role });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
