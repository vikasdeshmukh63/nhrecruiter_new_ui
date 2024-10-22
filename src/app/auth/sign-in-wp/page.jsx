'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Alert, Box, Button } from '@mui/material';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';
import { signInWithoutPassword } from 'src/auth/context/jwt';
import { useAuthContext } from 'src/auth/hooks';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();
  const { checkUserSession } = useAuthContext();

  const returnToDashboard = async (username) => {
    if (username) {
      try {
        await signInWithoutPassword?.(username, router);
        await checkUserSession?.();
        router.push(CONFIG.auth.redirectPath);
      } catch (error) {
        console.error(error);
        setIsLoading(false); // Set loading to false once API call completes

        setErrorMsg(typeof error === 'string' ? error : error.message);
      }
    }
  };

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_ADMIN || 'http://localhost:3035';
    if (window.opener) {
      window.opener.postMessage('ready', url);
    } else {
      setIsLoading(false);
    }

    // Listen for the actual message from localhost:3035
    const handleMessage = (event) => {
      if (event.origin === url) {
        returnToDashboard(event.data);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (errorMsg) {
    return (
      <Box display="flex" height="100vh" justifyContent="center" alignItems="center" mb={3}>
        <Alert severity="error">{errorMsg}</Alert>
      </Box>
    );
  }

  return (
    <GuestGuard>
      <Box display="flex" height="100vh" justifyContent="center" alignItems="center" mb={3}>
        <Button href="/auth/login" variant="contained">
          Login
        </Button>
      </Box>
    </GuestGuard>
  );
}
