import { result } from 'lodash';
import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { Ingredient, WithDocId } from '../lib/firebase/interfaces';

// Private context value types, set in Context Provider
type IngredientProps = {
  currentIngredients: WithDocId<Ingredient>[];
  setCurrentIngredients: (ingredient: WithDocId<Ingredient>[]) => void;
};

// Private context values
const IngredientContext = createContext<IngredientProps>({
  currentIngredients: [],
  setCurrentIngredients: () => {},
});

// Public values
type IngredientContextType = {
  currentIngredients: WithDocId<Ingredient>[];
  arrayToIngredient: (ingredients: WithDocId<Ingredient>[]) => void;
  addIngredient: (ingredient: WithDocId<Ingredient>) => void;
  removeIngredient: (ingredientName: string) => void;
};

export const useIngredientContext = (): IngredientContextType => {
  const { currentIngredients, setCurrentIngredients } = useContext(IngredientContext);

  return {
    currentIngredients,
    arrayToIngredient: ingredients => {
      setCurrentIngredients(ingredients);
    },
    addIngredient: ingredient => {
      setCurrentIngredients({ ...currentIngredients, ...{ [ingredient.name]: ingredient } });
    },
    removeIngredient: ingredientName => {
      setCurrentIngredients(
        currentIngredients.filter(ingredient => ingredient.name !== ingredientName),
      );
    },
  };
};

export const IngredientProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentIngredients, setCurrentIngredients] = useState<WithDocId<Ingredient>[]>([]);

  return (
    <IngredientContext.Provider value={{ currentIngredients, setCurrentIngredients }}>
      {children}
    </IngredientContext.Provider>
  );
};
