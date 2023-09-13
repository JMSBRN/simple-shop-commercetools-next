import React from 'react';
import styles from '../../styles/Checkout.module.scss';

function Checkout() {
  const {
    checkoutMainContainer,
    mainTitle,
    checkoutContainer,
    formTitle,
    billingDetailsContainer,
    flexInputs,
    blockInputs,
    differentAddressStyle,
    orderSummaryContainer,
    totalsInfo,
    totalsInfoTitles,
    lineItemsStyle,
    subTotal,
    shippingModeContainer,
    paymentMethodContainer,
    totalSum,
    placeOrderBtn,
    errors,
  } = styles;

  return (
    <div className={checkoutMainContainer}>
      <div className={mainTitle}>
        <h3>Checkout</h3>
      </div>
      <div className={checkoutContainer}>
        <div className={billingDetailsContainer}>
          <div className={formTitle}>billingDetails</div>
          <form action="">
            <div className={flexInputs}>
              <input type="text" />
              <input type="text" />
            </div>
            <div className={blockInputs}>
              <input type="text" />
              <input type="text" />
            </div>
            <div className={flexInputs}>
              <input type="text" />
              <input type="text" />
            </div>
            <div className={flexInputs}>
              <input type="text" />
              <input type="text" />
            </div>
            <label className={differentAddressStyle}>
              differentAddress
              <input type="checkbox" />
            </label>
          </form>
        </div>
        <div className={orderSummaryContainer}>
          <div className={formTitle}>orderSummary</div>
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
          <button className={placeOrderBtn}>PlaceOrder</button>
          <div className={errors}>error</div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
