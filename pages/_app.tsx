import React, { ComponentType, useState } from 'react';
import { DarkModeContext } from '../contexts/DarkModeContext';
import '../styles/globals.css';
import { ThemeProvider } from '@emotion/react';
import { darkModeStyles } from '../components/UI/DarkMode';

type Props = {
  Component: ComponentType;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  pageProps: any;
};

const App = ({ Component, pageProps }: Props): JSX.Element => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkModeStyles(darkMode)}>
      <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
        <Component {...pageProps} />
      </DarkModeContext.Provider>
    </ThemeProvider>
  );
};

export default App;
