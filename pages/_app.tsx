import React, { ComponentType, useState } from 'react';
import { DarkModeContext } from '../hooks/darkModeContext';
import '../styles/globals.css';
// import ThemeProvider from '../components/UI/ThemeProvider';

type Props = {
  Component: ComponentType;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  pageProps: any;
};

const App = ({ Component, pageProps }: Props): JSX.Element => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      <Component {...pageProps} />
    </DarkModeContext.Provider>
  );
};

export default App;
