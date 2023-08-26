import { NextRouter } from 'next/router';

const toggleServerSideLaguage = (router: NextRouter, newLocale: string) => {
    const { pathname, asPath, query } = router;

    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

export default toggleServerSideLaguage;