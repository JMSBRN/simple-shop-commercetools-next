import React from 'react';
import styles from './OrderSummary.module.scss';

function OrderSummary() {
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

  return (
    <div className={orderSummaryStyle}>
    <div className={totalsInfo}>
      <div className={totalsInfoTitles}>
        <span>product</span>
        <span>total</span>
      </div>
      <div className={lineItemsStyle}>
          <div className="line">line</div>
          <div className="line">line</div>
          <div className="line">line</div>
          <div className="line">line</div>
          <div className="line">line</div>
          <div className="line">line</div>
          <div className="line">line</div>
          <div className="line">line</div>
          <div className="line">line</div>
          <div className="line">line</div>
          <div className="line">line</div>
          <div className="line">line</div>
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
    <div className={totalSum}>Total : <span>10000.00</span></div>
    <button className={checkoutBtn} >Checkout</button>
    <div className={errors}>error</div>
  </div>
  );
}

export default OrderSummary;
