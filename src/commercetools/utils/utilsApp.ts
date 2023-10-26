import { NextRouter } from 'next/router';

export const toggleServerSideLaguage = (router: NextRouter, newLocale: string) => {
    const { pathname, asPath, query } = router;

    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  export const setCurrency = (country: string) => {
    switch (country) {
      case 'GB':
        return 'GBP';
      case 'DE':
        return 'EUR';
      case 'FR':
        return 'EUR';
      case 'IL':
        return 'ILS';
      default:
        return 'GBP';
    }
  }; 

  export const  removeUnderscores = (inputString: string) => {
    return inputString.replace('_', ' ');
  };