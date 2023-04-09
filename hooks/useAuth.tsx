import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
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

export const AuthContext = createContext<AuthContextType>({
  authUser: undefined,
  loading: false,
  login: async () => void 0,
  logout: async () => void 0,
});

type AuthContextType = {
  authUser: User | undefined;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

// Public auth hook
export const useAuth = (): AuthContextType => useContext(AuthContext);

// Initial values of Auth Context (AuthContextType)
export const useProvideAuth = (): AuthContextType => {
  const [authUser, setAuthUser] = useState<User | undefined>(undefined);
  const [{ getUser, createUser }, _createUserLoading] = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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
        setAuthUser(undefined);
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
                undefined,
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

  const handleAuthChange = useCallback(
    async (user: FirebaseUser | null) => {
      if (user) {
        /* The signed-in user info; at this point they are authenticated
         * Auth state will update to existing user; don't create a new user here (save db reads too)
         */

        setAuthUser((await getUser(user.uid)) || undefined);
      } else {
        setAuthUser(undefined);
        console.log('User is not logged');
      }
    },
    [getUser],
  );

  // Auth persistence: detect if user is authenticated or not
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, handleAuthChange);
    handleRedirect(auth);
    return () => unsubscribe();
  }, [handleAuthChange, handleRedirect]);

  return { authUser, loading, login, logout };
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <AuthContext.Provider value={useProvideAuth()}>{children}</AuthContext.Provider>;
};
