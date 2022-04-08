import '../styles/globals.css';
import React, { ComponentType } from 'react';
// import ThemeProvider from '../components/UI/ThemeProvider';

type Props = {
  Component: ComponentType;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  pageProps: any;
};

const App = ({ Component, pageProps }: Props): JSX.Element => {
  return (
    // <ThemeProvider>
    // </ThemeProvider>
    <Component {...pageProps} />
  );
};

export default App;
