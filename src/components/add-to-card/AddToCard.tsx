import React, { useState } from 'react';
import {
  addLineItemToCart,
  createCartWithProductId,
  getCarts,
} from '@/commercetools/utils/utilsCarts';
import { selectCommerceTools, setCart } from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Cart } from '@commercetools/platform-sdk';
import styles from './AddToCard.module.scss';

function AddToCard({
  productId,
  variantId,
  currency,
}: {
  productId: string;
  variantId: number;
  currency: string;
}) {
  const { addToCardContiner, quantityContainer } = styles;
  const dispatch = useAppDispatch();
  const { cart, country } = useAppSelector(selectCommerceTools);
  const [quantity, setQuantity] = useState<number>(0);
 const { id } = cart;
  const handleCreateCard = async () => {
    if (quantity && !id) {
      const newCart = await createCartWithProductId(currency, country, productId, quantity);
     
      if (newCart?.id) {
        dispatch(setCart(newCart));
      }
    } 

    if(quantity) {
      const { version } = await getCarts(id)as Cart;
   
       const res =  await addLineItemToCart(
          id,
          version,
          productId,
          quantity,
          variantId
          );

          if(res?.id) dispatch(setCart(res));
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
        Add to Cart
      </button>
    </div>
  );
}

export default AddToCard;
