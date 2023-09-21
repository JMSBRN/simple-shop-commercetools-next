import { BaseAddress, Cart } from '@commercetools/platform-sdk';
import React, { useRef } from 'react';
import BillingAddressForm from '@/components/forms/billing-addres-form/BillingAddressForm';
import { GetServerSideProps } from 'next';
import OrderSummary from '@/components/order-summary/OrderSummary';
import { addShippingAddresToCart } from '@/commercetools/utils/utilsCarts';
import { createOrder } from '@/commercetools/utils/utilsOrders';
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
      const { statusCode, body } = await addShippingAddresToCart(
        cartId,
        country,
        e
      );

      if (statusCode === 200) {
        const { version, cartState } = body;

        const res = await createOrder(body.id, version, cartState);
        const { id, orderState } = res?.body!;

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

  return (
    <div className={checkoutMainContainer}>
      <div className={mainTitle}>
        <h3>Checkout</h3>
      </div>
      <div className={checkoutContainer}>
        <div className={billingDetailsContainer}>
          <div className={formTitle}>billingDetails</div>
          <BillingAddressForm formRef={formRef} onSubmit={handleSubMit} />
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
