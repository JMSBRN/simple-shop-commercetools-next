import { BaseAddress, Cart, ShippingMethod } from '@commercetools/platform-sdk';
import React, { useEffect, useRef, useState } from 'react';
import {
  addPaymentToCart,
  addShippingAddresToCart,
  getMoneyValueFromCartField,
  removeLineItemfromCart,
  setShippingMethodToCart,
} from '@/commercetools/utils/utilsCarts';
import {
  createCreditCardPayment,
  createPayPalPayment,
  deleteAlPaymentsFromCart,
} from '@/commercetools/utils/utilsPayment';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import AddressForm from '../forms/addres-form/AddressForm';
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
    fillShippingAdressMessage,
    paymentMethodContainer,
    deliveryTax,
    totalSum,
    checkoutBtn,
    errors,
    listItem,
    itemDelete,
    itemName,
    itemPrice,
    modalShippingAdrStyle,
    closeModal,
  } = styles;

  const dispatch = useAppDispatch();
  const { country } = useAppSelector(selectCommerceTools);
  const { push } = useRouter();
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(
    [] as ShippingMethod[]
  );
  const [isOrdered, setIsOrdered] = useState<boolean>(false);
  const [isShippingAdrModalRendered, setIsShippingAdrModalRendered] =
    useState<boolean>(false);
  const isShippingAddressExisted = !cart.shippingAddress?.email;
  const cartShippingMethodId = cart.shippingInfo?.shippingMethod?.id as string;
  const shippingAdrRef = useRef<HTMLFormElement | null>(null);
  const addressFields: (keyof BaseAddress)[][] = [
    ['firstName'],
    ['lastName'],
    ['city'],
    ['streetName'],
    ['building'],
    ['email'],
    ['phone'],
  ];
  const paymantsFields: string[] = ['Credit Card', 'PayPal'];

  const handleChangePaymentMethod = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { lineItems, customerId } = cart!;
    const curencyCode = lineItems.find((l) => l.totalPrice.currencyCode)
      ?.totalPrice.currencyCode!;

    switch (e.currentTarget.id) {
      case 'Credit Card':
        const deletedAllCreditCard = await deleteAlPaymentsFromCart(
          cart?.id
        );

        if (deletedAllCreditCard) {
          try {
            const resCreditCardPayment = await createCreditCardPayment(
              curencyCode,
              customerId
            );

            if (resCreditCardPayment.statusCode === 201) {
              const { id } = resCreditCardPayment.body;

              const resAddPayment = await addPaymentToCart(cart.id, id);

              if(resAddPayment.statusCode === 201) return;
            };
          } catch (error) {
            console.error(error);
          }
        }
        break;

      case 'PayPal':
        const deletedAllForPayPal = await deleteAlPaymentsFromCart(cart?.id);
        
        if (deletedAllForPayPal) {
          try {
            const resPayPal = await createPayPalPayment(
              curencyCode,
              customerId
            );

            if (resPayPal.statusCode === 201) {
              const { id } = resPayPal.body;
              const resAddPayment = await addPaymentToCart(cart.id, id);

              if(resAddPayment.statusCode === 201) return;
            };
          } catch (error) {
            console.error(error);
          }
        }
        break;

      default:
        return;
    }
  };

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
    setIsOrdered(cart.cartState === 'Ordered');
  }, [cart]);

  useEffect(() => {
    const fn = async () => {
      if (country) {
        const res = await getShippingMethodsWithCountry(country);

        if (res.length) setShippingMethods(res);
      }
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

  const formSubmit = async (e?: BaseAddress) => {
    if (e?.firstName) {
      const res = await addShippingAddresToCart(cart.id, country, e);

      if (res.statusCode === 200) {
        dispatch(fetchCarts());
        setIsShippingAdrModalRendered(false);
      }
    }
  };
  const handleSubmitForm = () => {
    formSubmit();
    if (shippingAdrRef.current) {
      shippingAdrRef.current.requestSubmit();
    }
  };

  return (
    <div className={orderSummaryStyle}>
      {isShippingAdrModalRendered && (
        <div className={modalShippingAdrStyle}>
          <div
            className={closeModal}
            onClick={() => setIsShippingAdrModalRendered(false)}
          >
            close
          </div>
          <AddressForm
            formRef={shippingAdrRef}
            addressFields={addressFields}
            onSubmit={formSubmit}
          />
          <button onClick={handleSubmitForm}>submit</button>
        </div>
      )}
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
      <div style={{ height: '25px' }}>
        {isShippingAddressExisted && (
          <div
            className={fillShippingAdressMessage}
            onClick={() =>
              setIsShippingAdrModalRendered(!isShippingAdrModalRendered)
            }
          >
            please fill shipping details
          </div>
        )}
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
                disabled={isOrdered || isShippingAddressExisted}
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
        {paymantsFields.map((el, idx) => (
          <label key={idx}>
            {el}
            <input
              id={el}
              type="radio"
              name="payment"
              onChange={handleChangePaymentMethod}
            />
          </label>
        ))}
      </div>
      <div className={totalSum}>
        Total: {getMoneyValueFromCartField(cart.taxedPrice?.totalGross!)}
      </div>
      <button
        className={checkoutBtn}
        onClick={handlePlaceOrder}
        disabled={isOrdered}
        style={
          isOrdered
            ? { backgroundColor: 'white', color: 'red' }
            : ({} as React.CSSProperties)
        }
      >
        {isOrdered ? 'Card Ordered' : 'Placeorder'}
      </button>
      <div className={errors}>error</div>
    </div>
  );
}

export default OrderSummary;
