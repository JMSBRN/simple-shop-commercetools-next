import {
  getMoneyValueFromCartField,
  removeLineItemfromCart,
} from '@/commercetools/utils/utilsCarts';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { useEffect, useState } from 'react';
import { Cart } from '@commercetools/platform-sdk';
import { OriginalTotal } from '../cart/original-sub-total/OriginalSubTotal';
import ProductImages from '../product-card/product-images/ProductImages';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import {
  filterObjectAndReturnValue,
} from '@/commercetools/utils/utilsCommercTools';
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
    subTotal
  } = styles;
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const { carts } = useAppSelector(selectCommerceTools);
  const [cart, setCart] = useState<Cart>();

  useEffect(() => {
    carts.forEach((el) => {
      setCart(el);
    });
  }, [carts]);

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
    if (cart?.id && cart?.lineItems.length) {
      onClick();
      push(`/cart/${cart.id}`);
    }
  };
  const handleCheckout = async () => {
    onClick();
    if (cart?.lineItems.length) {
      push(`/checkout/${cart.id}`);
    }
  };

  return (
    <div className={miniModalConTainer}>
      <div className={miniModalClose} onClick={onClick}>
        close
      </div>
      <div className={titleStyle}>Mini Cart</div>
      {cart?.lineItems.length ? (
        <>
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
                    {`${item.quantity} * ${getMoneyValueFromCartField(
                      item.totalPrice
                    )}`}
                  </div>
                </div>
              ))}
          </div>
          <div className={subTotal}>
            Sub Total:  <OriginalTotal cart={cart} />
          </div>
          <div className={total}>
            Total:
            {cart?.taxedPrice &&
              getMoneyValueFromCartField(cart?.taxedPrice.totalGross)}
          </div>
          <div className={buttonsContiner}>
            <button onClick={handleRedirectToCartPage} type="button">
              Viewbag
            </button>
            <button type="button" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      ) : (
        <div>Empty Cart</div>
      )}
    </div>
  );
}

export default MiniCartModal;

