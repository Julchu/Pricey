import { createContext, useContext } from 'react';

type DarkModeType = {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
};

export const DarkModeContext = createContext<DarkModeType>({
  darkMode: false,
  setDarkMode: () => {},
});

export const useDarkMode = (): DarkModeType => useContext(DarkModeContext);
