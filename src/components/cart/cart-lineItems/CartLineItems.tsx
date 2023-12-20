import { Cart } from '@commercetools/platform-sdk';
import CartLineItem from '../cart-line-item/CartLineItem';
import React from 'react';
import styles from './CartLineItems.module.scss';

function CartLineItems({
  cart,
  withTotalSumm,
  isImageNotExisted,
}: {
  cart: Cart;
  withTotalSumm: boolean;
  isImageNotExisted?: boolean;
}) {
  return (
    <div className={styles.cartLineItemsStyle}>
      {cart?.id &&
        cart?.lineItems.map((item) => (
          <CartLineItem
            key={cart?.id}
            cartId={cart?.id}
            lineItem={item}
            isTotlaSummExisted={withTotalSumm}
            isImageNotExisted={isImageNotExisted}
          />
        ))}
    </div>
  );
}

export default CartLineItems;
