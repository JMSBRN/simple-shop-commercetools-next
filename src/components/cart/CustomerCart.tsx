import { Cart, TaxedPrice } from '@commercetools/platform-sdk';
import React, { useEffect, useState } from 'react';
import {
  getMoneyValueFromCartField,
  removeLineItemfromCart,
} from '@/commercetools/utils/utilsCarts';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import CartLineItem from './cart-line-item/CartLineItem';
import Link from 'next/link';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './CustomerCart.module.scss';
import { useRouter } from 'next/router';

function CustomerCart() {
  const {
    cartContainer,
    cartTitle,
    mainContainer,
    leftSideContainer,
    lineItemsStyle,
    promoCodeContainer,
    cartTotalsContainer,
    cartTotalsTable,
    cartTotalsTitle,
    cartTotalsInfo,
    cartTotals,
    lineItemHeadlines,
  } = styles;

  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const { carts } = useAppSelector(selectCommerceTools);
  const [cart, setCart] = useState<Cart>();
  const { query } = useRouter();
  const cartId = query.id as string; 
  
 useEffect(() => {
  return () => {
    carts.filter(el => el.id === cartId).forEach(el => {
     setCart(el);
    });
  };
 }, [cartId, carts]);

  const handleDeleteLineItem = async (lineitemId: string) => {
    if (cart?.id) {
      const res = await removeLineItemfromCart(
        cart.id,
        cart.version,
        lineitemId
      );

      if (res.statusCode === 200) {
        dispatch(fetchCarts());
      }
      if (cart?.lineItems.length === 1) {
        push('/');
      }
    }
  };

  const handleCheckout = async () => {
    if(cart?.lineItems.length) {
      push(`/checkout/${cart?.id}`);
    }
  };

  if (cart) {
    const { taxPortions, totalGross, totalNet, totalTax } = cart.taxedPrice as TaxedPrice;

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
          <div className={lineItemsStyle}>
            {cart.lineItems.map((el) => (
              <CartLineItem
              handleDeleteLineItem={async () =>
                  await handleDeleteLineItem(el.id)
                }
                cartId={cart?.id}
                key={el.id}
                lineItem={el}
              />
            ))}
          </div>
          <div className={promoCodeContainer}>
            <input type="text" placeholder='promo code' />
            <button type="button">Apply</button>
          </div>
        </div>
        <div className={cartTotalsContainer}>
          <div className={cartTotalsTable}>
            <div className={cartTotalsTitle}>Cart Totals</div>
            <div className={cartTotalsInfo}>
              Net amount
              <span>
              {getMoneyValueFromCartField(totalNet)}
              </span>
            </div>
            <div className={cartTotalsInfo}>
              <div>{taxPortions.map((el, idx) => (
                <span
                 key={idx}>
                  <span>{el.name} </span>
                  <span>{`${(el.rate * 100)} %`}</span>
                </span>
              ))}</div>
              <span>
              { totalTax && getMoneyValueFromCartField(totalTax)}
              </span>
            </div>
            <div className={cartTotals}>
              Total :  {getMoneyValueFromCartField(totalGross)}
            </div>
          </div>
          <button type="button" onClick={handleCheckout}>Checkout</button>
        </div>
      </div>
    </div>
  );
  }

  return <div className=""></div>;
}

export default CustomerCart;
