import { BaseAddress, Cart } from '@commercetools/platform-sdk';
import AddressForm from '../forms/addres-form/AddressForm';
import ButtonWithLoader from '../buttons/buttonWithLoader/ButtonWithLoader';
import CartLineItems from '../cart/cart-lineItems/CartLineItems';
import { OriginalTotal } from '../cart/original-sub-total/OriginalSubTotal';
import { PaymentMethods } from '@/interfaces';
import React, {  } from 'react';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import {
  getMoneyValueFromCartField,
} from '@/commercetools/utils/utilsCarts';
import { removeUnderscores } from '@/commercetools/utils/utilsApp';
import styles from './OrderSummary.module.scss';
import useOrderSummary from '@/hooks/commercetools-hooks/useOrderSummary';
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
    lineItemsWrapperStyle,
    subTotal,
    shippingModeContainer,
    fillShippingAdressMessage,
    paymentMethodContainer,
    deliveryTax,
    totalSum,
    checkoutBtn,
    errors,
    modalShippingAdrStyle,
    closeModal,
  } = styles;

  const { locale } = useRouter();
  const isShippingAddressExisted = !cart.shippingAddress?.email;
  const cartShippingMethodId = cart.shippingInfo?.shippingMethod?.id as string;
  const { t } = useTranslation('common');
  
  const paymantsFields: PaymentMethods[] = ['CREDIT_CARD', 'PAY_PAL'];

  const {
    formSubmit,
    handleChangePaymentMethod,
    handleChooseShippingMethod,
    handleSubmitForm,
    isOrdered, 
    isShippingAdrModalRendered,
    setIsShippingAdrModalRendered,
    shippingAdrRef,
    shippingMethods
  } = useOrderSummary({ cart });
  
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
        <div className={lineItemsWrapperStyle}>
          <CartLineItems cart={cart} withTotalSumm={true} isImageNotExisted={true}/>
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
