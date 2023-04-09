import {
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { db, User, Role } from '../lib/firebase/interfaces';

type AuthData = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role?: Role;
};

interface UseUserMethods {
  getUser: (uid: string) => Promise<User | undefined>;
  createUser: (authData: AuthData) => Promise<User | undefined>;
  // updateUser: (userData: Partial<User>) => Promise<User | undefined>;
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

  // const userDocRef = db.userDoc();

  // const updateUser = useCallback<UseUserMethods['updateUser']>(
  //   async userData => {
  //     setLoading(true);
  //     if (!auth) throw new Error('Invalid user');

  //     try {
  //       await userDocRef.update(userData);
  //     } catch (error) {
  //       setError(error as Error);
  //     }
  //     setLoading(false);
  //   },
  //   [auth, userRef],
  // );

  return [
    {
      getUser,
      createUser,
      // updateUser,
    },
    loading,
    error,
  ];
};

export default useUser;

// const citiesRef = collection(db, "cities");
// await setDoc(doc(citiesRef, 'LA'), {
//   name: 'Los Angeles',
//   state: 'CA',
//   country: 'USA',
//   capital: false,
//   population: 3900000,
//   regions: ['west_coast', 'socal'],
// });

// await setDoc(doc(db, 'cities', 'LA'), {
//   name: 'Los Angeles',
//   state: 'CA',
//   country: 'USA',
// });

// await setDoc(
//   doc(db, 'cities', 'LA'),
//   { name: 'Los Angeles', state: 'CA', country: 'USA' },
//   { merge: true },
// );
