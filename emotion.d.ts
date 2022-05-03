// Theme types that need to be adjusted to add fields in DarkMode.tsx/darkModeStyles
// import { ThemeType } from './components/UI/DarkMode';

declare module '@emotion/react' {
  export interface Theme {
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
