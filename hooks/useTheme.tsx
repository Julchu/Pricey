import { createContext, useContext } from 'react';

// Theme types that need to be adjusted to add fields in Theme.tsx/darkModeStyles
declare module '@emotion/react' {
  export interface Theme {
    test: string;
    backgroundColor: string;
    color: string;
    fontWeight: {
      regular: number;
      medium: number;
      semiBold: number;
      bold: number;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      laptop: string;
      desktop: string;
      television: string;
    };
    boxShadows: {
      normal: string;
      hover: string;
      focus: string;
      under: string;
    };
  }
}

type DarkModeType = {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
};

export const ThemeContext = createContext<DarkModeType>({
  darkMode: false,
  setDarkMode: () => {},
});

export const useDarkMode = (): DarkModeType => useContext(ThemeContext);
