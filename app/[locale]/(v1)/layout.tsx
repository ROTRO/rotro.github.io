import SiteChrome from '@/components/SiteChrome';

import '../../styles/global.css';
import '../../styles/pages.css';
import '../../styles/showcase.css';

/**
 * v1 shell: the original dark "engineered system" design. Scoped to this
 * route group so its global CSS and chrome never load on the v2 routes.
 */
export default function V1Layout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
