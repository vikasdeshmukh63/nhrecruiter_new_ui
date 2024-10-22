import { CONFIG } from 'src/config-global';

import { DashboardView } from 'src/sections/overview/analytics/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <DashboardView />;
}
