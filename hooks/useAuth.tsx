import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
  User as FirebaseUser,
} from '@firebase/auth';

import { User, WithId } from '../lib/firebase/interfaces';
import { useRouter } from 'next/router';
import useUser from './useUser';

export const AuthContext = createContext<AuthContextType>({
  authUser: undefined,
  loading: false,
  login: async () => void 0,
  logout: async () => void 0,
});

type AuthContextType = {
  authUser: WithId<User> | undefined;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

// Public auth hook
export const useAuth = (): AuthContextType => useContext(AuthContext);

// Initial values of Auth Context (AuthContextType)
export const useProvideAuth = (): AuthContextType => {
  const [authUser, setAuthUser] = useState<WithId<User> | undefined>(undefined);
  const [{ getUser, createUser }, _createUserLoading] = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const auth = getAuth();

  const login = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    // Retrieve user public info such as first name
    // provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    // provider.addScope('profile');
    // provider.addScope('email');

    signInWithPopup(auth, provider); // signInWithRedirect(auth, provider) doesn't work for mobile for now
  };

  const logout = async (): Promise<void> => {
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
    setLoading(false);
  };

  /* Every page load, checks if there is a user authenticated from Google services (not Pricey db)
   * If there is one (aka after signing in), go to handleRedirect to getRedirectResults
   * If user had redirected from Google login services, there will be a redirectResult: get/create user
   * If user refreshes page, there will be no redirect result: get user
   */
  const handleAuthChange = useCallback(
    async (user: FirebaseUser | null) => {
      if (user) {
        setAuthUser(
          (await getUser(user.uid)) ||
            (await createUser({
              uid: user.uid,
              email: user.email || '',
              photoURL: user.photoURL || '',
              displayName: user.displayName || '',
            })),
        );
      } else {
        setAuthUser(undefined);
        console.log('User is not logged');
      }
    },
    [createUser, getUser],
  );

  // Auth persistence: detect if user is authenticated or not (on page change, on page refresh)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthChange);
    return () => unsubscribe();
  }, [auth, handleAuthChange]);

  return { authUser, loading, login, logout };
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <AuthContext.Provider value={useProvideAuth()}>{children}</AuthContext.Provider>;
};

/* Use this (getRedirectResult) if using signInWithRedirect? */
// const handleRedirect = useCallback(
//   async (auth: Auth, user: FirebaseUser | null): Promise<User | void> => {
//     return await getRedirectResult(auth)
//       .then(async result => {
//         // If user refreshes page, there will be no redirect result since it's not coming from signInWithRedirect
//         if (result) {
//           // This gives you a Google Access Token. You can use it to access Google APIs.
//           const credential = GoogleAuthProvider.credentialFromResult(result);
//           const _token = credential?.accessToken;
//           const user = result.user;

//           return (
//             (await getUser(user.uid)) ||
//             (await createUser({
//               uid: user.uid,
//               email: user.email || '',
//               photoURL: user.photoURL || '',
//               displayName: user.displayName || '',
//             }))
//           );
//         } else if (user)
//           return (
//             (await getUser(user.uid)) ||
//             (await createUser({
//               uid: user.uid,
//               email: user.email || '',
//               photoURL: user.photoURL || '',
//               displayName: user.displayName || '',
//             }))
//           );
//       })
//       .catch(error => {
//         // Handle Errors here.
//         console.error(error);
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         // The email of the user's account used.
//         const email = error.customData.email;
//         // The AuthCredential type that was used.
//         const credential = GoogleAuthProvider.credentialFromError(error);
//         console.error(errorCode, errorMessage, email, credential);
//       });
//   },
//   [createUser, getUser],
// );
