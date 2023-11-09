import {
  BaseAddress,
  Cart,
  ClientResponse,
  Order,
  PaymentPagedQueryResponse,
} from '@commercetools/platform-sdk';
import React, { useEffect, useRef, useState } from 'react';
import {
  addBillingAdressToOrder,
  createOrder,
} from '@/commercetools/utils/utilsOrders';
import AddressForm from '@/components/forms/addres-form/AddressForm';
import { GetServerSideProps } from 'next';
import OrderSummary from '@/components/order-summary/OrderSummary';
import { deleteCookieFromLocal } from '@/commercetools/utils/secureCookiesUtils';
import { getCurrentDataFromCart } from '@/commercetools/utils/utilsCarts';
import { getPayments } from '@/commercetools/utils/utilsPayment';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../styles/Checkout.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

function Checkout({ paymentMethod }: { paymentMethod: string | undefined }) {
  const {
    checkoutMainContainer,
    mainTitle,
    checkoutContainer,
    formTitle,
    billingDetailsContainer,
    orderSummaryContainer,
  } = styles;
  const formRef = useRef<HTMLFormElement | null>(null);
  const { carts, country } = useAppSelector(selectCommerceTools);
  const [cart, setCart] = useState<Cart>();
  const { query, push } = useRouter();
  const cartId = query.id as string;
  const { t } = useTranslation('form');

  useEffect(() => {
    carts.forEach((c) => {
      if (c.id === cartId) setCart(c);
    });
  }, [cartId, carts]);

  const handleSubMit = async (e?: BaseAddress) => {
    if (e?.firstName) {
      const result = await  getCurrentDataFromCart(cartId);
      const { version, cartState } = result!;

      const res = (await createOrder(
        cartId,
        version,
        cartState
      )) as ClientResponse<Order>;
      const { id } = res.body;

      if (id) {
        const orderResp = (await addBillingAdressToOrder(
          id,
          country,
          e
        )) as ClientResponse<Order>;
        const { orderState } = orderResp.body;

        if (orderState === 'Open') {
          deleteCookieFromLocal('currentCartId');
          push(`/ordered/${id}`);
        }
      }
    }
  };
  const handlePlaceOrder = () => {
    handleSubMit();
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const addressFields: (keyof BaseAddress)[][] = [
    [t('firstName'), t('lastName')],
    [t('postalCode'), t('city')],
    [t('streetName'), t('streetNumber')],
    [t('additionalStreetInfo')],
    [t('building'), t('apartment')],
    [t('company'), t('department')],
    [t('email'), t('phone')],
  ];
  const addressFieldsOrderSummary: (keyof BaseAddress)[][] = [
    [t('firstName')],
    [t('lastName')],
    [t('city')],
    [t('streetName')],
    [t('building')],
    [t('email')],
    [t('phone')],
  ];

  return (
    <div className={checkoutMainContainer}>
      <div className={mainTitle}>
        <h3>{t('checkout', { ns: 'common' })}</h3>
      </div>
      <div className={checkoutContainer}>
        <div className={billingDetailsContainer}>
          <div className={formTitle}>billingDetails</div>
          <AddressForm
            formRef={formRef}
            addressFields={addressFields}
            onSubmit={handleSubMit}
            inputWithCalcWidth={true}
          />
        </div>
        <div className={orderSummaryContainer}>
          <div className={formTitle}>orderSummary</div>
          {cart?.id && (
            <OrderSummary
              cart={cart}
              addressFields={addressFieldsOrderSummary}
              paymentMethod={paymentMethod}
              handlePlaceOrder={handlePlaceOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const res =
    (await getPayments()) as ClientResponse<PaymentPagedQueryResponse>;

  const { results } = res.body;

  const paymentMethod = results
    .map((p) => {
      if (p.paymentMethodInfo) {
        const { method } = p.paymentMethodInfo;

        if (method) {
          return method;
        }
      }
    })
    .find((e) => typeof e === 'string');

  return {
    props: {
      paymentMethod,
      ...(await serverSideTranslations(locale || 'en-GB', [
        'form',
        'translation',
        'common',
      ])),
    },
  };
};
