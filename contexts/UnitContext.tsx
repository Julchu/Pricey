import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { Unit } from '../lib/firebase/interfaces';

type UnitType = {
  currentUnit: { mass: Unit; area: Unit };
  setCurrentUnit: Dispatch<SetStateAction<{ mass: Unit; area: Unit }>>;
  oppositeUnit: { mass: Unit; area: Unit };
  setOppositeUnit: Dispatch<SetStateAction<{ mass: Unit; area: Unit }>>;
};

export const UnitContext = createContext<UnitType>({
  currentUnit: { mass: Unit.lb, area: Unit.squareFeet },
  setCurrentUnit: ({}) => {},
  oppositeUnit: { mass: Unit.kg, area: Unit.squareMeters },
  setOppositeUnit: ({}) => {},
});

export const useUnit = (): UnitType => useContext(UnitContext);
