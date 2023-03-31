import { ComponentType, useState } from 'react';
import { Unit } from '../lib/firebase/interfaces';
import { AuthContext, useProvideAuth } from '../hooks/useAuth';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { theme } from '../components/UI/Theme';
import { UnitContext } from '../hooks/useUnit';

type Props = {
  Component: ComponentType;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  pageProps: any;
};

const App = ({ Component, pageProps }: Props): JSX.Element => {
  const [currentUnit, setCurrentUnit] = useState({ mass: Unit.pound, liquid: Unit.litre });
  const [oppositeUnit, setOppositeUnit] = useState(() =>
    currentUnit.mass === Unit.pound
      ? { mass: Unit.kilogram, liquid: Unit.litre }
      : { mass: Unit.pound, liquid: Unit.quart },
  );

  return (
    <ChakraProvider theme={extendTheme(theme)}>
      <AuthContext.Provider value={useProvideAuth()}>
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
      </AuthContext.Provider>
    </ChakraProvider>
  );
};

export default App;
