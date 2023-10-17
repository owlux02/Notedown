import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  rem,
  Button,
  Box,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import classes from './UserButton.module.css';

export default function UserButton() {
  const [username, setUsername] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  useEffect(() => {
    const user: any = localStorage.getItem('username');
    setUsername(user);
  }, [username]);

  return (
    <UnstyledButton
      className={classes.user}
      onClick={() => setIsOpen(!isOpen)}
      data-cy="options-menu"
    >
      <Group>
        <Avatar src="/img/profileIcon.png" radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {username}
          </Text>
        </div>

        <IconChevronRight
          style={{ width: rem(14), height: rem(14) }}
          stroke={1.5}
        />
      </Group>
      {isOpen && (
        <Box mt={15} className={classes.opts}>
          <Button
            className={classes.logoutButton}
            onClick={logout}
            data-cy="logout-btn"
            fullWidth
          >
            Log Out
          </Button>
          <Link href="/dashboard/settings">
            <Button>Settings</Button>
          </Link>
        </Box>
      )}
    </UnstyledButton>
  );
}
