import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { Unit, UnitCategory } from '../lib/firebase/interfaces';

// Private context value types, set in Context Provider
type UnitProps = {
  currentUnits: UnitCategory;
  setCurrentUnits: (type: UnitCategory) => void;
};

// Private context values
const UnitContext = createContext<UnitProps>({
  currentUnits: { mass: Unit.kilogram, volume: Unit.litre },
  setCurrentUnits: () => {},
});

// Public values
type UnitContextType = {
  currentUnits: UnitCategory;
  setCurrentUnits: (type: UnitCategory) => void;
  toggleUnit: () => void; // TODO: remove after testing unit/price functions work
};

// Public unit hook
export const useUnit = (): UnitContextType => {
  const { currentUnits, setCurrentUnits } = useContext(UnitContext);

  return {
    currentUnits,
    setCurrentUnits,
    toggleUnit: () => {
      if (currentUnits.mass === Unit.kilogram && currentUnits.volume === Unit.litre) {
        setCurrentUnits({ mass: Unit.pound, volume: Unit.quart });
      } else setCurrentUnits({ mass: Unit.kilogram, volume: Unit.litre });
    },
  };
};

export const UnitProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUnits, setCurrentUnits] = useState<UnitCategory>({
    mass: Unit.kilogram,
    volume: Unit.litre,
  });

  return (
    <UnitContext.Provider value={{ currentUnits, setCurrentUnits }}>
      {children}
    </UnitContext.Provider>
  );
};
