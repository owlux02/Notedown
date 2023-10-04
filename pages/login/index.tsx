import {
  PasswordInput,
  Text,
  Group,
  Anchor,
  Button,
  Input,
  Title,
} from '@mantine/core';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './styles.module.css';
import Footer from '@/components/Footer/Footer';

import { supabase } from '@/lib/supabaseClient';
import { decrypt } from '@/lib/security/decrypt';
import { Toaster, toast } from 'sonner';
import { FormEvent, useRef, useState } from 'react';
import { TABLE_NAME } from '@/consts/consts';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    const { data: users, error } = await supabase
      .from(TABLE_NAME)
      .select('name, password');

    if (error) {
      toast.error('Something went wrong');
      throw new Error(error.message);
    }

    const searchUser = users.find(
      (user: any) =>
        user.name === (username || userRef.current?.value) &&
        decrypt(user.password).message === (password || passRef.current?.value)
    );

    if (searchUser) {
      localStorage.setItem('username', searchUser.name);
      router.push('/dashboard');
      return;
    }
    toast.error('Wrong username or password');
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Login / Notedown</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster richColors />
      <div className={styles.container}>
        <form className={styles.form} onSubmit={login}>
          <Title className={styles.title}>Login</Title>
          <Group justify="space-between" mb={5} mt={10}>
            <Text component="label" htmlFor="your-username" size="sm" fw={500}>
              Username
            </Text>
          </Group>
          <Input
            placeholder="Username"
            type="text"
            id="your-username"
            required
            value={username}
            onChange={(event: any) => setUsername(event.target.value)}
          />

          <Group mb={5} mt={10}>
            <Text component="label" htmlFor="your-password" size="sm" fw={500}>
              Password
            </Text>
          </Group>
          <PasswordInput
            placeholder="Your password"
            id="your-password"
            ref={passRef}
            value={password}
            onChange={(event: any) => setPassword(event.target.value)}
            required
          />

          <Button type="submit" mt={5} w="100%" disabled={loading}>
            {loading ? 'Login...' : 'Login'}
          </Button>

          <Link href="/signup" className={styles.formLink}>
            Just getting started? Create an Account
          </Link>
        </form>
      </div>
      <Footer />
    </>
  );
}
