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
  export const  areAllObjectValuesEqual = (obj: Record<string, string>) => {
    const values = Object.values(obj);
  
    if (values.length === 0) {
      // If the object has no values, consider them not equal
      return false;
    }
  
    const firstValue = values[0];
  
    for (let i = 1; i < values.length; i++) {
      if (values[i] !== firstValue) {
        return false;
      }
    }
  
    return true;
  };

  export const  getNameAtIndex = (idx: number, array: { name: string }[]) => {
    return array[idx % array.length].name;
  };
