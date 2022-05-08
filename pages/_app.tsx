import React, { ComponentType, useState } from 'react';
import { DarkModeContext } from '../contexts/DarkModeContext';
import '../styles/globals.css';
import { ThemeProvider } from '@emotion/react';
import { darkModeStyles } from '../components/UI/DarkMode';
import { UnitContext } from '../contexts/UnitContext';
import { Unit } from '../lib/firebase/interfaces';

type Props = {
  Component: ComponentType;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  pageProps: any;
};

const App = ({ Component, pageProps }: Props): JSX.Element => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentUnit, setCurrentUnit] = useState({ mass: Unit.lb, area: Unit.squareFeet });
  const [oppositeUnit, setOppositeUnit] = useState(() =>
    currentUnit.mass === Unit.lb
      ? { mass: Unit.kg, area: Unit.squareMeters }
      : { mass: Unit.lb, area: Unit.squareFeet },
  );

  return (
    <ThemeProvider theme={darkModeStyles(darkMode)}>
      <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
        <UnitContext.Provider
          value={{
            currentUnit,
            setCurrentUnit,
            oppositeUnit,
            setOppositeUnit,
          }}
        >
          <Component {...pageProps} />
        </UnitContext.Provider>
      </DarkModeContext.Provider>
    </ThemeProvider>
  );
};

export default App;
