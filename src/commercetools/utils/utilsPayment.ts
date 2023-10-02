import { apiRoot } from '../BuildClient';

export const createPayment = async function name(currencyCode: string) {
    return ( await apiRoot.payments().post({
      body: {
          amountPlanned: {
            currencyCode,
            type: 'centPrecision',
            centAmount: 200
            
          }
      }
    }).execute());
};
export const getPayments = async function name(ID?: string) {
    if (ID) {
        return (await apiRoot.payments().withId({ ID }).get().execute()).body;
      }
      return (await apiRoot.payments().get().execute()).body.results;
};

