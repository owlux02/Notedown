'use client';

import { MantineProvider } from '@mantine/core';
import { useEffect } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <MantineProvider defaultColorScheme="auto">{children}</MantineProvider>
  );
}
