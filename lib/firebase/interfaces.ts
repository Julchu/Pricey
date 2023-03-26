// import { Timestamp } from "firebase/firestore";

import {
  collection,
  doc,
  DocumentReference,
  FieldValue,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from './index';
import { CollectionReference } from '@firebase/firestore';

export enum Status {
  Approved = 'APPROVED',
  Pending = 'PENDING',
  Denied = 'DENIED',
}

export enum Unit {
  lb = 'lb',
  kg = 'kg',
  litre = 'L',
  quart = 'qt',
  oz = 'oz',
  unit = 'unit',
}

/* Ingredient
  name: 
  variety: 
  commodity: 
  category: 
  PLU: 
  image: 

*/

// Record of every instance that an ingredient is saved
export interface Submission {
  ingredientId: string;
  image?: string;
  price: number;
  unit: Unit;
  submitter?: User;
  location: Address;
  createdAt: Timestamp | FieldValue;
  status?: Status;
}

// Ingredient info
export interface Ingredient {
  ingredientId: string;
  name: string;
  image?: string;
  plu: number;
  category: string;
  submissions: string[] | FieldValue;
  count: number | FieldValue;
  lastUpdated: Timestamp | FieldValue;
}

export interface User {
  name: string;
  location?: Address;
  email?: string;
  createdAt?: Timestamp;
  submissions: Submission[];
  // Preferences
}

/* Public features:
 * Create Time-to-live (TTL) grocery list w/ ingredients
 *
 */

/* Logged in user features:
 * Save grocery list
 * Save price thresholds per ingredient
 *
 */

// City, province/state, country
export interface Address {
  locality: string;
  administrative_area_level_1: string;
  country: string;
}

// export interface Auth {
//   uid: string;
//   name: string;
//   email: string;
//   photoURL: string;
//   // claims?: {
//   //   isMyWayCafeAdmin?: boolean;
//   // };
//   // preferences?: UserPreferences | ChefPreferences;
//   role?: UserRole;
// }

// Firestore data converters
// toFirestore({ id, ...data }: PartialWithFieldValue<T>): DocumentData {
//   return data
// },
export const converter = <
  T extends Submission | Ingredient | User,
>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) =>
    snapshot.data(options) as T,
});

const collectionPoint = <T>(collectionPath: string): CollectionReference<T> =>
  collection(firestore, collectionPath).withConverter(converter<T>());

const docPoint = <T>(collectionPath: string, ...extraPaths: string[]): DocumentReference<T> =>
  doc(firestore, collectionPath, ...extraPaths).withConverter(converter<T>());

/* dataPoint use-cases:
 * const ingredientsCollectionRef = db.ingredientCollection;
 * const ingredientDocumentRef = db.ingredientInfoDoc(id, ...extraPaths);
 * * const ingredientDocumentRef = doc(db.ingredientCollection, id, ...extraPaths);
 */
export const db = {
  // Collections
  ingredientCollection: collectionPoint<Submission>('ingredients'),
  ingredientInfoCollection: collectionPoint<Ingredient>('ingredientInfos'),
  userCollection: collectionPoint<User>('users'),

  // Docs
  ingredientDoc: (...extraPaths: string[]) => docPoint<Submission>('ingredients', ...extraPaths),
  ingredientInfoDoc: (...extraPaths: string[]) =>
    docPoint<Ingredient>('ingredientInfos', ...extraPaths),
  userDoc: (...extraPaths: string[]) => docPoint<User>('users', ...extraPaths),
};

// Test
/* All ingredient names will be placed in collection /ingredientNames within a document named as the first letter of the ingredient name
 * Ex: /ingredientNames/a/almond: { ingredientIds[]: list of id used in /ingredients for almond }
 */
