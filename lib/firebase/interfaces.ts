// import { Timestamp } from "firebase/firestore";

import {
  FieldValue,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from 'firebase/firestore';

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
