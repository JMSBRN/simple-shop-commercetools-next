import React, { useEffect, useState } from 'react';
import {
  getTotalSumFromCart,
  removeLineItemfromCart,
} from '@/commercetools/utils/utilsCarts';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Cart } from '@commercetools/platform-sdk';
import CartLineItem from './cart-line-item/CartLineItem';
import Link from 'next/link';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { getCurrencySymbol } from '@/commercetools/utils/utilsCommercTools';
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

  const [total, setTotal] = useState<{
    totalPrice: string;
    currencyCode: string | undefined;
  }>();
  const { push, locale } = useRouter();
  const dispatch = useAppDispatch();
  const { carts } = useAppSelector(selectCommerceTools);
  const cart = carts?.find(el => el.id) as Cart;
  const { country } = useAppSelector(selectCommerceTools);
  
  useEffect(() => {
    const fn = async () => {
      if(cart) {
        const res = await getTotalSumFromCart(cart, country);

        if (res) setTotal(res);

      }
    };

    fn();
  }, [cart, country]);

  const handleDeleteLineItem = async (lineitemId: string) => {

    if (cart.id) {
      const res = await removeLineItemfromCart(
        cart.id,
        cart.version,
        lineitemId
      );

      if (res.statusCode === 200) {
        dispatch(fetchCarts());
      }
      if(cart?.lineItems.length === 1){
         push('/');
      };
    }
  };

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
            {cart?.lineItems.map((el) => (
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
            <input type="text" />
            <button type="button">Apply</button>
          </div>
        </div>
        <div className={cartTotalsContainer}>
          <div className={cartTotalsTable}>
            <div className={cartTotalsTitle}>Cart Totals</div>
            <div className={cartTotalsInfo}>
              Sub Totals<span>??</span>
            </div>
            <div className={cartTotalsInfo}>
              Tax Totals<span>??</span>
            </div>
            <div className={cartTotals}>
              Total :
              <span>{`${total?.totalPrice} ${
                total?.currencyCode
                  ? getCurrencySymbol(locale!, total?.currencyCode as string)
                  : ''
              }`}</span>
            </div>
          </div>
          <button type="button">Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default CustomerCart;
