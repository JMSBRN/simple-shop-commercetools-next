import { Cart, TaxedPrice } from '@commercetools/platform-sdk';
import React, { useState } from 'react';
import {
  deleteCart,
  getMoneyValueFromCartField,
} from '@/commercetools/utils/utilsCarts';
import ButtonWithLoader from '@/commercetools/buttons/buttonWithLoader/ButtonWithLoader';
import CartLineItem from './cart-line-item/CartLineItem';
import { deleteCookieFromLocal } from '@/commercetools/utils/secureCookiesUtils';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import styles from './CustomerCart.module.scss';
import { useAppDispatch } from '@/hooks/storeHooks';
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
    cartTotalsContainerBtns,
  } = styles;

  const { push } = useRouter();
  const dispatch = useAppDispatch();

  const { id, taxedPrice, shippingInfo } = cart;
  const { taxPortions, totalGross, totalNet, totalTax } =
    taxedPrice as TaxedPrice;
  const shipingMethodTaxTotal = shippingInfo?.taxedPrice?.totalGross!;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionType, setActiontype] = useState<string>('');

  const handleCheckout = async (actionType: string) => {
    setActiontype(actionType);
    setIsLoading(true);
      if (cart?.lineItems.length) {
        push(`/checkout/${cart?.id}`);
        setIsLoading(false);
      }
  };
  const handleDeleteCart = async (actionType: string) => {
    setActiontype(actionType);
      setIsLoading(true);
      const res = await deleteCart(id);
      
      if (res) dispatch(fetchCarts());
      
      if (res) {
        dispatch(fetchCarts());
        deleteCookieFromLocal('currentCartId');
        push('/');
        setIsLoading(false);
      }
  };

  return (
    <div className={cartContainer}>
      <div className={cartTitle}>
        <h3>Customer Cart</h3>
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
                isQuantityButtonsExisted={true}
                isTotlaSummExisted={true}
              />
            ))}
          </div>
          <div className={promoCodeContainer}>
            <input type="text" placeholder="promo code" />
            <ButtonWithLoader text="Apply" onClick={() => {}} />
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
          <div className={cartTotalsContainerBtns}>
            <ButtonWithLoader
              isLoading={isLoading && actionType === 'checkout'}
              text="Checkout"
              onClick={() => handleCheckout('checkout')}
            />
            <ButtonWithLoader
              isLoading={isLoading && actionType === 'delete'}
              text="Delete cart"
              onClick={() => handleDeleteCart('delete')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerCart;
