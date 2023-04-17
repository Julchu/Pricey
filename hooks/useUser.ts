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
import { db, User, Role, WithId, Unit } from '../lib/firebase/interfaces';
import { filterNullableObject } from '../lib/textFormatters';

type AuthData = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role?: Role;
};

interface UseUserMethods {
  getUser: (docId: string) => Promise<WithId<User> | undefined | void>;
  retrieveUser: (authData: AuthData) => Promise<WithId<User> | undefined | void>;
  updateUser: (userData: Partial<WithId<User>>) => Promise<WithId<User> | undefined | void>;
}

const useUser = (): [UseUserMethods, boolean, Error | undefined] => {
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);

  const getUser = useCallback<UseUserMethods['getUser']>(async docId => {
    try {
      setLoading(true);

      // Associate auth info to a specific user in db for public data:
      const existingUser = await getDoc(doc(db.userCollection, docId));

      if (existingUser.exists()) return { ...existingUser.data(), id: existingUser.id };

      setLoading(false);
    } catch (error) {
      setError(error as Error);
    }
  }, []);

  const retrieveUser = useCallback<UseUserMethods['retrieveUser']>(
    async ({ uid, displayName, email, photoURL, role = Role.standard }) => {
      try {
        setLoading(true);

        // Associate auth info to a specific user in db for public data:
        const q = query(db.userCollection, where('uid', '==', uid));
        const existingUser = await getDocs(q);

        if (existingUser.size > 0) {
          const user = existingUser.docs[0].data();
          return { id: existingUser.docs[0].id, ...user };
        } else {
          // Create new user if user doesn't exist
          const newUserDocRef = doc(db.userCollection);
          await setDoc(newUserDocRef, {
            uid,
            email,
            photoURL,
            name: displayName,
            createdAt: serverTimestamp(),
            role,
            preferences: { mass: Unit.kilogram, volume: Unit.litre },
          });

          const newUserDoc = await getDoc(newUserDocRef);
          if (newUserDoc.exists()) {
            const user = newUserDoc.data();
            setLoading(false);

            return {
              id: newUserDoc.id,
              ...user,
            };
          }
        }
        setLoading(false);
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
      const updatedUser = await getDoc(userDocRef);

      if (updatedUser.exists())
        return {
          id: updatedUser.id,
          ...updatedUser.data(),
        };
    } catch (error) {
      setError(error as Error);
    }
  }, []);

  return [
    {
      getUser,
      retrieveUser,
      updateUser,
    },
    loading,
    error,
  ];
};

export default useUser;
