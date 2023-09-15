import { BaseAddress, Cart } from '@commercetools/platform-sdk';
import React, { useRef } from 'react';
import BillingAddressForm from '@/components/forms/billing-addres-form/BillingAddressForm';
import OrderSummary from '@/components/order-summary/OrderSummary';
import { createOrderWithShippingAddress } from '@/commercetools/utils/utilsOrders';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
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
  const cart = carts?.find(el => el.id) as Cart;
  const { id, version } = cart;
  const { query } = useRouter();
  const orderId = query.id as string;
  
  const handleSubMit = async (e?: BaseAddress) => {
    if (e?.firstName)  {
      const res = await createOrderWithShippingAddress(id, version, country, e);

      console.log(res?.body);
    }
  };
  const handlePlaceOrder = () => {
    handleSubMit();
    if(formRef.current){
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
          <BillingAddressForm
            formRef={formRef}
            onSubmit={handleSubMit}
          />
        </div>
        <div className={orderSummaryContainer}>
          <div className={formTitle}>orderSummary</div>
          <OrderSummary orderId={orderId} handlePlaceOrder={handlePlaceOrder} />
        </div>
      </div>
    </div>
  );
}

export default Checkout;
