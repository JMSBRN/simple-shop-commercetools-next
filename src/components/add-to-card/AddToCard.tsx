import React, { useEffect, useState } from 'react';
import {
  addLineItemToCart,
  createCartWithProductId,
  getCarts,
} from '@/commercetools/utils/utilsCarts';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Cart } from '@commercetools/platform-sdk';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './AddToCard.module.scss';

function AddToCard({
  productId,
  variantId,
}: {
  productId: string;
  variantId: number;
}) {
  const { addToCardContiner, quantityContainer } = styles;
  const dispatch = useAppDispatch();
  const { carts, country } = useAppSelector(selectCommerceTools);
  const [quantity, setQuantity] = useState<number>(0);
  const [cart, setCart] = useState<Cart>({} as Cart);

  useEffect(() => {
    carts.forEach(el => {
     setCart(el);
    });
   }, [carts]);
   
  const handleCreateCard = async () => {
    if (quantity && !cart.id) {
      const newCart = await createCartWithProductId(
        country,
        productId,
        variantId,
        quantity
      );

      if (newCart?.id) {
        dispatch(fetchCarts());
      }
    }

    if (quantity && cart.id) {
      const { version } = (await getCarts(cart.id)) as Cart;

      await addLineItemToCart(cart.id, version, productId, quantity, variantId);
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
        Add to Cart
      </button>
    </div>
  );
}

export default AddToCard;
