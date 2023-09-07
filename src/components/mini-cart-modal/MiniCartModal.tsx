import React, { useEffect, useState } from 'react';
import {
  addShoopingListToCart,
  createCart,
} from '@/commercetools/utils/utilsCarts';
import {
  deleteShoppingList,
  getTotalSumFromSoppingLists,
} from '@/commercetools/utils/utilsShoppingList';
import {
  filterObjectAndReturnValue,
  getCurrencySymbol,
} from '@/commercetools/utils/utilsCommercTools';
import {
  selectCommerceTools,
  setCart,
} from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import ProductImages from '../product-card/product-images/ProductImages';
import ProductPrice from '../product-card/product-price/ProductPrice';
import { ShoppingList } from '@commercetools/platform-sdk';
import { fetchShoppingLists } from '@/features/thunks/FetchShoppingLists';
import styles from './MiniCartModal.module.scss';
import { useRouter } from 'next/router';

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
    itemPrice,
    subTotal,
  } = styles;

  const dispatch = useAppDispatch();
  const { currency } = useAppSelector(selectCommerceTools);
  const { push } = useRouter();

  const handleDeleteShoppingList = async (ID: string, version: number) => {
    const res = await deleteShoppingList(ID, version);

    if (res.statusCode === 200) dispatch(fetchShoppingLists());
  };
  const handleRedirectToCartPage = async () => {
    onClick();
    if (shoppingLists.length) {
      console.log(currency);
      
      const res = await createCart(currency);

      if (res) {
        push('/cart');
        dispatch(setCart(res));
        const { id, version } = res;

        shoppingLists.forEach( async (el) => {
          await addShoopingListToCart(
            id,
            version,
            el.id
          );
        });

      }
    }
  };

  function TotalSum() {
    const [totalSum, setTotalSum] = useState<string>('');
    const [currencySymbol, setCurrencySymbol] = useState<string>('');
    const { country } = useAppSelector(selectCommerceTools);

    useEffect(() => {
      const fn = async () => {
        const res = await getTotalSumFromSoppingLists(shoppingLists, country);

        if (res) {
          setTotalSum(res.totalPrice);
          setCurrencySymbol(getCurrencySymbol(country, res.currencyCode!));
        }
      };

      fn();
    }, [country]);
    return (
      <div
        style={{ minWidth: '30px', width: 'auto' }}
      >{`${totalSum} ${currencySymbol}`}</div>
    );
  }

  return (
    <div className={miniModalConTainer}>
      <div className={miniModalClose} onClick={onClick}>
        close
      </div>
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
                  {filterObjectAndReturnValue(item.name, 'en') ||
                    'no product name'}
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
        ))}
      </div>
      <div className={subTotal}>
        Total: <TotalSum />
      </div>
      <div className={buttonsContiner}>
        <button onClick={handleRedirectToCartPage} type="button">
          Viewbag
        </button>
        <button type="button">Checkout</button>
      </div>
    </div>
  );
}

export default MiniCartModal;
