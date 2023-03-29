import { createContext, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signOut,
  signInWithRedirect,
  getRedirectResult,
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
  const [{ getUser, createUser }, _createUserLoading] = useUser();
  const [loading, _setLoading] = useState<boolean>(false);
  const router = useRouter();

  // useEffect(() => {
  //   setLoading(loading || createUserLoading);
  // }, [createUserLoading, loading]);

  const login = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    // Retrieve user public info such as first name
    // provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    // provider.addScope('profile');
    // provider.addScope('email');

    const auth = getAuth();
    signInWithRedirect(auth, provider);
  };

  const logout = async (): Promise<void> => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setAuthUser(null);
        console.log('Signed out');
        router.push('/');
      })
      .catch(error => {
        // An error happened.
        console.log('Sign out error:', error);
      });
  };

  // Auth persistence: detect if user is authenticated or not
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async user => {
      if (user) {
        /* The signed-in user info; at this point they are authenticated
         * Auth state will update to existing user; dont create a new user here
         */
        setAuthUser((await getUser(user.uid)) || null);
      } else {
        console.log('User is not logged');
      }
    });

    /* When user signs in, they're redirected (instead of using Google popup signin flow)
     * if user doesn't exist in database, save public version of their user (rather than using exposing their auth info)
     * Only create user here, otherwise multiple users will be saved
     */
    getRedirectResult(auth)
      .then(async result => {
        if (result) {
          // This gives you a Google Access Token. You can use it to access Google APIs.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const _token = credential?.accessToken;

          // The signed-in user info; at this point they are authenticated
          const { uid, email, photoURL, displayName } = result.user;

          setAuthUser(
            (await getUser(uid)) ||
              (await createUser({
                uid,
                email: email || '',
                photoURL: photoURL || '',
                displayName: displayName || '',
              })) ||
              null,
          );
        }
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
        console.error(errorCode, errorMessage, email, credential);
      });
  }, [createUser, getUser, router]);

  return { authUser, loading, login, logout };
};

export const AuthContext = createContext<AuthContextType>({
  authUser: null,
  loading: true,
  login: async () => void 0,
  logout: async () => void 0,
});

export const useAuth = (): AuthContextType => useContext(AuthContext);
