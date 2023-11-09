import React, { useState } from 'react';
import {
  addLineItemToCart,
  createCartWithProductId,
   getCurrentDataFromCart,
} from '@/commercetools/utils/utilsCarts';
import {
  getDecryptedDataFromCookie,
  setEncryptedDataToCookie,
} from '@/commercetools/utils/secureCookiesUtils';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Cart } from '@commercetools/platform-sdk';
import { UserData } from '@/interfaces';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './AddToCard.module.scss';
import { useTranslation } from 'next-i18next';

function AddToCard({
  productId,
  variantId,
}: {
  productId: string;
  variantId: number;
}) {
  const { addToCardContiner, quantityContainer } = styles;
  const dispatch = useAppDispatch();
  const { country } = useAppSelector(selectCommerceTools);
  const [quantity, setQuantity] = useState<number>(0);
  const anonimouseId = process.env.ANONIMOUS_ID;
  const { t } = useTranslation('common');

  const userData = JSON.parse(getDecryptedDataFromCookie('userData')) as
    | UserData
    | undefined;

  const handleCreateCard = async () => {
    const currentCartId = JSON.parse(
      getDecryptedDataFromCookie('currentCartId')
    ) as string | undefined;

    if (quantity && !currentCartId) {
      const resNewCart = await createCartWithProductId(
        country,
        productId,
        variantId,
        quantity,
        userData?.customerId ? undefined : anonimouseId,
        userData?.customerId
      );
      const newCart = resNewCart?.body as Cart;

      if (newCart?.id) {
        setEncryptedDataToCookie('currentCartId', newCart.id, 3600);
        dispatch(fetchCarts());
      }
    }

    if (quantity && currentCartId) {
      const cart = await  getCurrentDataFromCart(currentCartId);
      const { version } = cart!;

      await addLineItemToCart(
        currentCartId,
        version,
        productId,
        quantity,
        variantId
      );
      dispatch(fetchCarts());
    }
  };

  const handlePlusQuantuty = () => {
    setQuantity(quantity + 1);
  };
  const handleMinusQuantuty = () => {
    if (quantity) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className={addToCardContiner}>
      <div className={quantityContainer}>
        <button onClick={handlePlusQuantuty}>+</button>
        {quantity}
        <button onClick={handleMinusQuantuty}>-</button>
      </div>
      <button type="button" onClick={handleCreateCard}>
        {t('add-to-cart')}
      </button>
    </div>
  );
}

export default AddToCard;
