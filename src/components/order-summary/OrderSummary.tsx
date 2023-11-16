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
  deleteAllPaymentsFromCart,
} from '@/commercetools/utils/utilsPayment';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import AddressForm from '../forms/addres-form/AddressForm';
import ButtonWithLoader from '../buttons/buttonWithLoader/ButtonWithLoader';
import { OriginalTotal } from '../cart/original-sub-total/OriginalSubTotal';
import { PaymentMethods } from '@/interfaces';
import ProductPrice from '../product-card/product-price/ProductPrice';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { getShippingMethodsWithCountry } from '@/commercetools/utils/utilsShippingMethods';
import { removeUnderscores } from '@/commercetools/utils/utilsApp';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './OrderSummary.module.scss';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

function OrderSummary({
  cart,
  addressFields,
  paymentMethod,
  handlePlaceOrder,
}: {
  cart: Cart;
  addressFields: (keyof BaseAddress)[][];
  paymentMethod: string | undefined;
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
  const { push, locale } = useRouter();
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(
    [] as ShippingMethod[]
  );
  const [isOrdered, setIsOrdered] = useState<boolean>(false);
  const [isShippingAdrModalRendered, setIsShippingAdrModalRendered] =
    useState<boolean>(false);
  const isShippingAddressExisted = !cart.shippingAddress?.email;
  const cartShippingMethodId = cart.shippingInfo?.shippingMethod?.id as string;
  const shippingAdrRef = useRef<HTMLFormElement | null>(null);
  const { t } = useTranslation('common');

  const paymantsFields: PaymentMethods[] = ['CREDIT_CARD', 'PAY_PAL'];

  const handleChangePaymentMethod = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { lineItems, customerId } = cart!;
    const curencyCode = lineItems.find((l) => l.totalPrice.currencyCode)
      ?.totalPrice.currencyCode!;

    switch (e.currentTarget.id as PaymentMethods) {
      case 'CREDIT_CARD':
        const deletedAllCreditCard = await deleteAllPaymentsFromCart(cart?.id);

        if (deletedAllCreditCard) {
          try {
            const resCreditCardPayment = await createCreditCardPayment(
              curencyCode,
              customerId
            );

            if (resCreditCardPayment.statusCode === 201) {
              const { id } = resCreditCardPayment.body;

              const resAddPayment = await addPaymentToCart(cart.id, id);

              if (resAddPayment.statusCode === 201) return;
            }
          } catch (error) {
            console.error(error);
          }
        }
        break;

      case 'PAY_PAL':
        const deletedAllForPayPal = await deleteAllPaymentsFromCart(cart?.id);

        if (deletedAllForPayPal) {
          try {
            const resPayPal = await createPayPalPayment(
              curencyCode,
              customerId
            );

            if (resPayPal.statusCode === 201) {
              const { id } = resPayPal.body;
              const resAddPayment = await addPaymentToCart(cart.id, id);

              if (resAddPayment.statusCode === 201) return;
            }
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
            {t('close')}
          </div>
          <AddressForm
            formRef={shippingAdrRef}
            addressFields={addressFields}
            onSubmit={formSubmit}
          />
          <ButtonWithLoader onClick={handleSubmitForm} text={t('submit')} />
        </div>
      )}
      <div className={totalsInfo}>
        <div className={totalsInfoTitles}>
          <span>{t('product')}</span>
          <span>{t('total')}</span>
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
                {t('delete')}
              </div>
              <div className={itemName}>
                {filterObjectAndReturnValue(item.name, 'en') ||
                  t('noProductMessage')}
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
          {t('subTotal')}: <OriginalTotal cart={cart} />
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
            {t('shippingWarnMessage')}
          </div>
        )}
      </div>
      <div className={shippingModeContainer}>
        {shippingMethods.map((el) => (
          <div key={el.id}>
            <label>
              {filterObjectAndReturnValue(el.localizedName!, locale!)}
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
        {t('deliveryTax')} :{' '}
        {getMoneyValueFromCartField(cart.shippingInfo?.taxedPrice?.totalGross!)}
      </div>
      <div className={paymentMethodContainer}>
        {paymantsFields.map((el, idx) => (
          <label key={idx}>
            {removeUnderscores(el)}
            <input
              id={el}
              type="radio"
              name="payment"
              onChange={handleChangePaymentMethod}
              defaultChecked={paymentMethod === el}
            />
          </label>
        ))}
      </div>
      <div className={totalSum}>
        {t('total')}: {getMoneyValueFromCartField(cart.taxedPrice?.totalGross!)}
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
        {isOrdered ? t('orderedCart') : t('placeOrder')}
      </button>
      <div className={errors}>error ??</div>
    </div>
  );
}

export default OrderSummary;
