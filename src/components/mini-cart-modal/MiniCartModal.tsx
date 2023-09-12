import React, { useEffect, useState } from 'react';
import {
  filterObjectAndReturnValue,
  getCurrencySymbol,
} from '@/commercetools/utils/utilsCommercTools';
import {
  getTotalSumFromCarts,
  removeLineItemfromCart,
} from '@/commercetools/utils/utilsCarts';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Cart } from '@commercetools/platform-sdk';
import ProductImages from '../product-card/product-images/ProductImages';
import ProductPrice from '../product-card/product-price/ProductPrice';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './MiniCartModal.module.scss';
import { useRouter } from 'next/router';

function MiniCartModal({ onClick }: { onClick: () => void }) {
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
    total,
  } = styles;
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const { carts } = useAppSelector(selectCommerceTools);
  const cart = carts?.find(el => el.id) as Cart;
  const handleDeleteLineItem = async (
    ID: string,
    version: number,
    lineitemId: string
  ) => {
    const res = await removeLineItemfromCart(ID, version, lineitemId);

    if (res.statusCode === 200) {
      dispatch(fetchCarts());
    } 
  };
  const handleRedirectToCartPage = async () => {
    onClick();
    dispatch(fetchCarts());
    push(`/cart/${cart.id}`);
    
  };

  return (
    <div className={miniModalConTainer}>
      <div className={miniModalClose} onClick={onClick}>
        close
      </div>
      <div className={titleStyle}>Mini Cart</div>
      <div className={shoppingListsStyle}>
        {cart?.id &&
          cart?.lineItems.map((item) => (
            <div className={listItem} key={item.id}>
              <div
                className={itemDelete}
                onClick={() =>
                  handleDeleteLineItem(cart.id, cart.version, item.id)
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
      <div className={total}>
        Total: <TotalSum carts={carts} />
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

function TotalSum({ carts }: {carts: Cart[] }) {
  const [totalSum, setTotalSum] = useState<string>('');
  const [currencySymbol, setCurrencySymbol] = useState<string>('');
  const { country } = useAppSelector(selectCommerceTools);

  useEffect(() => {
    const fn = async () => {
      if (carts.length) {
        const res = await getTotalSumFromCarts(carts, country);
        
        if (res) {
          setTotalSum(res.totalPrice);
          setCurrencySymbol(getCurrencySymbol(country, res.currencyCode!));
        }
      }
    };

    fn();
  }, [carts, country]);
  return (
    <div
      style={{ minWidth: '30px', width: 'auto', height: '20px' }}
    >{`${totalSum} ${currencySymbol}`}</div>
  );
}
