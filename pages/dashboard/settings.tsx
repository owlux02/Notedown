import Head from 'next/head';
import { Box, Checkbox, Group, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import Link from 'next/link'

import styles from './css/Settings.module.css';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    /*
     * This is for check if dark mode is enabled or disabled,
     * if it's enabled check the `Checkbox` component,
     * if it's disabled check the `Checkbox` component
     */
    const mode = localStorage.getItem('darkMode');
    if (mode === 'true') {
      setDarkMode(true);
      return;
    }
    setDarkMode(false);
  }, []);

  return (
    <>
      <Head>
        <title>Settings / Notedown</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box p={15}>
        <h1>Settings</h1>
        <div className={styles.flex}>
          <Checkbox
            checked={darkMode}
            onChange={() => {
              const mode = !darkMode;
              localStorage.setItem('darkMode', mode.toString());
              setDarkMode(!darkMode);

              // This will be changed soon...
              document.querySelector('html')!.dataset.mantineColorScheme = mode
                ? 'dark'
                : 'light';
            }}
            tabIndex={-1}
            size="md"
            styles={{ input: { cursor: 'pointer' } }}
            aria-hidden
          />
          <Text>Dark Mode</Text>
        </div>

        <Link href="/dashboard" className={styles.goBack}>
          Go back to the Dashboard
        </Link>
      </Box>
    </>
  );
};

export default Settings;
