import { createContext, useContext, useState } from 'react';
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from '@firebase/auth';
import { authorization } from '../lib/firebase';
import { User } from '../lib/firebase/interfaces';

type AuthType = {
  auth: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthType>({
  auth: null,
  loading: true,
  login: async () => void 0,
  logout: async () => void 0,
});

export const useProvideAuth = (): AuthType => {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();

    // Retrieve user public info such as first name
    // provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

    signInWithPopup(authorization, provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const logout = async (): Promise<void> => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch(error => {
        // An error happened.
      });
  };

  return { auth, loading, login, logout };
};

export const useAuth = (): AuthType => useContext(AuthContext);
