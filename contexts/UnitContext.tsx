import { createContext, useContext } from 'react';
import { Unit } from '../lib/firebase/interfaces';

type UnitType = {
  currentUnit: Unit;
  setCurrentUnit: (unit: Unit) => void;
  oppositeUnit: Unit;
  setOppositeUnit: (unit: Unit) => void;
};

export const UnitContext = createContext<UnitType>({
  currentUnit: Unit.lb,
  setCurrentUnit: () => {},
  oppositeUnit: Unit.kg,
  setOppositeUnit: () => {},
});

export const useUnit = (): UnitType => useContext(UnitContext);
