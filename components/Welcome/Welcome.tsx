import {
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import Link from 'next/link';
import image from './image.svg';
import classes from './welcome.module.css';

export default function Welcome() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            A <span className={classes.highlight}>simple</span> <br />{' '}
            note-taking app
          </Title>
          <Text c="dimmed" mt="md">
            Take notes with Notedown and you never have to worry about losing
            them!
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck
                  style={{ width: rem(12), height: rem(12) }}
                  stroke={1.5}
                />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Simple</b> – with a clean interface
            </List.Item>
            <List.Item>
              <b>Free and open source</b> - with MIT license
            </List.Item>
            <List.Item>
              <b>Multiple Sync</b> - you can sync your data between all your
              devices
            </List.Item>
          </List>

          <Group mt={30}>
            <Link href="/signup">
              <Button radius="xl" size="md" className={classes.control}>
                Get started
              </Button>
            </Link>
            <Link href="https://github.com/martinval11/Notedown">
              <Button
                variant="default"
                radius="xl"
                size="md"
                className={classes.control}
              >
                Source code
              </Button>
            </Link>
          </Group>
        </div>
        <Image src={image.src} className={classes.image} alt="presentation image" />
      </div>
    </Container>
  );
}
