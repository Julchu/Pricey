import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { db, User } from '../lib/firebase/interfaces';

type AuthData = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
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
      const existingUser = await getDoc(doc(db.userCollection, uid));

      if (existingUser.exists()) {
        const user = existingUser.data();
        setLoading(false);
        return {
          uid: uid,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL,
        };
      }
    } catch (error) {
      setError(error as Error);
    }
  }, []);

  const createUser = useCallback<UseUserMethods['createUser']>(
    async ({ uid, displayName, email, photoURL }) => {
      try {
        setLoading(true);

        const newUserDocRef = doc(db.userCollection, uid);

        await setDoc(newUserDocRef, {
          uid,
          email,
          photoURL,
          name: displayName,
          createdAt: serverTimestamp(),
          submissions: [],
        });

        const newUserDoc = await getDoc(newUserDocRef);
        if (newUserDoc.exists()) {
          const user = newUserDoc.data();
          setLoading(false);
          return {
            uid: uid,
            name: user.name,
            email: user.email,
            photoURL: user.photoURL,
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
