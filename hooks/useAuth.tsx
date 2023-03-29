import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signOut,
  signInWithRedirect,
  getRedirectResult,
  User as FirebaseUser,
  Auth,
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

  /* When user signs in, they're redirected (instead of using Google popup signin flow)
   * if user doesn't exist in database, save public version of their user (rather than using exposing their auth info)
   * Only create user here, otherwise multiple users will be saved
   */
  const handleRedirect = useCallback(
    (auth: Auth): void => {
      getRedirectResult(auth)
        .then(async result => {
          if (result) {
            // This gives you a Google Access Token. You can use it to access Google APIs.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const _token = credential?.accessToken;
            const user = result.user;
            // The signed-in user info; at this point they are authenticated
            setAuthUser(
              (await getUser(user.uid)) ||
                (await createUser({
                  uid: user.uid,
                  email: user.email || '',
                  photoURL: user.photoURL || '',
                  displayName: user.displayName || '',
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
    },
    [createUser, getUser],
  );

  const handleAuthChange = async (user: FirebaseUser | null): Promise<void> => {
    if (user) {
      /* The signed-in user info; at this point they are authenticated
       * Auth state will update to existing user; don't create a new user here (save db reads too)
       */
      setAuthUser(
        {
          uid: user.uid,
          email: user.email || '',
          photoURL: user.photoURL || '',
          name: user.displayName || '',
        } || null,
      );
    } else {
      setAuthUser(null);
      console.log('User is not logged');
    }
  };

  // Auth persistence: detect if user is authenticated or not
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, handleAuthChange);
    handleRedirect(auth);
  }, [handleRedirect]);

  return { authUser, loading, login, logout };
};

export const AuthContext = createContext<AuthContextType>({
  authUser: null,
  loading: true,
  login: async () => void 0,
  logout: async () => void 0,
});

export const useAuth = (): AuthContextType => useContext(AuthContext);
