import { createContext, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from '@firebase/auth';

import { User } from '../lib/firebase/interfaces';
import { useRouter } from 'next/router';
import useUser from './useUser';

type AuthContextType = {
  authUser: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useProvideAuth = (): AuthContextType => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [{ createUser }, createUserLoading, error] = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(createUserLoading);
  }, [createUserLoading]);

  const login = async (): Promise<void> => {
    setLoading(true);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    // Retrieve user public info such as first name
    // provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    // provider.addScope('profile');
    // provider.addScope('email');

    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(async result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        // The signed-in user info; at this point they are authenticated
        const { uid, email, photoURL, displayName } = result.user;

        setAuthUser(
          (await createUser({
            uid,
            email: email || '',
            photoURL: photoURL || '',
            displayName: displayName || '',
          })) || null,
        );
      })
      .catch(error => {
        // Handle Errors here.
        console.error(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });

    setLoading(false);
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setAuthUser(null);
        console.log('Signed out');
        router.push('/functions');
      })
      .catch(error => {
        // An error happened.
        console.log('Sign out error:', error);
      });
    setLoading(false);
  };

  /* Auth persistence: detect if user is authenticated or not
   * Do not redirect with router.push(), will cause infinite state changes
   */
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async user => {
      if (user) {
        /* The signed-in user info; at this point they are authenticated
         * Auth state will update to existing user or create new user here
         */
        const { uid, email, photoURL, displayName } = user;
        setAuthUser(
          (await createUser({
            uid,
            email: email || '',
            photoURL: photoURL || '',
            displayName: displayName || '',
          })) || null,
        );
      } else {
        console.log('User is not logged');
      }
    });
  }, [createUser, router]);

  return { authUser, loading, login, logout };
};

export const AuthContext = createContext<AuthContextType>({
  authUser: null,
  loading: true,
  login: async () => void 0,
  logout: async () => void 0,
});

export const useAuth = (): AuthContextType => useContext(AuthContext);
