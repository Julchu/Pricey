import React, { FC } from 'react';
import { ThemeProvider as ThemeProviderBase } from '@emotion/react';

// Do not export, use React context to access theme
const theme = {
  pageBackground: '#FFF',
  fontColor: '#000',
  colors: {
    primary: {
      regular: '#000',
    },
    secondary: {},
    white: '#fff',
    black: '#000',
    blue: '#0454CC',
    gray: {
      light: '#DDDDDE',
      regular: '#CFCFCF',
    },
    input: {
      focus: '#0454CC',
      error: '#D63955',
      success: '#038758',
      errorMessage: '#AD1933',
    },
  },
  fontFamilies: {
    primary: 'Inter',
    secondary: '',
  },
  post: {
    shadow: '0px 2px 20px rgba(0, 0, 0, 0.04)',
  },
  weight: {
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  bp: {
    xsDown: '@media (min-width: 575px)',
    mdDown: '@media (min-width: 768px)',
    lgDown: '@media (min-width: 992px)',
  },
};

type ThemeType = typeof theme;

declare module '@emotion/react' {
  export interface Theme extends ThemeType {}
}

interface Props {
  children: React.ReactNode;
}

const ThemeProvider: FC<Props> = ({ children }) => (
  <ThemeProviderBase theme={theme}>{children}</ThemeProviderBase>
);

export default ThemeProvider;
