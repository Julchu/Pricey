import { createContext, useContext } from 'react';

type UnitType = {
  unit: string;
  setUnit: (unit: string) => void;
};

export const UnitContext = createContext<UnitType>({
  unit: 'lb',
  setUnit: () => {},
});

export const useUnit = (): UnitType => useContext(UnitContext);
