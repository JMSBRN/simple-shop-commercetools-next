import { Cart, TaxedPrice } from '@commercetools/platform-sdk';
import CartLineItem from './cart-line-item/CartLineItem';
import Link from 'next/link';
import React from 'react';
import { getMoneyValueFromCartField } from '@/commercetools/utils/utilsCarts';
import styles from './CustomerCart.module.scss';
import { useRouter } from 'next/router';

function CustomerCart({ cart }: { cart: Cart }) {
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
    cartTotalsInfoData,
    cartTotals,
    lineItemHeadlines,
  } = styles;

  const { push } = useRouter();

  const handleCheckout = async () => {
    if (cart?.lineItems.length) {
      push(`/checkout/${cart?.id}`);
    }
  };

  const { taxedPrice, shippingInfo } = cart;
  const { taxPortions, totalGross, totalNet, totalTax } =
    taxedPrice as TaxedPrice;
  const shipingMethodTaxTotal = shippingInfo?.taxedPrice?.totalGross!;

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
                cartId={cart?.id}
                version={cart.version}
                key={el.id}
                lineItem={el}
              />
            ))}
          </div>
          <div className={promoCodeContainer}>
            <input type="text" placeholder="promo code" />
            <button type="button">Apply</button>
          </div>
        </div>
        <div className={cartTotalsContainer}>
          <div className={cartTotalsTable}>
            <div className={cartTotalsTitle}>Cart Totals</div>
            <div className={cartTotalsInfo}>
              Taxes included
              <div className={cartTotalsInfoData}>
                Net amount
                <span>{getMoneyValueFromCartField(totalNet)}</span>
              </div>
              <div className={cartTotalsInfoData}>
                <div>
                  {taxPortions.map((el, idx) => (
                    <span key={idx}>
                      <span>{el.name} </span>
                      <span>{`${el.rate * 100} %`}</span>
                    </span>
                  ))}
                </div>
                <span>{getMoneyValueFromCartField(totalTax!)}</span>
              </div>
              <div className={cartTotalsInfoData}>
                Delivery
                <span>{getMoneyValueFromCartField(shipingMethodTaxTotal)}</span>
              </div>
            </div>
            <div className={cartTotals}>
              Total : {getMoneyValueFromCartField(totalGross)}
            </div>
          </div>
          <button type="button" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerCart;
