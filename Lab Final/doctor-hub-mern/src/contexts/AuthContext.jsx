import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.time('AuthContext - Total Initialization');
    console.time('AuthContext - onAuthStateChanged listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.timeEnd('AuthContext - onAuthStateChanged listener');
      console.log('onAuthStateChanged triggered with user:', user?.uid || 'none');
      
      setCurrentUser(user);
      
      if (user) {
        console.time('AuthContext - Firestore getDoc');
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          console.timeEnd('AuthContext - Firestore getDoc');
          console.log('User data fetched:', userDoc.exists() ? userDoc.data() : 'not found');
          setUserData(userDoc.exists() ? userDoc.data() : null);
        } catch (error) {
          console.error('Error fetching user data:', error);
          console.timeEnd('AuthContext - Firestore getDoc');
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
      console.timeEnd('AuthContext - Total Initialization');
    });
    
    return () => {
      unsubscribe();
      console.log('AuthContext - Listener unsubscribed');
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
