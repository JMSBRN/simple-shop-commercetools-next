import { Cart, LineItem } from '@commercetools/platform-sdk';
import {
  getCarts,
  getMoneyValueFromCartField,
  updateCartLineitemQuantity,
} from '@/commercetools/utils/utilsCarts';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import Image from 'next/image';
import React from 'react';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import {
  filterObjectAndReturnValue,
} from '@/commercetools/utils/utilsCommercTools';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './CartLineItem.module.scss';

function CartLineItem({
  cartId,
  lineItem,
  handleDeleteLineItem,
}: {
  cartId: string;
  lineItem: LineItem;
  handleDeleteLineItem: (lineitemId: string) => Promise<void>;
}) {
  const {
    lineItemStyle,
    deleteLineItem,
    description,
    descriptionInfoContainer,
    priceStyle,
    saleBage,
    quantityStyle,
    total,
  } = styles;
  const dispatch = useAppDispatch();
  const { language } = useAppSelector(selectCommerceTools);

  const { id, variant, name, quantity, price } = lineItem;
  const { images, sku } = variant;

  const handlePlusQuantity = async () => {
    const cart = (await getCarts(cartId)) as Cart;

    if (cart.id) {
      const { version } = cart;

      const res = await updateCartLineitemQuantity(
        cart.id,
        version,
        id,
        quantity + 1
      );

      if (res.id) dispatch(fetchCarts());
    }
  };
  const handleMinusQuantity = async () => {
    if (quantity > 1) {
      const cart = (await getCarts(cartId)) as Cart;

      if (cart.id) {
        const { version } = cart;

        const res = await updateCartLineitemQuantity(
          cart.id,
          version,
          id,
          quantity - 1
        );

        if (res.id) dispatch(fetchCarts());
      }
    }
  };

  return (
    <div className={lineItemStyle}>
      <div className={deleteLineItem} onClick={() => handleDeleteLineItem(id)}>
        delete
      </div>
      <div className={description}>
        <Image
          priority
          src={images?.find((el) => el.url)?.url!}
          width={100}
          height={160}
          alt="product image"
          style={{ width: '60%', height: 'auto' }}
        />
        <div className={descriptionInfoContainer}>
          <div>{filterObjectAndReturnValue(name, language)}</div>
          <div>{sku}</div>
        </div>
      </div>
      <div className={priceStyle}>
          {getMoneyValueFromCartField(price.value)}
        {false && <div className={saleBage}>Sale</div>}
      </div>
      <div className={quantityStyle}>
        <button type="button" onClick={handlePlusQuantity}>
          +
        </button>
        <div>{quantity}</div>
        <button type="button" onClick={handleMinusQuantity}>
          -
        </button>
      </div>
      <div className={total}>
        {lineItem.taxedPrice &&
          getMoneyValueFromCartField(lineItem.taxedPrice?.totalGross)}
      </div>
    </div>
  );
}

export default CartLineItem;
