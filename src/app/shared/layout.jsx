'use client';

import { CompactLayout } from 'src/layouts/compact';

import { useAuthContext } from 'src/auth/hooks';
import { AuthGuard, GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <GuestGuard>
        <CompactLayout textAlign="start" maxWidth="100%" justifyContent="start">
          {children}
        </CompactLayout>
      </GuestGuard>
    );
  }
  return (
    <AuthGuard>
      <CompactLayout textAlign="start" maxWidth="100%" justifyContent="start">
        {children}
      </CompactLayout>
    </AuthGuard>
  );
}
