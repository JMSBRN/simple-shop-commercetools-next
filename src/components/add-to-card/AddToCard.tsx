import React, { useState } from 'react';
import {
  createShoppingListWithProductId,
  filterShoppingListsByProductId,
  getShoppingLists,
  updateQuantityInShoppingList,
} from '@/commercetools/utils/utilsShoppingList';
import {
  selectCommerceTools,
  setQuantity,
} from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { ShoppingList } from '@commercetools/platform-sdk';
import { fetchShoppingLists } from '@/features/thunks/FetchShoppingLists';
import styles from './AddToCard.module.scss';

function AddToCard({ productId }: { productId: string }) {
  const { addToCardContiner, quantityContainer } = styles;
  const dispatch = useAppDispatch();
  const { quantity } = useAppSelector(selectCommerceTools);
  const [currentQuantity, setCurrentQuantity] = useState(0);

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
    setCurrentQuantity(currentQuantity + 1);
    dispatch(setQuantity(currentQuantity));
  };
  const handleMinusQuantuty = () => {
    if (currentQuantity) {
      setCurrentQuantity(currentQuantity - 1);
      dispatch(setQuantity(currentQuantity));
    }
  };

  return (
    <div className={addToCardContiner}>
      <div className={quantityContainer}>
        <button onClick={handlePlusQuantuty}>+</button>
        {currentQuantity}
        <button onClick={handleMinusQuantuty}>-</button>
      </div>
      <button type="button" onClick={handleCreateCard}>
        Add to Cart
      </button>
    </div>
  );
}

export default AddToCard;
