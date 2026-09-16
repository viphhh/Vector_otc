import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  country: string;
  status: 'pending' | 'approved' | 'rejected';
  role: 'user' | 'admin';
  createdAt: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isSigningIn: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  registerProfile: (data: Omit<UserProfile, 'status' | 'role' | 'createdAt'>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  useEffect(() => {
    // Safety timeout: ensure loading state never hangs indefinitely
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Consume any pending redirect result gracefully if one was started earlier
    getRedirectResult(auth).catch(() => {});

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(safetyTimeout);
      setUser(firebaseUser);
      if (firebaseUser) {
        // Setup listener for user profile in Firestore
        const unsubProfile = onSnapshot(
          doc(db, 'users', firebaseUser.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserProfile);
            } else {
              setProfile(null);
            }
            setLoading(false);
          },
          (error) => {
            console.warn('Profile sync notice:', error.message);
            setLoading(false);
          }
        );
        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, []);

  const signIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    setAuthError(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error?.code === 'auth/cancelled-popup-request') {
        // Ignored safely: previous popup superseded
      } else if (error?.code === 'auth/popup-closed-by-user') {
        setAuthError('تم إغلاق نافذة تسجيل الدخول. يمكنك المحاولة مرة أخرى.');
      } else if (error?.code === 'auth/popup-blocked') {
        setAuthError('قام المتصفح بحظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة أو فتح المنصة في علامة تبويب جديدة.');
      } else {
        console.warn('Sign-in notice:', error?.message || error);
        setAuthError('تعذر تسجيل الدخول عبر Google. يرجى التأكد من اتصالك والمحاولة مجدداً.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const logOut = async () => {
    setAuthError(null);
    await signOut(auth);
  };

  const registerProfile = async (data: Omit<UserProfile, 'status' | 'role' | 'createdAt'>) => {
    if (!user) return;
    try {
      const isAdmin = user.email === 'viphhhxxx@gmail.com';
      const newProfile = {
        ...data,
        status: isAdmin ? 'approved' : 'pending',
        role: isAdmin ? 'admin' : 'user',
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', user.uid), newProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isSigningIn,
        authError,
        clearAuthError,
        signIn,
        logOut,
        registerProfile,
      }}
    >
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
