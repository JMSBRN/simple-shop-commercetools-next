import { Cart, LineItem } from '@commercetools/platform-sdk';
import {
  getCarts,
  removeLineItemfromCart,
  updateCartLineitemQuantity,
} from '@/commercetools/utils/utilsCarts';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { useAppDispatch } from '../storeHooks';
import { useRouter } from 'next/router';
import { useState } from 'react';

function useUpdateProductQuantity(
  cartId: string,
  lineItem: LineItem,
) {
  const dispatch = useAppDispatch();
  const { push } = useRouter();
  const { id, quantity } = lineItem;
  const [currentQuantity, setCurrentQuantity] = useState<number>(quantity);

  const upDateQuantityLineItem = async (cartId: string, quantity: number) => {
    const cart = (await getCarts(cartId)) as Cart;

    if (cart.id) {
      const { version } = cart;
      const res = await updateCartLineitemQuantity(
        cart.id,
        version,
        id,
        quantity
      );
      const { lineItems } = res.body;
      const updatedlineItem = lineItems.find(
        (item) => item.id === lineItem.id
      )!;

      setCurrentQuantity(updatedlineItem.quantity);
    }
  };

  const handlePlusQuantity = async () => {
    setCurrentQuantity(currentQuantity + 1);
    await upDateQuantityLineItem(cartId, currentQuantity + 1);

    dispatch(fetchCarts());
  };

  const handleMinusQuantity = async () => {
    if (currentQuantity > 1) {
      setCurrentQuantity(currentQuantity - 1);
      await upDateQuantityLineItem(cartId, currentQuantity - 1);
      dispatch(fetchCarts());
    }
    if (currentQuantity === 1) {
      await upDateQuantityLineItem(cartId, 0);
      push('/');
    }
  };

  const handleDeleteLineItem = async (

  ) => {
    const cart = (await getCarts(cartId)) as Cart;

    if(cart.id) {
        const res = await removeLineItemfromCart(cartId, cart.version, id);
    
        if (res.statusCode === 200) {
          dispatch(fetchCarts());
        }
        if (quantity === 1) {
          push('/');
        }
    }
  };

  return {
    handlePlusQuantity,
    handleMinusQuantity,
    handleDeleteLineItem,
    currentQuantity
  };
}

export default useUpdateProductQuantity;
