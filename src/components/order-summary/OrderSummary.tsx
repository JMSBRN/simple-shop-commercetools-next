import React, { useEffect, useState } from 'react';
import { Order } from '@commercetools/platform-sdk';
import { formatValue } from '../product-card/utilsProductCard';
import { getOrders } from '@/commercetools/utils/utilsOrders';
import styles from './OrderSummary.module.scss';

function OrderSummary({
  orderId,
  handlePlaceOrder,
}: {
  orderId: string;
  handlePlaceOrder: () => void;
}) {
  const {
    orderSummaryStyle,
    totalsInfo,
    totalsInfoTitles,
    lineItemsStyle,
    subTotal,
    shippingModeContainer,
    paymentMethodContainer,
    totalSum,
    checkoutBtn,
    errors,
  } = styles;

  const [order, setOrder] = useState<Order>({} as Order);

    useEffect(() => {
    
      const fn = async () => {
        const res = await getOrders(orderId);

         if( typeof res === 'object') {
            setOrder(res as Order);
         }
      };

      fn();
    }, [orderId]);
    
  return (
    <div className={orderSummaryStyle}>
      <div className={totalsInfo}>
        <div className={totalsInfoTitles}>
          <span>product</span>
          <span>total</span>
        </div>
        <div className={lineItemsStyle}>
         {order.id && order.lineItems.map(el => (
          <div key={el.id}>{el.id}</div>
         ))}
        </div>
        <div className={subTotal}>subtotal:</div>
      </div>
      <div className={shippingModeContainer}>
        shipping mode
        <label>
          <input type="radio" />
          <input type="radio" />
        </label>
      </div>
      <div className={paymentMethodContainer}>
        <label>
          paymentMethod
          <input type="radio" />
          <input type="radio" />
        </label>
      </div>
      <div className={totalSum}>
        Total : <span>{order.id && formatValue(order.totalPrice)}</span>
      </div>
      <button className={checkoutBtn} onClick={handlePlaceOrder}>
        Placeorder
      </button>
      <div className={errors}>error</div>
    </div>
  );
}

export default OrderSummary;
