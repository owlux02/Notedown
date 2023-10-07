import '@/styles/globals.css';
import '@mantine/core/styles.css';

import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <MantineProvider defaultColorScheme="dark">
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default App;
