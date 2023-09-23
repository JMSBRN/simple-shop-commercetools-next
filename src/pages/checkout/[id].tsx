import {
  BaseAddress,
  Cart,
  ClientResponse,
  Order,
} from '@commercetools/platform-sdk';
import React, { useRef } from 'react';
import {
  addBillingAdressToOrder,
  createOrder,
} from '@/commercetools/utils/utilsOrders';
import AddressForm from '@/components/forms/addres-form/AddressForm';
import { GetServerSideProps } from 'next';
import OrderSummary from '@/components/order-summary/OrderSummary';
import { getCarts } from '@/commercetools/utils/utilsCarts';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../styles/Checkout.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';
import { useRouter } from 'next/router';

function Checkout() {
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
  const { query, push } = useRouter();
  const cartId = query.id as string;
  const cart = carts?.find((el) => el.id === cartId) as Cart;

  const handleSubMit = async (e?: BaseAddress) => {
    if (e?.firstName) {
      const { version, cartState } = (await getCarts(cartId)) as Cart;

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
    ['firstName', 'lastName'],
    ['postalCode', 'city'],
    ['streetName', 'streetNumber'],
    ['additionalStreetInfo'],
    ['building', 'apartment'],
    ['company', 'department'],
    ['email', 'phone'],
  ];

  return (
    <div className={checkoutMainContainer}>
      <div className={mainTitle}>
        <h3>Checkout</h3>
      </div>
      <div className={checkoutContainer}>
        <div className={billingDetailsContainer}>
          <div className={formTitle}>billingDetails</div>
          <AddressForm
            formRef={formRef}
            addressFields={addressFields}
            onSubmit={handleSubMit}
          />
        </div>
        <div className={orderSummaryContainer}>
          <div className={formTitle}>orderSummary</div>
          <OrderSummary cart={cart} handlePlaceOrder={handlePlaceOrder} />
        </div>
      </div>
    </div>
  );
}

export default Checkout;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'en', [
      'translation',
      'common',
    ])),
  },
});
