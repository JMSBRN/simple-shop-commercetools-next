import React, { useEffect, useState } from 'react';
import { getCarts, removeLineItemfromCart } from '@/commercetools/utils/utilsCarts';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Cart } from '@commercetools/platform-sdk';
import ProductImages from '../product-card/product-images/ProductImages';
import ProductPrice from '../product-card/product-price/ProductPrice';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import {
  filterObjectAndReturnValue,
} from '@/commercetools/utils/utilsCommercTools';
import {
  selectCommerceTools,
} from '@/features/commerceTools/CommerceToolsSlice';
import styles from './MiniCartModal.module.scss';

function MiniCartModal({
  onClick,
}: {
  onClick: () => void;
}) {
  const {
    miniModalConTainer,
    miniModalClose,
    titleStyle,
    shoppingListsStyle,
    buttonsContiner,
    listItem,
    itemDelete,
    ItemImages,
    itemName,
    itemPrice,
    subTotal,
  } = styles;
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector(selectCommerceTools);
  const [currentCart, setCurrentCart] = useState<Cart>();

  useEffect(() => {
    const fn =async () => {
      const c = await getCarts(cart.id) as Cart;

      if(c) setCurrentCart(c);
    };

   fn();
  }, [cart.id]);
  
  const handleDeleteLineItem = async (ID: string, version: number, lineitemId: string) => {
    const res = await removeLineItemfromCart(ID, version,lineitemId );

    if (res.statusCode === 200) dispatch(fetchCarts());
  };
  const handleRedirectToCartPage = async () => {
    onClick();
   
  };
    
  return (
    <div className={miniModalConTainer}>
      <div className={miniModalClose} onClick={onClick}>
        close
      </div>
      <div className={titleStyle}>Mini Cart</div>
      <div className={shoppingListsStyle}>
      {currentCart?.id && currentCart?.lineItems.map((item) => (
              <div className={listItem} key={item.id}>
                <div
                  className={itemDelete}
                  onClick={() =>
                    handleDeleteLineItem(currentCart.id, currentCart.version, item.id)
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
      <div className={subTotal}>
        Total: ??
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
