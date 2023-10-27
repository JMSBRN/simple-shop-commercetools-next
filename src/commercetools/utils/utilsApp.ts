import { ErrorResponse } from '@commercetools/platform-sdk';
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

  export const  isErrorResponse = (obj: any): obj is ErrorResponse => {
    return (
      typeof obj === 'object' &&
      'statusCode' in obj &&
      'message' in obj &&
      typeof obj.statusCode === 'number' &&
      typeof obj.message === 'string' &&
      (obj.errors === undefined || Array.isArray(obj.errors))
    );
  };

  export const isInternetConnectionOnline = () => {
    if (typeof window !== 'undefined') {
      return window.navigator.onLine;
    }
    return false;
  };