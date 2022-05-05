import { createContext, useContext } from 'react';
import { Unit } from '../lib/firebase/interfaces';

type UnitType = {
  toggledUnit: Unit;
  setUnit: (unit: Unit) => void;
};

export const UnitContext = createContext<UnitType>({
  toggledUnit: Unit.lb,
  setUnit: () => {},
});

export const useUnit = (): UnitType => useContext(UnitContext);
