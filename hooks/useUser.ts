import {
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { db, User, Role, WithId } from '../lib/firebase/interfaces';
import { filterNullableObject } from '../lib/textFormatters';

type AuthData = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role?: Role;
};

interface UseUserMethods {
  getUser: (uid: string) => Promise<WithId<User> | undefined>;
  createUser: (authData: AuthData) => Promise<WithId<User> | undefined>;
  updateUser: (userData: Partial<WithId<User>>) => Promise<void>;
}

const useUser = (): [UseUserMethods, boolean, Error | undefined] => {
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);

  const getUser = useCallback<UseUserMethods['getUser']>(async uid => {
    try {
      setLoading(true);
      // Associate auth info to a specific user in db for public data:
      const q = query(db.userCollection, where('uid', '==', uid));
      const existingUser = await getDocs(q);

      if (existingUser.size == 1) {
        const user = existingUser.docs[0].data();
        setLoading(false);
        return {
          id: existingUser.docs[0].id,
          uid: uid,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL,
          role: user.role,
        };
      }
    } catch (error) {
      setError(error as Error);
    }
  }, []);

  const createUser = useCallback<UseUserMethods['createUser']>(
    async ({ uid, displayName, email, photoURL, role = Role.standard }) => {
      try {
        setLoading(true);

        const newUserDocRef = doc(db.userCollection);
        await setDoc(newUserDocRef, {
          uid,
          email,
          photoURL,
          name: displayName,
          createdAt: serverTimestamp(),
          role,
        });

        const newUserDoc = await getDoc(newUserDocRef);
        if (newUserDoc.exists()) {
          const user = newUserDoc.data();
          setLoading(false);
          return {
            id: newUserDocRef.id,
            uid,
            name: user.name,
            email: user.email,
            photoURL: user.photoURL,
            role: user.role,
          };
        }
      } catch (error) {
        setError(error as Error);
      }
    },
    [],
  );

  const updateUser = useCallback<UseUserMethods['updateUser']>(async userData => {
    try {
      setLoading(true);
      // Associate auth info to a specific user in db for public data:
      const userDocRef = doc(db.userCollection, userData.id);
      const updatedInfo = filterNullableObject(userData);
      await updateDoc(userDocRef, updatedInfo);
    } catch (error) {
      setError(error as Error);
    }
  }, []);

  return [
    {
      getUser,
      createUser,
      updateUser,
    },
    loading,
    error,
  ];
};

export default useUser;
