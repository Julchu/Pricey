import { ChakraProvider } from '@chakra-ui/react';
import { FC } from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../hooks/useAuthContext';
import theme from '../components/UI/Theme';
import { UnitProvider } from '../hooks/useUnitContext';
import { SidebarProvider } from '../hooks/useSidebarContext';
import { IngredientProvider } from '../hooks/useIngredientContext';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <SidebarProvider>
          <IngredientProvider>
            <UnitProvider>
              <Component {...pageProps} />
            </UnitProvider>
          </IngredientProvider>
        </SidebarProvider>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
