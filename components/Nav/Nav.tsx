'use client';

import { Group, Button, Box } from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image';
import classes from './styles.module.css';

const Nav = () => {
  return (
    <Box className={classes.header}>
      <Group justify="space-between" h="100%">
        <div className={classes.logo}>
          <Image src="/favicon.ico" alt="Notedown Logo" width={40} height={40} />
          <b>Notedown</b>
        </div>

        <Group>
          <Link href="/login" data-cy='login-btn'>
            <Button variant="default">Log in</Button>
          </Link>
          <Link href="/signup" data-cy='signup-btn'>
            <Button>Sign up</Button>
          </Link>
        </Group>
      </Group>
    </Box>
  );
}

export default Nav;
