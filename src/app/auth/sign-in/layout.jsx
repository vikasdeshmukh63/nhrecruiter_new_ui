import { AuthSplitLayout } from 'src/layouts/auth-split';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <GuestGuard>
      <AuthSplitLayout
        section={{
          title:
            'Welcome to NovelHire! Streamline your hiring process with our AI-powered interviews, saving you time and finding the best candidates effortlessly.',
          imgUrl: '/assets/background/background-3.webp',
        }}
      >
        {children}
      </AuthSplitLayout>
    </GuestGuard>
  );
}
