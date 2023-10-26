import {
  Cart,
  ClientResponse,
  Payment,
  PaymentDraft,
  PaymentInfo,
} from '@commercetools/platform-sdk';
import { getCarts, removePaymentFromCart } from './utilsCarts';
import { apiRoot } from '../BuildClient';

export const getPayments = async (ID?: string) =>  {
  if (ID) {
    return await apiRoot.payments().withId({ ID }).get().execute();
  }
  return await apiRoot.payments().get().execute();
};

export const deletePayment = async (ID: string) => {
  const { body } = await getPayments(ID) as ClientResponse<Payment>;
  const { version } = body;

  return await apiRoot
    .payments()
    .withId({ ID })
    .delete({
      queryArgs: {
        version,
      },
    })
    .execute();
};

export const deleteAllPaymentsFromPaymentInfo = async (paymentInfo: PaymentInfo) => {
  if (!paymentInfo || !paymentInfo.payments || paymentInfo.payments.length === 0) {
    return true;
  }

  const deletePaymentPromises = paymentInfo.payments.map(async (p) => {
    if (p.id) {
      const deleteResult = await deletePayment(p.id);
      
      return deleteResult.statusCode === 200;
    }
    return true;
  });

  const results = await Promise.all(deletePaymentPromises);

  return !results.includes(false);
};

export const deleteAllPaymentsFromCart = async (cartId: string) => {
  const { paymentInfo } = (await getCarts(cartId)) as Cart;

  if (paymentInfo) {
    const res = Promise.all(
      paymentInfo.payments?.map(async (p) => {

        if (p.id) {
          const res = await removePaymentFromCart(cartId, p.id);

          if (res.statusCode === 200) {
            return await deletePayment(p.id);
          }
        }
      })
    );

    return (await res).every((res) => res !== undefined);
  }
};

export const createCreditCardPayment = async function name(
  currencyCode: string,
  customerId?: string
) {
  const bodyData: PaymentDraft = {
    paymentMethodInfo: {
      paymentInterface: 'STRIPE',
      method: 'CREDIT_CARD',
      name: {
        'en-GB': 'Credit Card',
      },
    },
    amountPlanned: {
      currencyCode,
      type: 'centPrecision',
      centAmount: 200,
      fractionDigits: 2,
    },
  };

  if (customerId) {
    return await apiRoot
      .payments()
      .post({
        body: {
          ...bodyData,
          customer: {
            typeId: 'customer',
            id: customerId,
          },
        },
      })
      .execute();
  }
  return await apiRoot
    .payments()
    .post({
      body: bodyData,
    })
    .execute();
};

export const createPayPalPayment = async function name(
  currencyCode: string,
  customerId?: string
) {
  const bodyData: PaymentDraft = {
    paymentMethodInfo: {
      paymentInterface: 'STRIPE',
      method: 'PAY_PAL',
      name: {
        'en-GB': 'PayPal',
      },
    },
    amountPlanned: {
      currencyCode,
      type: 'centPrecision',
      centAmount: 300,
      fractionDigits: 2,
    },
  };

  if (customerId) {
    return await apiRoot
      .payments()
      .post({
        body: {
          ...bodyData,
          customer: {
            typeId: 'customer',
            id: customerId,
          },
        },
      })
      .execute();
  }
  return await apiRoot
    .payments()
    .post({
      body: bodyData,
    })
    .execute();
};
