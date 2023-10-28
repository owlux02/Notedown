'use client';

import { Container, Group, ActionIcon, rem } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import Image from 'next/image';
import classes from './styles.module.css';

const Footer = () => {
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Image src="/favicon.ico" alt="Logo" width={40} height={40} />
          <b>Notedown</b>
        </div>
        <Group
          gap={0}
          className={classes.links}
          justify="flex-end"
          wrap="nowrap"
        >
          <a
            href="https://github.com/martinval11/Notedown"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ActionIcon size="lg" color="gray" variant="subtle">
              <IconBrandGithub
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          </a>
        </Group>
      </Container>
    </div>
  );
}

export default Footer;
