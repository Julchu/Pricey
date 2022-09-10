import React, { ComponentType, useState } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/globals.css';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../components/UI/Theme';
import { UnitContext } from '../contexts/UnitContext';
import { Unit } from '../lib/firebase/interfaces';
import { AuthContext, useProvideAuth } from '../contexts/AuthContext';

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
    <AuthContext.Provider value={useProvideAuth()}>
      <ThemeProvider theme={theme(darkMode)}>
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
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
        </ThemeContext.Provider>
      </ThemeProvider>
    </AuthContext.Provider>
  );
};

export default App;
