import React, { ComponentType, useState } from 'react';
import { DarkModeContext } from '../contexts/DarkModeContext';
import '../styles/globals.css';
import { ThemeProvider } from '@emotion/react';
import { darkModeStyles } from '../components/UI/DarkMode';
import { UnitContext } from '../contexts/UnitContext';

type Props = {
  Component: ComponentType;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  pageProps: any;
};

const App = ({ Component, pageProps }: Props): JSX.Element => {
  const [darkMode, setDarkMode] = useState(false);
  const [unit, setUnit] = useState('lb');

  return (
    <ThemeProvider theme={darkModeStyles(darkMode)}>
      <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
        <UnitContext.Provider value={{ unit, setUnit }}>
          <Component {...pageProps} />
        </UnitContext.Provider>
      </DarkModeContext.Provider>
    </ThemeProvider>
  );
};

export default App;
