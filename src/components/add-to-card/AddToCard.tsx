import React, { useState } from 'react';
import {
  createShoppingListWithProductId,
  filterShoppingListsByProductId,
  getShoppingLists,
  updateQuantityInShoppingList,
} from '@/commercetools/utils/utilsShoppingList';
import { ShoppingList } from '@commercetools/platform-sdk';
import { fetchShoppingLists } from '@/features/thunks/FetchShoppingLists';
import styles from './AddToCard.module.scss';
import { useAppDispatch } from '@/hooks/storeHooks';

function AddToCard({ productId }: { productId: string }) {
  const { addToCardContiner, quantityContainer } = styles;
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState<number>(0);

  const handleCreateCard = async () => {
    const shoppingLists = (await getShoppingLists()) as ShoppingList[];

    const filteredList = filterShoppingListsByProductId(
      shoppingLists,
      productId
    );

    if (quantity && !filteredList.length) {
      const res = await createShoppingListWithProductId(
        { en: 'my list' },
        productId,
        quantity
      );

      if (res.id) dispatch(fetchShoppingLists());
    }
    if (filteredList.length) {
      const { id } = filteredList[0];

      if (quantity && id) {
        const findedShoppingList = (await getShoppingLists(id)) as ShoppingList;

        if (findedShoppingList.id) {
          const { id, version, lineItems } = findedShoppingList;

          const result = await updateQuantityInShoppingList(
            id,
            version,
            lineItems[0].id,
            quantity
          );

          if (result.statusCode === 200) {
            dispatch(fetchShoppingLists());
          }
        }
      }
    }
  };

  const handlePlusQuantuty = () => {
    
    setQuantity(quantity + 1 );
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
