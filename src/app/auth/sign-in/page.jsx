import { CONFIG } from 'src/config-global';

import { JwtSignInView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in | ${CONFIG.appName}` };

export default function Page() {
  return <JwtSignInView />;
}
