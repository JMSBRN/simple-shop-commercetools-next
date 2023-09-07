import React from 'react';
import styles from '../../styles/Cart.module.scss';

function Cart() {
    const { 
      cartContiner,
      cartTitle,
      mainContainer,
      leftSideContainer,
      lineItems,
      lineItem,
      promoCodeContainer,
      cartTotalsContainer,
      cartTotalsTable,
      cartTotalsTitle,
      cartTotalsInfo,
      cartTotals,

     } = styles;

  return (
    <div className={cartContiner}>
      <div className={cartTitle}>Customer Cart</div>
      <div className={mainContainer}>
        <div className={leftSideContainer}>
        <div className={lineItems}>
          <div className={lineItem}></div>
          <div className={lineItem}></div>
          <div className={lineItem}></div>
          </div>
         <div className={promoCodeContainer}>
          <input type="text" />
          <button type="button">Apply</button>
         </div>
        </div>
          <div className={cartTotalsContainer}>
            <div className={cartTotalsTable}>
              <div className={cartTotalsTitle}>Cart Totals</div>
              <div className={cartTotalsInfo}>Sub Totals<span>130,00</span></div>
              <div className={cartTotalsInfo}>Tax Totals<span>23,00</span></div>
              <div className={cartTotals}>Total :<span>123,00</span></div>
            </div>
            <button type="button">Checkout</button>
            </div>   
      </div>
    </div>
  );
};

export default Cart;
