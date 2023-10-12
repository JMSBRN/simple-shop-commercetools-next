import { PaymentDraft } from '@commercetools/platform-sdk';
import { apiRoot } from '../BuildClient';

export const getPayments = async function name(ID?: string) {
    if (ID) {
        return (await apiRoot.payments().withId({ ID }).get().execute()).body;
      }
      return (await apiRoot.payments().get().execute()).body.results;
};

export const createPayment = async function name(currencyCode: string, customerId?:string) {
  const dataBodyWithCustomer: PaymentDraft =  {
    customer: {
      typeId: 'customer',
      id:customerId
    },
    paymentMethodInfo: {
      paymentInterface: 'STRIPE',
       method: 'CREDIT_CARD',
       name: {
        'en-GB': 'Credit Card'
       },
    },
      amountPlanned: {
        currencyCode,
        type: 'centPrecision',
        centAmount: 200,
        fractionDigits: 2
      }
  };

  if(customerId) {
    return ( await apiRoot.payments().post({
      body: dataBodyWithCustomer
  }).execute());

  }
  return ( await apiRoot.payments().post({
    body: {
      paymentMethodInfo: {
        paymentInterface: 'STRIPE',
         method: 'CREDIT_CARD',
         name: {
          'en-GB': 'Credit Card'
         },
      },
      amountPlanned: {
        currencyCode,
        type: 'centPrecision',
        centAmount: 200,
        fractionDigits: 2
      }
    }
}).execute());

};
