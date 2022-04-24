// import { Timestamp } from "firebase/firestore";

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
