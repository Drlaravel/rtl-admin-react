import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OverviewEcommerceView } from 'src/sections/overview/e-commerce/view';

// ----------------------------------------------------------------------

const metadata = { title: `فروشگاه | داشبورد - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OverviewEcommerceView />
    </>
  );
}
