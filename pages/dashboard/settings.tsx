import Head from 'next/head';
import { Box, Checkbox, Text, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

import styles from './css/Settings.module.css';
import { supabase } from '@/lib/supabaseClient';
import { TABLE_NAME } from '@/consts/consts';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);

  const deleteAccount = async () => {
    const username = localStorage.getItem('username');
    const confirmation = prompt(
      `Are you sure you want to delete your account?\nThis action cannot be undone.\n\nType "${username}" to confirm.`
    );

    if (confirmation && confirmation === username) {
      const deleteUserFromDB = () =>
        new Promise((resolve) => {
          resolve(supabase.from(TABLE_NAME).delete().eq('name', username));
        });

      toast.promise(deleteUserFromDB, {
        loading: 'Loading...',
        success: (): any => {
          toast.success('Account deleted');
          localStorage.removeItem('username');
          window.location.href = '/';
          return;
        },
        error: (): any => {
          toast.error('Failed to delete account')
          return;
        },
      });
      return;
    }

    if (confirmation !== username) {
      toast.error('Invalid confirmation');
      return;
    }
    return null;
  };

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
      <Toaster richColors />
      <Box p={15} className={styles.container}>
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

        <Box mt={35} className={styles.dangerZoneContainer}>
          <h2>Danger Zone</h2>
          <Button onClick={deleteAccount} mt={2}>Delete my account</Button>
        </Box>

        <Link href="/dashboard" className={styles.goBack}>
          Go back to the Dashboard
        </Link>
      </Box>
    </>
  );
};

export default Settings;
