import CartLineItem from './cart-line-item/CartLineItem';
import Link from 'next/link';
import React from 'react';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './CustomerCart.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';

function CustomerCart() {
    const { 
      cartContainer,
      cartTitle,
      mainContainer,
      leftSideContainer,
      lineItems,
      promoCodeContainer,
      cartTotalsContainer,
      cartTotalsTable,
      cartTotalsTitle,
      cartTotalsInfo,
      cartTotals,
      lineItemHeadlines,
     } = styles;

     const { cart } = useAppSelector(selectCommerceTools);

   console.log(cart);
  return (
    <div className={cartContainer}>
      <div className={cartTitle}>
         <h3>Customer Cart</h3> 
      <Link href={'/'}>Home</Link>
      </div>
      <div className={mainContainer}>
        <div className={leftSideContainer}>
          <div className={lineItemHeadlines}>
            <div></div>
            <div>Description</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Total</div>
          </div>
        <div className={lineItems}>
        <CartLineItem />
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

export default CustomerCart;
