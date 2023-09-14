import React, { useEffect, useState } from 'react';
import { BaseAddress } from '@commercetools/platform-sdk';
import BillingAddressForm from '@/components/forms/billing-addres-form/BillingAddressForm';
import OrderSummary from '@/components/order-summary/OrderSummary';
import styles from '../../styles/Checkout.module.scss';

function Checkout() {
  const {
    checkoutMainContainer,
    mainTitle,
    checkoutContainer,
    formTitle,
    billingDetailsContainer,
    orderSummaryContainer,
  } = styles;
  const [address, setAddress] = useState<BaseAddress>({} as BaseAddress);

  useEffect(() => {
    console.log(address);
  }, [address]);
  
  const handleSubMit = (e: BaseAddress) => {
    setAddress(e);
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
            address={address}
            onSubmit={handleSubMit}

          />
        </div>
        <div className={orderSummaryContainer}>
          <div className={formTitle}>orderSummary</div>
          <OrderSummary  />
        </div>
      </div>
    </div>
  );
}

export default Checkout;
