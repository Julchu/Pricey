import { createContext, useContext } from 'react';
import { darkModeStyles } from '../components/UI/DarkMode';

const test = {
  backgroundColor: '#212121',
  color: 'white',
  fontWeight: {
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  breakpoints: {
    mobile: '@media (min-width: 320px)',
    tablet: '@media (min-width: 481px)',
    laptop: '@media (min-width: 769px)',
    desktop: '@media (min-width: 1025px)',
    television: '@media (min-width: 1201px)',
  },
  boxShadows: {
    normal: 'rgba(0, 0, 0, 0.2)',
    hover: 'rgba(0, 0, 0, 0.2)',
    focus: 'rgba(0, 0, 0, 0.2)',
    under: 'rgba(0, 0, 0, 0.2)',
  },
};

// Theme types that need to be adjusted to add fields in DarkMode.tsx/darkModeStyles
type ThemeType = typeof test;

declare module '@emotion/react' {
  export interface Theme extends ThemeType {}
}

type DarkModeType = {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
};

export const DarkModeContext = createContext<DarkModeType>({
  darkMode: false,
  setDarkMode: () => {},
});

export const useDarkMode = (): DarkModeType => useContext(DarkModeContext);
