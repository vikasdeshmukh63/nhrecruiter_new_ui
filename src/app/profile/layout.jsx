// ----------------------------------------------------------------------

import { AuthGuard } from 'src/auth/guard';
import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

export default function Layout({ children }) {
  if (CONFIG.auth.skip) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
