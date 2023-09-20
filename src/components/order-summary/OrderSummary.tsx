import { Cart, ShippingMethod } from '@commercetools/platform-sdk';
import React, { useEffect, useState } from 'react';
import {
  getMoneyValueFromCartField,
  removeLineItemfromCart,
  setShippingMethodToCart,
} from '@/commercetools/utils/utilsCarts';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { OriginalTotal } from '../cart/original-sub-total/OriginalSubTotal';
import ProductPrice from '../product-card/product-price/ProductPrice';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { getShippingMethodsWithCountry } from '@/commercetools/utils/utilsShippingMethods';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './OrderSummary.module.scss';
import { useRouter } from 'next/router';

function OrderSummary({
  cart,
  handlePlaceOrder,
}: {
  cart: Cart;
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
    deliveryTax,
    totalSum,
    checkoutBtn,
    errors,
    listItem,
    itemDelete,
    itemName,
    itemPrice,
  } = styles;

  const dispatch = useAppDispatch();
  const { country } = useAppSelector(selectCommerceTools);
  const { push } = useRouter();
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(
    [] as ShippingMethod[]
  );
  const cartShippingMethodId = cart.shippingInfo?.shippingMethod?.id as string; 
  const handleDeleteLineItem = async (
    ID: string,
    version: number,
    lineitemId: string
  ) => {
    const res = await removeLineItemfromCart(ID, version, lineitemId);

    if (res.statusCode === 200) {
      dispatch(fetchCarts());
    }
    if (cart?.lineItems.length === 1) {
      push('/');
    }
  };

  useEffect(() => {
    const fn = async () => {
      const res = await getShippingMethodsWithCountry(country);

      if(res) setShippingMethods(res);
    };

    fn();
  }, [country]);

  const handleChooseShippingMethod = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const res = await setShippingMethodToCart(cart.id, e.currentTarget.id);

    if (res.statusCode === 200 ) dispatch(fetchCarts());
  };

  return (
    <div className={orderSummaryStyle}>
      <div className={totalsInfo}>
        <div className={totalsInfoTitles}>
          <span>product</span>
          <span>total</span>
        </div>
        <div className={lineItemsStyle}>
          {cart.lineItems.map((item) => (
            <div className={listItem} key={item.id}>
              <div
                className={itemDelete}
                onClick={() =>
                  handleDeleteLineItem(cart.id, cart.version, item.id)
                }
              >
                delete
              </div>
              <div className={itemName}>
                {filterObjectAndReturnValue(item.name, 'en') ||
                  'no product name'}
              </div>
              <div className={itemPrice}>
                <ProductPrice
                  quantity={item.quantity}
                  productId={item.productId}
                />
              </div>
            </div>
          ))}
        </div>
        <div className={subTotal}>
          Sub Total:   <OriginalTotal cart={cart}/>
          </div>
      </div>
      <div className={shippingModeContainer}>
        {
          shippingMethods.map(el => (
            <div key={el.id}>
              <label>
                {el.name}
                <input
                type="radio"
                name="delivery"
                id={el.id}
                checked={cartShippingMethodId === el.id}
                onChange={handleChooseShippingMethod}
                />
              </label>
            </div>
          ))
        }
      </div>
      <div className={deliveryTax}>
       Delivery tax: {getMoneyValueFromCartField(cart.shippingInfo?.taxedPrice?.totalGross!)}
      </div>
      <div className={paymentMethodContainer}>
        <label>
          paymentMethod
          <input type="radio" />
          <input type="radio" />
        </label>
      </div>
      <div className={totalSum}>
        Total: {getMoneyValueFromCartField(cart.taxedPrice?.totalGross!)}
      </div>
      <button className={checkoutBtn} onClick={handlePlaceOrder}>
        Placeorder
      </button>
      <div className={errors}>error</div>
    </div>
  );
}

export default OrderSummary;
