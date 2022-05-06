import { createContext, useContext } from 'react';
import { Unit } from '../lib/firebase/interfaces';

type UnitType = {
  toggledUnit: Unit;
  setUnit: (unit: Unit) => void;
  oppositeUnit: Unit;
};

export const UnitContext = createContext<UnitType>({
  toggledUnit: Unit.lb,
  setUnit: () => {},
  oppositeUnit: Unit.kg,
});

export const useUnit = (): UnitType => useContext(UnitContext);
