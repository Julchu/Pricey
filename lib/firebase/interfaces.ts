// import { Timestamp } from "firebase/firestore";

import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

// const ingredientRef = db.ingredients.doc(ingredient.name.trim().toLocaleLowerCase());
export interface Ingredient {
  name: string;
  price: number;
  unit: string;
  location?: string;
  submitter?: User;
  // time: Timestamp
}

export interface User {
  name: string;
  location?: string;

  // joinDate?: Timestamp
  // Preferences
}

// Firestore data converter
export const ingredientConverter = {
  toFirestore: ({ name, price, unit, location }: Ingredient) => {
    return {
      name,
      price,
      unit,
      location,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return data.name, data.price, data.unit, data.location;
  },
};
