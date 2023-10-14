import { Button, Input, Title } from '@mantine/core';

import {
  Box,
  Progress,
  PasswordInput,
  Group,
  Text,
  Center,
} from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconCheck, IconX } from '@tabler/icons-react';
import { FormEvent, useRef, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Toaster, toast } from 'sonner';

import styles from './styles.module.css';
import Footer from '@/components/Footer/Footer';
import { supabase } from '@/lib/supabaseClient';
import { encrypt } from '@/lib/security/encrypt';
import { TABLE_NAME } from '@/consts/consts';

const SignUp = () => {
  const [loading, setLoading] = useState(false);

  const userRef: any = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Password strength requirements

  const PasswordRequirement = ({
    meets,
    label,
  }: {
    meets: boolean;
    label: string;
  }) => {
    return (
      <Text component="div" c={meets ? 'teal' : 'red'} mt={5} size="sm">
        <Center inline>
          {meets ? (
            <IconCheck size="0.9rem" stroke={1.5} />
          ) : (
            <IconX size="0.9rem" stroke={1.5} />
          )}
          <Box ml={7}>{label}</Box>
        </Center>
      </Text>
    );
  };

  const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
  ];

  const getStrength = (password: string) => {
    let multiplier = password.length > 5 ? 0 : 1;

    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
  };

  const [value, setValue] = useInputState('');
  const strength = getStrength(value);

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(value)}
    />
  ));

  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ section: { transitionDuration: '0ms' } }}
        value={
          value.length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / 4) * 100
            ? 100
            : 0
        }
        color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
        key={index}
        size={4}
      />
    ));

  const createAccount = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
  
    // find if user exists
    const { data } = await supabase.from(TABLE_NAME).select('name');
    const user = data?.find((user) => user.name === userRef.current?.value);

    if (user) {
      toast.error('This user already exists!');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from(TABLE_NAME).insert([
      {
        name: userRef.current?.value,
        password: encrypt(passRef.current?.value),
        notes: [],
      },
    ]);

    if (error) {
      toast.error('Error creating account!');
      throw new Error(error.message);
    }
    localStorage.setItem('username', userRef.current?.value);
    router.push('/dashboard');

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Sign Up / Notedown</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster richColors />
      <div className={styles.container}>
        <form className={styles.form} onSubmit={createAccount}>
          <Title className={styles.title}>Sign Up</Title>

          <Group justify="space-between" mb={5} mt={10}>
            <Text component="label" htmlFor="your-username" size="sm" fw={500}>
              Username
              <span className={styles.required}>*</span>
            </Text>
          </Group>
          <Input
            placeholder="Username"
            type="text"
            id="your-username"
            ref={userRef}
            data-cy="username-input-signup"
            required
          />

          <div>
            <PasswordInput
              value={value}
              onChange={setValue}
              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^.&+=!])(?=\S+$).{6,}$"
              ref={passRef}
              placeholder="Password"
              label="Password"
              mt={10}
              data-cy="password-input-signup"
              required
            />

            <Group gap={5} grow mt="xs" mb="md">
              {bars}
            </Group>

            <PasswordRequirement
              label="Has at least 6 characters"
              meets={value.length > 5}
            />
            {checks}
          </div>

          <Button type="submit" mt={5} w="100%" disabled={loading} data-cy='createAccount-btn'>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Link href="/login" className={styles.formLink}>
            Do you have an account? Login here
          </Link>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default SignUp;
