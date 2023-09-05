import ProductImages from '../product-card/product-images/ProductImages';
import React from 'react';
import { ShoppingList } from '@commercetools/platform-sdk';
import { deleteShoppingList } from '@/commercetools/utils/utilsShoppingList';
import { fetchShoppingLists } from '@/features/thunks/FetchShoppingLists';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import styles from './MiniCartModal.module.scss';
import { useAppDispatch } from '@/hooks/storeHooks';

function MiniCartModal({
  shoppingLists,
  onClick,
}: {
  shoppingLists: ShoppingList[];
  onClick: () => void;
}) {
  const {
    miniModalConTainer,
    miniModalClose,
    titleStyle,
    shoppingListsStyle,
    buttonsContiner,
    shoppingList,
    listItem,
    itemDelete,
    ItemImages,
    itemName,
    itemQuantity
  } = styles;

  const dispatch = useAppDispatch();

  const handleDeleteShoppingList = async (ID: string, version: number) => {
    const res = await deleteShoppingList(ID, version);

    if (res.statusCode === 200) dispatch(fetchShoppingLists());
  };

  return (
    <div className={miniModalConTainer}>
      <div className={miniModalClose} onClick={onClick}>close</div>
      <div className={titleStyle}>Mini Cart</div>
      <div className={shoppingListsStyle}>
        {shoppingLists.map((list) => (
          <div className={shoppingList} key={list.id}>
            {list.lineItems.map((item) => (
              <div className={listItem} key={item.id}>
                <div
                  className={itemDelete}
                  onClick={() =>
                    handleDeleteShoppingList(list.id, list.version)
                  }
                >
                  delete
                </div>
                <div className={ItemImages}>
                  <ProductImages productId={item.productId} />
                </div>
                <div className={itemName}>
                  {filterObjectAndReturnValue(item.name, 'en')}
                </div>
                <div className={itemQuantity}>{item.quantity}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={buttonsContiner}>
        <button type="button">Viewbag</button>
        <button type="button">Checkout</button>
      </div>
    </div>
  );
}

export default MiniCartModal;
