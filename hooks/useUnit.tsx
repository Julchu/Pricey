import { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
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
  convertToCurrent: (price: number, fromUnit: Unit) => [number, Unit];
};

// Public unit hook
export const useUnit = (): UnitContextType => {
  const { currentUnits, setCurrentUnits } = useContext(UnitContext);

  // TODO: move convertors outside of hook; any form triggers rerendering of unit conversion
  const isMass = (unit: Unit): boolean => {
    return unit === Unit.kilogram || unit === Unit.pound;
  };

  const isVolume = (unit?: Unit): boolean => {
    return unit === Unit.litre || unit === Unit.quart;
  };

  const priceConverter = (price: number, fromUnit: Unit): number => {
    /*
     * if (beforeUnit === Unit.pound && afterUnit?.mass === Unit.kilogram) return price * 2.2046;
     * else if (beforeUnit === Unit.kilogram && afterUnit?.mass === Unit.pound) return price / 2.2046;
     * else if (beforeUnit === Unit.litre && afterUnit?.liquid === Unit.quart) return price * 1.05669;
     * else if (beforeUnit === Unit.quart && afterUnit?.liquid === Unit.litre) return price / 1.05669;
     * else return price;
     */
    if (fromUnit === Unit.pound && currentUnits?.mass === Unit.kilogram) return price * 2.2046;
    else if (fromUnit === Unit.kilogram && currentUnits?.mass === Unit.pound) return price / 2.2046;
    else if (fromUnit === Unit.litre && currentUnits?.volume === Unit.quart) return price * 1.05669;
    else if (fromUnit === Unit.quart && currentUnits?.volume === Unit.litre) return price / 1.05669;
    else return price;
  };

  const unitConverter = (fromUnit: Unit): Unit => {
    if (isMass(fromUnit)) return currentUnits.mass;
    else if (isVolume(fromUnit)) return currentUnits.volume;
    return Unit.unit;
  };

  return {
    currentUnits,
    setCurrentUnits,
    toggleUnit: () => {
      if (currentUnits.mass === Unit.kilogram && currentUnits.volume === Unit.litre) {
        setCurrentUnits({ mass: Unit.pound, volume: Unit.quart });
      } else setCurrentUnits({ mass: Unit.kilogram, volume: Unit.litre });
    },
    convertToCurrent: (price: number, fromUnit: Unit) => [
      priceConverter(price, fromUnit),
      unitConverter(fromUnit),
    ],
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
