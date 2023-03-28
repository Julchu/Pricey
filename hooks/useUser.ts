import { addDoc, getDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { db, User } from '../lib/firebase/interfaces';

type AuthData = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
};

interface UseUserMethods {
  createUser: (authData: AuthData) => Promise<User | undefined>;
  // updateUser: (userData: Partial<User>) => Promise<User | undefined>;
}

const useUser = (): [UseUserMethods, boolean, Error | undefined] => {
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);

  const createUser = useCallback<UseUserMethods['createUser']>(
    async ({ uid, displayName, email, photoURL }) => {
      try {
        // if (!authUser) throw new Error('Invalid user');

        setLoading(true);
        // Associate auth info to a specific user in db for public data:
        const existingUser = await getDocs(query(db.userCollection, where('uid', '==', uid)));

        const createNewUserData = async (): Promise<User | undefined> => {
          const newUserRef = await addDoc(db.userCollection, {
            uid,
            email,
            photoURL,
            name: displayName,
            createdAt: serverTimestamp(),
            submissions: [],
          });
          const userDoc = await getDoc(newUserRef);
          if (userDoc.exists()) {
            return userDoc.data();
          }
        };

        const user = existingUser.docs.length
          ? existingUser.docs[0].data()
          : await createNewUserData();
        if (user) {
          setLoading(false);
          return {
            uid: user.uid,
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
