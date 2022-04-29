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

export interface Ingredient {
  name: string;
  price: number;
  unit: string;
  location?: string;
  submitter?: User;
  createdAt: Timestamp | FieldValue;
}

/* All ingredient names will be placed in collection /ingredientNames within a document named as the first letter of the ingredient name
 * Ex: /ingredientNames/a/almond: { ingredientIds[]: list of id used in /ingredients for almond }
 */
export interface IngredientInfo {
  name: string;
  ids: string[] | FieldValue;
  count: number | FieldValue;
  total: number | FieldValue;
  lowest?: number;
}

export interface User {
  name: string;
  location?: string;

  createdAt?: Timestamp;
  // Preferences
}

// Firestore data converters
export const converter = <T>(): FirestoreDataConverter<T> => ({
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
  ingredientCollection: collectionPoint<Ingredient>('ingredients'),
  ingredientInfoCollection: collectionPoint<IngredientInfo>('ingredientInfos'),
  userCollection: collectionPoint<User>('users'),

  // Docs
  ingredientDoc: (...extraPaths: string[]) => docPoint<Ingredient>('ingredients', ...extraPaths),
  ingredientInfoDoc: (...extraPaths: string[]) =>
    docPoint<IngredientInfo>('ingredientInfos', ...extraPaths),
  userDoc: (...extraPaths: string[]) => docPoint<User>('users', ...extraPaths),
};
