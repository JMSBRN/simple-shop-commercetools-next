import { BaseAddress, Cart } from '@commercetools/platform-sdk';
import React, { useRef } from 'react';
import BillingAddressForm from '@/components/forms/billing-addres-form/BillingAddressForm';
import OrderSummary from '@/components/order-summary/OrderSummary';
import { createOrderWithShippingAddress } from '@/commercetools/utils/utilsOrders';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from '../../styles/Checkout.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';

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
  const { carts } = useAppSelector(selectCommerceTools);
  const cart = carts?.find(el => el.id) as Cart;
  const { id, version } = cart;
  
  const handleSubMit = async (e?: BaseAddress) => {
    if (e?.country)  {
      const res = await createOrderWithShippingAddress(id, version, e);

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
          <OrderSummary handlePlaceOrder={handlePlaceOrder} />
        </div>
      </div>
    </div>
  );
}

export default Checkout;
