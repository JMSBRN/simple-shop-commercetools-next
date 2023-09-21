import { Cart, Payment, ShippingMethod } from '@commercetools/platform-sdk';
import React, { useEffect, useState } from 'react';
import {
  addPaymentToCart,
  getCarts,
  getMoneyValueFromCartField,
  removeLineItemfromCart,
  removePaymentFromCart,
  setShippingMethodToCart,
} from '@/commercetools/utils/utilsCarts';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { OriginalTotal } from '../cart/original-sub-total/OriginalSubTotal';
import ProductPrice from '../product-card/product-price/ProductPrice';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { getPayments } from '@/commercetools/utils/utilsPayment';
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
  const [payments, setPayments] = useState<Payment[]>([] as Payment[]);
  const cartShippingMethodId = cart.shippingInfo?.shippingMethod?.id as string;
  const isAllPaymentsMethodChossen = cart.paymentInfo?.payments.length! === 2;
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

      if (res.length) setShippingMethods(res);

      const payments = (await getPayments()) as Payment[];

      if (payments.length) setPayments(payments);
    };

    fn();
  }, [country]);

  const handleChooseShippingMethod = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { statusCode } = await setShippingMethodToCart(
      cart.id,
      e.currentTarget.id
    );

    if (statusCode === 200) dispatch(fetchCarts());
  };
  const handleChoosePaymentMethod = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.currentTarget.id;
    const { paymentInfo } = (await getCarts(cart.id)) as Cart;
    const existMethodId = paymentInfo?.payments.find(
      (el) => el.id !== value
    )?.id;

    await addPaymentToCart(cart.id, value);
    if (existMethodId) {
      await removePaymentFromCart(cart.id, existMethodId);
    }
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
          Sub Total: <OriginalTotal cart={cart} />
        </div>
      </div>
      <div className={shippingModeContainer}>
        {shippingMethods.map((el) => (
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
        ))}
      </div>
      <div className={deliveryTax}>
        Delivery tax:{' '}
        {getMoneyValueFromCartField(cart.shippingInfo?.taxedPrice?.totalGross!)}
      </div>
      <div className={paymentMethodContainer}>
        {payments.map((el) => (
          <div key={el.id}>
            <label>
              {filterObjectAndReturnValue(el.paymentMethodInfo.name!, 'en')}
              <input
                type="radio"
                name="payment"
                id={el.id}
                defaultChecked={
                  !!cart.paymentInfo?.payments.find((p) => p.id === el.id)?.id
                }
                onChange={handleChoosePaymentMethod}
                disabled={isAllPaymentsMethodChossen}
              />
            </label>
          </div>
        ))}
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
