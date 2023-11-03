import { Cart, LineItem } from '@commercetools/platform-sdk';
import React, { useState } from 'react';
import {
  getCarts,
  getMoneyValueFromCartField,
  removeLineItemfromCart,
  updateCartLineitemQuantity,
} from '@/commercetools/utils/utilsCarts';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import Image from 'next/legacy/image';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './CartLineItem.module.scss';
import { useRouter } from 'next/router';

function CartLineItem({
  cartId,
  version,
  lineItem,
  isDeleteBtnNotExisted,
  isQuantityButtonsExisted,
  isTotlaSummExisted,
}: {
  cartId: string;
  version: number;
  lineItem: LineItem;
  isDeleteBtnNotExisted?: boolean;
  isQuantityButtonsExisted?: boolean;
  isTotlaSummExisted?: boolean;
}) {
  const {
    lineItemStyle,
    deleteLineItem,
    description,
    priceStyle,
    saleBage,
    quantityStyle,
    currentQuantityStyle,
    total,
  } = styles;
  const dispatch = useAppDispatch();
  const { language } = useAppSelector(selectCommerceTools);
  const { id, variant, name, quantity, price } = lineItem;
  const { images } = variant;
  const [currentQuantity, setCurrentQuantity] = useState<number>(quantity);
  const { push } = useRouter();
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
    ID: string,
    version: number,
    lineitemId: string
  ) => {
    const res = await removeLineItemfromCart(ID, version, lineitemId);

    if (res.statusCode === 200) {
      dispatch(fetchCarts());
    }
    if (quantity === 1) {
      push('/');
    }
  };

  return (
    <div className={lineItemStyle}>
      {!isDeleteBtnNotExisted && <div
        className={deleteLineItem}
        onClick={() => handleDeleteLineItem(cartId, version, id)}
      >
        delete
      </div>}
      <Image
        priority
        src={images?.find((el) => el.url)?.url!}
        width={100}
        height={160}
        alt="product image"
      />
      <div className={description}>
        <div>{filterObjectAndReturnValue(name, language)}</div>
      </div>
      <div className={priceStyle}>
        {getMoneyValueFromCartField(price.value)}
        {false && <div className={saleBage}>Sale</div>}
      </div>
      <div className={currentQuantityStyle}>
      </div>
      {isQuantityButtonsExisted ? (
        <div className={quantityStyle}>
          <button type="button" onClick={handlePlusQuantity}>
            +
          </button>
          <div>{currentQuantity}</div>
          <button type="button" onClick={handleMinusQuantity}>
            -
          </button>
        </div>
      ) :  (
        <>
          <div>*</div>
          <div>{quantity}</div>
        </>
      )}
      {isTotlaSummExisted && (
        <div className={total}>
          {lineItem.taxedPrice &&
            getMoneyValueFromCartField(lineItem.taxedPrice?.totalGross!)}
        </div>
      )}
    </div>
  );
}

export default CartLineItem;
