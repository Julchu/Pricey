// import { Timestamp } from "firebase/firestore";

import {
  DocumentData,
  FieldValue,
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
  createdAt: Timestamp;
}

/* All ingredient names will be placed in collection /ingredientNames within a document named as the first letter of the ingredient name
 * Ex: /ingredientNames/a/almond: { ingredientIds[]: list of id used in /ingredients for almond }
 */
export interface IngredientName {
  ids: string[] | FieldValue;
}

export interface User {
  name: string;
  location?: string;

  createdAt?: Timestamp;
  // Preferences
}

// Firestore data converters
export const ingredientsConverter = {
  toFirestore: (ingredient: Ingredient): DocumentData => ingredient,
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return data.name, data.price, data.unit, data.location, data.createdat;
  },
};

export const ingredientNameConverter = {
  toFirestore: (ingredientName: IngredientName): DocumentData => ingredientName,
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return data.name;
  },
};
