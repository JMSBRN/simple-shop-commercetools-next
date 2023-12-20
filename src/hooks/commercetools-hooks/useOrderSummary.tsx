import { BaseAddress, Cart, ShippingMethod } from '@commercetools/platform-sdk';
import {
  addPaymentToCart,
  addShippingAddresToCart,
  removeLineItemfromCart,
  setShippingMethodToCart,
} from '@/commercetools/utils/utilsCarts';
import {
  createCreditCardPayment,
  createPayPalPayment,
  deleteAllPaymentsFromCart,
} from '@/commercetools/utils/utilsPayment';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { useEffect, useRef, useState } from 'react';
import { PaymentMethods } from '@/interfaces';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { getShippingMethodsWithCountry } from '@/commercetools/utils/utilsShippingMethods';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import { useRouter } from 'next/router';

function useOrderSummary({ cart }: { cart: Cart }) {
  const dispatch = useAppDispatch();
  const { country } = useAppSelector(selectCommerceTools);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isOrdered, setIsOrdered] = useState(false);
  const [isShippingAdrModalRendered, setIsShippingAdrModalRendered] =
    useState(false);
  const shippingAdrRef = useRef<HTMLFormElement | null>(null);
  const { push } = useRouter();

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

  return {
    shippingAdrRef,
    shippingMethods,
    isOrdered,
    isShippingAdrModalRendered,
    setIsShippingAdrModalRendered,
    handleChangePaymentMethod,
    handleDeleteLineItem,
    handleChooseShippingMethod,
    formSubmit,
    handleSubmitForm,
  };
}

export default useOrderSummary;
