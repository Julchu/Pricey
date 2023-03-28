import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { Unit } from '../lib/firebase/interfaces';

type UnitType = {
  currentUnit: { mass: Unit; liquid: Unit };
  setCurrentUnit: Dispatch<SetStateAction<{ mass: Unit; liquid: Unit }>>;
  oppositeUnit: { mass: Unit; liquid: Unit };
  setOppositeUnit: Dispatch<SetStateAction<{ mass: Unit; liquid: Unit }>>;
};

export const UnitContext = createContext<UnitType>({
  currentUnit: { mass: Unit.pound, liquid: Unit.litre },
  setCurrentUnit: ({}) => {},
  oppositeUnit: { mass: Unit.kilogram, liquid: Unit.quart },
  setOppositeUnit: ({}) => {},
});

export const useUnit = (): UnitType => useContext(UnitContext);
