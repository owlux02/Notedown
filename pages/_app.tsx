import '@/styles/globals.css';
import '@mantine/core/styles.css';

import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { useEffect } from 'react';

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');

    if (darkMode === 'true') {
      document.querySelector('html')!.dataset.mantineColorScheme = 'dark';
    }

    if (darkMode === 'false') {
      document.querySelector('html')!.dataset.mantineColorScheme = 'light';
    }
  }, []);

  return (
    <MantineProvider defaultColorScheme="auto">
      <Component {...pageProps} />
    </MantineProvider>
  );
};

export default App;
