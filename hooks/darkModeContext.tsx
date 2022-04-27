import { createContext, CSSProperties, useContext } from 'react';

type DarkModeType = {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
};

export const darkModeStyles = (mode: boolean): CSSProperties => ({
  backgroundColor: mode ? '#212121' : '',
  color: mode ? 'white' : '',
});

export const DarkModeContext = createContext<DarkModeType>({
  darkMode: false,
  setDarkMode: () => {},
});

export const useDarkMode = (): DarkModeType => useContext(DarkModeContext);
