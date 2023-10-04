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
import classes from './UserButton.module.css';

export function UserButton() {
  const [username, setUsername] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  function logout() {
    localStorage.removeItem('username');
    window.location.href = '/login';
  }

  useEffect(() => {
    const user: any = localStorage.getItem('username');
    setUsername(user);
  }, [username]);

  return (
    <UnstyledButton className={classes.user} onClick={() => setIsOpen(!isOpen)}>
      <Group>
        <Avatar src="profileIcon.png" radius="xl" />

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
          <Button className={classes.logoutButton} onClick={logout}>Log Out</Button>
          <Button>Settings</Button>
        </Box>
      )}
    </UnstyledButton>
  );
}
