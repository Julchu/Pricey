import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { FC } from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../hooks/useAuth';
import { theme } from '../components/UI/Theme';
import { UnitProvider } from '../hooks/useUnit';
import { SidebarProvider } from '../hooks/useSidebar';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={extendTheme(theme)}>
      <AuthProvider>
        <SidebarProvider>
          <UnitProvider>
            <Component {...pageProps} />
          </UnitProvider>
        </SidebarProvider>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
